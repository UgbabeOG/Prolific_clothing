'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';

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

export type ProductMedia = {
  id: string;
  mediaType: 'image' | 'video';
  mediaPath: string;
  sortOrder: number;
};

export type ProductVariant = {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  isActive: boolean;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  shortDescription: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  media: ProductMedia[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type CollectionRecord = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imagePath: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

const productSelection = `
  id, slug, name, category, price, description, short_description,
  is_published, is_featured, created_at, updated_at,
  media:product_media(id, media_type, media_path, sort_order),
  variants:product_variants(id, size, color_name, color_hex, is_active)
`;

const collectionSelection = `
  id, slug, name, description, image_path, is_published, created_at, updated_at
`;

function mapProductRow(row: any): ProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description,
    shortDescription: row.short_description,
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    media: (row.media ?? []).map((m: any) => ({
      id: m.id,
      mediaType: m.media_type,
      mediaPath: m.media_path,
      sortOrder: m.sort_order,
    })).sort((a: ProductMedia, b: ProductMedia) => a.sortOrder - b.sortOrder),
    variants: (row.variants ?? []).map((v: any) => ({
      id: v.id,
      size: v.size,
      colorName: v.color_name,
      colorHex: v.color_hex,
      isActive: v.is_active,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCollectionRow(row: any): CollectionRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imagePath: row.image_path,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function loadAdminProducts(): Promise<ProductRecord[]> {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('products')
    .select(productSelection)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Could not load products: ${error.message}`);
  }

  return (data as any[]).map(mapProductRow);
}

export async function loadAdminCollections(): Promise<CollectionRecord[]> {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('collections')
    .select(collectionSelection)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Could not load collections: ${error.message}`);
  }

  return (data as any[]).map(mapCollectionRow);
}

export async function createProduct(input: {
  slug: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  shortDescription?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}) {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('products')
    .insert({
      slug: input.slug,
      name: input.name,
      category: input.category,
      price: input.price,
      description: input.description ?? null,
      short_description: input.shortDescription ?? null,
      is_published: input.isPublished ?? false,
      is_featured: input.isFeatured ?? false,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not create product: ${error.message}`);
  }

  return { id: data.id };
}

export async function updateProduct(input: {
  id: string;
  slug?: string;
  name?: string;
  category?: string;
  price?: number;
  description?: string | null;
  shortDescription?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
}) {
  const supabase = await requireStyleAdmin();

  const updates: Record<string, any> = {};
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.name !== undefined) updates.name = input.name;
  if (input.category !== undefined) updates.category = input.category;
  if (input.price !== undefined) updates.price = input.price;
  if (input.description !== undefined) updates.description = input.description;
  if (input.shortDescription !== undefined) updates.short_description = input.shortDescription;
  if (input.isPublished !== undefined) updates.is_published = input.isPublished;
  if (input.isFeatured !== undefined) updates.is_featured = input.isFeatured;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', input.id)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not update product: ${error.message}`);
  }

  return { id: data.id };
}

export async function deleteProduct(id: string) {
  const supabase = await requireStyleAdmin();

  const { data: media, error: mediaError } = await supabase
    .from('product_media')
    .select('media_path')
    .eq('product_id', id);

  if (mediaError) {
    throw new Error(`Could not look up product media: ${mediaError.message}`);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(`Could not delete product: ${error.message}`);
  }

  if (media && media.length > 0) {
    const paths = media.map((m: any) => m.media_path);
    const { error: storageError } = await supabase.storage.from('product-media').remove(paths);
    if (storageError) {
      return `Product deleted, but some media files could not be removed: ${storageError.message}`;
    }
  }

  return null;
}

export async function addProductMedia(input: {
  productId: string;
  mediaType: 'image' | 'video';
  mediaPath: string;
  sortOrder?: number;
}) {
  const supabase = await requireStyleAdmin();

  const { data, error } = await supabase
    .from('product_media')
    .insert({
      product_id: input.productId,
      media_type: input.mediaType,
      media_path: input.mediaPath,
      sort_order: input.sortOrder ?? 0,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not add media: ${error.message}`);
  }

  return { id: data.id };
}

export async function deleteProductMedia(id: string) {
  const supabase = await requireStyleAdmin();

  const { data: media, error: lookupError } = await supabase
    .from('product_media')
    .select('media_path')
    .eq('id', id)
    .single();

  if (lookupError) {
    throw new Error(`Could not look up media: ${lookupError.message}`);
  }

  const { error } = await supabase.from('product_media').delete().eq('id', id);

  if (error) {
    throw new Error(`Could not delete media: ${error.message}`);
  }

  if (media?.media_path) {
    const { error: storageError } = await supabase.storage.from('product-media').remove([media.media_path]);
    if (storageError) {
      return `Media deleted, but file could not be removed from storage: ${storageError.message}`;
    }
  }

  return null;
}

export async function addProductVariant(input: {
  productId: string;
  size: string;
  colorName: string;
  colorHex: string;
}) {
  const supabase = await requireStyleAdmin();

  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: input.productId,
      size: input.size,
      color_name: input.colorName,
      color_hex: input.colorHex,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not add variant: ${error.message}`);
  }

  return { id: data.id };
}

export async function deleteProductVariant(id: string) {
  const supabase = await requireStyleAdmin();
  const { error } = await supabase.from('product_variants').delete().eq('id', id);

  if (error) {
    throw new Error(`Could not delete variant: ${error.message}`);
  }
}

export async function createCollection(input: {
  slug: string;
  name: string;
  description?: string;
  isPublished?: boolean;
}) {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('collections')
    .insert({
      slug: input.slug,
      name: input.name,
      description: input.description ?? null,
      is_published: input.isPublished ?? false,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not create collection: ${error.message}`);
  }

  return { id: data.id };
}

export async function updateCollection(input: {
  id: string;
  slug?: string;
  name?: string;
  description?: string | null;
  imagePath?: string | null;
  isPublished?: boolean;
}) {
  const supabase = await requireStyleAdmin();

  const updates: Record<string, any> = {};
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.imagePath !== undefined) updates.image_path = input.imagePath;
  if (input.isPublished !== undefined) updates.is_published = input.isPublished;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('collections')
    .update(updates)
    .eq('id', input.id)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not update collection: ${error.message}`);
  }

  return { id: data.id };
}

export async function deleteCollection(id: string) {
  const supabase = await requireStyleAdmin();

  const { data: collection, error: lookupError } = await supabase
    .from('collections')
    .select('image_path')
    .eq('id', id)
    .single();

  if (lookupError) {
    throw new Error(`Could not look up collection: ${lookupError.message}`);
  }

  const { error } = await supabase.from('collections').delete().eq('id', id);

  if (error) {
    throw new Error(`Could not delete collection: ${error.message}`);
  }

  if (collection?.image_path) {
    const { error: storageError } = await supabase.storage.from('product-media').remove([collection.image_path]);
    if (storageError) {
      return `Collection deleted, but image could not be removed from storage: ${storageError.message}`;
    }
  }

  return null;
}

export type CollectionMedia = {
  id: string;
  mediaType: 'image' | 'video';
  mediaPath: string;
  sortOrder: number;
};

export async function loadCollectionMedia(collectionId: string): Promise<CollectionMedia[]> {
  const supabase = await requireStyleAdmin();
  const { data, error } = await supabase
    .from('collection_media')
    .select('id, media_type, media_path, sort_order')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Could not load collection media: ${error.message}`);
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    mediaType: row.media_type,
    mediaPath: row.media_path,
    sortOrder: row.sort_order,
  }));
}

export async function addCollectionMedia(input: {
  collectionId: string;
  mediaType: 'image' | 'video';
  mediaPath: string;
  sortOrder?: number;
}) {
  const supabase = await requireStyleAdmin();

  const { data, error } = await supabase
    .from('collection_media')
    .insert({
      collection_id: input.collectionId,
      media_type: input.mediaType,
      media_path: input.mediaPath,
      sort_order: input.sortOrder ?? 0,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Could not add media: ${error.message}`);
  }

  return { id: data.id };
}

export async function deleteCollectionMedia(id: string) {
  const supabase = await requireStyleAdmin();

  const { data: media, error: lookupError } = await supabase
    .from('collection_media')
    .select('media_path')
    .eq('id', id)
    .single();

  if (lookupError) {
    throw new Error(`Could not look up media: ${lookupError.message}`);
  }

  const { error } = await supabase.from('collection_media').delete().eq('id', id);

  if (error) {
    throw new Error(`Could not delete media: ${error.message}`);
  }

  if (media?.media_path) {
    const { error: storageError } = await supabase.storage.from('product-media').remove([media.media_path]);
    if (storageError) {
      return `Media deleted, but file could not be removed from storage: ${storageError.message}`;
    }
  }

  return null;
}
