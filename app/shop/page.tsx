import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { products } from '@/data/products';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type ShopSearchParams = {
  search?: string;
  collection?: string;
  sort?: string;
};

export default async function ShopPage({ searchParams }: { searchParams?: Promise<ShopSearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const searchTerm = resolvedSearchParams?.search?.trim().toLowerCase() ?? '';
  const collection = resolvedSearchParams?.collection?.trim().toLowerCase() ?? '';
  const sort = resolvedSearchParams?.sort;

  const filteredProducts = products
    .filter((product) => {
      if (collection && collection !== 'all' && product.category.toLowerCase() !== collection) {
        return false;
      }
      if (!searchTerm) {
        return true;
      }
      const productText = `${product.name} ${product.category} ${product.description} ${product.shortDescription}`.toLowerCase();
      return productText.includes(searchTerm);
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });

  const statusLabel = searchTerm
    ? `Search results for “${searchTerm}”`
    : collection && collection !== 'all'
    ? `Filtering ${collection}`
    : 'All products';

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Shop"
          title="A calm, editorial destination for our collections."
          description="Browse categories, filter by essentials, and explore a premium selection of handpicked pieces."
        />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-[#b9a887]">{statusLabel}</p>
          <p className="text-sm text-[#d3c7b0]">Showing {filteredProducts.length} products</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.4fr_1fr]">
          <aside className="space-y-8 rounded-[28px] border border-white/10 bg-[#100f0d] p-8 text-sm text-[#b9a887]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Category</p>
              <ul className="mt-6 space-y-4">
                <li><Link href="/shop?collection=native-wear" className="transition hover:text-gold">Native Wear</Link></li>
                <li><Link href="/shop?collection=shirts" className="transition hover:text-gold">Shirts</Link></li>
                <li><Link href="/shop?collection=trousers" className="transition hover:text-gold">Trousers</Link></li>
                <li><Link href="/shop?collection=t-shirts" className="transition hover:text-gold">T-Shirts</Link></li>
                <li><Link href="/shop?collection=ready-to-wear" className="transition hover:text-gold">Ready-to-Wear</Link></li>
                <li><Link href="/bespoke" className="transition hover:text-gold">Bespoke</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Popular Searches</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Native Wear', 'Shirts', 'Trousers', 'T-Shirts', 'Essentials', 'Bespoke'].map((term) => (
                  <Link key={term} href={`/shop?search=${encodeURIComponent(term)}`} className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f4edd7] transition hover:border-gold hover:text-gold">
                    {term}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Sort</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/shop?sort=price-asc" className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f4edd7] transition hover:border-gold hover:text-gold">
                  Price: Low to High
                </Link>
                <Link href="/shop?sort=price-desc" className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f4edd7] transition hover:border-gold hover:text-gold">
                  Price: High to Low
                </Link>
              </div>
            </div>
          </aside>

          <section className="space-y-10">
            {filteredProducts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[#100f0d] p-12 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <p className="text-lg text-white">No products found.</p>
                <p className="mt-4">Try another search term or explore one of our curated collections.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
