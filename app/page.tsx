import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { ProductCard } from '@/components/products/ProductCard';
import { collections } from '@/data/collections';
import { products } from '@/data/products';
import { createWhatsAppLink, generalInquiryMessage } from '@/lib/whatsapp';

export default function HomePage() {
  const whatsappHref = createWhatsAppLink(generalInquiryMessage);

  return (
    <div className="bg-[#0b0907] text-[#f7f1e8]">
      <AnnouncementBar />
      <Header />
      <main className="overflow-hidden">
        <Hero />

        <section className="bg-[#f7f1e8] text-[#0c0a08]">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#a78c6f]">THE PROLIFIC STANDARD</p>
                <h2 className="mt-6 text-5xl font-serif leading-tight tracking-[-0.03em] sm:text-6xl">Crafted for Distinguished Men.</h2>
              </div>
              <div className="space-y-6 border-l border-black/10 pl-0 lg:pl-16">
                <p className="text-lg leading-9 text-[#50473b]">
                  Prolific Clothing is a premium African menswear brand built on over 14 years of tailoring experience. We create bespoke native wear, premium shirts, tailored trousers, and refined essentials for men who value quality, confidence, and presence.
                </p>
                <p className="text-sm uppercase tracking-[0.28em] text-[#a78c6f]">We are building a fashion house rooted in craftsmanship, precision, and excellent client experience.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <SectionHeading
            eyebrow="The Collections"
            title="A refined wardrobe of elevated essentials."
            description="Explore the collection blocks that capture the quiet luxury of modern African menswear." 
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="grid gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Selected Pieces</p>
                <h2 className="mt-4 text-4xl font-serif leading-tight text-white sm:text-5xl">A considered wardrobe for the modern African gentleman.</h2>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-[18px] border border-white/10 bg-[#11100d] px-7 py-3 text-sm uppercase tracking-[0.24em] text-white transition hover:border-gold hover:text-gold"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2">
              {products.filter((product) => product.featured).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#100f0d] px-6 py-24 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Every Detail Matters</p>
              <h2 className="text-5xl font-serif leading-tight text-white sm:text-6xl">Precision lives in the details.</h2>
              <p className="max-w-2xl text-lg leading-9 text-[#aaa08a]">
                From cut and construction to the finishing touches, every piece is shaped by meticulous craftsmanship, premium fabrics, and a quiet luxury sensibility.
              </p>
            </div>
            <div className="relative h-[520px] overflow-hidden rounded-[30px] border border-white/10 bg-[#14110f]">
              <img src="/assets/tag_photo.png" alt="Detail craftsmanship imagery" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="grid gap-16 xl:grid-cols-[1fr_0.86fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Designed for Presence</p>
              <h2 className="text-5xl font-serif leading-tight text-white sm:text-6xl">A fashion editorial for the modern wardrobe.</h2>
              <p className="max-w-2xl text-lg leading-9 text-[#b8ac9a]">
                Our lookbook celebrates the bold restraint of premium menswear—striking imagery, layered textures, and composition built for quiet impact.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative h-96 overflow-hidden rounded-[26px] border border-white/10 bg-[#11100d]">
                <img src="/assets/product_lookbook_board.png" alt="Lookbook board imagery" className="h-full w-full object-cover" />
              </div>
              <div className="relative h-96 overflow-hidden rounded-[26px] border border-white/10 bg-[#11100d]">
                <img src="/assets/tshirt_lookbook.png" alt="T-shirt lookbook imagery" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0a08] px-6 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl rounded-[30px] border border-white/10 bg-[#15120f] px-8 py-16 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Studio Experience</p>
                <h2 className="mt-6 text-5xl font-serif leading-tight text-white sm:text-6xl">Private studio visits by appointment.</h2>
                <p className="mt-6 max-w-2xl text-lg leading-9 text-[#b8ac9a]">
                  Prolific Clothing operates from a private Abuja studio where clients can book consultations, take measurements, discuss style, and experience a refined menswear service.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                <a
                  href="/studio"
                  className="inline-flex min-w-[200px] items-center justify-center rounded-[18px] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]"
                >
                  Book a studio visit
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[200px] items-center justify-center rounded-[18px] border border-white/15 bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
