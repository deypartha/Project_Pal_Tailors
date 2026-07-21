/*
# Homepage section photos — admin-editable

## Overview
Adds four image URL columns to site_settings so the admin can change the photos
shown on the home page: the three "What we offer" service cards (Ready Made,
Customise Fabrics, Bespoke Tailoring) and the "Our story" about-strip image.

## Changed Tables

### site_settings
- Adds `section_ready_made_image` (text) — service card 1 image
- Adds `section_fabrics_image` (text) — service card 2 image
- Adds `section_tailoring_image` (text) — service card 3 image
- Adds `about_image` (text) — "Our story" strip image
- Seeds all four with the current hardcoded Pexels defaults so the home page
  looks identical until the admin changes them.

## Security
- No RLS changes. New columns inherit existing policies.

## Notes
1. All columns are nullable text; empty/null falls back to the hardcoded
   defaults in Home.tsx, so the page never shows a broken image.
*/

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_ready_made_image text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_fabrics_image text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS section_tailoring_image text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_image text;

UPDATE site_settings SET
  section_ready_made_image = coalesce(section_ready_made_image, 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg'),
  section_fabrics_image    = coalesce(section_fabrics_image,    'https://images.pexels.com/photos/5980585/pexels-photo-5980585.jpeg'),
  section_tailoring_image  = coalesce(section_tailoring_image,  'https://images.pexels.com/photos/6311629/pexels-photo-6311629.jpeg'),
  about_image              = coalesce(about_image,              'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg'),
  updated_at = now()
WHERE id = 1;
