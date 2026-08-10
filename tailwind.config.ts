import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        body: '#0e0c0a',
        surface: '#16130f',
        surfaceSoft: '#1f1b17',
        cream: '#f7f1e8',
        gold: '#c7a16d',
        goldSoft: '#e5d3b2',
        muted: '#b5a18e',
      },
      boxShadow: {
        premium: '0 18px 70px rgba(0,0,0,0.24)',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        roomy: '0.16em',
      },
      borderRadius: {
        soft: '18px',
      },
    },
  },
  plugins: [],
};

export default config;
