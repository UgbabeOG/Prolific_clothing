import type { Metadata } from 'next';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { StyleAdmin } from '@/components/styles/StyleAdmin';

export const metadata: Metadata = {
  title: 'Style Library Admin — Prolific Clothing',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function StyleAdminPage() {
  const configured = Boolean(getSupabaseConfig());

  return (
    <main className="min-h-screen bg-[var(--bg)] px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Prolific Clothing · Admin</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Style Library</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8ac9a]">
          Manage your reference categories and publish styles. Every upload receives a permanent Style ID.
        </p>
        <div className="mt-9">
          {configured ? (
            <StyleAdmin />
          ) : (
            <div className="rounded-2xl border border-[#d3b88b]/30 bg-[#100f0d] p-6 text-sm leading-7 text-[#d3c7b0]">
              Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the server environment, then restart the site.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
