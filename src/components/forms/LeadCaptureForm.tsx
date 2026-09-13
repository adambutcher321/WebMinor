'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { trades } from '@/data/trades';
import { towns } from '@/data/towns';

interface LeadCaptureFormProps {
  /** Trade slug from a landing page — resolved to its display name and offered as an editable starting value. */
  prefilledTrade?: string;
  /** Town slug from a landing page — resolved to its display name and offered as an editable starting value. */
  prefilledTown?: string;
  compact?: boolean;
}

/* The form is mounted on both halves of the site: the trade × town landing
   pages and the studio work. A fixed list of four trades and twelve towns can
   only describe the first, so business and location are free text. Landing
   pages still prefill them — the visitor just gets words they can edit rather
   than a select they can't escape. */

const capitalise = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

function tradeLabel(slug?: string): string {
  if (!slug) return '';
  return trades.find((t) => t.slug === slug)?.displayName ?? capitalise(slug);
}

function townLabel(slug?: string): string {
  if (!slug) return '';
  return towns.find((t) => t.slug === slug)?.displayName ?? capitalise(slug);
}

const fieldClass =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[16px] text-[#F5F7FA] placeholder:text-[#768393] outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03]';

const labelClass =
  'font-[family-name:var(--font-mono)] text-[12px] font-bold tracking-wider uppercase text-[#9AA3AF]';

export default function LeadCaptureForm({ prefilledTrade, prefilledTown, compact }: LeadCaptureFormProps) {
  const initial = {
    name: '',
    phone: '',
    email: '',
    website: '',
    business: tradeLabel(prefilledTrade),
    location: townLabel(prefilledTown),
  };

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData(initial);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-400" />
        <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white">
          We&apos;ve got your details
        </h3>
        <p className="text-[#9AA3AF] max-w-md">
          We&apos;ll review your website and get back to you within 2 hours with our findings and recommendations.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div className="space-y-1.5">
          <label htmlFor="lead-name" className={labelClass}>
            Your Name *
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-phone" className={labelClass}>
            Phone Number *
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="07700 900000"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-email" className={labelClass}>
            Email *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-website" className={labelClass}>
            Your Website URL
          </label>
          <input
            id="lead-website"
            name="website"
            type="url"
            autoComplete="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yoursite.co.uk"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-business" className={labelClass}>
            Your Business *
          </label>
          <input
            id="lead-business"
            name="business"
            type="text"
            required
            autoComplete="organization"
            value={formData.business}
            onChange={handleChange}
            placeholder="Name, or what you do"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-location" className={labelClass}>
            Where You&apos;re Based
          </label>
          <input
            id="lead-location"
            name="location"
            type="text"
            autoComplete="address-level2"
            value={formData.location}
            onChange={handleChange}
            placeholder="Town or city"
            className={fieldClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-[16px] px-8 py-4 rounded-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(64,224,255,0.35)]"
      >
        {status === 'submitting' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-5 h-5" /> Get my free website review</>
        )}
      </button>

      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">
          Something went wrong. Please call us on <a href="tel:01752845258" className="underline">01752 845258</a> or email <a href="mailto:hello@webminor.com" className="underline">hello@webminor.com</a>.
        </p>
      )}
    </form>
  );
}
