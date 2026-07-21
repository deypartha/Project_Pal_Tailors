import { Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useProducts } from '../lib/hooks';
import { formatPrice } from '../lib/format';
import ImageUploader from './ImageUploader';
import { PRODUCT_TYPES } from '../types';
import type { Product, ProductType } from '../types';

const emptyDraft: Omit<Product, 'id' | 'created_at' | 'code'> = {
  name: '',
  description: '',
  price: null,
  image_url: '',
  category: '',
  type: 'Nighty',
  sold_out: false,
  sort_order: 0,
};

export default function ProductsPanel() {
  const { products, loading } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.code || '').toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.type || '').toLowerCase().includes(q)
    );
  }, [products, query]);

  const remove = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
  };

  const toggleSoldOut = async (p: Product) => {
    await supabase.from('products').update({ sold_out: !p.sold_out }).eq('id', p.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-sand-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-charcoal">Products</h3>
          <p className="mt-0.5 text-sm text-sand-600">{products.length} ready-made items</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-sand-50 shadow-soft transition-all hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code (PT-0001) or name…"
          className="w-full rounded-full border border-sand-200 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-sand-400 focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-sand-600 shadow-soft">
          No products yet. Click “Add Product” to create your first one.
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-sand-600 shadow-soft">
          No products match “{query}”.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-all hover:shadow-card"
            >
              <div className={`relative aspect-[4/3] bg-sand-100 ${p.sold_out ? 'grayscale' : ''}`}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-3xl text-sand-300">
                    {p.name.charAt(0)}
                  </div>
                )}
                {p.sold_out && (
                  <span className="absolute right-2 top-2 rounded-full bg-charcoal/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sand-50">
                    Sold Out
                  </span>
                )}
                {p.code && (
                  <span className="absolute left-2 top-2 rounded-full bg-sand-50/90 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-charcoal backdrop-blur-sm">
                    {p.code}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h4 className="font-medium text-charcoal">{p.name}</h4>
                <p className="mt-0.5 line-clamp-1 text-xs text-sand-600">{p.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-sand-500">
                  <span className="rounded bg-sand-100 px-2 py-0.5 font-medium text-charcoal">
                    {p.type || 'Other'}
                  </span>
                  {p.price != null && <span>{formatPrice(p.price)}</span>}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-sand-200 py-2 text-xs font-medium text-charcoal hover:bg-sand-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleSoldOut(p)}
                    className={`inline-flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-medium transition-colors ${
                      p.sold_out
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                    }`}
                  >
                    {p.sold_out ? 'Mark Available' : 'Mark Sold Out'}
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 px-2.5 py-2 text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <ProductFormModal
          product={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [draft, setDraft] = useState<Omit<Product, 'id' | 'created_at' | 'code'>>(
    product
      ? {
          name: product.name,
          description: product.description || '',
          price: product.price,
          image_url: product.image_url || '',
          category: product.category || '',
          type: (product.type as ProductType) || 'Nighty',
          sold_out: product.sold_out,
          sort_order: product.sort_order,
        }
      : { ...emptyDraft }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    if (!draft.name.trim()) {
      setError('Name is required.');
      setSaving(false);
      return;
    }
    const payload = {
      name: draft.name.trim(),
      description: draft.description,
      price: draft.price === null ? null : Number(draft.price),
      image_url: draft.image_url,
      category: draft.category,
      type: draft.type,
      sold_out: draft.sold_out,
      sort_order: Number(draft.sort_order) || 0,
    };

    const { error } = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload);

    setSaving(false);
    if (error) setError(error.message);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-charcoal/55 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 max-h-[88vh] w-full max-w-lg animate-scale-in overflow-y-auto rounded-t-3xl bg-sand-50 shadow-elevate sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-sand-200 bg-sand-50/95 px-6 py-4 backdrop-blur">
          <div>
            <h3 className="font-display text-2xl font-semibold text-charcoal">
              {product ? 'Edit Product' : 'Add Product'}
            </h3>
            {product?.code && (
              <p className="mt-0.5 text-xs font-semibold tracking-wider text-sand-500">
                {product.code} · code auto-assigned
              </p>
            )}
            {!product && (
              <p className="mt-0.5 text-xs text-sand-500">
                A code like PT-0001 will be auto-assigned on save
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-sand-700 hover:bg-sand-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Input label="Name" value={draft.name} onChange={(v) => set('name', v)} />
          <Input
            label="Description"
            value={draft.description || ''}
            onChange={(v) => set('description', v)}
            textarea
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price (₹, leave blank for on-request)"
              value={draft.price == null ? '' : String(draft.price)}
              onChange={(v) => set('price', v === '' ? null : Number(v))}
              type="number"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">
                Type (drives customer-side navigation)
              </label>
              <select
                value={draft.type || 'Nighty'}
                onChange={(e) => set('type', e.target.value as ProductType)}
                className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-charcoal focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Sort order (lower shows first)"
            value={String(draft.sort_order)}
            onChange={(v) => set('sort_order', Number(v) || 0)}
            type="number"
          />
          <ImageUploader
            label="Product Image"
            value={draft.image_url || ''}
            onChange={(v) => set('image_url', v)}
            aspect="aspect-[4/5]"
          />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 shadow-soft">
            <input
              type="checkbox"
              checked={draft.sold_out}
              onChange={(e) => set('sold_out', e.target.checked)}
              className="h-4 w-4 accent-charcoal"
            />
            <span className="text-sm text-charcoal">
              Mark as sold out (shown grayed out on customer page)
            </span>
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-sand-200 bg-sand-50/95 px-6 py-4 backdrop-blur">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-sand-300 py-3 text-sm font-medium text-charcoal hover:bg-sand-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-charcoal py-3 text-sm font-medium text-sand-50 shadow-soft disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
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
          className="w-full resize-none rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-charcoal focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-charcoal focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
        />
      )}
    </div>
  );
}
