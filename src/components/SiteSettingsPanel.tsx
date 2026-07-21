import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSiteSettings } from '../lib/hooks';
import ImageUploader from './ImageUploader';
import type { SiteSettings } from '../types';

export default function SiteSettingsPanel() {
  const { settings, loading } = useSiteSettings();
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const set = (key: keyof SiteSettings, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const payload = {
      tagline: form.tagline || '',
      hero_title: form.hero_title || '',
      hero_subtitle: form.hero_subtitle || '',
      hero_image_url: form.hero_image_url || '',
      section_ready_made_image: form.section_ready_made_image || '',
      section_fabrics_image: form.section_fabrics_image || '',
      section_tailoring_image: form.section_tailoring_image || '',
      about_image: form.about_image || '',
      phone: form.phone || '',
      whatsapp_number: form.whatsapp_number || '',
      address: form.address || '',
      email: form.email || '',
      about: form.about || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('site_settings').upsert({ id: 1, ...payload });
    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSavedAt(Date.now());
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-sand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-2xl font-semibold text-charcoal">Homepage Content</h3>
        <p className="mt-1 text-sm text-sand-600">
          Edit what customers see on the home page. Changes appear on all devices instantly.
        </p>

        <div className="mt-6 space-y-5">
          <Field
            label="Brand Tagline"
            value={form.tagline || ''}
            onChange={(v) => set('tagline', v)}
            placeholder="Stitched to perfection, made just for you"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Hero Title"
              value={form.hero_title || ''}
              onChange={(v) => set('hero_title', v)}
              placeholder="Threads of Tradition, Tailored for You"
            />
            <Field
              label="Hero Subtitle"
              value={form.hero_subtitle || ''}
              onChange={(v) => set('hero_subtitle', v)}
              placeholder="Custom tailoring and ready-made elegance…"
            />
          </div>
          <ImageUploader
            label="Hero Image (top banner)"
            value={form.hero_image_url || ''}
            onChange={(v) => set('hero_image_url', v)}
            aspect="aspect-[16/9]"
          />
          <Field
            label="About Text"
            value={form.about || ''}
            onChange={(v) => set('about', v)}
            placeholder="A family-run tailoring house…"
            textarea
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-2xl font-semibold text-charcoal">Homepage Photos</h3>
        <p className="mt-1 text-sm text-sand-600">
          Change the photos shown in the “What we offer” cards and the “Our story” strip. Leave
          blank to use the default image.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <ImageUploader
            label="Ready Made card"
            value={form.section_ready_made_image || ''}
            onChange={(v) => set('section_ready_made_image', v)}
            aspect="aspect-[4/3]"
          />
          <ImageUploader
            label="Customise Fabrics card"
            value={form.section_fabrics_image || ''}
            onChange={(v) => set('section_fabrics_image', v)}
            aspect="aspect-[4/3]"
          />
          <ImageUploader
            label="Bespoke Tailoring card"
            value={form.section_tailoring_image || ''}
            onChange={(v) => set('section_tailoring_image', v)}
            aspect="aspect-[4/3]"
          />
          <ImageUploader
            label="Our Story strip"
            value={form.about_image || ''}
            onChange={(v) => set('about_image', v)}
            aspect="aspect-[4/3]"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-2xl font-semibold text-charcoal">Contact Details</h3>
        <p className="mt-1 text-sm text-sand-600">
          The phone number powers the header & footer. The WhatsApp number (with country code,
          digits only) powers chat and order messages.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            label="Display Phone"
            value={form.phone || ''}
            onChange={(v) => set('phone', v)}
            placeholder="81169 57329"
          />
          <Field
            label="WhatsApp Number (digits only, with country code)"
            value={form.whatsapp_number || ''}
            onChange={(v) => set('whatsapp_number', v)}
            placeholder="918116957329"
          />
          <Field
            label="Email"
            value={form.email || ''}
            onChange={(v) => set('email', v)}
            placeholder="hello@tailorshop.com"
          />
          <Field
            label="Address"
            value={form.address || ''}
            onChange={(v) => set('address', v)}
            placeholder="Shop address"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-sand-50 shadow-soft transition-all hover:scale-[1.02] hover:shadow-card disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
        {savedAt && Date.now() - savedAt < 4000 && (
          <span className="text-sm font-medium text-green-600 animate-fade-in">
            Saved — visible to all customers now.
          </span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-sand-400 focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-sand-400 focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
        />
      )}
    </div>
  );
}
