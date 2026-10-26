'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Save, Upload, Image as ImageIcon, Film } from 'lucide-react';
import {
  loadAdminCollections,
  updateCollection,
  deleteCollection,
  loadCollectionMedia,
  addCollectionMedia,
  deleteCollectionMedia,
  type CollectionRecord,
  type CollectionMedia,
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

export default function AdminCollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const [collection, setCollection] = useState<CollectionRecord | null>(null);
  const [media, setMedia] = useState<CollectionMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    name: '',
    description: '',
    isPublished: false,
  });

  const [newMedia, setNewMedia] = useState<MediaFile[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    const fetchCollection = async () => {
      try {
        const paramsObj = await params;
        setId(paramsObj.id);
        const collections = await loadAdminCollections();
        const found = collections.find((c) => c.id === paramsObj.id);
        if (active) {
          setCollection(found ?? null);
          if (found) {
            setForm({
              slug: found.slug,
              name: found.name,
              description: found.description ?? '',
              isPublished: found.isPublished,
            });
            const collectionMedia = await loadCollectionMedia(found.id);
            setMedia(collectionMedia);
          }
        }
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : 'Could not load collection.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchCollection();
    return () => {
      active = false;
    };
  }, [params]);

  const handleFormChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: keyof typeof form) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveDetails = async () => {
    if (!collection) return;
    setError('');
    setNotice('');
    setSaving(true);

    try {
      await updateCollection({
        id: collection.id,
        slug: form.slug,
        name: form.name,
        description: form.description || null,
        isPublished: form.isPublished,
      });
      setCollection((prev) => (prev ? { ...prev, name: form.name, description: form.description || null, isPublished: form.isPublished } : prev));
      setNotice('Collection details updated.');
      setTimeout(() => setNotice(''), 3000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update collection.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveCollection = async () => {
    if (!collection) return;
    if (!window.confirm(`Delete ${collection.name}? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      const warning = await deleteCollection(collection.id);
      if (warning) setError(warning);
      else setNotice('Collection deleted.');
      setTimeout(() => {
        window.location.href = '/admin/collections';
      }, 500);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete collection.');
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
    if (!collection || newMedia.length === 0) return;
    setUploadingMedia(true);
    setError('');

    try {
      const client = createSupabaseBrowserClient();
      const uploaded = await Promise.all(
        newMedia.map(async (mf, index) => {
          const ext = mf.file.name.split('.').pop();
          const path = `${collection.slug}/${Date.now()}-${index}.${ext}`;
          const { error } = await client.storage.from('product-media').upload(path, mf.file, {
            contentType: mf.file.type,
            upsert: false,
          });
          if (error) throw new Error(`Upload failed for ${mf.file.name}: ${error.message}`);
          return { mediaType: mf.type, mediaPath: path, sortOrder: media.length + index };
        }),
      );

      for (const u of uploaded) {
        await addCollectionMedia({
          collectionId: collection.id,
          mediaType: u.mediaType,
          mediaPath: u.mediaPath,
          sortOrder: u.sortOrder,
        });
      }

      setNewMedia([]);
      setNotice(`Uploaded ${uploaded.length} file(s) to collection gallery.`);
      setTimeout(() => setNotice(''), 3000);

      const updatedMedia = await loadCollectionMedia(collection.id);
      setMedia(updatedMedia);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Upload failed.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMedia((prev) => {
      const next = new Set(prev);
      if (next.has(mediaId)) next.delete(mediaId);
      else next.add(mediaId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedMedia.size === media.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(media.map((m) => m.id)));
    }
  };

  const handleDeleteSelectedMedia = async () => {
    if (selectedMedia.size === 0) return;
    if (!window.confirm(`Delete ${selectedMedia.size} selected media item(s)? This cannot be undone.`)) return;
    setError('');
    setNotice('');

    try {
      const mediaItems = media.filter((m) => selectedMedia.has(m.id));
      await Promise.all(mediaItems.map((m) => deleteCollectionMedia(m.id)));
      setSelectedMedia(new Set());
      setNotice(`Deleted ${mediaItems.length} media item(s).`);
      setTimeout(() => setNotice(''), 3000);

      const updatedMedia = await loadCollectionMedia(collection!.id);
      setMedia(updatedMedia);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete media.');
    }
  };

  const handleRemoveSingleMedia = async (mediaItem: CollectionMedia) => {
    setError('');
    setNotice('');
    try {
      const warning = await deleteCollectionMedia(mediaItem.id);
      if (warning) setError(warning);
      else setNotice('Media removed from gallery.');
      const updatedMedia = await loadCollectionMedia(collection!.id);
      setMedia(updatedMedia);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not remove media.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
          <p className="text-sm text-[#b8ac9a]">Loading collection…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AnnouncementBar />
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
          <div className="rounded-2xl border border-white/10 bg-[#100f0d] p-12 text-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">Collection not found.</p>
            <Link
              href="/admin/collections"
              className="mt-6 inline-flex rounded-[18px] border border-white/10 px-6 py-3 text-sm uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
            >
              Back to collections
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const coverImage = media.find((m) => m.mediaType === 'image')?.mediaPath ?? collection.imagePath;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/collections"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
            >
              <ArrowLeft size={15} /> Back to collections
            </Link>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{collection.name}</h1>
            <p className={`mt-1 text-xs uppercase tracking-[0.16em] ${collection.isPublished ? 'text-[#d3b88b]' : 'text-[#a99d84]'}`}>
              {collection.isPublished ? 'Published' : 'Draft'} · {media.length} gallery item(s)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDetails}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50 hover:bg-[#e5d3b2]"
            >
              <Save size={15} /> Save changes
            </button>
            <button
              type="button"
              onClick={handleRemoveCollection}
              className="text-xs uppercase tracking-[0.16em] text-[#a99d84] hover:text-red-300"
            >
              <Trash2 size={16} /> Delete collection
            </button>
          </div>
        </div>

        {error && <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

        <section className="grid gap-8 lg:grid-cols-[1fr_0.5fr]">
          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Collection details</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveDetails(); }} className="space-y-5">
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
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Description</label>
                  <textarea required value={form.description} onChange={(e) => handleFormChange('description', e.target.value)} className="theme-input mt-2 h-32 w-full rounded-lg border px-4 py-3 text-sm" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.isPublished} onChange={() => handleToggle('isPublished')} className="rounded border-white/10 text-[#d3b88b] focus:ring-0" />
                  Published
                </label>
              </div>
            </form>
          </section>

          <section className="space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Cover image</p>
              <p className="mt-2 text-xs text-[#a99d84]">The cover is the first image in the gallery. It represents this collection publicly.</p>
            </div>
            <div className="flex items-center gap-4">
              {coverImage ? (
                <div className="relative h-32 w-40 shrink-0 overflow-hidden rounded-md border border-white/10">
                  <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-32 w-40 shrink-0 flex items-center justify-center rounded-md border border-white/10 text-xs text-[#a99d84]">No cover</div>
              )}
              <div className="flex-1">
                <p className="text-sm text-[#f7f1e8] truncate">{coverImage ? coverImage.split('/').pop() : 'None'}</p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2 space-y-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Collection gallery</p>
                <p className="mt-1 text-xs text-[#a99d84]">Add more images and videos below. The cover image stays unchanged.</p>
              </div>
              {selectedMedia.size > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-950/20 px-3 py-2">
                  <span className="text-xs text-red-200">{selectedMedia.size} selected</span>
                  <button
                    type="button"
                    onClick={handleDeleteSelectedMedia}
                    className="ml-2 text-xs text-red-300 hover:text-white"
                  >
                    Delete selected
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  className="sr-only"
                />
                <label htmlFor="media-upload" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white cursor-pointer">
                  <Upload size={15} /> Add media
                </label>
              </div>
            </div>

            {newMedia.length > 0 && (
              <div className="mt-4 space-y-2">
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

            <div className="space-y-3 mt-4">
              {media.length > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-[#d3c7b0] hover:text-gold"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMedia.size === media.length && media.length > 0}
                      className="rounded border-white/10 text-[#d3b88b] focus:ring-0"
                    />
                    {selectedMedia.size === media.length && media.length > 0 ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
              )}
              {media.map((m) => (
                <div key={m.id} className="flex items-center gap-3 border border-white/10 rounded-lg p-3 group">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedMedia.has(m.id)}
                      onChange={() => toggleMediaSelection(m.id)}
                      className="rounded border-white/10 text-[#d3b88b] focus:ring-0"
                    />
                  </div>
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-black/20 flex items-center justify-center">
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
                    onClick={() => handleRemoveSingleMedia(m)}
                    className="text-xs text-[#a99d84] hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {media.length === 0 && (
                <p className="text-xs text-[#a99d84]">No gallery items yet. Add images and videos above.</p>
              )}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
