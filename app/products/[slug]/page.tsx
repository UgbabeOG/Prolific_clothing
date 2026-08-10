import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { createWhatsAppLink, productInquiryMessage } from '@/lib/whatsapp';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductPurchaseForm } from '@/components/products/ProductPurchaseForm';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) {
    return { title: 'Product not found' };
  }
  return {
    title: `${product.name} — Prolific Clothing`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) {
    notFound();
  }

  const whatsappHref = createWhatsAppLink(productInquiryMessage(product.name));

  return (
    <div className="bg-[#0b0907] text-[#f7f1e8]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {product.images.slice(0, 2).map((src) => (
                <div key={src} className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#100f0d]">
                  <Image src={src} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-8 rounded-[32px] border border-white/10 bg-[#100f0d] p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">{product.category}</p>
            <h1 className="text-5xl font-serif leading-tight text-white">{product.name}</h1>
            <p className="text-lg leading-8 text-[#b8ac9a]">{product.description}</p>
            <div className="flex items-center gap-4 text-2xl font-semibold text-white">₦{product.price.toLocaleString()}</div>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Size</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button key={size} type="button" className="rounded-[14px] border border-white/10 bg-[#0f0d0b] px-4 py-3 text-sm uppercase tracking-[0.24em] text-[#f7f1e8] transition hover:border-gold">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d3b88b]">Color</p>
                <div className="mt-4 flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button key={color.name} type="button" className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-[#0f0d0b] px-4 py-3 text-sm text-[#f7f1e8] transition hover:border-gold">
                      <span className="h-4 w-4 rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ProductPurchaseForm product={product} whatsappHref={whatsappHref} />

            <div className="space-y-6 rounded-[26px] border border-white/10 bg-[#0d0b09] p-6 text-sm text-[#b8ac9a]">
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

        <section className="mt-20 space-y-8 rounded-[32px] border border-white/10 bg-[#100f0d] p-10">
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
            {products.slice(0, 4).map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="rounded-[24px] border border-white/10 bg-[#0d0b09] p-5 transition hover:border-gold">
                <div className="relative h-56 overflow-hidden rounded-[20px] bg-[#11100d]">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                </div>
                <div className="mt-5 space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b8ac9a]">{item.category}</p>
                  <h3 className="text-xl font-serif leading-tight text-white">{item.name}</h3>
                  <p className="text-sm text-[#aea28c]">₦{item.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
