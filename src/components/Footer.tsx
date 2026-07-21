import { Mail, MapPin, Phone, Scissors } from 'lucide-react';
import type { SiteSettings } from '../types';
import { openWhatsAppChat } from '../lib/whatsapp';

interface FooterProps {
  settings: SiteSettings | null;
  onNavigate: (page: 'home' | 'products' | 'fabrics' | 'admin') => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-sand-200 bg-sand-100">
      <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-sand-50">
              <Scissors className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-semibold text-charcoal">Pal Tailors</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-700">
            {settings?.about ||
              'A family-run tailoring house bringing you ready-made garments, fine fabrics, and bespoke stitching.'}
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-charcoal">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-sand-700">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-charcoal transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-charcoal transition-colors">
                Ready Made
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('fabrics')} className="hover:text-charcoal transition-colors">
                Fabrics
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-charcoal">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-sand-700">
            {settings?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-sand-500" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-charcoal">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-sand-500" />
                <a href={`mailto:${settings.email}`} className="hover:text-charcoal">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-sand-500" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings?.whatsapp_number && (
              <li>
                <button
                  onClick={() => openWhatsAppChat(settings.whatsapp_number!)}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-sand-50 transition-transform hover:scale-[1.03]"
                >
                  <Phone className="h-4 w-4" />
                  Chat on WhatsApp
                </button>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-charcoal">Crafted With Care</h4>
          <p className="mt-4 text-sm leading-relaxed text-sand-700">
            Every garment is measured, cut, and stitched to your unique fit. Reach out to begin your
            bespoke journey.
          </p>
        </div>
      </div>

      <div className="border-t border-sand-200">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-5 text-xs text-sand-600 sm:flex-row">
          <span>© {new Date().getFullYear()} Pal Tailors. All rights reserved.</span>
          <span>Heritage stitching, modern comfort</span>
        </div>
      </div>
    </footer>
  );
}
