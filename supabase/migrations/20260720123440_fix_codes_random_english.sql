/*
# Fix duplicate code keys + random code generation + English content

## Overview
Resolves "duplicate keys found" errors by removing the UNIQUE constraints on
products.code and fabrics.code, and switches code generation from sequential
sequence-based values to random 4-digit numbers (still PT-XXXX / FB-XXXX format).
Also reverts the site_settings hero/about copy to English (the site keeps a warm
Bengali-inspired aesthetic but all customer-facing text is English).

## Changes

### products
- Drops the `products_code_key` UNIQUE constraint (codes no longer must be unique).
- Replaces `set_products_code()` trigger function so it generates
  'PT-' || random 4-digit number (1000-9999) instead of a sequence value.

### fabrics
- Drops the `fabrics_code_key` UNIQUE constraint.
- Replaces `set_fabrics_code()` trigger function to generate
  'FB-' || random 4-digit number (1000-9999).

### site_settings
- Reverts tagline, hero_title, hero_subtitle, and about to English.

## Notes
1. Codes are random 4-digit numbers in PT-XXXX / FB-XXXX format — collisions are
   possible but no longer cause insert failures.
*/

-- ---------- products: remove unique, random code ----------
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_code_key;

CREATE OR REPLACE FUNCTION set_products_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'PT-' || lpad(floor(random() * 9000 + 1000)::int::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------- fabrics: remove unique, random code ----------
ALTER TABLE fabrics DROP CONSTRAINT IF EXISTS fabrics_code_key;

CREATE OR REPLACE FUNCTION set_fabrics_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := 'FB-' || lpad(floor(random() * 9000 + 1000)::int::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------- revert site_settings to English ----------
UPDATE site_settings SET
  tagline = 'Threads of tradition, tailored for you',
  hero_title = 'Pal Tailors — Heritage Stitching, Modern Comfort',
  hero_subtitle = 'Ready-made, nighties, sarees, kurtis, traditional wear and custom tailoring — crafted with care, made to your measure.',
  about = 'Pal Tailors is a family-run tailoring house bringing you ready-made garments, fine fabrics, and bespoke stitching — every piece made to your measure, with care.',
  updated_at = now()
WHERE id = 1;
