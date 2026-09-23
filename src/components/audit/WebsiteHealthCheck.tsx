'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Download, Loader2, Mail } from 'lucide-react';
import type { SiteReport, Severity } from '@/lib/audit/types';

/* The free website health check. Type a domain, watch it being checked, see
   the score and the top three problems on screen, then give an email for the
   full PDF — which downloads immediately and is emailed as well. The on-screen
   result is never gated: the PDF is the thing worth an email address. */

const STEPS = [
  'Finding your pages',
  'Reading titles, headings and descriptions',
  'Following every link',
  'Weighing the images',
  'Checking you can be rung and emailed',
  'Running Google’s speed test on a phone',
  'Looking up your web address',
  'Scoring it all',
];

const SEV: Record<Severity, { label: string; dot: string; text: string }> = {
  error: { label: 'Fix now', dot: 'bg-[#FF5A5F]', text: 'text-[#FF8A8E]' },
  warning: { label: 'Fix soon', dot: 'bg-[#F5A524]', text: 'text-[#F7BD5A]' },
  notice: { label: 'Worth doing', dot: 'bg-[#6FA0EA]', text: 'text-[#9CC0F5]' },
};

const scoreColour = (n: number) => (n >= 85 ? '#3DD68C' : n >= 70 ? '#A3D65C' : n >= 50 ? '#F5A524' : '#FF5A5F');
const BAND_WORD: Record<SiteReport['band'], string> = { strong: 'Strong', fair: 'Fair', weak: 'Needs work', poor: 'Poor' };

type Stage = 'idle' | 'running' | 'done' | 'error';

function Gauge({ score }: { score: number }) {
  const r = 70;
  const len = 2 * Math.PI * r * 0.75;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(id);
  }, [score]);
  return (
    <div className="relative size-[180px] shrink-0">
      <svg viewBox="0 0 180 180" className="size-full -rotate-[225deg]">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${len} 999`} />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={scoreColour(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(len * shown) / 100} 999`}
          className="transition-[stroke-dasharray] duration-[900ms] ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[family-name:var(--font-sora)] text-5xl font-bold text-white leading-none">{score}</span>
        <span className="mt-2 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] uppercase text-[#9AA3AF]">out of 100</span>
      </div>
    </div>
  );
}

