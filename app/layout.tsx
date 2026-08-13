import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prolific Clothing — Luxury African Menswear',
  description:
    'Prolific Clothing creates premium African menswear, bespoke native wear, shirts, tailored trousers and refined essentials for distinguished men in Abuja, Nigeria.',
  metadataBase: new URL('https://prolificclothings.com'),
  openGraph: {
    title: 'Prolific Clothing — Luxury African Menswear',
    description:
      'Prolific Clothing creates premium African menswear, bespoke native wear, shirts, tailored trousers and refined essentials for distinguished men in Abuja, Nigeria.',
    type: 'website',
    siteName: 'Prolific Clothing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prolific Clothing — Luxury African Menswear',
    description:
      'Prolific Clothing creates premium African menswear, bespoke native wear, shirts, tailored trousers and refined essentials for distinguished men in Abuja, Nigeria.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#0b0907] text-[#f7f1e8]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
