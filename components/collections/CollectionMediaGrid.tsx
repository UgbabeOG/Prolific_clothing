'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cart/CartContext';
import type { PublicCollectionMedia } from '@/lib/products.server';

interface CollectionMediaGridProps {
  media: PublicCollectionMedia[];
}

export function CollectionMediaGrid({ media }: CollectionMediaGridProps) {
  const { addItem, openCart } = useCart();

  const handleAddToBag = (product: PublicCollectionMedia['product']) => {
    if (!product) return;
    addItem({
      productId: product.id,
      product: product as never,
      size: product.sizes[0] ?? 'OS',
      color: product.colors[0] ?? { name: 'Default', hex: '#000000' },
      quantity: 1,
    });
    openCart();
  };

  return (
    <section aria-label="Collection media" className="mt-8">
      <div className="columns-2 gap-4 sm:gap-6 lg:columns-3 xl:columns-4">
        {media.map((item) => (
          <article key={item.id} className="mb-6 inline-block w-full break-inside-avoid sm:mb-8">
            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#100f0d]">
              {item.mediaType === 'image' ? (
                <Image src={item.mediaUrl} alt="Collection piece" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" loading="lazy" decoding="async" />
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
              {item.product && (
                <button
                  type="button"
                  onClick={() => handleAddToBag(item.product)}
                  className="absolute right-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#d3b88b] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#0b0907] transition hover:bg-[#e5d3b2] opacity-0 group-hover:opacity-100"
                  aria-label={`Add ${item.product.name} to bag`}
                >
                  <Plus size={14} /> Add to bag
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#a99d84]">
        {media.length} {media.length === 1 ? 'item' : 'items'} in this collection
      </p>
    </section>
  );
}
