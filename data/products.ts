import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: 'signature-shirt',
    slug: 'prolific-signature-shirt',
    name: 'Prolific Signature Shirt',
    category: 'Shirts',
    price: 145000,
    description:
      'A refined statement shirt with a tailored silhouette, timeless details, and a polished finish for distinguished dressing.',
    shortDescription: 'An elevated essential for refined wardrobes.',
    images: ['/assets/Embriodry shirt.png', '/assets/Website Image.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#1b1b1b' },
      { name: 'Ecru', hex: '#ede1d0' },
    ],
    featured: true,
  },
  {
    id: 'classic-native-set',
    slug: 'classic-native-set',
    name: 'Classic Native Set',
    category: 'Native Wear',
    price: 285000,
    description:
      'A carefully tailored native ensemble with crisp lines, premium fabric, and a poised silhouette for a modern African wardrobe.',
    shortDescription: 'A thoughtful native wear set with contemporary tailoring.',
    images: ['/assets/Website image2.png', '/assets/tag_photo.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#e8dfd1' },
      { name: 'Midnight', hex: '#131010' },
    ],
    featured: true,
  },
  {
    id: 'tailored-black-trouser',
    slug: 'tailored-black-trouser',
    name: 'Tailored Black Trouser',
    category: 'Trousers',
    price: 98000,
    description:
      'A minimalist trouser with precision tailoring, a clean finish, and an elevated feel for polished ensembles.',
    shortDescription: 'A sharp, everyday tailored trouser.',
    images: ['/assets/white_tee.png', '/assets/Website Image.png'],
    sizes: ['30', '32', '34', '36'],
    colors: [{ name: 'Black', hex: '#121212' }],
  },
  {
    id: 'essential-tshirt',
    slug: 'essential-t-shirt',
    name: 'Essential T-Shirt',
    category: 'T-Shirts',
    price: 42000,
    description:
      'A luxury everyday T-shirt with clean lines, refined fabric, and a comfortable fit for understated style.',
    shortDescription: 'A premium essential T-shirt in a subtle palette.',
    images: ['/assets/white_tee.png', '/assets/tshirt_lookbook.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#f5f1ea' },
      { name: 'Black', hex: '#0f0d0b' },
    ],
  },
  {
    id: 'heritage-native-set',
    slug: 'heritage-native-set',
    name: 'Heritage Native Set',
    category: 'Native Wear',
    price: 315000,
    description:
      'An elegant heritage-inspired set with rich detailing and a flawless cut for distinguished occasions.',
    shortDescription: 'A heritage native set with modern refinement.',
    images: ['/assets/tag_photo.png', '/assets/Website Image.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand', hex: '#d8c9b8' },
      { name: 'Charcoal', hex: '#26221f' },
    ],
  },
  {
    id: 'relaxed-shirt',
    slug: 'prolific-relaxed-shirt',
    name: 'Prolific Relaxed Shirt',
    category: 'Shirts',
    price: 132000,
    description:
      'A relaxed shirt with an elevated feel, crafted to move comfortably while maintaining a strong editorial presence.',
    shortDescription: 'A relaxed luxury shirt for refined ease.',
    images: ['/assets/Website Image.png', '/assets/white_tee.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream', hex: '#f6ede2' },
      { name: 'Ink', hex: '#1e1b19' },
    ],
  },
  {
    id: 'signature-cream-shirt',
    slug: 'signature-cream-shirt',
    name: 'Signature Cream Shirt',
    category: 'Shirts',
    price: 148500,
    description:
      'A soft cream shirt with a luxuriously tailored fit and understated refinement for elegant dressing.',
    shortDescription: 'A luxury cream shirt with editorial polish.',
    images: ['/assets/white_tee.png', '/assets/embriodry shirt.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Cream', hex: '#f3eadc' }],
  },
  {
    id: 'executive-native-set',
    slug: 'executive-native-set',
    name: 'Executive Native Set',
    category: 'Native Wear',
    price: 342000,
    description:
      'A commanding native set designed for presence, with structured tailoring and premium finishes.',
    shortDescription: 'A premium native set for executive dressing.',
    images: ['/assets/hero_showroom.png', '/assets/tag_photo.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Midnight', hex: '#14100d' }],
  },
];
