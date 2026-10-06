'use server';

import { formatStyleId, normalizeStyleRecord, parseStyleId, slugifyCategory, STYLE_STORAGE_BUCKET, type StyleCategory, type StyleQueryRecord } from '@/lib/styles';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function requireStyleAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Could not verify the admin session: ${error.message}`);
  }
  if (!user || user.app_metadata?.role !== 'style_admin') {
    throw new Error('A Style Library administrator account is required.');
  }

  return supabase;
}

async function getStyleImageUrl(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  path: string,
) {
  const { data, error } = await supabase.storage.from(STYLE_STORAGE_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) {
    throw new Error(`Could not create a temporary URL for a style image: ${error.message}`);
  }
  return data.signedUrl;
}

export async function loadAdminStyles() {
  const supabase = await requireStyleAdmin();
  const [categoryResult, styleResult] = await Promise.all([
    supabase
      .from('style_categories')
      .select('id,name,slug,sort_order,is_active')
      .order('sort_order')
      .order('name'),
    supabase
      .from('styles')
      .select('id,style_number,image_path,image_width,image_height,is_published,is_deleted,created_at,category:style_categories(id,name,slug,sort_order,is_active)')
      .eq('is_deleted', false)
      .order('style_number', { ascending: false }),
  ]);

  if (categoryResult.error) {
    throw new Error(`Could not load categories: ${categoryResult.error.message}`);
  }
  if (styleResult.error) {
    throw new Error(`Could not load styles: ${styleResult.error.message}`);
  }

  return {
    categories: categoryResult.data as StyleCategory[],
    styles: await Promise.all((styleResult.data as StyleQueryRecord[]).map(async (queryStyle) => {
      const style = normalizeStyleRecord(queryStyle);
      return {
        ...style,
        imageUrl: style.image_path
          ? await getStyleImageUrl(supabase, style.image_path)
          : null,
      };
    })),
  };
}

export async function addStyleCategory(name: string) {
  const trimmedName = name.trim();
  const slug = slugifyCategory(trimmedName);
  if (!trimmedName || !slug) {
    throw new Error('Enter a category name containing letters or numbers.');
  }

  const supabase = await requireStyleAdmin();
  const { data: highestOrder, error: orderError } = await supabase
    .from('style_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    throw new Error(`Could not determine category order: ${orderError.message}`);
  }

  const { error } = await supabase.from('style_categories').insert({
    name: trimmedName,
    slug,
    sort_order: (highestOrder?.sort_order ?? 0) + 1,
  });

  if (error) {
    throw new Error(`Could not add category: ${error.message}`);
  }
}

export async function setCategoryActive(categoryId: string, isActive: boolean) {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('style_categories')
    .update({ is_active: isActive })
    .eq('id', categoryId)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`Could not update category: ${error.message}`);
  }
  if (!data) {
    throw new Error('The requested category no longer exists.');
  }
}

export async function deleteStyleCategory(categoryId: string) {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('style_categories')
    .delete()
    .eq('id', categoryId)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`Could not delete category. Reassign its styles first if it is in use. ${error.message}`);
  }
  if (!data) {
    throw new Error('The requested category no longer exists.');
  }
}

export async function createDraftStyle(categoryId: string) {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('styles')
    .insert({ category_id: categoryId })
    .select('id,style_number')
    .single();

  if (error) {
    throw new Error(`Could not reserve a Style ID: ${error.message}`);
  }

  return { id: data.id, styleId: formatStyleId(data.style_number) };
}

export async function setStyleImage(styleId: string, imagePath: string, imageWidth: number, imageHeight: number) {
  const styleNumber = parseStyleId(styleId);
  if (
    styleNumber === null
    || !imagePath.startsWith(`${styleId}/`)
    || !Number.isInteger(imageWidth)
    || !Number.isInteger(imageHeight)
    || imageWidth < 1
    || imageHeight < 1
  ) {
    throw new Error('The image path or dimensions are invalid for this Style ID.');
  }

  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('styles')
    .update({ image_path: imagePath, image_width: imageWidth, image_height: imageHeight })
    .eq('style_number', styleNumber)
    .eq('is_deleted', false)
    .select('style_number')
    .maybeSingle();

  if (error) {
    throw new Error(`Could not attach the image to ${styleId}: ${error.message}`);
  }
  if (!data) {
    throw new Error(`${styleId} no longer exists.`);
  }
}

export async function setStylePublished(styleId: string, isPublished: boolean) {
  const styleNumber = parseStyleId(styleId);
  if (styleNumber === null) {
    throw new Error('The Style ID is invalid.');
  }

  const supabase = await requireStyleAdmin();
  let query = supabase
    .from('styles')
    .update({ is_published: isPublished })
    .eq('style_number', styleNumber)
    .eq('is_deleted', false);

  if (isPublished) {
    query = query.not('image_path', 'is', null);
  }

  const { data, error } = await query.select('style_number').maybeSingle();
  if (error) {
    throw new Error(`Could not update ${styleId}: ${error.message}`);
  }
  if (!data) {
    throw new Error(isPublished ? `${styleId} needs an image before it can be published.` : `${styleId} no longer exists.`);
  }
}

export async function archiveStyle(styleId: string) {
  const styleNumber = parseStyleId(styleId);
  if (styleNumber === null) {
    throw new Error('The Style ID is invalid.');
  }

  const supabase = await requireStyleAdmin();
  const { data: existingStyle, error: lookupError } = await supabase
    .from('styles')
    .select('image_path')
    .eq('style_number', styleNumber)
    .eq('is_deleted', false)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Could not find ${styleId} before removing it: ${lookupError.message}`);
  }
  if (!existingStyle) {
    throw new Error(`${styleId} no longer exists.`);
  }

  const { data, error } = await supabase
    .from('styles')
    .update({ is_deleted: true, is_published: false })
    .eq('style_number', styleNumber)
    .eq('is_deleted', false)
    .select('style_number')
    .maybeSingle();

  if (error) {
    throw new Error(`Could not remove ${styleId}: ${error.message}`);
  }
  if (!data) {
    throw new Error(`${styleId} no longer exists.`);
  }

  if (existingStyle.image_path) {
    const { error: storageError } = await supabase.storage
      .from(STYLE_STORAGE_BUCKET)
      .remove([existingStyle.image_path]);
    if (storageError) {
      return `${styleId} was removed from the library, but its image could not be deleted from storage: ${storageError.message}`;
    }
  }

  return null;
}
