import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { products } from '@/data/products';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const searchTerm = (resolved?.q ?? '').trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const productText = `${product.name} ${product.category} ${product.description} ${product.shortDescription}`.toLowerCase();
    return !searchTerm || productText.includes(searchTerm);
  });

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Search"
          title={searchTerm ? `Results for “${searchTerm}”` : 'Search'}
          description={searchTerm ? `Found ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'} matching your search.` : 'Search our collections to find your next piece.'}
        />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-[#b9a887]">{searchTerm ? `Search results for “${searchTerm}”` : 'Search our collections'}</p>
          <p className="text-sm text-[#d3c7b0]">Showing {filteredProducts.length} results</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-white/10 bg-[#100f0d] p-16 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-lg text-white">No products found.</p>
            <p className="mt-4 text-sm">Try another search term or browse our collections below.</p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              {['Native Wear', 'Shirts', 'Trousers', 'T-Shirts', 'Essentials', 'Bespoke'].map((term) => (
                <Link key={term} href={`/shop?search=${encodeURIComponent(term)}`} className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f4edd7] transition hover:border-gold hover:text-gold">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
