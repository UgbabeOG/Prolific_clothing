export const STYLE_PAGE_SIZE = 24;
export const STYLE_STORAGE_BUCKET = 'style-library';

export type StyleCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

export type StyleRecord = {
  id: string;
  style_number: number;
  image_path: string | null;
  image_width: number | null;
  image_height: number | null;
  is_published: boolean;
  is_deleted: boolean;
  created_at: string;
  category: StyleCategory | null;
};

export type StyleQueryRecord = Omit<StyleRecord, 'category'> & {
  category: StyleCategory | StyleCategory[] | null;
};

export type PublicStyle = {
  styleId: string;
  imageUrl: string;
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  category: Pick<StyleCategory, 'id' | 'name' | 'slug'>;
};

export function formatStyleId(styleNumber: number | string) {
  return `P${String(styleNumber).padStart(3, '0')}`;
}

export function parseStyleId(styleId: string) {
  const match = /^P(\d{3,})$/i.exec(styleId);
  if (!match) return null;
  const styleNumber = Number(match[1]);
  return Number.isSafeInteger(styleNumber) && styleNumber > 0 ? styleNumber : null;
}

export function normalizeStyleRecord(record: StyleQueryRecord): StyleRecord {
  return {
    ...record,
    category: Array.isArray(record.category) ? record.category[0] ?? null : record.category,
  };
}

export async function toPublicStyle(
  record: StyleRecord,
  getPublicUrl: (path: string) => string | Promise<string>,
): Promise<PublicStyle | null> {
  if (!record.image_path || !record.image_width || !record.image_height || !record.category) {
    return null;
  }

  return {
    styleId: formatStyleId(record.style_number),
    imageUrl: await getPublicUrl(record.image_path),
    imagePath: record.image_path,
    imageWidth: record.image_width,
    imageHeight: record.image_height,
    category: {
      id: record.category.id,
      name: record.category.name,
      slug: record.category.slug,
    },
  };
}

export function slugifyCategory(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
