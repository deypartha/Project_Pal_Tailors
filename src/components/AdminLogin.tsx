import { LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

const ADMIN_ID = 'test';
const ADMIN_PASS = '1234';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim() === ADMIN_ID && pass === ADMIN_PASS) {
      setError(null);
      onSuccess();
    } else {
      setError('Incorrect ID or password.');
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card animate-scale-in">
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-sand-600 hover:bg-sand-100"
            aria-label="Back to site"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-sand-50 shadow-soft">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-charcoal">Pal Tailors Admin</h1>
            <p className="mt-1.5 text-sm text-sand-600">
              Sign in to manage products, fabrics, and homepage content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Admin ID</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  autoFocus
                  placeholder="Enter admin ID"
                  className="w-full rounded-xl border border-sand-200 bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder:text-sand-400 focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-sand-400 focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-charcoal py-3.5 text-sm font-medium text-sand-50 shadow-soft transition-all hover:scale-[1.01] hover:shadow-card"
            >
              Sign In
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-sand-500">
          Demo credentials — ID: <span className="font-medium text-sand-700">test</span> · Pass:{' '}
          <span className="font-medium text-sand-700">1234</span>
        </p>
      </div>
    </div>
  );
}
