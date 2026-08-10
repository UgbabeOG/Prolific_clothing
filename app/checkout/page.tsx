import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutPage() {
  return (
    <div className="bg-[#0b0907] text-[#f7f1e8]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="grid gap-14 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#100f0d] p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Checkout</p>
            <h1 className="mt-6 text-4xl font-serif text-white">Complete your order with quiet luxury.</h1>
            <div className="mt-12 space-y-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="email">
                    Email
                  </label>
                  <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="email" type="email" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="phone">
                    Phone
                  </label>
                  <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="phone" type="tel" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="address">
                    Delivery Address
                  </label>
                  <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="address" type="text" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="city">
                    City
                  </label>
                  <input className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="city" type="text" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="payment">
                    Payment method
                  </label>
                  <select className="mt-3 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="payment">
                    <option>Card payment</option>
                    <option>Bank transfer</option>
                    <option>Cash on delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-[0.22em] text-[#d3b88b]" htmlFor="notes">
                    Order notes
                  </label>
                  <textarea className="mt-3 h-36 w-full rounded-[16px] border border-white/10 bg-[#0c0a08] px-4 py-4 text-sm text-white outline-none transition focus:border-gold" id="notes" />
                </div>
              </div>
            </div>
          </section>
          <aside className="space-y-8 rounded-[28px] border border-white/10 bg-[#100f0d] p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Order Summary</p>
              <div className="mt-6 space-y-4 text-sm text-[#b8ac9a]">
                <div className="flex items-center justify-between">
                  <span>Prolific Signature Shirt</span>
                  <span>₦145,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Classic Native Set</span>
                  <span>₦145,000</span>
                </div>
                <div className="border-t border-white/10 pt-4 text-base font-semibold text-white">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>₦290,000</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]">
              Place order
            </button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
