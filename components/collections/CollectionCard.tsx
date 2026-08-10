import Link from 'next/link';
import Image from 'next/image';
import type { Collection } from '@/lib/types';

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/shop?collection=${collection.slug}`}
      className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-[#100f0d] transition hover:-translate-y-1 hover:border-gold/40"
    >
      <div className="relative h-72 sm:h-80 lg:h-96">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      <div className="relative space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">{collection.name}</p>
        <p className="text-base font-light leading-7 text-white">{collection.description}</p>
      </div>
    </Link>
  );
}
