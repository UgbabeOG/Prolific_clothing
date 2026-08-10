import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CartPage() {
  return (
    <div className="bg-[#0b0907] text-[#f7f1e8]">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="grid gap-10 xl:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6 rounded-[28px] border border-white/10 bg-[#100f0d] p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Cart</p>
            <h1 className="text-4xl font-serif text-white">Your selected pieces.</h1>
            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div key={item} className="grid gap-4 rounded-[24px] border border-white/10 bg-[#0d0b09] p-6 sm:grid-cols-[0.9fr_0.4fr]">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-[18px] bg-[#14110f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-[#d3b88b]">Tailored Shirt</p>
                      <h2 className="mt-3 text-xl font-serif text-white">Prolific Signature Shirt</h2>
                      <p className="mt-2 text-sm text-[#b8ac9a]">Size M · Black</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-[#b8ac9a]">
                    <div className="flex items-center gap-3">
                      <button className="h-10 w-10 rounded-[14px] border border-white/10">-</button>
                      <span>1</span>
                      <button className="h-10 w-10 rounded-[14px] border border-white/10">+</button>
                    </div>
                    <p className="text-base text-white">₦145,000</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-[#100f0d] p-10">
            <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Summary</p>
            <div className="mt-8 space-y-4 text-sm text-[#b8ac9a]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₦290,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-white/10 pt-4 text-base font-semibold text-white">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>₦290,000</span>
                </div>
              </div>
            </div>
            <button className="mt-10 w-full rounded-[18px] bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]">
              Proceed to checkout
            </button>
            <button className="mt-4 w-full rounded-[18px] border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-gold hover:text-gold">
              Need help? Chat on WhatsApp
            </button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
