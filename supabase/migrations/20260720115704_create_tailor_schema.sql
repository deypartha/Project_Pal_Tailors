/*
# Tailor Shop Schema — Products, Fabrics, Site Settings & Media Storage

## Overview
Creates the complete data layer for a clothing tailor website with a customer-facing
storefront and an admin-managed catalog. Admin authentication is handled at the
frontend (simple password gate) per the user's request to keep backend minimal, so
all tables use anon+authenticated policies. Admin changes are reflected across all
devices in real-time via Supabase realtime subscriptions.

## New Tables

### products
Ready-made garments the customer can buy or request to customise.
- id (uuid, primary key)
- name (text, not null) — product title
- description (text) — product details
- price (numeric) — optional price in INR
- image_url (text) — product photo URL
- category (text) — product category/type
- sold_out (boolean, default false) — when true, shown grayed out
- sort_order (int, default 0) — display ordering
- created_at (timestamptz)

### fabrics
Fabric options the customer can pick and customise into a garment (nighty, saree, etc.).
- id (uuid, primary key)
- name (text, not null) — fabric name
- description (text) — fabric details
- price (numeric) — optional price in INR
- image_url (text) — fabric photo URL
- sold_out (boolean, default false) — when true, shown grayed out
- sort_order (int, default 0) — display ordering
- created_at (timestamptz)

### site_settings
A single row (id = 1) holding homepage content the admin can edit.
- id (int, primary key, always 1)
- tagline (text) — short brand tagline shown in header
- hero_title (text) — main hero heading
- hero_subtitle (text) — hero subheading
- hero_image_url (text) — homepage hero photo
- phone (text) — contact phone number
- whatsapp_number (text) — WhatsApp number for chat & orders
- address (text) — shop address
- email (text) — contact email
- about (text) — about text
- updated_at (timestamptz)

## Storage
- Creates a public bucket `media` for product/fabric/hero image uploads.
- Policies allow anon+authenticated to read, upload, update, and delete objects in `media`.

## Security
- RLS enabled on products, fabrics, site_settings.
- All policies scoped to anon, authenticated (single-tenant, no sign-in screen).
- Storage objects in `media` bucket are publicly readable and anon-writable.

## Notes
1. A default site_settings row (id = 1) is seeded with placeholder content.
2. All changes made by the admin are instantly visible to all customer devices through
   Supabase realtime subscriptions on products, fabrics, and site_settings.
*/

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric,
  image_url text DEFAULT '',
  category text DEFAULT 'Ready Made',
  sold_out boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- fabrics ----------
CREATE TABLE IF NOT EXISTS fabrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric,
  image_url text DEFAULT '',
  sold_out boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_fabrics" ON fabrics;
CREATE POLICY "anon_select_fabrics" ON fabrics FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_fabrics" ON fabrics;
CREATE POLICY "anon_insert_fabrics" ON fabrics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_fabrics" ON fabrics;
CREATE POLICY "anon_update_fabrics" ON fabrics FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_fabrics" ON fabrics;
CREATE POLICY "anon_delete_fabrics" ON fabrics FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- site_settings ----------
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  tagline text DEFAULT '',
  hero_title text DEFAULT '',
  hero_subtitle text DEFAULT '',
  hero_image_url text DEFAULT '',
  phone text DEFAULT '',
  whatsapp_number text DEFAULT '',
  address text DEFAULT '',
  email text DEFAULT '',
  about text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_site_settings" ON site_settings;
CREATE POLICY "anon_insert_site_settings" ON site_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
CREATE POLICY "anon_update_site_settings" ON site_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default settings row
INSERT INTO site_settings (id, tagline, hero_title, hero_subtitle, hero_image_url, phone, whatsapp_number, address, email, about)
VALUES (
  1,
  'Stitched to perfection, made just for you',
  'Threads of Tradition, Tailored for You',
  'Custom tailoring and ready-made elegance — crafted with care, delivered with love.',
  '',
  '81169 57329',
  '918116957329',
  'Visit our boutique for personalised tailoring',
  'hello@tailorshop.com',
  'A family-run tailoring house bringing you bespoke garments, fine fabrics, and timeless craftsmanship for every occasion.'
) ON CONFLICT (id) DO NOTHING;

-- ---------- storage bucket ----------
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_anon_insert" ON storage.objects;
CREATE POLICY "media_anon_insert" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_anon_update" ON storage.objects;
CREATE POLICY "media_anon_update" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_anon_delete" ON storage.objects;
CREATE POLICY "media_anon_delete" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'media');

-- Enable realtime for all three tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE fabrics;
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
