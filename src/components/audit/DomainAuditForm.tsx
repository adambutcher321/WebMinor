'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Loader2 } from 'lucide-react';

export type Strategy = 'mobile' | 'desktop';

interface DomainAuditFormProps {
  initialDomain?: string;
  initialStrategy?: Strategy;
  onSubmit?: (domain: string, strategy: Strategy) => void;
  isLoading?: boolean;
  compact?: boolean;
  submitLabel?: string;
}

export default function DomainAuditForm({
  initialDomain = '',
  initialStrategy = 'mobile',
  onSubmit,
  isLoading = false,
  compact = false,
  submitLabel = 'Run My Free Pre-Flight Check',
}: DomainAuditFormProps) {
  const router = useRouter();
  const [domain, setDomain] = useState(initialDomain);
  const [strategy, setStrategy] = useState<Strategy>(initialStrategy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed) return;

    if (onSubmit) {
      onSubmit(trimmed, strategy);
    } else {
      const params = new URLSearchParams({ domain: trimmed, strategy });
      router.push(`/pre-flight-check?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col ${compact ? 'gap-3' : 'gap-4'}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="audit-domain" className="sr-only">
          Website address
        </label>
        <input
          id="audit-domain"
          name="domain"
          type="text"
          inputMode="url"
          autoComplete="url"
          required
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="yourwebsite.co.uk"
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3.5 text-[16px] text-[#F5F7FA] placeholder:text-white/20 outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03] focus-visible:ring-2 focus-visible:ring-[#40E0FF]/50"
        />
        <div
          role="radiogroup"
          aria-label="Device to test"
          className="flex bg-white/[0.04] border border-white/[0.08] rounded-lg p-1 shrink-0"
        >
          {(['mobile', 'desktop'] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={strategy === s}
              onClick={() => setStrategy(s)}
              className={`px-4 py-2.5 rounded-md text-sm font-[family-name:var(--font-mono)] uppercase tracking-wider transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#40E0FF]/50 ${
                strategy === s
                  ? 'bg-[#40E0FF] text-[#0B0D10] font-bold'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-[16px] px-8 py-4 rounded-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(64,224,255,0.35)]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Running your Pre-Flight Check…
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" /> {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}
