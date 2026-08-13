import Link from 'next/link';
import Image from 'next/image';
import { createWhatsAppLink, generalInquiryMessage } from '@/lib/whatsapp';

export function Hero() {
  const whatsappHref = createWhatsAppLink(generalInquiryMessage);

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[85vh] min-h-[680px] sm:h-[90vh]">
        <Image src="/assets/hero_showroom.png" alt="Prolific Clothing showroom" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }} />
      </div>
      <div className="absolute inset-x-0 top-1/3 mx-auto flex max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl p-10 backdrop-blur-md sm:p-14" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: '1px' }}>
          <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">PROLIFIC CLOTHING</p>
          <h1 className="mt-6 text-5xl font-serif leading-tight sm:text-6xl" style={{ color: '#ffffff' }}>Luxury African Menswear</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#d8c8af]">
            Bespoke native wear, premium shirts, tailored trousers, and refined essentials crafted for distinguished men.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/shop" className="inline-flex min-w-[220px] items-center justify-center rounded-[18px] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]">
              Shop the Collection
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-w-[220px] items-center justify-center rounded-[18px] bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] transition hover:border-gold hover:text-gold"
              style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.15)', borderWidth: '1px' }}
            >
              Book via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
