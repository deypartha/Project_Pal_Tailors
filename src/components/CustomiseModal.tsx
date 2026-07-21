import { useEffect, useState } from 'react';
import { Loader2, MessageCircle, X } from 'lucide-react';
import type { CustomiseFormData, Fabric, GarmentType, Product, SiteSettings } from '../types';
import { GARMENT_TYPES } from '../types';
import {
  buildFabricMessage,
  buildProductMessage,
  sendToWhatsApp,
} from '../lib/whatsapp';

interface CustomiseModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  fabric?: Fabric | null;
  settings: SiteSettings | null;
}

export default function CustomiseModal({
  open,
  onClose,
  product,
  fabric,
  settings,
}: CustomiseModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [garment, setGarment] = useState<GarmentType>('Nighty');
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState(false);

  const isFabric = !!fabric;
  const title = isFabric ? `Customise ${fabric!.name}` : product ? product.name : 'Customise';

  useEffect(() => {
    if (open) {
      setName('');
      setPhone('');
      setDetails('');
      setGarment('Nighty');
      setTouched(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const nameValid = name.trim().length >= 2;
  const phoneValid = /^[0-9+\-\s]{7,15}$/.test(phone.trim());
  const detailsValid = details.trim().length >= 3;
  const formValid = nameValid && phoneValid && detailsValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!formValid) return;

    setSending(true);
    const data: CustomiseFormData = { name: name.trim(), phone: phone.trim(), details: details.trim() };
    const message = isFabric
      ? buildFabricMessage(fabric!, garment, data)
      : buildProductMessage(product!, data);
    sendToWhatsApp(settings?.whatsapp_number || '918116957329', message);
    window.setTimeout(() => {
      setSending(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-charcoal/55 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg animate-scale-in rounded-t-3xl bg-sand-50 shadow-elevate sm:rounded-3xl">
        <div className="flex items-start justify-between border-b border-sand-200 px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-sand-500">
              {isFabric ? 'Fabric to Garment' : 'Buy or Customise'}
            </p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-charcoal">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-sand-700 hover:bg-sand-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {(product || fabric) && (
            <div className="mb-5 flex gap-4 rounded-2xl bg-sand-100 p-3">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sand-200">
                {(product?.image_url || fabric?.image_url) && (
                  <img
                    src={product?.image_url || fabric?.image_url || ''}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-charcoal">
                  {product?.name || fabric?.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-sand-700">
                  {product?.description || fabric?.description || 'Custom tailoring request'}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-wider text-sand-500">
                  ID: {product?.code || fabric?.code || product?.id || fabric?.id}
                </p>
              </div>
            </div>
          )}

          {isFabric && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-charcoal">
                Make it into a
              </label>
              <div className="flex flex-wrap gap-2">
                {GARMENT_TYPES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGarment(g)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                      garment === g
                        ? 'bg-charcoal text-sand-50 shadow-soft'
                        : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Your Name"
              value={name}
              onChange={setName}
              placeholder="e.g. Priya Sharma"
              invalid={touched && !nameValid}
              error="Please enter your name"
            />
            <Field
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              placeholder="e.g. 98765 43210"
              type="tel"
              invalid={touched && !phoneValid}
              error="Enter a valid phone number"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-charcoal">
              How would you like it?
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Describe measurements, colour preferences, occasion, delivery timeline, etc."
              className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-sand-400 transition-colors focus:outline-none focus:ring-2 ${
                touched && !detailsValid
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-sand-200 focus:border-sand-400 focus:ring-sand-300'
              }`}
            />
            {touched && !detailsValid && (
              <p className="mt-1 text-xs text-red-500">Please tell us how you'd like it made.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-charcoal py-3.5 text-base font-medium text-sand-50 shadow-card transition-all hover:scale-[1.01] hover:shadow-elevate disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                Send via WhatsApp
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-sand-600">
            Your name, phone, and details will be sent with the {isFabric ? 'fabric' : 'product'} ID.
          </p>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  invalid?: boolean;
  error?: string;
}

function Field({ label, value, onChange, placeholder, type = 'text', invalid, error }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-sand-400 transition-colors focus:outline-none focus:ring-2 ${
          invalid
            ? 'border-red-400 focus:ring-red-300'
            : 'border-sand-200 focus:border-sand-400 focus:ring-sand-300'
        }`}
      />
      {invalid && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
