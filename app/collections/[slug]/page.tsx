import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicCollection, getPublicCollectionMedia, type PublicCollectionMedia } from '@/lib/products.server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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
          <section aria-label="Collection media" className="mt-8">
            <div className="columns-2 gap-4 sm:gap-6 lg:columns-3 xl:columns-4">
              {media.map((item) => (
                <article key={item.id} className="mb-6 inline-block w-full break-inside-avoid sm:mb-8">
                  <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#100f0d]">
                    {item.mediaType === 'image' ? (
                      <Image src={item.mediaUrl} alt={collection.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" loading="lazy" decoding="async" />
                    ) : (
                      <div className="relative h-[420px] overflow-hidden rounded-[24px] bg-[#11100d]">
                        <video src={item.mediaUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <polygon points="12 2 18 12 12 22" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#a99d84]">
              {media.length} {media.length === 1 ? 'item' : 'items'} in this collection
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
