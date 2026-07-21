import { Loader2, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadImage } from '../lib/hooks';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  aspect = 'aspect-video',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      <div className={`relative ${aspect} overflow-hidden rounded-2xl border border-sand-200 bg-sand-100`}>
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/70 text-sand-50 backdrop-blur-sm hover:bg-charcoal"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-sand-500 transition-colors hover:bg-sand-200/60"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <UploadCloud className="h-7 w-7" />
                <span className="text-sm font-medium">Click to upload</span>
              </>
            )}
          </button>
        )}
      </div>

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 text-xs font-medium text-sand-700 underline-offset-2 hover:underline disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Replace image'}
        </button>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          className="w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-xs text-charcoal placeholder:text-sand-400 focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
        />
      </div>
    </div>
  );
}
