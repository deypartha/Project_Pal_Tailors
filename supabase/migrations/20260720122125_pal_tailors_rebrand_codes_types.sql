/*
# Pal Tailors rebrand + product codes + type taxonomy

## Overview
Renames the brand from "Aadya Tailors" to "Pal Tailors" (a Bengali-based tailor shop),
introduces human-readable sequential codes for products (PT-0001) and fabrics (FB-0001),
and standardises the product type taxonomy so the customer-side product page can show
filter tabs (All / Nighty / Kurtis / Traditional / Bed Sheet) driven entirely by the
"type" the admin picks when uploading. Also adds an admin search capability on the code.

## Changed Tables

### products
- Adds column `code` (text, unique) — sequential human-readable ID like "PT-0001".
- Adds column `type` (text) — normalised product type (Nighty, Kurtis, Traditional,
  Bed Sheet, Other). The old `category` column is kept untouched (existing data
  preserved); the new `type` column drives the customer-side filter tabs and the
  admin type dropdown.
- A trigger auto-fills `code` as 'PT-' || zero-padded next sequence number on INSERT
  when the client does not supply one. Back-fills codes for any existing rows.

### fabrics
- Adds column `code` (text, unique) — sequential human-readable ID like "FB-0001".
- A trigger auto-fills `code` as 'FB-' || zero-padded next sequence number on INSERT.
  Back-fills codes for existing rows.

### site_settings
- Updates the seeded row: brand name/tagline/hero copy now reflect "Pal Tailors",
  a Bengali atelier feel.

## Sequences & Triggers
- `products_code_seq` and `fabrics_code_seq` — monotonic counters backing the codes.
- `products_set_code` / `fabrics_set_code` BEFORE INSERT triggers — generate the code
  from the sequence (zero-padded to 4 digits) only when the row's code is null.

## Security
- No RLS policy changes. New columns inherit existing anon+authenticated CRUD policies.

## Notes
1. Codes are immutable after insert — a product keeps PT-0001 for life.
2. The `type` column is free-text but the admin UI restricts it to a fixed list; "Other"
   exists as a catch-all so existing rows without a type still render under "All".
3. Back-fill uses a CTE so window functions are not used inside UPDATE directly.
*/

-- ---------- products: code + type ----------
ALTER TABLE products ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS type text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_code_key') THEN
    ALTER TABLE products ADD CONSTRAINT products_code_key UNIQUE (code);
  END IF;
END $$;

CREATE SEQUENCE IF NOT EXISTS products_code_seq START 1;

CREATE OR REPLACE FUNCTION set_products_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'PT-' || lpad(nextval('products_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_set_code ON products;
CREATE TRIGGER products_set_code
BEFORE INSERT ON products
FOR EACH ROW EXECUTE FUNCTION set_products_code();

-- back-fill existing product codes (CTE so row_number is allowed)
WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn FROM products
)
UPDATE products p
SET code = 'PT-' || lpad(r.rn::text, 4, '0')
FROM ranked r
WHERE p.id = r.id AND (p.code IS NULL OR p.code = '');

-- normalise existing category values into the new type column
UPDATE products SET type = 'Nighty'      WHERE type IS NULL AND lower(coalesce(category,'')) LIKE '%nighty%';
UPDATE products SET type = 'Kurtis'      WHERE type IS NULL AND lower(coalesce(category,'')) LIKE '%kurti%';
UPDATE products SET type = 'Traditional' WHERE type IS NULL AND (lower(coalesce(category,'')) LIKE '%traditional%' OR lower(coalesce(category,'')) LIKE '%saree%' OR lower(coalesce(category,'')) LIKE '%gown%' OR lower(coalesce(category,'')) LIKE '%blouse%' OR lower(coalesce(category,'')) LIKE '%salwar%');
UPDATE products SET type = 'Bed Sheet'   WHERE type IS NULL AND lower(coalesce(category,'')) LIKE '%bed%';
UPDATE products SET type = 'Other'       WHERE type IS NULL;

-- ---------- fabrics: code ----------
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS code text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fabrics_code_key') THEN
    ALTER TABLE fabrics ADD CONSTRAINT fabrics_code_key UNIQUE (code);
  END IF;
END $$;

CREATE SEQUENCE IF NOT EXISTS fabrics_code_seq START 1;

CREATE OR REPLACE FUNCTION set_fabrics_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'FB-' || lpad(nextval('fabrics_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fabrics_set_code ON fabrics;
CREATE TRIGGER fabrics_set_code
BEFORE INSERT ON fabrics
FOR EACH ROW EXECUTE FUNCTION set_fabrics_code();

-- back-fill existing fabric codes
WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn FROM fabrics
)
UPDATE fabrics f
SET code = 'FB-' || lpad(r.rn::text, 4, '0')
FROM ranked r
WHERE f.id = r.id AND (f.code IS NULL OR f.code = '');

-- ---------- rebrand site_settings ----------
UPDATE site_settings SET
  tagline = 'বাংলার ঘ্রাণে সেলাইয়ের আঁচল',
  hero_title = 'পাল টেইলার্স — বাংলার ঐতিহ্য, আপনার পোশাক',
  hero_subtitle = 'রেডিমেড থেকে বাংলা ট্রাডিশনাল, নাইটি, শাড়ি, কুর্তি — আপনার পছন্দের কাপড়ে সেলাই হোক নিখুঁত। পাল টেইলার্সে স্বাগতম।',
  about = 'পাল টেইলার্স — একটি বাংলা পরিবার-পরিচালিত টেইলারিং হাউস। আমরা বাংলার ঐতিহ্যবাহী পোশাক, রেডিমেড, নাইটি, শাড়ি, কুর্তি এবং কাস্টম টেইলারিং তৈরি করি — প্রতিটি পোশাক আপনার মাপে, আপনার পছন্দে।',
  updated_at = now()
WHERE id = 1;
