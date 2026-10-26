import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicCollection, getPublicCollectionMedia, type PublicCollectionMedia } from '@/lib/products.server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CollectionMediaGrid } from '@/components/collections/CollectionMediaGrid';

export const dynamic = 'force-dynamic';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getPublicCollection(slug);
  if (!collection) {
    return { title: 'Collection not found' };
  }
  return {
    title: `${collection.name} — Prolific Clothing`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getPublicCollection(slug);
  if (!collection) {
    notFound();
  }

  const media = await getPublicCollectionMedia(collection.id);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="mb-12">
          <Link href="/collections" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d3c7b0] transition hover:text-gold">
            <span>←</span> Back to collections
          </Link>
          <h1 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl">{collection.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#b8ac9a]">{collection.description}</p>
        </div>

        {media.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-[#100f0d] p-16 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">No media in this collection yet.</p>
            <p className="mt-4 text-sm">New images and videos will appear here soon.</p>
          </div>
        ) : (
          <CollectionMediaGrid media={media} />
        )}
      </main>
      <Footer />
    </div>
  );
}
