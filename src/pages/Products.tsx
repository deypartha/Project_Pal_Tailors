import { Loader2, PackageOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProducts, useSiteSettings } from '../lib/hooks';
import { formatPrice } from '../lib/format';
import CustomiseModal from '../components/CustomiseModal';
import { PRODUCT_TYPES } from '../types';
import type { Product } from '../types';

type Filter = 'All' | (typeof PRODUCT_TYPES)[number];

export default function Products() {
  const { products, loading } = useProducts();
  const { settings } = useSiteSettings();
  const [active, setActive] = useState<Product | null>(null);
  const [filter, setFilter] = useState<Filter>('All');

  const filters: Filter[] = ['All', ...PRODUCT_TYPES];

  const filtered = useMemo(() => {
    if (filter === 'All') return products;
    return products.filter((p) => (p.type || 'Other') === filter);
  }, [products, filter]);

  return (
    <div className="animate-fade-in">
      <section className="border-b border-sand-200 bg-sand-100">
        <div className="container-tight py-16 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sand-500">Ready Made Collection</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
            Our Ready-Made Collection
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sand-700">
            Browse our ready-to-wear pieces. Tap{' '}
            <span className="font-medium text-charcoal">Buy or Customise</span> to purchase as-is or
            request alterations — your details go straight to our WhatsApp.
          </p>
        </div>
      </section>

      <section className="container-wide py-14">
        {/* Type filter tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {filters.map((f) => {
            const count =
              f === 'All' ? products.length : products.filter((p) => (p.type || 'Other') === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-charcoal text-sand-50 shadow-soft'
                    : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                }`}
              >
                {f}
                <span className={`ml-1.5 text-xs ${filter === f ? 'text-sand-300' : 'text-sand-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-sand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState label={filter === 'All' ? 'No products yet. Please check back soon.' : `No items in ${filter} yet.`} />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onCustomise={() => setActive(p)}
              />
            ))}
          </div>
        )}
      </section>

      <CustomiseModal
        open={!!active}
        onClose={() => setActive(null)}
        product={active}
        settings={settings}
      />
    </div>
  );
}

function ProductCard({
  product,
  index,
  onCustomise,
}: {
  product: Product;
  index: number;
  onCustomise: () => void;
}) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-card animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div className={`relative aspect-[4/5] overflow-hidden bg-sand-100 ${product.sold_out ? 'grayscale' : ''}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sand-400">
            <PackageOpen className="h-10 w-10" />
          </div>
        )}
        {product.sold_out && (
          <span className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sand-50">
            Sold Out
          </span>
        )}
        {product.code && (
          <span className="absolute left-3 top-3 rounded-full bg-sand-50/90 px-3 py-1 text-[11px] font-semibold tracking-wider text-charcoal backdrop-blur-sm">
            {product.code}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-charcoal">{product.name}</h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-sand-700">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {product.price != null ? (
            <span className="font-display text-lg font-semibold text-charcoal">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-sm text-sand-500">Price on request</span>
          )}
        </div>

        <button
          onClick={onCustomise}
          disabled={product.sold_out}
          className="mt-4 w-full rounded-full bg-charcoal py-3 text-sm font-medium text-sand-50 shadow-soft transition-all hover:scale-[1.02] hover:shadow-card disabled:cursor-not-allowed disabled:bg-sand-300 disabled:shadow-none"
        >
          {product.sold_out ? 'Sold Out' : 'Buy or Customise'}
        </button>
      </div>
    </article>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <PackageOpen className="h-12 w-12 text-sand-300" />
      <p className="mt-4 text-sand-600">{label}</p>
    </div>
  );
}
