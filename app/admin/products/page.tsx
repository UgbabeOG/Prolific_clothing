import type { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseConfig } from '@/lib/supabase/config';
import {
  loadAdminProducts,
  deleteProduct,
  type ProductRecord,
} from '@/app/admin/products/actions';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowRight, Trash2 } from 'lucide-react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Products — Prolific Clothing Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const configured = Boolean(getSupabaseConfig());
  const products: ProductRecord[] = await loadAdminProducts();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 text-[var(--text)] sm:px-8 sm:py-16">
        <div className="mb-9">
          <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Prolific Clothing · Admin</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Products</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b8ac9a]">
            Manage your shop products. Upload images and videos, set prices, sizes, and colors.
          </p>
        </div>

        {!configured && (
          <div className="rounded-2xl border border-[#d3b88b]/30 bg-[#100f0d] p-6 text-sm leading-7 text-[#d3c7b0]">
            Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to the server environment, then restart the site.
          </div>
        )}

        <div className="mt-9 flex flex-wrap items-end justify-between gap-4">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d3b88b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b0907] hover:bg-[#e5d3b2]"
          >
            <ArrowRight size={15} /> Add product
          </Link>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#100f0d] overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pl-6">Product</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pl-4">Category</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84]">Price</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pl-4">Status</th>
                  <th className="pb-4 text-xs uppercase tracking-[0.2em] text-[#a99d84] pr-6">Media</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-[#a99d84]">
                      No products yet. Add your first product.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="py-4 pl-6">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-serif text-lg text-white hover:text-[#d3b88b]"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-[#a99d84]">{product.slug}</p>
                      </td>
                      <td className="py-4 pl-4 text-sm text-[#f7f1e8]">{product.category}</td>
                      <td className="py-4 pl-4 text-sm text-[#f7f1e8]">₦{product.price.toLocaleString()}</td>
                      <td className="py-4 pl-4">
                        <span className={`px-3 py-1 rounded-full border text-xs uppercase tracking-[0.14em] border-white/10 ${product.isPublished ? 'text-[#d3b88b]' : 'text-[#a99d84]'}`}>
                          {product.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {product.isFeatured && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#d3b88b]/30 bg-[#d3b88b]/10 text-[10px] uppercase tracking-[0.12em] text-[#d3b88b]">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-sm text-[#f7f1e8]">
                        {product.media.length} {product.media.length === 1 ? 'file' : 'files'}
                        {product.media.filter((m) => m.mediaType === 'video').length > 0 && (
                          <span className="ml-1 text-[#d3b88b]">🎬</span>
                        )}
                      </td>
                      <td className="py-4 pr-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${product.name}? This cannot be undone.`)) {
                              // Handled by form action in a real implementation
                            }
                          }}
                          className="text-xs uppercase tracking-[0.16em] text-[#a99d84] hover:text-red-300"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {products.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#a99d84]">Total products</p>
              <p className="mt-1 text-lg font-serif text-white">{products.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#a99d84]">Published</p>
              <p className="mt-1 text-lg font-serif text-white">{products.filter((p) => p.isPublished).length}</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
