export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  featured?: boolean;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
};

export type WhatsAppTemplate = {
  label: string;
  message: string;
};
