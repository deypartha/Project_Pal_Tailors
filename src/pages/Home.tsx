import { ArrowRight, MessageCircle, Phone, Sparkles } from 'lucide-react';
import type { SiteSettings } from '../types';
import { openWhatsAppChat } from '../lib/whatsapp';

interface HomeProps {
  settings: SiteSettings | null;
  onNavigate: (page: 'home' | 'products' | 'fabrics' | 'admin') => void;
}

export default function Home({ settings, onNavigate }: HomeProps) {
  const heroImage =
    settings?.hero_image_url ||
    'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg';

  const readyMadeImage =
    settings?.section_ready_made_image ||
    'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg';
  const fabricsImage =
    settings?.section_fabrics_image ||
    'https://images.pexels.com/photos/5980585/pexels-photo-5980585.jpeg';
  const tailoringImage =
    settings?.section_tailoring_image ||
    'https://images.pexels.com/photos/6311629/pexels-photo-6311629.jpeg';
  const aboutImage =
    settings?.about_image ||
    'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg';

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Tailoring atelier" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/55 to-charcoal/25" />
        </div>

        <div className="container-wide relative flex min-h-[78vh] flex-col justify-center py-20">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-sand-50/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-sand-100 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Pal Tailors
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-sand-50 text-balance sm:text-6xl lg:text-7xl">
              {settings?.hero_title || 'Pal Tailors — Heritage Stitching, Modern Comfort'}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-100/90">
              {settings?.hero_subtitle ||
                'Ready-made, nighties, sarees, kurtis, traditional wear and custom tailoring — crafted with care, made to your measure.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('products')}
                className="group inline-flex items-center gap-2 rounded-full bg-sand-50 px-6 py-3.5 text-base font-medium text-charcoal shadow-card transition-all hover:scale-[1.03] hover:shadow-elevate"
              >
                Explore Ready Made
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('fabrics')}
                className="inline-flex items-center gap-2 rounded-full border border-sand-50/40 bg-sand-50/10 px-6 py-3.5 text-base font-medium text-sand-50 backdrop-blur-sm transition-all hover:bg-sand-50/20"
              >
                Choose Fabrics
              </button>
              {settings?.whatsapp_number && (
                <button
                  onClick={() => openWhatsAppChat(settings.whatsapp_number!)}
                  className="inline-flex items-center gap-2 rounded-full border border-sand-50/40 px-6 py-3.5 text-base font-medium text-sand-50 backdrop-blur-sm transition-all hover:bg-sand-50/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with us
                </button>
              )}
            </div>

            {settings?.phone && (
              <div className="mt-10 flex items-center gap-3 text-sand-100/90">
                <Phone className="h-5 w-5" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-lg font-medium">
                  {settings.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-wide py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sand-500">What we offer</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            From fabric to finished garment
          </h2>
          <p className="mt-4 text-sand-700">
            Pick a ready-made piece or bring us a fabric — we craft it into a nighty, saree,
            traditional dress, and more, fitted just for you.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <ServiceCard
            image={readyMadeImage}
            title="Ready Made"
            text="Curated, ready-to-wear pieces. Tap to buy or customise to your fit."
            cta="Browse products"
            onClick={() => onNavigate('products')}
          />
          <ServiceCard
            image={fabricsImage}
            title="Customise Fabrics"
            text="Choose a fabric and we'll tailor it into any garment you like."
            cta="Pick a fabric"
            onClick={() => onNavigate('fabrics')}
          />
          <ServiceCard
            image={tailoringImage}
            title="Bespoke Tailoring"
            text="Share your vision over WhatsApp and we'll bring it to life."
            cta="Chat now"
            onClick={() => settings?.whatsapp_number && openWhatsAppChat(settings.whatsapp_number)}
          />
        </div>
      </section>

      {/* About strip */}
      <section className="bg-sand-100">
        <div className="container-wide grid items-center gap-12 py-20 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img
              src={aboutImage}
              alt="Our atelier"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sand-500">Our story</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
              Crafted with patience, worn with pride
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-sand-700">
              {settings?.about ||
                'A family-run tailoring house bringing you ready-made garments, fine fabrics, and bespoke stitching.'}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <Stat value="25+" label="Years of craft" />
              <Stat value="5k+" label="Garments stitched" />
              <Stat value="100%" label="Made to measure" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  image,
  title,
  text,
  cta,
  onClick,
}: {
  image: string;
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-semibold text-charcoal">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-sand-700">{text}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sand-700 transition-colors group-hover:text-charcoal">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold text-charcoal">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-sand-600">{label}</p>
    </div>
  );
}
