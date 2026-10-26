import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPublicCollections } from '@/lib/products.server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const collections = await getPublicCollections();

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Collections"
          title="Our collections."
          description="Explore curated groups of pieces, each with its own character and story."
        />

        {collections.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-white/10 bg-[#100f0d] p-16 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">No collections available yet.</p>
            <p className="mt-4 text-sm">Check back soon for new collections.</p>
          </div>
        ) : (
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#100f0d] transition hover:border-gold/40 hover:-translate-y-1" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden bg-[#11100d]">
                  {collection.image ? (
                    <Image src={collection.image} alt={collection.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-[#a99d84]">No cover image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">{collection.name}</p>
                  <p className="mt-3 text-sm leading-7 text-[#b8ac9a]">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
