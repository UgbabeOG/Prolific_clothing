import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getPublicCollections, getPublicProducts, type PublicCollection, type PublicProduct } from '@/lib/products.server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShoppableCollectionGrid } from '@/components/collections/ShoppableCollectionGrid';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([
    getPublicCollections(),
    getPublicProducts(),
  ]);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Collections"
          title="Our collections."
          description="Explore curated groups of pieces, each with its own character and story. Shop directly from any collection."
        />

        {collections.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-white/10 bg-[#100f0d] p-16 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">No collections available yet.</p>
            <p className="mt-4 text-sm">Check back soon for new collections.</p>
          </div>
        ) : (
          <ShoppableCollectionGrid collections={collections as PublicCollection[]} products={products as PublicProduct[]} />
        )}
      </main>
      <Footer />
    </div>
  );
}
