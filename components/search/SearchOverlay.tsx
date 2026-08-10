'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { products } from '@/data/products';

const popularTerms = ['Native Wear', 'Shirts', 'Trousers', 'Essentials', 'Bespoke'];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-6 py-8 text-[#f7f1e8]">
      <div className="relative w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#0d0b09] p-8 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#12100d]/90 text-[#f7f1e8] transition hover:border-gold hover:text-gold"
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-[#12100d] px-6 py-4">
          <Search size={20} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search Prolific Clothing"
            className="w-full bg-transparent text-lg text-white placeholder:text-[#9c8f76] focus:outline-none"
            aria-label="Search products"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.75fr_0.25fr]">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d3b88b]">Search inspiration</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {popularTerms.map((term) => (
                  <Link
                    key={term}
                    href={`/shop?search=${encodeURIComponent(term)}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#f4edd7] transition hover:border-gold hover:text-gold"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d3b88b]">Featured products</p>
              <div className="mt-6 grid gap-4">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="rounded-[22px] border border-white/10 bg-[#11100d] p-5 transition hover:border-gold"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-[#b8ac9a]">{product.category}</p>
                    <h3 className="mt-3 text-xl font-serif leading-tight text-white">{product.name}</h3>
                    <p className="mt-2 text-sm text-[#a89d83]">₦{product.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#100f0d] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d3b88b]">Why search?</p>
            <p className="mt-4 text-sm leading-7 text-[#b9a887]">
              Discover tailored essentials, curated collections, and one-of-a-kind native wear with expressive search and refined results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
