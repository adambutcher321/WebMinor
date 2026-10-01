'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { Star } from 'lucide-react';

// Google Preferred Sources: lets a reader pick WebMinor as a source Google
// should favour in Top Stories, AI Overviews and AI Mode.
// https://developers.google.com/search/docs/appearance/preferred-sources
//
// Uses Google's "manual" mode so the button can match the site instead of
// Google's own styling. It is a real link to the preferences page, so it still
// works if the script is blocked or hasn't loaded yet; once the script is
// ready, a click opens Google's in-page confirmation and the reader stays here.
const DEEPLINK = 'https://www.google.com/preferences/source?q=webminor.co.uk';

type PreferredSource = {
  init: (opts: { theme: 'light' | 'dark'; lang: string }) => void;
  addPreferredSource: () => void;
};

declare global {
  interface Window {
    PREFERRED_SOURCE?: Array<(ps: PreferredSource) => void>;
  }
}

// Shared across every button on the page so Google's script is set up once.
let api: PreferredSource | null = null;
let queued = false;

export default function PreferredSourceButton({ className = '' }: { className?: string }) {
  useEffect(() => {
    if (queued) return;
    queued = true;
    (window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []).push((ps) => {
      ps.init({ theme: 'dark', lang: 'en' });
      api = ps;
    });
  }, []);

  return (
    <>
      <Script
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="lazyOnload"
        preferred-sources-control="manual"
      />
      <a
        href={DEEPLINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!api) return;
          e.preventDefault();
          api.addPreferredSource();
        }}
        className={`group inline-flex whitespace-nowrap items-center gap-2.5 rounded-lg border border-[#40E0FF]/10 bg-[#40E0FF]/[0.06] px-3.5 py-2 text-sm text-[#9AA3AF] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#40E0FF]/40 hover:text-[#F5F7FA] focus-visible:border-[#40E0FF] focus-visible:text-[#F5F7FA] active:translate-y-0 active:scale-95 ${className}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Star className="size-4 shrink-0 text-[#40E0FF] transition-colors group-hover:fill-[#40E0FF]" aria-hidden="true" />
        Add as a preferred source on Google
      </a>
    </>
  );
}
