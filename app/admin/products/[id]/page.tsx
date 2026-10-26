'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Upload, Film, Image as ImageIcon } from 'lucide-react';
import {
  loadAdminProducts,
  updateProduct,
  deleteProduct,
  addProductMedia,
  deleteProductMedia,
  addProductVariant,
  deleteProductVariant,
  type ProductRecord,
  type ProductMedia,
  type ProductVariant,
} from '@/app/admin/products/actions';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { STYLE_STORAGE_BUCKET } from '@/lib/styles';

type MediaFile = {
  file: File;
  type: 'image' | 'video';
  preview: string;
};

export default function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

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

// Form fields
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

// Media
const [newMedia, setNewMedia] = useState<MediaFile[]>([]);
const [uploadingMedia, setUploadingMedia] = useState(false);

// Variants
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

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      try {
        const paramsObj = await params;
        setId(paramsObj.id);
        const products = await loadAdminProducts();
        const found = products.find((p) => p.id === paramsObj.id);
        if (active) {
          setProduct(found ?? null);
          if (found) {
            setForm({
              slug: found.slug,
              name: found.name,
              category: found.category,
              price: found.price.toString(),
              description: found.description ?? '',
              shortDescription: found.shortDescription ?? '',
              isPublished: found.isPublished,
              isFeatured: found.isFeatured,
            });
          }
        }
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : 'Could not load product.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProduct();
    return () => {
      active = false;
    };
  }, [params]);

  const handleFormChange = (field: keyof ProductForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: keyof ProductForm) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    if (!product) return;
    setError('');
    setNotice('');
    setSaving(true);

    try {
      await updateProduct({
        id: product.id,
        slug: form.slug,
        name: form.name,
        category: form.category,
        price: Number(form.price) || 0,
        description: form.description || null,
        shortDescription: form.shortDescription || null,
        isPublished: form.isPublished,
        isFeatured: form.isFeatured,
      });
      setNotice('Product updated.');
      setTimeout(() => setNotice(''), 3000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!product) return;
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      const warning = await deleteProduct(product.id);
      if (warning) setError(warning);
      else setNotice('Product deleted.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete product.');
    }
  };

  // Media upload
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files ?? []);
    const next: MediaFile[] = [];
    for (const file of files) {
      if (type === 'image' && !file.type.startsWith('image/')) continue;
      if (type === 'video' && !file.type.startsWith('video/')) continue;
      next.push({
        file,
        type,
        preview: URL.createObjectURL(file),
      });
    }
    setNewMedia((prev) => [...prev, ...next]);
    event.target.value = '';
  };

  const removeNewMedia = (index: number) => {
    URL.revokeObjectURL(newMedia[index].preview);
    setNewMedia(newMedia.filter((_, i) => i !== index));
  };

  const handleUploadMedia = async () => {
    if (!product || newMedia.length === 0) return;
    setUploadingMedia(true);
    setError('');

    try {
      const client = createSupabaseBrowserClient();
      const uploaded = await Promise.all(
        newMedia.map(async (mf, index) => {
          const ext = mf.file.name.split('.').pop();
          const path = `${product.slug}/${Date.now()}-${index}.${ext}`;
          const { error } = await client.storage.from('product-media').upload(path, mf.file, {
            contentType: mf.file.type,
            upsert: false,
          });
          if (error) throw new Error(`Upload failed for ${mf.file.name}: ${error.message}`);
          return { mediaType: mf.type, mediaPath: path, sortOrder: product.media.length + index };
        }),
      );

      for (const u of uploaded) {
        await addProductMedia({ productId: product.id, mediaType: u.mediaType, mediaPath: u.mediaPath, sortOrder: u.sortOrder });
      }

      setNewMedia([]);
      setNotice(`Uploaded ${uploaded.length} file(s).`);
      setTimeout(() => setNotice(''), 3000);
      // Refresh product data
      const products = await loadAdminProducts();
      const found = products.find((p) => p.id === product!.id);
      if (found) setProduct(found);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Upload failed.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleRemoveMedia = async (media: ProductMedia) => {
    setError('');
    setNotice('');
    try {
      const warning = await deleteProductMedia(media.id);
      if (warning) setError(warning);
      else setNotice('Media removed.');
      const products = await loadAdminProducts();
      const found = products.find((p) => p.id === product!.id);
      if (found) setProduct(found);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not remove media.');
    }
  };

  // Variants
  const handleVariantChange = (field: keyof VariantForm, value: string) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVariant = async () => {
    if (!product) return;
    if (!newVariant.size || !newVariant.colorName) {
      setError('Size and color are required.');
      return;
    }
    setError('');
    try {
      await addProductVariant({
        productId: product.id,
        size: newVariant.size,
        colorName: newVariant.colorName,
        colorHex: newVariant.colorHex,
      });
      setNewVariant({ size: '', colorName: '', colorHex: '#000000' });
      setNotice('Variant added.');
      const products = await loadAdminProducts();
      const found = products.find((p) => p.id === product.id);
      if (found) setProduct(found);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add variant.');
    }
  };

  const handleRemoveVariant = async (variantId: string) => {
    setError('');
    setNotice('');
    try {
      await deleteProductVariant(variantId);
      setNotice('Variant removed.');
      const products = await loadAdminProducts();
      const found = products.find((p) => p.id === product!.id);
      if (found) setProduct(found);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not remove variant.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
          <p className="text-sm text-[#b8ac9a]">Loading product…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
          <div className="rounded-2xl border border-white/10 bg-[#100f0d] p-12 text-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">Product not found.</p>
            <Link
              href="/admin/products"
              className="mt-6 inline-flex rounded-[18px] border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
            >
              Back to products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
            >
              <ArrowLeft size={15} /> Back to products
            </Link>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{product.name}</h1>
            <p className={`mt-1 text-xs uppercase tracking-[0.16em] ${product.isPublished ? 'text-[#d3b88b]' : 'text-[#a99d84]'}`}>
              {product.isPublished ? 'Published' : 'Draft'} · {product.media.length} media file(s) · {product.variants.length} variant(s)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]"
            >
              <Save size={15} /> Save changes
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs uppercase tracking-[0.16em] text-[#a99d84] hover:text-red-300"
            >
              <Trash2 size={16} /> Delete product
            </button>
          </div>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

        <section className="grid gap-8 lg:grid-cols-[1fr_0.5fr]">
          {/* Product details form */}
          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Product details</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Slug</label>
                  <input required value={form.slug} onChange={(e) => handleFormChange('slug', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Name</label>
                  <input required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Category</label>
                  <input required value={form.category} onChange={(e) => handleFormChange('category', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Price (₦)</label>
                  <input required type="number" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
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
            </form>
          </section>

          {/* Media upload */}
          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Media (images & videos)</p>
              </div>
              <div className="flex gap-2">
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    const next: MediaFile[] = [];
                    for (const file of files) {
                      if (file.type.startsWith('image/')) {
                        next.push({ file, type: 'image', preview: URL.createObjectURL(file) });
                      } else if (file.type.startsWith('video/')) {
                        next.push({ file, type: 'video', preview: URL.createObjectURL(file) });
                      }
                    }
                    setNewMedia((prev) => [...prev, ...next]);
                    e.target.value = '';
                  }}
                  className="sr-only"
                />
                <label htmlFor="media-upload" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white cursor-pointer">
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
              {product.media.map((m) => (
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
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(m)}
                    className="text-xs text-[#a99d84] hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {product.media.length === 0 && (
                <p className="text-xs text-[#a99d84]">No media yet. Upload images or videos above.</p>
              )}
            </div>
          </section>

          {/* Variants */}
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
              {product.variants.map((v) => (
                <div key={v.id} className="flex items-center gap-3 border border-white/10 rounded-lg p-3">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-white/10" style={{ backgroundColor: v.colorHex }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f7f1e8]">Size {v.size} · {v.colorName}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99d84]">{v.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    className="text-xs text-[#a99d84] hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {product.variants.length === 0 && (
                <p className="text-xs text-[#a99d84]">No variants yet. Add sizes and colors below.</p>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Size</label>
                  <input required value={newVariant.size} onChange={(e) => handleVariantChange('size', e.target.value)} placeholder="S, M, L…" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Color name</label>
                  <input required value={newVariant.colorName} onChange={(e) => handleVariantChange('colorName', e.target.value)} placeholder="Black, Cream…" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Color hex</label>
                  <input required type="color" value={newVariant.colorHex} onChange={(e) => handleVariantChange('colorHex', e.target.value)} className="theme-input w-full rounded-lg border px-4 py-3 text-sm cursor-pointer" />
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
