'use client';

import type { Product } from '@/lib/types';

export function ProductPurchaseForm({ product, whatsappHref }: { product: Product; whatsappHref: string }) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        className="w-full rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]"
      >
        Add to Bag
      </button>
      <button
        type="button"
        className="w-full rounded-[18px] border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold"
      >
        Buy Now
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center rounded-[18px] border border-white/10 bg-[#11100d] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        Inquiry via WhatsApp
      </a>
    </div>
  );
}
