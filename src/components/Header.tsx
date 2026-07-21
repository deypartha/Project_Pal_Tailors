import { Menu, Phone, Scissors, X } from 'lucide-react';
import { useState } from 'react';
import type { SiteSettings } from '../types';
import { openWhatsAppChat } from '../lib/whatsapp';

interface HeaderProps {
  settings: SiteSettings | null;
  page: 'home' | 'products' | 'fabrics' | 'admin';
  onNavigate: (page: 'home' | 'products' | 'fabrics' | 'admin') => void;
}

export default function Header({ settings, page, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const navItems: { id: 'home' | 'products' | 'fabrics'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Ready Made' },
    { id: 'fabrics', label: 'Fabrics' },
  ];

  const go = (p: 'home' | 'products' | 'fabrics' | 'admin') => {
    onNavigate(p);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200/70 bg-sand-50/85 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between sm:h-20">
        <button onClick={() => go('home')} className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-sand-50 shadow-soft transition-transform group-hover:scale-105">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-wide text-charcoal sm:text-2xl">
              Pal Tailors
            </span>
            <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.25em] text-sand-600 sm:block">
              {settings?.tagline || 'Threads of tradition, tailored for you'}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                page === item.id ? 'text-charcoal' : 'text-sand-700 hover:text-charcoal'
              }`}
            >
              {item.label === 'Ready Made' ? 'Ready Made' : item.label === 'Fabrics' ? 'Fabrics' : 'Home'}
              <span
                className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-sand-500 transition-transform duration-300 ${
                  page === item.id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
          {settings?.whatsapp_number && (
            <button
              onClick={() => openWhatsAppChat(settings.whatsapp_number!)}
              className="ml-2 flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-sand-50 shadow-soft transition-all hover:scale-[1.03] hover:shadow-card"
            >
              <Phone className="h-4 w-4" />
              Chat
            </button>
          )}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-sand-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-sand-200 bg-sand-50 md:hidden">
          <nav className="container-wide flex flex-col py-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`rounded-lg px-3 py-3 text-left text-base font-medium transition-colors ${
                  page === item.id ? 'bg-sand-100 text-charcoal' : 'text-sand-700 hover:bg-sand-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {settings?.whatsapp_number && (
              <button
                onClick={() => openWhatsAppChat(settings.whatsapp_number!)}
                className="mt-2 flex items-center gap-2 rounded-lg bg-charcoal px-3 py-3 text-base font-medium text-sand-50"
              >
                <Phone className="h-4 w-4" />
                Chat on WhatsApp
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
