export interface Product {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  type: string | null;
  sold_out: boolean;
  sort_order: number;
  created_at: string;
}

export interface Fabric {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  sold_out: boolean;
  sort_order: number;
  created_at: string;
}

export const PRODUCT_TYPES = ['Nighty', 'Kurtis', 'Traditional', 'Bed Sheet', 'Other'] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export interface SiteSettings {
  id: number;
  tagline: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  section_ready_made_image: string | null;
  section_fabrics_image: string | null;
  section_tailoring_image: string | null;
  about_image: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  email: string | null;
  about: string | null;
  updated_at: string;
}

export const GARMENT_TYPES = [
  'Nighty',
  'Saree',
  'Traditional Dress',
  'Kurti',
  'Gown',
  'Blouse',
  'Salwar Suit',
  'Other',
] as const;

export type GarmentType = (typeof GARMENT_TYPES)[number];

export interface CustomiseFormData {
  name: string;
  phone: string;
  details: string;
}
