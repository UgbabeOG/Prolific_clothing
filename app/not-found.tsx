import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0907] px-6 py-24 text-[#f7f1e8]">
      <div className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-[#d3b88b]">Page not found</p>
        <h1 className="mt-6 text-5xl font-serif leading-tight text-white">We could not find that page.</h1>
        <p className="mt-6 text-sm leading-8 text-[#b8ac9a]">Return to the showroom and continue exploring Prolific Clothing.</p>
        <Link href="/" className="mt-10 inline-flex rounded-[18px] border border-white/10 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#0f0d0b] transition hover:bg-[#f2ede4]">
          Return Home
        </Link>
      </div>
    </main>
  );
}
