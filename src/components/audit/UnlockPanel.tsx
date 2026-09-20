'use client';

import { useState } from 'react';
import { Download, Loader2, CheckCircle, Send } from 'lucide-react';
import type { AuditReport } from '@/lib/audit/types';

// Kept in sync with the placeholder URLs in src/components/layout/Footer.tsx —
// update both together once real WebMinor social accounts are live.
const FACEBOOK_PAGE = 'https://facebook.com/webminor';
const INSTAGRAM_PAGE = 'https://instagram.com/webminor';
const SITE_URL = 'https://www.webminor.co.uk';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type Stage = 'locked' | 'submitting' | 'unlocked';

export default function UnlockPanel({ report }: { report: AuditReport }) {
  const [stage, setStage] = useState<Stage>('locked');
  const [email, setEmail] = useState('');
  const [leadError, setLeadError] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<'idle' | 'generating' | 'error'>('idle');

  const shareQuote = `I just scored ${report.grade} (${report.overallScore}/100) on WebMinor's free website Pre-Flight Check — check yours:`;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(shareQuote)}`;

  const downloadPdf = async () => {
    setPdfState('generating');
    try {
      const res = await fetch('/api/audit/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report }),
      });
      if (!res.ok) throw new Error('pdf failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webminor-launch-readiness-${report.domain}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setPdfState('idle');
    } catch {
      setPdfState('error');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);
    setStage('submitting');

    try {
      const res = await fetch('/api/audit/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          domain: report.domain,
          grade: report.grade,
          score: report.overallScore,
          strategy: report.strategy,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setLeadError(body?.error ?? 'Something went wrong. Please try again.');
        setStage('locked');
        return;
      }

      setStage('unlocked');
      downloadPdf();
    } catch {
      setLeadError('Something went wrong. Please try again.');
      setStage('locked');
    }
  };

  return (
    <div className="bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-8 sm:p-10 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
      <div className="text-center mb-8">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — Unlock Your Launch Readiness Report
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
          Get the full PDF report
        </h2>
      </div>

      {/* Step 1: share/follow — a nudge, never a gate */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-bold tracking-wider uppercase text-white/60 mb-3">
          Step 1 — Share your score (optional, but it helps us a lot)
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1665d8] text-white font-[family-name:var(--font-sora)] font-semibold text-sm px-5 py-3 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white/50 outline-none"
          >
            <FacebookIcon className="w-4 h-4" /> Share my score
          </a>
          <a
            href={FACEBOOK_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#40E0FF]/20 bg-[#40E0FF]/[0.06] hover:bg-[#40E0FF]/[0.12] text-[#40E0FF] font-[family-name:var(--font-sora)] font-semibold text-sm px-5 py-3 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#40E0FF]/50 outline-none"
          >
            <FacebookIcon className="w-4 h-4" /> Follow us
          </a>
          <a
            href={INSTAGRAM_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#40E0FF]/20 bg-[#40E0FF]/[0.06] hover:bg-[#40E0FF]/[0.12] text-[#40E0FF] font-[family-name:var(--font-sora)] font-semibold text-sm px-5 py-3 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#40E0FF]/50 outline-none"
          >
            <InstagramIcon className="w-4 h-4" /> Follow us
          </a>
        </div>
      </div>

      {/* Step 2: email to unlock */}
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-bold tracking-wider uppercase text-white/60 mb-3">
          Step 2 — Enter your email to unlock the PDF
        </p>

        {stage !== 'unlocked' ? (
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="unlock-email" className="sr-only">Email address</label>
            <input
              id="unlock-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3.5 text-[16px] text-[#F5F7FA] placeholder:text-white/20 outline-none transition-colors focus:border-[#40E0FF]/40 focus:bg-[#40E0FF]/[0.03] focus-visible:ring-2 focus-visible:ring-[#40E0FF]/50"
            />
            <button
              type="submit"
              disabled={stage === 'submitting'}
              className="flex items-center justify-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-[16px] px-6 py-3.5 rounded-lg transition-all hover:scale-[1.02] whitespace-nowrap"
            >
              {stage === 'submitting' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Unlocking…</>
              ) : (
                <><Send className="w-5 h-5" /> Unlock PDF</>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
            <p className="text-[#9AA3AF]">
              Unlocked — your download should start automatically.
            </p>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={pdfState === 'generating'}
              className="inline-flex items-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] disabled:opacity-60 text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-sm px-6 py-3 rounded-lg transition-all"
            >
              {pdfState === 'generating' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
              ) : (
                <><Download className="w-4 h-4" /> Download PDF again</>
              )}
            </button>
            {pdfState === 'error' && (
              <p className="text-red-400 text-sm">
                Couldn&apos;t generate the PDF. Please try the button above again, or email{' '}
                <a href="mailto:hello@webminor.co.uk" className="underline">hello@webminor.co.uk</a>.
              </p>
            )}
          </div>
        )}

        {leadError && <p className="text-red-400 text-sm mt-3">{leadError}</p>}
      </div>
    </div>
  );
}
