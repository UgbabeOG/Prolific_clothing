'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/CartContext';

export function ProductPurchaseForm({ product, whatsappHref }: { product: Product; whatsappHref: string }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleAddToBag = () => {
    if (!selectedSize || !selectedColor) return;
    addItem({
      productId: product.id,
      product,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Size</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-[14px] border px-4 py-3 text-sm uppercase tracking-[0.24em] transition ${
                  selectedSize === size
                    ? 'border-gold text-gold'
                    : 'border-white/10 text-[#f7f1e8] hover:border-gold'
                }`}
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Color</p>
          <div className="mt-4 flex items-center gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 text-sm transition ${
                  selectedColor?.name === color.name
                    ? 'border-gold text-gold'
                    : 'border-white/10 text-[#f7f1e8] hover:border-gold'
                }`}
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <span className="h-4 w-4 rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleAddToBag}
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
    </div>
  );
}
