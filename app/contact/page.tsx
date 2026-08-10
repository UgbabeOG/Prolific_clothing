import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <div className="bg-[#0b0907] text-[#f7f1e8]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Contact</p>
            <h1 className="mt-6 text-5xl font-serif leading-tight text-white sm:text-6xl">Connect with Prolific Clothing.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#b8ac9a]">
              Reach out for bespoke inquiries, product questions, studio appointments, and order support from our Abuja team.
            </p>
            <div className="mt-12 space-y-4 text-sm text-[#c2b49d]">
              <p>
                <strong className="text-white">WhatsApp:</strong> <a href="https://wa.me/2348000000000" className="text-gold">+234 800 000 0000</a>
              </p>
              <p>
                <strong className="text-white">Email:</strong> <a href="mailto:hello@prolificclothing.ng" className="text-gold">hello@prolificclothing.ng</a>
              </p>
              <p>
                <strong className="text-white">Location:</strong> Abuja, Nigeria
              </p>
              <p>
                <strong className="text-white">Studio Visits:</strong> By appointment only.
              </p>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-[#100f0d] p-10">
            <form className="space-y-6">
              <div>
                <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="name">
                  Name
                </label>
                <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="name" name="name" type="text" />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="email">
                  Email
                </label>
                <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="email" name="email" type="email" />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="phone">
                  Phone
                </label>
                <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="phone" name="phone" type="tel" />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="inquiry">
                  Inquiry Type
                </label>
                <select className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="inquiry" name="inquiry">
                  <option>General Inquiry</option>
                  <option>Bespoke</option>
                  <option>Product</option>
                  <option>Studio Visit</option>
                  <option>Order Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="message">
                  Message
                </label>
                <textarea className="mt-3 h-36 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="message" name="message" />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]">
                Send inquiry
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
