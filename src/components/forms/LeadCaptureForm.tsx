'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { trades } from '@/data/trades';
import { towns } from '@/data/towns';

interface LeadCaptureFormProps {
  prefilledTrade?: string;
  prefilledTown?: string;
  compact?: boolean;
}

export default function LeadCaptureForm({ prefilledTrade, prefilledTown, compact }: LeadCaptureFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    trade: prefilledTrade || '',
    town: prefilledTown || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        setFormData({ name: '', phone: '', email: '', website: '', trade: prefilledTrade || '', town: prefilledTown || '' });
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
          <label htmlFor="lead-name" className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60">
            Your Name *
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-[#F5F7FA] placeholder:text-white/20 outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-phone" className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60">
            Phone Number *
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="07700 900000"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-[#F5F7FA] placeholder:text-white/20 outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-email" className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60">
            Email *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-[#F5F7FA] placeholder:text-white/20 outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-website" className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60">
            Your Website URL
          </label>
          <input
            id="lead-website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yoursite.co.uk"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-[#F5F7FA] placeholder:text-white/20 outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-trade" className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60">
            Your Trade *
          </label>
          <select
            id="lead-trade"
            name="trade"
            required
            value={formData.trade}
            onChange={handleChange}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-[#F5F7FA] outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03] appearance-none"
          >
            <option value="" className="bg-[#151A21]">Select your trade…</option>
            {trades.map(t => (
              <option key={t.slug} value={t.slug} className="bg-[#151A21]">{t.displayName}</option>
            ))}
            <option value="other" className="bg-[#151A21]">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-town" className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60">
            Your Town *
          </label>
          <select
            id="lead-town"
            name="town"
            required
            value={formData.town}
            onChange={handleChange}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-[#F5F7FA] outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03] appearance-none"
          >
            <option value="" className="bg-[#151A21]">Select your area…</option>
            {towns.map(t => (
              <option key={t.slug} value={t.slug} className="bg-[#151A21]">{t.displayName}</option>
            ))}
            <option value="other" className="bg-[#151A21]">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-[15px] px-8 py-4 rounded-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(64,224,255,0.35)]"
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
