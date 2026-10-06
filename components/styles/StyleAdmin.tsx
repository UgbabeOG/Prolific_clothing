'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { LogOut, Plus, Upload, X } from 'lucide-react';
import {
  addStyleCategory,
  archiveStyle,
  createDraftStyle,
  deleteStyleCategory,
  loadAdminStyles,
  setCategoryActive,
  setStyleImage,
  setStylePublished,
} from '@/app/admin/styles/actions';
import { formatStyleId, STYLE_STORAGE_BUCKET, type StyleCategory, type StyleRecord } from '@/lib/styles';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type AdminStyle = StyleRecord & { imageUrl: string | null };
type AdminData = { categories: StyleCategory[]; styles: AdminStyle[] };

async function compressImage(file: File) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    throw new Error('Choose a raster image such as JPG, PNG, or WebP.');
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('This browser could not prepare the image for upload.');
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const compressed = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('The image could not be compressed. Try another image.'));
    }, 'image/webp', 0.82);
  });

  if (compressed.size > 5 * 1024 * 1024) {
    throw new Error('The compressed image is over the 5 MB upload limit.');
  }
  return {
    file: compressed,
    width: canvas.width,
    height: canvas.height,
  };
}

export function StyleAdmin() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [data, setData] = useState<AdminData>({ categories: [], styles: [] });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refreshData = async () => {
    const nextData = await loadAdminStyles();
    setData(nextData);
    setUploadCategory((current) => current || nextData.categories.find((category) => category.is_active)?.id || '');
  };

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const client = createSupabaseBrowserClient();
        const { data: { user }, error: authError } = await client.auth.getUser();
        if (authError) throw new Error(`Could not check admin session: ${authError.message}`);
        if (!active) return;

        if (user?.app_metadata?.role === 'style_admin') {
          await refreshData();
          if (active) setSignedIn(true);
        }
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : 'Could not check the admin session.');
      } finally {
        if (active) setReady(true);
      }
    };

    void checkSession();
    return () => {
      active = false;
    };
  }, []);

  const perform = async (action: () => Promise<void>, successMessage: string) => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await action();
      await refreshData();
      setNotice(successMessage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The request could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const client = createSupabaseBrowserClient();
      const { data: result, error: authError } = await client.auth.signInWithPassword({ email, password });
      if (authError) throw new Error(authError.message);
      if (result.user.app_metadata?.role !== 'style_admin') {
        await client.auth.signOut();
        throw new Error('This account is not authorized to manage the Style Library.');
      }
      await refreshData();
      setSignedIn(true);
      setPassword('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const submitCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await perform(async () => {
      await addStyleCategory(categoryName);
      setCategoryName('');
    }, 'Category added.');
  };

  const submitImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !uploadCategory) {
      setError('Choose an image and category before uploading.');
      return;
    }

    setError('');
    setNotice('');
    setBusy(true);
    let uploadedPath: string | null = null;
    let reservedStyleId = '';
    try {
      const compressedImage = await compressImage(file);
      const draft = await createDraftStyle(uploadCategory);
      reservedStyleId = draft.styleId;
      uploadedPath = `${draft.styleId}/${crypto.randomUUID()}.webp`;
      const client = createSupabaseBrowserClient();
      const { error: uploadError } = await client.storage
        .from(STYLE_STORAGE_BUCKET)
        .upload(uploadedPath, compressedImage.file, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Image upload failed for ${draft.styleId}: ${uploadError.message}`);
      }

      await setStyleImage(draft.styleId, uploadedPath, compressedImage.width, compressedImage.height);
      setFile(null);
      const fileInput = document.getElementById('style-image') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      await refreshData();
      setNotice(`${draft.styleId} uploaded and saved as a draft. Publish it when you are ready.`);
    } catch (caught) {
      if (uploadedPath) {
        const client = createSupabaseBrowserClient();
        const { error: removeError } = await client.storage.from(STYLE_STORAGE_BUCKET).remove([uploadedPath]);
        if (removeError) {
          setError(`${caught instanceof Error ? caught.message : 'Upload failed.'} Cleanup also failed: ${removeError.message}`);
        } else {
          setError(caught instanceof Error ? caught.message : 'Upload failed.');
        }
      } else {
        setError(caught instanceof Error ? caught.message : 'Upload failed.');
      }

      if (reservedStyleId) {
        setError((current) => `${current} The reserved ID ${reservedStyleId} remains unused and will not be reassigned.`);
      }
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setError('');
    setBusy(true);
    try {
      const { error: authError } = await createSupabaseBrowserClient().auth.signOut();
      if (authError) throw new Error(`Could not sign out: ${authError.message}`);
      setSignedIn(false);
      setData({ categories: [], styles: [] });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-out failed.');
    } finally {
      setBusy(false);
    }
  };

  const removeStyle = async (styleId: string) => {
    if (!window.confirm(`Remove ${styleId} from the Style Library? This ID will remain permanently reserved.`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const warning = await archiveStyle(styleId);
      await refreshData();
      if (warning) setError(warning);
      else setNotice(`${styleId} removed. Its ID remains reserved.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : `Could not remove ${styleId}.`);
    } finally {
      setBusy(false);
    }
  };

  if (!getSupabaseConfig()) {
    return <p className="text-sm text-[#b8ac9a]">Supabase environment variables are missing.</p>;
  }

  if (!ready) {
    return <p className="text-sm text-[#b8ac9a]">Checking administrator access…</p>;
  }

  if (!signedIn) {
    return (
      <section className="max-w-md rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8">
        <h2 className="font-serif text-2xl">Administrator sign-in</h2>
        <p className="mt-2 text-sm leading-6 text-[#b8ac9a]">Use the email and password for your authorized admin account.</p>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
        <form className="mt-6 space-y-4" onSubmit={signIn}>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
            Email
            <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm normal-case tracking-normal" />
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
            Password
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm normal-case tracking-normal" />
          </label>
          <button disabled={busy} className="w-full rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    );
  }

  const activeCategories = data.categories.filter((category) => category.is_active);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#100f0d] px-5 py-4">
        <p className="text-sm text-[#b8ac9a]">Signed in as an authorized administrator.</p>
        <button type="button" disabled={busy} onClick={() => void signOut()} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] hover:text-white">
          <LogOut size={15} /> Sign out
        </button>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{notice}</p>}

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={submitImage} className="space-y-5 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8">
          <div>
            <h2 className="font-serif text-2xl">Add a style</h2>
            <p className="mt-2 text-sm leading-6 text-[#b8ac9a]">Images are resized and converted to WebP before upload. New styles stay unpublished until you publish them.</p>
          </div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
            Category
            <select required value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value)} className="theme-input mt-2 w-full rounded-lg border px-4 py-3 text-sm normal-case tracking-normal">
              <option value="">Choose a category</option>
              {activeCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">
            Image
            <input id="style-image" required type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-[#b8ac9a] file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.14em] file:text-white" />
          </label>
          {file && <p className="truncate text-xs text-[#b8ac9a]">Selected: {file.name}</p>}
          <button type="submit" disabled={busy || !file || !uploadCategory} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] disabled:opacity-50">
            <Upload size={15} /> {busy ? 'Uploading…' : 'Upload style'}
          </button>
        </form>

        <section className="space-y-5 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8">
          <div>
            <h2 className="font-serif text-2xl">Categories</h2>
            <p className="mt-2 text-sm leading-6 text-[#b8ac9a]">Deactivate a category to hide it from the public filters. Delete only categories that are not assigned to styles.</p>
          </div>
          <form onSubmit={submitCategory} className="flex gap-2">
            <input required maxLength={48} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="New category" className="theme-input min-w-0 flex-1 rounded-lg border px-4 py-3 text-sm" />
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-xs uppercase tracking-[0.16em] hover:border-[#d3b88b]">
              <Plus size={15} /> Add
            </button>
          </form>
          <ul className="divide-y divide-white/10">
            {data.categories.map((category) => (
              <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm">{category.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#a99d84]">{category.is_active ? 'Visible to visitors' : 'Hidden'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" disabled={busy} onClick={() => void perform(() => setCategoryActive(category.id, !category.is_active), category.is_active ? 'Category hidden.' : 'Category visible.')} className="text-xs text-[#d3c7b0] hover:text-white">
                    {category.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button type="button" disabled={busy} aria-label={`Delete ${category.name}`} onClick={() => void perform(() => deleteStyleCategory(category.id), 'Category deleted.')} className="text-[#a99d84] hover:text-red-300">
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl">Styles</h2>
            <p className="mt-2 text-sm text-[#b8ac9a]">{data.styles.length} active {data.styles.length === 1 ? 'style' : 'styles'}</p>
          </div>
        </div>
        {data.styles.length === 0 ? (
          <p className="mt-6 text-sm text-[#b8ac9a]">No styles yet. Upload your first image above.</p>
        ) : (
          <ul className="mt-6 divide-y divide-white/10">
            {data.styles.map((style) => {
              const styleId = formatStyleId(style.style_number);
              return (
                <li key={style.id} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-black/20">
                    {style.imageUrl && style.image_width && style.image_height && <Image src={style.imageUrl} alt="" width={style.image_width} height={style.image_height} unoptimized loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-32 flex-1">
                    <p className="font-serif text-lg">{styleId}</p>
                    <p className="mt-1 text-xs text-[#b8ac9a]">{style.category?.name ?? 'Uncategorized'} · {style.is_published ? 'Published' : 'Draft'}</p>
                  </div>
                  <button type="button" disabled={busy || !style.image_path} onClick={() => void perform(() => setStylePublished(styleId, !style.is_published), style.is_published ? `${styleId} unpublished.` : `${styleId} published.`)} className="rounded-full border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[#d3c7b0] hover:border-[#d3b88b] disabled:opacity-40">
                    {style.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void removeStyle(styleId)} className="text-xs text-[#a99d84] hover:text-red-300">
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
