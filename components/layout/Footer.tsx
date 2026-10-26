'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

const footerNav = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Bespoke', href: '/bespoke' },
  { label: 'Style Library', href: '/styles' },
  { label: 'About', href: '/about' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    const checkAdmin = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (active && user?.app_metadata?.role === 'style_admin') {
          setIsAdmin(true);
        }
      } catch {
        // Supabase not configured or auth error
      } finally {
        if (active) setChecked(true);
      }
    };
    void checkAdmin();
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="border-t border-white/10 bg-[#0b0907] px-6 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/assets/OB_monogram_white.svg" alt="Prolific Clothing" width={32} height={32} className="h-8 w-8" />
            <p className="text-sm uppercase tracking-[0.28em] text-[#d3b88b]">Prolific Clothing</p>
          </div>
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
            <Link href="#" className="transition hover:text-gold">Size Guide</Link>
            <Link href="#" className="transition hover:text-gold">FAQs</Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#b8a88d]">Connect</p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-[#dcd0c2]">
            <Link href="https://wa.me/2348000000000" className="transition hover:text-gold">WhatsApp</Link>
            <Link href="https://www.instagram.com/" className="transition hover:text-gold">Instagram</Link>
            <Link href="mailto:Info@prolificclothings.com" className="transition hover:text-gold">Email</Link>
            <span>Abuja, Nigeria</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-8 text-sm text-[#a99d84]">
        © Prolific Clothing · prolificclothings.com
        {!isAdmin && checked && (
          <a
            href="/admin/styles"
            className="ml-4 inline-flex items-center gap-1 text-[10px] hover:text-gold transition"
            title="Admin login"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50 hover:opacity-100">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM15 6.732a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </a>
        )}
      </div>
    </footer>
  );
}
