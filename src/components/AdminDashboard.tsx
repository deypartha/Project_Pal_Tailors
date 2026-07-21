import { LayoutDashboard, LogOut, Scissors, Settings, ShoppingBag, Sparkles } from 'lucide-react';
import { useState } from 'react';
import SiteSettingsPanel from './SiteSettingsPanel';
import ProductsPanel from './ProductsPanel';
import FabricsPanel from './FabricsPanel';

type Tab = 'settings' | 'products' | 'fabrics';

interface AdminDashboardProps {
  onLogout: () => void;
  onExit: () => void;
}

export default function AdminDashboard({ onLogout, onExit }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('settings');

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: 'settings', label: 'Homepage', icon: Settings },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'fabrics', label: 'Fabrics', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="border-b border-sand-200 bg-white">
        <div className="container-wide flex h-16 items-center justify-between">
          <button onClick={onExit} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-sand-50">
              <Scissors className="h-4 w-4" />
            </span>
            <div className="leading-none">
              <span className="font-display text-lg font-semibold text-charcoal">Pal Tailors</span>
              <span className="ml-2 text-xs uppercase tracking-wider text-sand-500">Admin</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="hidden items-center gap-1.5 rounded-full border border-sand-200 px-4 py-2 text-sm font-medium text-charcoal hover:bg-sand-100 sm:inline-flex"
            >
              <LayoutDashboard className="h-4 w-4" />
              View Site
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-sand-50 hover:scale-[1.03]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="mb-8 flex gap-1 overflow-x-auto rounded-full bg-sand-100 p-1.5 sm:inline-flex">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white text-charcoal shadow-soft'
                    : 'text-sand-700 hover:text-charcoal'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="animate-fade-in" key={tab}>
          {tab === 'settings' && <SiteSettingsPanel />}
          {tab === 'products' && <ProductsPanel />}
          {tab === 'fabrics' && <FabricsPanel />}
        </div>
      </div>
    </div>
  );
}
