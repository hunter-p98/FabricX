// types/printify.ts

export type PrintifyOptionType = {
  name: string;       // e.g. "Color", "Size"
  type: string;       // e.g. "color", "size"
  values: string[];   // e.g. ["Black", "White"]
};

export type PrintifyVariant = {
  id: number;
  sku: string | null;
  title: string;       // e.g. "Black / M"
  price: number;       // usually in cents
  is_available: boolean;
  is_default: boolean;
  options: number[];   // indexes into option values
  grams?: number;
};

export type PrintifyImage = {
  src: string;         // mockup URL
  position?: string;   // e.g. "front", "back"
  is_default?: boolean;
};

export type Product = {
  id: string;                     // Printify product id
  title: string;
  description: string;
  tags: string[];
  options: PrintifyOptionType[];
  variants: PrintifyVariant[];
  images: PrintifyImage[];
  createdAt?: string;
  updatedAt?: string;
};
