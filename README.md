# Prolific Clothing

A luxury African menswear e-commerce experience built with Next.js, Tailwind CSS, and WhatsApp-first client engagement.

## Overview

Prolific Clothing is a premium African menswear brand rooted in over 14 years of tailoring experience. The brand delivers bespoke native wear, premium shirts, tailored trousers, and refined essentials for distinguished men in Abuja, Nigeria. This repository powers the customer-facing digital storefront, blending quiet luxury aesthetics with direct WhatsApp ordering and studio booking.

## Key Features

- **Product Showcase** – Curated collections across Bespoke Native Wear, Premium Shirts, Tailored Trousers, Ready-to-Wear, and T-Shirt lines
- **Product Pages** – Detailed product views with size and colour variants, image galleries, and pricing
- **Cart & Checkout** – Full cart workflow with a clean, premium checkout experience
- **WhatsApp Integration** – Direct WhatsApp inquiry and ordering links generated client-side for low-friction conversion
- **Studio Booking** – Appointment request flow for the private Abuja studio
- **Search** – Real-time product search overlay
- **Responsive Design** – Mobile-first layout with an editorial, editorial-luxury visual language

## Tech Stack

- **Framework:** Next.js 15 (App Router)
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

## Design & Branding

The visual identity is built on a dark, warm palette (`#0b0907` background with `#f7f1e8` typography) accented by muted gold tones. Typography mixes serif headlines with clean sans-serif body text to convey heritage, craftsmanship, and modern luxury.

## Contact

Built for Prolific Clothing. WhatsApp inquiries and studio consultations are handled directly through the site.
