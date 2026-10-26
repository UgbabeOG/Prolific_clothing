import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSupabaseConfig } from '@/lib/supabase/config';
import {
  loadAdminCollections,
  updateCollection,
  deleteCollection,
  type CollectionRecord,
} from '@/app/admin/products/actions';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowLeft, Trash2, Save, Upload } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export const metadata: Metadata = {
  title: 'Edit Collection — Prolific Clothing Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminCollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const configured = Boolean(getSupabaseConfig());
  const { id } = await params;
  const collections = await loadAdminCollections();
  const collection = collections.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/collections"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white"
            >
              <ArrowLeft size={15} /> Back to collections
            </Link>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{collection ? collection.name : 'Collection'}</h1>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (collection && window.confirm(`Delete ${collection.name}? This cannot be undone.`)) {
                try {
                  const warning = await deleteCollection(collection.id);
                  if (warning) alert(warning);
                  else {
                    // redirect handled by router in a client component; use link for now
                    window.location.href = '/admin/collections';
                  }
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Could not delete collection.');
                }
              }
            }}
            className="text-xs uppercase tracking-[0.16em] text-[#a99d84] hover:text-red-300"
          >
            <Trash2 size={16} /> Delete collection
          </button>
        </div>

        {!configured && (
          <div className="rounded-2xl border border-[#d3b88b]/30 bg-[#100f0d] p-6 text-sm leading-7 text-[#d3c7b0]">
            Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the server environment, then restart the site.
          </div>
        )}

        {collection && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#100f0d] p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Collection details</p>
            <form className="space-y-5" onSubmit={(e) => {
              e.preventDefault();
              // This is a server-rendered page; form submission would need client handling.
              // For now, the edit form is display-only; use the new collection flow to create.
            }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Slug</label>
                  <input
                    defaultValue={collection.slug}
                    className="theme-input w-full rounded-lg border px-4 py-3 text-sm bg-[#0d0b09]/50"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Name</label>
                  <input
                    defaultValue={collection.name}
                    className="theme-input w-full rounded-lg border px-4 py-3 text-sm bg-[#0d0b09]/50"
                  />
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Description</label>
                  <textarea
                    defaultValue={collection.description ?? ''}
                    className="theme-input mt-2 h-24 w-full rounded-lg border px-4 py-3 text-sm bg-[#0d0b09]/50"
                  />
                </div>
              </div>
              <div className="space-y-3 sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#d3c7b0]">Cover image</label>
                <div className="mt-2 flex gap-3 items-center">
                  {collection.imagePath && (
                    <span className="text-xs text-[#a99d84] truncate max-w-[400px]">{collection.imagePath.split('/').pop()}</span>
                  )}
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d3c7b0] transition hover:border-gold hover:text-white cursor-pointer"
                  >
                    <Upload size={15} /> Upload cover
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked={collection.isPublished} className="rounded border-white/10 text-[#d3b88b] focus:ring-0" />
                  Published
                </label>
              </div>
              <button
                type="button"
                disabled={true}
                className="w-full rounded-lg border border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a99d84] disabled:opacity-50"
              >
                <Save size={16} /> Save changes (coming soon)
              </button>
            </form>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
