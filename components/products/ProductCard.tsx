import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Heart, Eye } from 'lucide-react';
import { productInquiryMessage, createWhatsAppLink } from '@/lib/whatsapp';

export function ProductCard({ product }: { product: Product }) {
  const enquiryHref = createWhatsAppLink(productInquiryMessage(product.name));

  return (
    <div className="group relative overflow-hidden rounded-[26px] bg-[#100f0d] border border-white/10 transition hover:-translate-y-1">
      <div className="relative h-96 overflow-hidden bg-[#16120f]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white opacity-90 transition hover:border-gold hover:text-gold"
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-[#b9a788]">
          <span>{product.category}</span>
          <span>₦{product.price.toLocaleString()}</span>
        </div>
        <div>
          <h3 className="text-2xl font-serif leading-tight text-white">{product.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[#bfb3a0]">{product.shortDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color.name}
              className="h-3.5 w-3.5 rounded-full border border-white/10"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-3">
          <Link href={`/products/${product.slug}`} className="rounded-[16px] border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.24em] text-white transition hover:border-gold hover:text-gold">
            View
          </Link>
          <a
            href={enquiryHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-[16px] border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.24em] text-[#d3c5a9] transition hover:border-gold hover:text-gold"
          >
            Quick WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
