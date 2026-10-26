import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicProduct } from '@/lib/products.server';
import { createWhatsAppLink, productInquiryMessage } from '@/lib/whatsapp';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductPurchaseForm } from '@/components/products/ProductPurchaseForm';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Static params are not used since products are fetched from Supabase at build/runtime.
  // Return empty array to avoid build-time data fetching; individual slugs resolved via generateMetadata + page.
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let product;
  try {
    product = await getPublicProduct(slug);
  } catch {
    product = null;
  }
  if (!product) {
    return { title: 'Product not found' };
  }
  return {
    title: `${product.name} — Prolific Clothing`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) {
    notFound();
  }

  const whatsappHref = createWhatsAppLink(productInquiryMessage(product.name));

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {product.images.slice(0, 2).map((src, i) => (
                <div key={i} className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#100f0d]">
                  <Image src={src} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
            {product.videos.length > 0 && (
              <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#100f0d]">
                <video
                  src={product.videos[0]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <aside className="space-y-8 rounded-[32px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">{product.category}</p>
            <h1 className="text-5xl font-serif leading-tight text-white">{product.name}</h1>
            <p className="text-lg leading-8 text-[#b8ac9a]">{product.description}</p>
            <div className="flex items-center gap-4 text-2xl font-semibold text-white">₦{product.price.toLocaleString()}</div>

            <ProductPurchaseForm product={product} whatsappHref={whatsappHref} />

            <div className="space-y-6 rounded-[26px] border border-white/10 bg-[#0d0b09] p-6 text-sm text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Product Details</p>
                <p className="mt-4 leading-7">{product.shortDescription}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Fit</p>
                <p className="mt-4 leading-7">Contemporary tailored fit, designed for an effortless yet precise look.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Care</p>
                <p className="mt-4 leading-7">Dry clean or hand wash in cold water. Press on low with a cloth if needed.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Delivery</p>
                <p className="mt-4 leading-7">Deliveries are handled with care from Abuja. Estimated shipping time varies depending on location.</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-20 space-y-8 rounded-[32px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Related</p>
              <h2 className="mt-4 text-3xl font-serif leading-tight text-white">You may also appreciate.</h2>
            </div>
            <Link href="/shop" className="text-sm uppercase tracking-[0.22em] text-[#d3b88b] transition hover:text-gold">
              View all products
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {/* Related products will be populated from Supabase in a future update; placeholder shows empty state */}
            <div className="col-span-full rounded-[28px] border border-white/10 bg-[#100f0d] p-12 text-center text-[#b8ac9a]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <p className="text-lg text-white">Browse all products in the shop.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
