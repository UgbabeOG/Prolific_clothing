import Link from 'next/link';

const footerNav = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?collection=all' },
  { label: 'Bespoke', href: '/bespoke' },
  { label: 'About', href: '/about' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0907] px-6 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d3b88b]">Prolific Clothing</p>
          <h2 className="max-w-sm text-3xl font-serif leading-tight text-white sm:text-4xl">Crafted for Distinguished Men.</h2>
          <p className="max-w-sm text-sm leading-7 text-[#b8a88d]">
            Luxury African menswear designed with precision, quiet confidence, and refined craftsmanship from Abuja.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#b8a88d]">Navigation</p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-[#dcd0c2]">
            {footerNav.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-gold">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#b8a88d]">Customer</p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-[#dcd0c2]">
            <Link href="#" className="transition hover:text-gold">Shipping</Link>
            <Link href="#" className="transition hover:text-gold">Returns</Link>
            <Link href="#" className="transition hover:text-gold">Size Guide</Link>
            <Link href="#" className="transition hover:text-gold">FAQs</Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#b8a88d]">Connect</p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-[#dcd0c2]">
            <Link href="https://wa.me/2348000000000" className="transition hover:text-gold">WhatsApp</Link>
            <Link href="https://www.instagram.com/" className="transition hover:text-gold">Instagram</Link>
            <Link href="mailto:hello@prolificclothing.ng" className="transition hover:text-gold">Email</Link>
            <span>Abuja, Nigeria</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-8 text-sm text-[#a99d84]">
        © Prolific Clothing · prolificclothings.com
      </div>
    </footer>
  );
}
