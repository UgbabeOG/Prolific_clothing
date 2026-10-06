# Prolific Clothing

A luxury African menswear e-commerce experience built with Next.js, Tailwind CSS, and WhatsApp-first client engagement.

## Overview

Prolific Clothing is a premium African menswear brand rooted in over 14 years of tailoring experience. The brand delivers bespoke native wear, premium shirts, tailored trousers, and refined essentials for distinguished men in Abuja, Nigeria. This repository powers the customer-facing digital storefront, blending quiet luxury aesthetics with direct WhatsApp ordering and studio booking.

## Key Features

- **Product Showcase** – Curated collections across Bespoke Native Wear, Premium Shirts, Tailored Trousers, Ready-to-Wear, and T-Shirt lines
- **Product Pages** – Detailed product views with size and colour variants, image galleries, and pricing
- **Cart & Checkout** – Full cart workflow with a clean, premium checkout experience
- **WhatsApp Integration** – Direct WhatsApp inquiry and ordering links generated client-side for low-friction conversion
- **Style Library** – A browsable reference gallery with permanent Style IDs, locally saved selections, and WhatsApp enquiries
- **Style Library Admin** – Authenticated category and image publishing backed by Supabase
- **Studio Booking** – Appointment request flow for the private Abuja studio
- **Search** – Real-time product search overlay
- **Responsive Design** – Mobile-first layout with an editorial, editorial-luxury visual language

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Managed content and image storage:** Supabase (Style Library)
- **UI:** React 18, Tailwind CSS 3
- **Language:** TypeScript
- **Icons:** Lucide React
- **Linting:** ESLint (Next.js config)

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the site.

## Available Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start the development server         |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production build           |
| `npm run lint`  | Run ESLint                           |

## Project Structure

```
app/                    # Next.js App Router pages and layouts
├── page.tsx            # Home page
├── layout.tsx          # Root layout with metadata
├── products/[slug]/    # Dynamic product pages
├── cart/               # Shopping cart
├── checkout/           # Checkout flow
├── shop/               # Shop listing
├── styles/             # Style Library gallery and shareable reference pages
├── admin/styles/       # Authenticated Style Library management
├── studio/             # Studio booking page
├── contact/            # Contact page
├── about/              # About page
└── bespoke/            # Bespoke services page

components/             # Reusable UI components
├── layout/             # Header, Footer, AnnouncementBar, MobileMenu
├── products/           # ProductCard, ProductPurchaseForm
├── collections/        # CollectionCard
├── hero/               # Hero section
├── search/             # SearchOverlay
├── ui/                 # Shared UI primitives
└── whatsapp/           # WhatsApp floating button

data/                   # Static data sources
├── collections.ts      # Collection definitions
└── products.ts         # Product catalogue

lib/                    # Utilities and helpers
├── whatsapp.ts         # WhatsApp link and message generation
└── types.ts            # TypeScript interfaces
```

## Style Library setup

The public gallery can render before it is configured, but uploading and publishing styles requires a Supabase project.

1. Create a Supabase project and add its Project URL and publishable key (or legacy anon key) to `.env.local` using the names in `.env.example`. Set the same variables in the production hosting environment.
2. Run `supabase/migrations/20261006110000_style_library.sql` in the Supabase SQL Editor. It creates the category/style tables, access policies, starter categories, and public image bucket.
3. Invite the first administrator with `npm run admin:invite-style -- admin@example.com`. Before running it, put a server-only Supabase Secret key in `SUPABASE_SECRET_KEY` in the ignored `.env.local` file. Never use a `NEXT_PUBLIC_` variable for this secret. The invite script sets `"role": "style_admin"` in App Metadata; do not use user-editable metadata for authorization. Disable public sign-ups after the admin user is created.
4. Open `/admin/styles`, sign in, and upload a JPG, PNG, or WebP image. The browser resizes it to at most 1600 pixels and converts it to WebP before upload. New styles are drafts until published.

Style numbers are allocated by a PostgreSQL sequence and are not reused when a style is removed. Removing a style archives its database record so its Style ID remains reserved. Category deletion is prevented while styles still reference that category; hide a category to remove it from public filters without removing its styles.

Customers can browse `/styles` without an account. Their saved Style IDs live only in that browser's local storage; individual and multiple enquiries open WhatsApp. Bulk image upload is not included in this first version.

For the first administrator, the invite script sends the account invitation and assigns its app role. The recipient sets their own password from the invitation email. The project's Auth email delivery and redirect settings must allow the invitation flow.

### Applying migrations with the Supabase CLI

The Supabase CLI is pinned as a development dependency. Set `SUPABASE_DB_URL` in your ignored `.env.local` file to the Postgres connection string from your Supabase Dashboard's **Connect** panel. Use the direct connection for migrations when reachable, or the session pooler connection for IPv4-only networks. Replace the password placeholder and percent-encode reserved characters in it. Then apply pending migration files with:

```bash
node -e "require('@next/env').loadEnvConfig(process.cwd()); const url = process.env.SUPABASE_DB_URL; if (!url) { console.error('Set SUPABASE_DB_URL in .env.local first.'); process.exit(2); } const { spawnSync } = require('node:child_process'); const result = spawnSync('npx', ['supabase', 'db', 'push', '--db-url', url], { stdio: 'inherit' }); if (result.error) { console.error(result.error.message); process.exit(1); } process.exit(result.status ?? 1)"
```

## Design & Branding

The visual identity is built on a dark, warm palette (`#0b0907` background with `#f7f1e8` typography) accented by muted gold tones. Typography mixes serif headlines with clean sans-serif body text to convey heritage, craftsmanship, and modern luxury.

## Contact

Built for Prolific Clothing. WhatsApp inquiries and studio consultations are handled directly through the site.
