'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import type { PublicProduct } from '@/lib/products.server';
import type { PublicCollection } from '@/lib/products.server';

interface ShoppableCollectionGridProps {
  collections: PublicCollection[];
  products: PublicProduct[];
}

function matchCollection(product: PublicProduct, collection: PublicCollection): boolean {
  const categoryLower = product.category.toLowerCase();
  const collectionNormalized = collection.slug.replace(/-/g, ' ');
  return (
    categoryLower === collection.slug ||
    categoryLower === collectionNormalized ||
    categoryLower.replace(/-/g, ' ') === collectionNormalized ||
    (collection.slug === 'native-wear' && categoryLower.includes('native')) ||
    (collection.slug === 'shirts' && categoryLower.includes('shirt')) ||
    (collection.slug === 'trousers' && categoryLower.includes('trouser')) ||
    (collection.slug === 't-shirts' && categoryLower.includes('t-shirt')) ||
    (collection.slug === 'ready-to-wear' && (categoryLower.includes('ready') || categoryLower.includes('shirt') || categoryLower.includes('trouser')))
  );
}

export function ShoppableCollectionGrid({ collections, products }: ShoppableCollectionGridProps) {
  return (
    <div className="mt-14 space-y-16">
      {collections.map((collection) => {
        const collectionProducts = products.filter((p) => matchCollection(p, collection));

        return (
          <section key={collection.id} className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-4xl leading-tight text-white sm:text-5xl">{collection.name}</h2>
                <p className="mt-3 text-sm leading-7 text-[#b8ac9a]">{collection.description}</p>
              </div>
              <Link
                href={`/collections/${collection.slug}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d3c7b0] transition hover:text-gold"
              >
                View collection <span>→</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collectionProducts.length === 0 ? (
                <div className="col-span-full rounded-[28px] border border-white/10 bg-[#100f0d] p-12 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <p className="text-lg text-white">No products in this collection yet.</p>
                </div>
              ) : (
                collectionProducts.map((product) => (
                  <ProductCard key={product.id} product={product as never} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
