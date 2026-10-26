'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Save, Upload, Film, Image as ImageIcon } from 'lucide-react';
import {
  createProduct,
  addProductMedia,
  addProductVariant,
  type ProductRecord,
} from '@/app/admin/products/actions';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type MediaFile = {
  file: File;
  type: 'image' | 'video';
  preview: string;
};

type ProductForm = {
  slug: string;
  name: string;
  category: string;
  price: string;
  description: string;
  shortDescription: string;
  isPublished: boolean;
  isFeatured: boolean;
};

export default function AdminNewProductPage() {
  const [form, setForm] = useState<ProductForm>({
    slug: '',
    name: '',
    category: '',
    price: '',
    description: '',
    shortDescription: '',
    isPublished: false,
    isFeatured: false,
  });
  const [newMedia, setNewMedia] = useState<MediaFile[]>([]);
type VariantForm = {
  size: string;
  colorName: string;
  colorHex: string;
};

  const [newVariant, setNewVariant] = useState<VariantForm>({
    size: '',
    colorName: '',
    colorHex: '#000000',
  });
  const [createdProduct, setCreatedProduct] = useState<ProductRecord | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleFormChange = (field: keyof ProductForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: keyof ProductForm) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setCreating(true);

    try {
      const result = await createProduct({
        slug: form.slug,
        name: form.name,
        category: form.category,
        price: Number(form.price) || 0,
        description: form.description || undefined,
        shortDescription: form.shortDescription || undefined,
        isPublished: form.isPublished,
        isFeatured: form.isFeatured,
      });
      setCreatedProduct({
        id: result.id,
        slug: form.slug,
        name: form.name,
        category: form.category,
        price: Number(form.price) || 0,
        description: form.description,
        shortDescription: form.shortDescription,
        isPublished: form.isPublished,
        isFeatured: form.isFeatured,
        media: [],
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setNotice(`Product "${form.name}" created.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create product.');
    } finally {
      setCreating(false);
    }
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const next: MediaFile[] = [];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        next.push({ file, type: 'image', preview: URL.createObjectURL(file) });
      } else if (file.type.startsWith('video/')) {
        next.push({ file, type: 'video', preview: URL.createObjectURL(file) });
      }
    }
    setNewMedia((prev) => [...prev, ...next]);
    event.target.value = '';
  };

  const removeNewMedia = (index: number) => {
    URL.revokeObjectURL(newMedia[index].preview);
    setNewMedia(newMedia.filter((_, i) => i !== index));
  };

  const handleUploadMedia = async () => {
    if (!createdProduct || newMedia.length === 0) return;
    setUploadingMedia(true);
    setError('');

    try {
      const client = createSupabaseBrowserClient();
      const uploaded = await Promise.all(
        newMedia.map(async (mf, index) => {
          const ext = mf.file.name.split('.').pop();
          const path = `${createdProduct.slug}/${Date.now()}-${index}.${ext}`;
          const { error } = await client.storage.from('product-media').upload(path, mf.file, {
            contentType: mf.file.type,
            upsert: false,
          });
          if (error) throw new Error(`Upload failed for ${mf.file.name}: ${error.message}`);
          return { mediaType: mf.type, mediaPath: path, sortOrder: index };
        }),
      );

      for (const u of uploaded) {
        await addProductMedia({
          productId: createdProduct.id,
          mediaType: u.mediaType,
          mediaPath: u.mediaPath,
          sortOrder: u.sortOrder,
        });
      }

      setNewMedia([]);
      setNotice(`Uploaded ${uploaded.length} file(s).`);
      setTimeout(() => setNotice(''), 3000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Upload failed.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleVariantChange = (field: keyof VariantForm, value: string) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVariant = async () => {
    if (!createdProduct) return;
    if (!newVariant.size || !newVariant.colorName) {
      setError('Size and color are required.');
      return;
    }
    setError('');
    try {
      await addProductVariant({
        productId: createdProduct.id,
        size: newVariant.size,
        colorName: newVariant.colorName,
        colorHex: newVariant.colorHex,
      });
      setNewVariant({ size: '', colorName: '', colorHex: '#000000' });
      setNotice('Variant added.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add variant.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
          >
            <ArrowLeft size={15} /> Back to products
          </Link>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Add product</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8ac9a]">
            Create a new product. Upload images and videos, then add sizes and colors as variants.
          </p>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

        <section className="grid gap-8 lg:grid-cols-[1fr_0.5fr]">
          {/* Creation form */}
          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Product details</p>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Slug</label>
                  <input required value={form.slug} onChange={(e) => handleFormChange('slug', e.target.value)} placeholder="signature-shirt" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Name</label>
                  <input required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Prolific Signature Shirt" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Category</label>
                  <input required value={form.category} onChange={(e) => handleFormChange('category', e.target.value)} placeholder="Shirts" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Price (₦)</label>
                  <input required type="number" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} placeholder="145000" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Description</label>
                <textarea required value={form.description} onChange={(e) => handleFormChange('description', e.target.value)} className="theme-input mt-2 h-32 w-full rounded-lg border px-4 py-3 text-sm" />
              </div>
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Short description</label>
                <textarea value={form.shortDescription} onChange={(e) => handleFormChange('shortDescription', e.target.value)} className="theme-input mt-2 h-24 w-full rounded-lg border px-4 py-3 text-sm" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isPublished} onChange={() => handleToggle('isPublished')} className="rounded border-white/10 text-[#d3b88b] focus:ring-0" />
                    Published
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isFeatured} onChange={() => handleToggle('isFeatured')} className="rounded border-white/10 text-[#d3b88b] focus:ring-0" />
                    Featured
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-lg bg-[#d3b88b] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]"
              >
                <Save size={16} /> {creating ? 'Creating…' : 'Create product'}
              </button>
            </form>
          </section>

          {/* Media upload */}
          {createdProduct && (
            <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Media (images & videos)</p>
                </div>
                <div className="flex gap-2">
                  <input
                    id="media-upload-new"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaSelect}
                    className="sr-only"
                  />
                  <label htmlFor="media-upload-new" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white cursor-pointer">
                    <Upload size={15} /> Upload media
                  </label>
                </div>
              </div>

              {newMedia.length > 0 && (
                <div className="space-y-3">
                  {newMedia.map((mf, index) => (
                    <div key={index} className="flex items-center gap-3 border border-white/10 rounded-lg p-3">
                      {mf.type === 'image' ? (
                        <img src={mf.preview} alt="Preview" className="h-16 w-20 object-cover rounded-md" />
                      ) : (
                        <div className="h-16 w-20 flex items-center justify-center rounded-md bg-black/20 text-xs text-[#a99d84]">Video</div>
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-[#f7f1e8]">{mf.file.name}</p>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99d84]">{mf.type}</p>
                      </div>
                      <button type="button" onClick={() => removeNewMedia(index)} className="text-xs text-[#a99d84] hover:text-red-300">Remove</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleUploadMedia}
                    disabled={uploadingMedia}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]"
                  >
                    <Upload size={15} /> {uploadingMedia ? 'Uploading…' : 'Upload selected media'}
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {createdProduct.media.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 border border-white/10 rounded-lg p-3">
                    <div className="h-16 w-20 flex items-center justify-center rounded-md bg-black/20">
                      {m.mediaType === 'image' ? (
                        <ImageIcon size={20} className="text-[#a99d84]" />
                      ) : (
                        <Film size={20} className="text-[#a99d84]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate text-[#f7f1e8]">{m.mediaPath.split('/').pop()}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99d84]">{m.mediaType}</p>
                    </div>
                  </div>
                ))}
                {createdProduct.media.length === 0 && (
                  <p className="text-xs text-[#a99d84]">No media yet.</p>
                )}
              </div>
            </section>
          )}

          {/* Variants */}
          {createdProduct && (
            <section className="lg:col-span-2 space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Variants (sizes & colors)</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
                >
                  <Plus size={15} /> Add variant
                </button>
              </div>

              <div className="space-y-4">
                {createdProduct.variants.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 border border-white/10 rounded-lg p-3">
                    <div className="h-8 w-8 shrink-0 rounded-full border border-white/10" style={{ backgroundColor: v.colorHex }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#f7f1e8]">Size {v.size} · {v.colorName}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99d84]">{v.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                ))}
                {createdProduct.variants.length === 0 && (
                  <p className="text-xs text-[#a99d84]">No variants yet.</p>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Size</label>
                    <input required value={newVariant.size} onChange={(e) => handleVariantChange('size', e.target.value)} placeholder="S" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Color name</label>
                    <input required value={newVariant.colorName} onChange={(e) => handleVariantChange('colorName', e.target.value)} placeholder="Black" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Color hex</label>
                    <input required type="color" value={newVariant.colorHex} onChange={(e) => handleVariantChange('colorHex', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm cursor-pointer" />
                  </div>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
