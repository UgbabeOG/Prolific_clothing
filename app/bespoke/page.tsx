import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton';
import { createWhatsAppLink, generalInquiryMessage } from '@/lib/whatsapp';

export default function BespokePage() {
  const whatsappHref = createWhatsAppLink(generalInquiryMessage);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <section className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Made Around You</p>
            <h1 className="mt-6 text-5xl font-serif leading-tight text-white sm:text-6xl">From consultation to final fitting, every Prolific bespoke piece is shaped around the individual.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#b8ac9a]">
              From consultation to final fitting, every Prolific bespoke piece is shaped around the individual.
            </p>
          </div>
          <div className="space-y-4">
            <WhatsAppButton href={whatsappHref} label="Chat on WhatsApp" />
            <a href="/contact" className="inline-flex w-full items-center justify-center rounded-[18px] border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold">
              Book a bespoke consultation
            </a>
          </div>
        </section>

        <section className="mt-20 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Consultation',
              description: 'Discuss your style, occasion, fabric and vision.',
            },
            {
              title: 'Measurement',
              description: 'Precise measurements and fitting guidance.',
            },
            {
              title: 'Craft',
              description: 'Your piece is carefully constructed and refined.',
            },
          ].map((step, index) => (
            <div key={step.title} className="rounded-[24px] border border-white/10 bg-[#100f0d] p-8 text-sm text-[#c2b49d]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d3b88b]">0{index + 1}</p>
              <h2 className="mt-5 text-2xl font-serif text-white">{step.title}</h2>
              <p className="mt-4 leading-8">{step.description}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