export default function WebsiteHealthCheck({ compact = false }: { compact?: boolean }) {
  const [domain, setDomain] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [report, setReport] = useState<SiteReport | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | { emailed: boolean }>(null);
  const [sendError, setSendError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage !== 'running') return;
    const start = Date.now();
    const t = setInterval(() => {
      const s = (Date.now() - start) / 1000;
      setElapsed(Math.floor(s));
      // Most sites finish in 10–40s; spread the steps over that, then hold on the last.
      setStep(Math.min(STEPS.length - 1, Math.floor(s / 4.5)));
    }, 250);
    return () => clearInterval(t);
  }, [stage]);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    setStage('running');
    setStep(0);
    setElapsed(0);
    setError('');
    setReport(null);
    setSent(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setReport(json);
      setStage('done');
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStage('error');
    }
  }

  async function getPdf(e: React.FormEvent) {
    e.preventDefault();
    if (!report) return;
    setSending(true);
    setSendError('');
    try {
      const res = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, email, name }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? 'We couldn’t build the PDF.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `website-health-report-${report.domain}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setSent({ emailed: res.headers.get('X-Report-Emailed') === '1' });
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSending(false);
    }
  }

  const field =
    'w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-3.5 text-[16px] text-[#F5F7FA] placeholder:text-[#768393] outline-none transition-colors focus:border-[#40E0FF]/50 focus:bg-[#40E0FF]/[0.03]';

  return (
    <div>
      {/* Domain in */}
      <form onSubmit={run} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="hc-domain" className="sr-only">
          Your website address
        </label>
        <input
          id="hc-domain"
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="url"
          placeholder="yourwebsite.co.uk"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          disabled={stage === 'running'}
          className={`${field} sm:flex-1 text-[18px] py-4`}
        />
        <button
          type="submit"
          disabled={stage === 'running' || !domain.trim()}
          className="flex items-center justify-center gap-2 bg-[#40E0FF] hover:bg-[#7AEAFF] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-[16px] px-7 py-4 rounded-lg transition-colors whitespace-nowrap"
        >
          {stage === 'running' ? (
            <>
              <Loader2 className="size-5 animate-spin" /> Checking…
            </>
          ) : (
            <>
              {report ? 'Check another site' : 'Check my website'} <ArrowRight className="size-5" />
            </>
          )}
        </button>
      </form>
      {stage === 'idle' && !compact && (
        <p className="mt-3 text-[#9AA3AF] text-base">
          Free, and nothing to sign up to. Takes under a minute. You’ll see your score here, then choose whether you want the PDF.
        </p>
      )}

      {/* Running */}
      {stage === 'running' && (
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0B0D10]/80 p-6 sm:p-8" aria-live="polite">
          <div className="flex items-baseline justify-between mb-5">
            <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-lg">Checking {domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}</p>
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[#9AA3AF] tabular-nums">{elapsed}s</p>
          </div>
          <ul className="space-y-3">
            {STEPS.map((label, i) => (
              <li key={label} className={`flex items-center gap-3 text-base transition-colors duration-500 ${i < step ? 'text-[#9AA3AF]' : i === step ? 'text-white' : 'text-white/25'}`}>
                <span className="size-5 grid place-items-center shrink-0">
                  {i < step ? <Check className="size-4 text-[#3DD68C]" /> : i === step ? <Loader2 className="size-4 animate-spin text-[#40E0FF]" /> : <span className="size-1.5 rounded-full bg-white/20" />}
                </span>
                {label}
              </li>
            ))}
          </ul>
          {elapsed > 45 && <p className="mt-5 text-[#9AA3AF] text-base">Bigger sites take a little longer. Nearly there.</p>}
        </div>
      )}

      {stage === 'error' && (
        <div className="mt-6 rounded-xl border border-[#FF5A5F]/30 bg-[#FF5A5F]/[0.06] p-5 text-[#F5F7FA] text-base">
          {error}
        </div>
      )}

      {/* Result */}
      {stage === 'done' && report && (
        <div ref={resultRef} className="mt-10 scroll-mt-28">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0D10]/85 p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <Gauge score={report.score} />
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] uppercase mb-2" style={{ color: scoreColour(report.score) }}>
                  {BAND_WORD[report.band]} · {report.domain}
                </p>
                <p className="font-[family-name:var(--font-sora)] text-2xl sm:text-[28px] font-semibold text-white leading-snug">{report.headline}</p>
                <p className="mt-3 text-[#9AA3AF] text-base">
                  {report.pagesChecked} pages checked ·{' '}
                  {(['error', 'warning', 'notice'] as Severity[]).map((k, i) => (
                    <span key={k}>
                      {i > 0 && ' · '}
                      <span className={SEV[k].text}>
                        {report.counts[k]} {SEV[k].label.toLowerCase()}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-4">{report.issues.length ? 'Fix these first' : 'Nothing urgent'}</h3>
                <ol className="space-y-3">
                  {report.issues.slice(0, 3).map((i, n) => (
                    <li key={i.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-[family-name:var(--font-sora)] text-white/25 font-bold text-xl leading-none">{n + 1}</span>
                        <span className={`inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.1em] uppercase ${SEV[i.severity].text}`}>
                          <span className={`size-1.5 rounded-full ${SEV[i.severity].dot}`} />
                          {SEV[i.severity].label}
                        </span>
                        {i.count > 1 && <span className="text-[#768393] text-[14px]">{i.count} pages</span>}
                      </div>
                      <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[17px]">{i.title}</p>
                      <p className="mt-1 text-[#9AA3AF] text-base leading-relaxed">{i.why}</p>
                    </li>
                  ))}
                </ol>
                {report.issues.length > 3 && (
                  <p className="mt-4 text-[#9AA3AF] text-base">
                    …and {report.issues.length - 3} more in the full report, each with the pages affected and what to do.
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-4">By area</h3>
                <div className="space-y-4">
                  {report.categories.map((c) => (
                    <div key={c.id}>
                      <div className="flex justify-between text-base mb-1.5">
                        <span className="text-[#C4CAD3]">{c.label}</span>
                        <span className="font-semibold tabular-nums" style={{ color: c.tested ? scoreColour(c.score) : '#768393' }}>
                          {c.tested ? c.score : c.id === 'speed' ? 'Not tested' : 'Not checked'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                        {c.tested && <div className="h-full rounded-full" style={{ width: `${Math.max(c.score, 2)}%`, background: scoreColour(c.score) }} />}
                      </div>
                    </div>
                  ))}
                </div>
                {report.limits.length > 0 && <p className="mt-5 text-[14px] text-[#F7BD5A] leading-relaxed">{report.limits[0]}</p>}
              </div>
            </div>
          </div>

          {/* PDF */}
          <div className="mt-6 rounded-2xl border border-[#40E0FF]/25 bg-[#0B0D10]/85 p-6 sm:p-10 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
            {sent ? (
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-[#3DD68C]/10 grid place-items-center shrink-0">
                  <Check className="size-5 text-[#3DD68C]" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-sora)] text-xl font-bold text-white">Your report has downloaded</p>
                  <p className="mt-1 text-[#9AA3AF] text-base leading-relaxed">
                    {sent.emailed
                      ? `We’ve emailed a copy to ${email} too. If it’s not there in a few minutes, check your junk folder.`
                      : 'We couldn’t email a copy this time, but the download has everything in it.'}{' '}
                    Want to talk it through? Ring <a href="tel:01752845258" className="text-[#40E0FF] underline-offset-4 hover:underline">01752 845258</a>.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
                  <div>
                    <p className="font-[family-name:var(--font-sora)] text-2xl font-bold text-white">Get the full report as a PDF</p>
                    <p className="mt-1 text-[#9AA3AF] text-base max-w-xl">
                      Every finding, the pages it affects and what to do about it, plus Google’s speed timings. Easy to forward to whoever looks after your site.
                    </p>
                  </div>
                </div>
                <form onSubmit={getPdf} className="grid gap-3 sm:grid-cols-[1fr_1.3fr_auto]">
                  <label className="sr-only" htmlFor="hc-name">Your name</label>
                  <input id="hc-name" className={field} placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                  <label className="sr-only" htmlFor="hc-email">Email</label>
                  <input id="hc-email" className={field} placeholder="you@yourbusiness.co.uk" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center justify-center gap-2 bg-[#40E0FF] hover:bg-[#7AEAFF] disabled:opacity-60 text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-[16px] px-6 py-3.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {sending ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
                    {sending ? 'Building PDF…' : 'Get my PDF'}
                  </button>
                </form>
                <p className="mt-3 flex items-center gap-2 text-[14px] text-[#768393]">
                  <Mail className="size-4" /> We’ll email you a copy and may follow up once. No mailing list.
                </p>
                {sendError && <p className="mt-3 text-[#FF8A8E] text-base">{sendError}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
