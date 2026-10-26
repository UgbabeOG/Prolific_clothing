'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Film } from 'lucide-react';
import {
  createCollection,
  updateCollection,
  type CollectionRecord,
} from '@/app/admin/products/actions';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type CollectionForm = {
  slug: string;
  name: string;
  description: string;
  isPublished: boolean;
};

type MediaFile = {
  file: File;
  type: 'image' | 'video';
  preview: string;
};

export default function AdminNewCollectionPage() {
  const [form, setForm] = useState<CollectionForm>({
    slug: '',
    name: '',
    description: '',
    isPublished: false,
  });
  const [newMedia, setNewMedia] = useState<MediaFile[]>([]);
  const [createdCollection, setCreatedCollection] = useState<CollectionRecord | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleFormChange = (field: keyof CollectionForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: keyof CollectionForm) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
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

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setCreating(true);

    try {
      const result = await createCollection({
        slug: form.slug,
        name: form.name,
        description: form.description || undefined,
        isPublished: form.isPublished,
      });
      setCreatedCollection({
        id: result.id,
        slug: form.slug,
        name: form.name,
        description: form.description || null,
        imagePath: null,
        isPublished: form.isPublished,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setNotice(`Collection "${form.name}" created.`);

      // Upload all media if selected
      if (newMedia.length > 0) {
        setUploadingMedia(true);
        try {
          const client = createSupabaseBrowserClient();
          const uploaded = await Promise.all(
            newMedia.map(async (mf, index) => {
              const ext = mf.file.name.split('.').pop();
              const path = `${form.slug}/${Date.now()}-${index}.${ext}`;
              const { error } = await client.storage.from('product-media').upload(path, mf.file, {
                contentType: mf.file.type,
                upsert: false,
              });
              if (error) throw new Error(`Upload failed for ${mf.file.name}: ${error.message}`);
              return { mediaType: mf.type as 'image' | 'video', mediaPath: path, sortOrder: index };
            }),
          );

          // Use the first uploaded image as the collection cover image_path
          const firstImage = uploaded.find((u) => u.mediaType === 'image');
          if (firstImage) {
            await updateCollection({ id: result.id, imagePath: firstImage.mediaPath });
          }
          setNotice(`Collection "${form.name}" created with ${uploaded.length} media file(s).`);
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : 'Collection created, but media upload failed.');
        } finally {
          setUploadingMedia(false);
        }
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create collection.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8">
          <Link
            href="/admin/collections"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
          >
            <ArrowLeft size={15} /> Back to collections
          </Link>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Add collection</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8ac9a]">
            Create a new shop collection. Upload one or more cover images (the first becomes the cover) and choose whether it's published.
          </p>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

        <section className="rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Collection details</p>
          <form onSubmit={handleCreate} className="space-y-5 mt-4">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Slug</label>
                <input required value={form.slug} onChange={(e) => handleFormChange('slug', e.target.value)} placeholder="native-wear" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
              </div>
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Name</label>
                <input required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} placeholder="Native Wear" className="theme-input w-full rounded-lg border px-4 py-3 text-sm" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Description</label>
              <textarea value={form.description} onChange={(e) => handleFormChange('description', e.target.value)} className="theme-input mt-2 h-24 w-full rounded-lg border px-4 py-3 text-sm" />
            </div>
            <div className="space-y-3 sm:col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Cover images (bulk)</label>
              <div className="mt-2 flex gap-3 items-center">
                <input id="cover-upload" type="file" multiple accept="image/*,video/*" onChange={handleMediaSelect} className="sr-only" />
                <label
                  htmlFor="cover-upload"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white cursor-pointer"
                >
                  <Upload size={15} /> Upload images & videos
                </label>
              </div>
              {newMedia.length > 0 && (
                <div className="mt-3 space-y-2">
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
                  <p className="text-xs text-[#a99d84]">{newMedia.length} file(s) selected. The first image becomes the collection cover.</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.isPublished} onChange={() => handleToggle('isPublished')} className="rounded border-white/10 text-[#d3b88b] focus:ring-0" />
                Published
              </label>
            </div>
            <button
              type="submit"
              disabled={creating || uploadingMedia}
              className="w-full rounded-lg bg-[#d3b88b] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]"
            >
              <Save size={16} /> {creating ? 'Creating…' : 'Create collection'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
