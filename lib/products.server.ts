import { createSupabaseServerClient } from '@/lib/supabase/server';

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  videos: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  featured: boolean;
};

export type PublicCollection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type PublicCollectionMedia = {
  id: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
};

const productSelection = `
  id, slug, name, category, price, description, short_description,
  is_published, is_featured,
  media:product_media(id, media_type, media_path, sort_order),
  variants:product_variants(id, size, color_name, color_hex, is_active)
`;

async function getPublicProductMediaUrl(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  path: string,
) {
  const { data, error } = await supabase.storage.from('product-media').createSignedUrl(path, 60 * 60);
  if (error) {
    throw new Error(`Could not create a temporary URL for product media: ${error.message}`);
  }
  return data.signedUrl;
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelection)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Could not load products: ${error.message}`);
  }

  const products = (data as any[]).map((row) => {
    const media = (row.media ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
    const images = media.filter((m: any) => m.media_type === 'image').map((m: any) => m.media_path);
    const videos = media.filter((m: any) => m.media_type === 'video').map((m: any) => m.media_path);
    const variants = row.variants ?? [];

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      price: row.price,
      description: row.description ?? '',
      shortDescription: row.short_description ?? '',
      images,
      videos,
      sizes: [...new Set(variants.filter((v: any) => v.is_active).map((v: any) => v.size))] as string[],
      colors: variants
        .filter((v: any) => v.is_active)
        .reduce((acc: { name: string; hex: string }[], v: any) => {
          const exists = acc.find((c) => c.name === v.color_name && c.hex === v.color_hex);
          if (!exists) acc.push({ name: v.color_name, hex: v.color_hex });
          return acc;
        }, []),
      featured: row.is_featured,
    };
  });

  return products;
}

export async function getPublicProduct(slug: string): Promise<PublicProduct | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelection)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load product: ${error.message}`);
  }

  if (!data) return null;

  const row = data as any;
  const media = (row.media ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const images = media.filter((m: any) => m.media_type === 'image').map((m: any) => m.media_path);
  const videos = media.filter((m: any) => m.media_type === 'video').map((m: any) => m.media_path);
  const variants = row.variants ?? [];

  // Resolve signed URLs for images and videos
  const resolvedImages = await Promise.all(images.map((p: string) => getPublicProductMediaUrl(supabase, p)));
  const resolvedVideos = await Promise.all(videos.map((p: string) => getPublicProductMediaUrl(supabase, p)));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description ?? '',
    shortDescription: row.short_description ?? '',
    images: resolvedImages,
    videos: resolvedVideos,
    sizes: [...new Set(variants.filter((v: any) => v.is_active).map((v: any) => v.size))] as string[],
    colors: variants
      .filter((v: any) => v.is_active)
      .reduce((acc: { name: string; hex: string }[], v: any) => {
        const exists = acc.find((c) => c.name === v.color_name && c.hex === v.color_hex);
        if (!exists) acc.push({ name: v.color_name, hex: v.color_hex });
        return acc;
      }, []),
    featured: row.is_featured,
  };
}

export async function getPublicCollections(): Promise<PublicCollection[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('collections')
    .select('id, slug, name, description, image_path, is_published')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Could not load collections: ${error.message}`);
  }

  // Resolve signed URLs for collection images
  const collections = await Promise.all((data as any[]).map(async (row) => {
    let image = '';
    if (row.image_path) {
      const { data: urlData, error: urlError } = await supabase.storage.from('product-media').createSignedUrl(row.image_path, 60 * 60);
      if (!urlError) image = urlData.signedUrl;
    }
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description ?? '',
      image,
    };
  }));

  return collections;
}

export async function getPublicCollection(slug: string): Promise<PublicCollection | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('collections')
    .select('id, slug, name, description, image_path, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load collection: ${error.message}`);
  }

  if (!data) return null;

  let image = '';
  if (data.image_path) {
    const { data: urlData, error: urlError } = await supabase.storage.from('product-media').createSignedUrl(data.image_path, 60 * 60);
    if (!urlError) image = urlData.signedUrl;
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description ?? '',
    image,
  };
}

export async function getPublicCollectionMedia(collectionId: string): Promise<PublicCollectionMedia[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('collection_media')
    .select('id, media_type, media_path, sort_order')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Could not load collection media: ${error.message}`);
  }

  const media = await Promise.all((data as any[]).map(async (row) => {
    const { data: urlData, error: urlError } = await supabase.storage.from('product-media').createSignedUrl(row.media_path, 60 * 60);
    if (urlError) return null;
    return {
      id: row.id,
      mediaType: row.media_type,
      mediaUrl: urlData.signedUrl,
    };
  }));

  return media.filter((m): m is PublicCollectionMedia => m !== null);
}
