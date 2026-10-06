import {
  formatStyleId,
  parseStyleId,
  STYLE_PAGE_SIZE,
  STYLE_STORAGE_BUCKET,
  normalizeStyleRecord,
  toPublicStyle,
  type PublicStyle,
  type StyleCategory,
  type StyleQueryRecord,
} from '@/lib/styles';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const styleSelection =
  'id,style_number,image_path,image_width,image_height,is_published,is_deleted,created_at,category:style_categories!inner(id,name,slug,sort_order,is_active)';

async function getStyleImageUrl(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, path: string) {
  const { data, error } = await supabase.storage.from(STYLE_STORAGE_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) {
    throw new Error(`Could not create a temporary URL for a style image: ${error.message}`);
  }
  return data.signedUrl;
}

export async function getStyleCategories() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('style_categories')
    .select('id,name,slug,sort_order,is_active')
    .eq('is_active', true)
    .order('sort_order')
    .order('name');

  if (error) {
    throw new Error(`Could not load style categories: ${error.message}`);
  }

  return data as StyleCategory[];
}

export async function getPublicStyles(options: {
  category?: string;
  before?: number;
  ids?: number[];
  limit?: number;
} = {}): Promise<PublicStyle[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('styles')
    .select(styleSelection)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .eq('category.is_active', true)
    .not('image_path', 'is', null)
    .order('style_number', { ascending: false });

  if (options.ids) {
    if (options.ids.length === 0) return [];
    query = query.in('style_number', options.ids);
  } else if (options.category) {
    query = query.eq('category.slug', options.category);
  }

  if (options.before) {
    query = query.lt('style_number', options.before);
  }

  const { data, error } = await query.limit(options.limit ?? STYLE_PAGE_SIZE);
  if (error) {
    throw new Error(`Could not load styles: ${error.message}`);
  }

  const styles = await Promise.all((data as StyleQueryRecord[]).map(async (queryRecord) => {
    const record = normalizeStyleRecord(queryRecord);
    if (!record.image_path || !record.category || !record.image_width || !record.image_height) return null;

    return toPublicStyle(record, async (path) => getStyleImageUrl(supabase, path));
  }));
  return styles.filter((style): style is PublicStyle => style !== null);
}

export async function getPublicStyle(styleId: string) {
  const styleNumber = parseStyleId(styleId);
  if (styleNumber === null) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('styles')
    .select(styleSelection)
    .eq('style_number', styleNumber)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .eq('category.is_active', true)
    .not('image_path', 'is', null)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load ${formatStyleId(styleNumber)}: ${error.message}`);
  }

  if (!data) return null;
  const record = normalizeStyleRecord(data as StyleQueryRecord);
  if (!record.image_path || !record.category || !record.image_width || !record.image_height) return null;
  return toPublicStyle(record, async (path) => getStyleImageUrl(supabase, path));
}
