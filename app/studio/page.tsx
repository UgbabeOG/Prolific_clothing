import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton';
import { createWhatsAppLink, generalInquiryMessage } from '@/lib/whatsapp';

export default function StudioPage() {
  const whatsappHref = createWhatsAppLink(generalInquiryMessage);

  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <section className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Private Studio Visits</p>
            <h1 className="mt-6 text-5xl font-serif leading-tight text-white sm:text-6xl">Abuja, Nigeria</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#b8ac9a]">
              Prolific Clothing operates from a private studio where clients can book consultations, take measurements, discuss styling, and experience a refined menswear service.
            </p>
          </div>
          <div className="space-y-4">
            <a href="/contact" className="inline-flex w-full items-center justify-center rounded-[18px] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]">
              Book a studio visit
            </a>
            <WhatsAppButton href={whatsappHref} label="Chat on WhatsApp" />
          </div>
        </section>

        <section className="mt-20 grid gap-10 sm:grid-cols-2">
          {[
            {
              title: 'Consultation',
              text: 'Personal styling and intent-led discussion to shape your bespoke vision.',
            },
            {
              title: 'Measurements',
              text: 'Precise fittings and tailored guidance to ensure an exceptional fit.',
            },
            {
              title: 'Style Direction',
              text: 'A curated approach to wardrobe planning and refined signature looks.',
            },
            {
              title: 'Private Appointments',
              text: 'A comfortable, discreet studio environment built for discerning clients.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] border border-white/10 bg-[#100f0d] p-8 text-sm text-[#c2b49d]" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <h2 className="text-2xl font-serif text-white">{item.title}</h2>
              <p className="mt-3 leading-8">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
