import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFabrics, useSiteSettings } from '../lib/hooks';
import { formatPrice } from '../lib/format';
import CustomiseModal from '../components/CustomiseModal';
import { EmptyState } from './Products';
import type { Fabric } from '../types';

export default function Fabrics() {
  const { fabrics, loading } = useFabrics();
  const { settings } = useSiteSettings();
  const [active, setActive] = useState<Fabric | null>(null);

  return (
    <div className="animate-fade-in">
      <section className="border-b border-sand-200 bg-sand-100">
        <div className="container-tight py-16 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sand-500">Fabric Library</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            Pick a fabric, we'll craft the rest
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sand-700">
            Choose any fabric below and have it tailored into a nighty, saree, traditional dress, or
            any garment you love. Tell us your measurements and preferences over WhatsApp.
          </p>
        </div>
      </section>

      <section className="container-wide py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-sand-500" />
          </div>
        ) : fabrics.length === 0 ? (
          <EmptyState label="No fabrics yet. Please check back soon." />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {fabrics.map((f, i) => (
              <FabricCard key={f.id} fabric={f} index={i} onCustomise={() => setActive(f)} />
            ))}
          </div>
        )}
      </section>

      <CustomiseModal
        open={!!active}
        onClose={() => setActive(null)}
        fabric={active}
        settings={settings}
      />
    </div>
  );
}

function FabricCard({
  fabric,
  index,
  onCustomise,
}: {
  fabric: Fabric;
  index: number;
  onCustomise: () => void;
}) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div className={`relative aspect-square overflow-hidden bg-sand-100 ${fabric.sold_out ? 'grayscale' : ''}`}>
        {fabric.image_url ? (
          <img
            src={fabric.image_url}
            alt={fabric.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-display text-sand-300">
            {fabric.name.charAt(0)}
          </div>
        )}
        {fabric.sold_out && (
          <span className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sand-50">
            Sold Out
          </span>
        )}
        {fabric.code && (
          <span className="absolute left-3 top-3 rounded-full bg-sand-50/90 px-3 py-1 text-[11px] font-semibold tracking-wider text-charcoal backdrop-blur-sm">
            {fabric.code}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-charcoal">{fabric.name}</h3>
        {fabric.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sand-700">
            {fabric.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {fabric.price != null ? (
            <span className="font-display text-lg font-semibold text-charcoal">
              {formatPrice(fabric.price)}
            </span>
          ) : (
            <span className="text-sm text-sand-500">Price on request</span>
          )}
          <span className="text-[10px] font-semibold tracking-wider text-sand-500">
            {fabric.code || `#${fabric.id.slice(0, 8)}`}
          </span>
        </div>

        <button
          onClick={onCustomise}
          disabled={fabric.sold_out}
          className="mt-4 w-full rounded-full bg-charcoal py-3 text-sm font-medium text-sand-50 shadow-soft transition-all hover:scale-[1.02] hover:shadow-card disabled:cursor-not-allowed disabled:bg-sand-300 disabled:shadow-none"
        >
          {fabric.sold_out ? 'Sold Out' : 'Customise'}
        </button>
      </div>
    </article>
  );
}
