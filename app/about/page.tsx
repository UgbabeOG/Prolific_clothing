import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <section className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">About</p>
            <h1 className="mt-6 text-5xl font-serif leading-tight text-white sm:text-6xl">A modern African fashion house rooted in tailoring heritage.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#b8ac9a]">
              Prolific Clothing is a luxury menswear brand with over 14 years of tailoring experience. Our story is shaped by craftsmanship, precision, and a quiet confidence that elevates every collection.
            </p>
          </div>
          <div className="space-y-6 rounded-[28px] border border-white/10 bg-[#100f0d] p-10" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="text-sm leading-8 text-[#c3b49c]">
              We craft modern African menswear with deliberate attention to proportion, texture, and finish. Each garment is designed to feel premium, understated, and purposeful.
            </p>
            <p className="text-sm leading-8 text-[#c3b49c]">
              The brand is built for men who appreciate timeless style, meticulous tailoring, and a refined wardrobe that speaks to presence and professionalism.
            </p>
          </div>
        </section>

        <section className="mt-20 grid gap-12 lg:grid-cols-3">
          {[
            {
              title: 'Craftsmanship',
              text: 'Precision at every stage, from pattern making to the final stitch.',
            },
            {
              title: 'Tailoring',
              text: 'A measured approach to fit, silhouette, and materiality.',
            },
            {
              title: 'Identity',
              text: 'A modern take on African menswear rooted in luxury.'
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] border border-white/10 bg-[#100f0d] p-8 text-sm text-[#c2b49d]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <h2 className="text-2xl font-serif text-white">{item.title}</h2>
              <p className="mt-4 leading-8">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
