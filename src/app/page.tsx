'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Script from 'next/script';
import LogoTicker from '@/components/sections/LogoTicker';
import Logo from '@/components/layout/Logo';
import Footer from '@/components/layout/Footer';

declare global {
  interface Window {
    mountScrollWorld?: (container: HTMLElement, config: Record<string, unknown>) => void;
  }
}

const QUICK_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

const SECTIONS = [
  {
    id: 'mission', label: 'Mission Control',
    still: '/world/mission.webp', clip: '/world/vid/mission.mp4', clipMobile: '/world/vid/mission-m.mp4',
    accent: '#40E0FF', scroll: 1.6, linger: 0.4,
    eyebrow: 'WebMinor', title: "We Don't Build Websites. We Launch Businesses.",
    body: 'Every project starts in mission control — planned, fuelled, and ready for liftoff.',
    tags: [] as string[],
  },
  {
    id: 'design', label: 'The Design Bay',
    still: '/world/design.webp', clip: '/world/vid/design.mp4', clipMobile: '/world/vid/design-m.mp4',
    accent: '#5B3DF0',
    eyebrow: 'Website Design', title: 'Premium Websites, Engineered Like Hardware.',
    body: 'Wireframes become fully working websites, built to hold under real traffic.',
    tags: ['Custom design', 'Built for speed'],
  },
  {
    id: 'cargo', label: 'The Cargo Bay',
    still: '/world/cargo.webp', clip: '/world/vid/cargo.mp4', clipMobile: '/world/vid/cargo-m.mp4',
    accent: '#2563EB',
    eyebrow: 'Ecommerce', title: 'Ecommerce That Loads Fast And Sells Faster.',
    body: 'Every product finds its way from the shelf to the checkout without friction.',
    tags: ['Fast checkout', 'Built to scale'],
  },
  {
    id: 'core', label: 'The AI Core',
    still: '/world/core.webp', clip: '/world/vid/core.mp4', clipMobile: '/world/vid/core-m.mp4',
    accent: '#5B3DF0',
    eyebrow: 'AI Automation + CRM', title: 'Automation And CRM On Autopilot.',
    body: 'Leads, follow-ups, and workflows run themselves while you focus on the work.',
    tags: ['AI Automation', 'CRM'],
  },
  {
    id: 'signal', label: 'The Signal Tower',
    still: '/world/signal.webp', clip: '/world/vid/signal.mp4', clipMobile: '/world/vid/signal-m.mp4',
    accent: '#40E0FF',
    eyebrow: 'SEO', title: 'SEO That Gets You Found In The Dark.',
    body: 'Your business shows up exactly where people are already looking.',
    tags: ['SEO', 'Local search'],
  },
  {
    id: 'finale', label: 'Deep Space',
    still: '/world/finale.webp', clip: '/world/vid/finale.mp4', clipMobile: '/world/vid/finale-m.mp4',
    accent: '#2563EB', scroll: 1.6, linger: 0.35,
    eyebrow: 'Branding + Marketing', title: 'Branding And Marketing That Reach Further.',
    body: 'One consistent identity, carried across every channel that matters.',
    tags: [] as string[],
    cta: {
      primary: { label: 'Launch Your Project', href: '/contact' },
      secondary: { label: 'See Pricing', href: '/pricing' },
    },
  },
];

const CONNECTORS = [
  '/world/vid/conn1.mp4',
  '/world/vid/conn2.mp4',
  '/world/vid/conn3.mp4',
  '/world/vid/conn4.mp4',
  '/world/vid/conn5.mp4',
];

const CONNECTORS_MOBILE = [
  '/world/vid/conn1-m.mp4',
  '/world/vid/conn2-m.mp4',
  '/world/vid/conn3-m.mp4',
  '/world/vid/conn4-m.mp4',
  '/world/vid/conn5-m.mp4',
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const engineReadyRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function alignQuicklinks() {
    const cta = document.querySelector('.sw-topcta') as HTMLElement | null;
    const nav = navRef.current;
    const logo = logoRef.current;
    if (!cta) return;
    const ctaRect = cta.getBoundingClientRect();
    if (nav) {
      const navRect = nav.getBoundingClientRect();
      nav.style.top = `${ctaRect.top + (ctaRect.height - navRect.height) / 2}px`;
    }
    if (logo) {
      const logoRect = logo.getBoundingClientRect();
      logo.style.top = `${ctaRect.top + (ctaRect.height - logoRect.height) / 2}px`;
    }
  }

  useEffect(() => {
    window.addEventListener('resize', alignQuicklinks);
    return () => window.removeEventListener('resize', alignQuicklinks);
  }, []);

  function mount() {
    if (mountedRef.current || !engineReadyRef.current) return;
    const container = containerRef.current;
    if (!container || !window.mountScrollWorld) return;
    mountedRef.current = true;

    window.mountScrollWorld(container, {
      cta: { label: 'Contact Us', href: '/contact' },
      nav: false,
      hint: 'scroll to fly in',
      diveScroll: 1.3,
      connScroll: 0.9,
      sections: SECTIONS,
      connectors: CONNECTORS,
      connectorsMobile: CONNECTORS_MOBILE,
    });
    requestAnimationFrame(alignQuicklinks);
  }

  useEffect(() => {
    if (window.mountScrollWorld) {
      engineReadyRef.current = true;
      mount();
    }
    return () => {
      // The engine injects a global <style id="sw-css"> into <head> that Next's
      // client-side router won't clean up on navigation — remove it ourselves so
      // no scroll-world CSS can leak onto other pages in the same SPA session.
      document.getElementById('sw-css')?.remove();
    };
  }, []);

  return (
    <>
      {/*
        The scroll-world experience below is built entirely client-side by a
        vanilla-JS canvas/video engine, so a crawler or AI bot that doesn't
        execute JS (many don't) would otherwise see none of this page's actual
        copy. This block is the same real content, visually hidden but present
        in the server-rendered HTML and accessibility tree, so it's genuinely
        crawlable rather than a JS-only page.
      */}
      <div className="sr-only">
        <h1>{SECTIONS[0].title}</h1>
        {SECTIONS.map((s) => (
          <section key={s.id} aria-label={s.label}>
            <h2>{s.eyebrow}: {s.title}</h2>
            <p>{s.body}</p>
            {s.tags.length > 0 && (
              <ul>
                {s.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </section>
        ))}
        <Link href="/contact">Launch Your Project</Link>
        <Link href="/pricing">See Pricing</Link>
      </div>
      <Script
        src="/world/scrub-engine.js"
        strategy="afterInteractive"
        onReady={() => { engineReadyRef.current = true; mount(); }}
        onLoad={() => { engineReadyRef.current = true; mount(); }}
      />
      <style>{`
        .sw-topcta, .sw-btn--primary {
          background: #40E0FF !important;
          color: #0B1D3A !important;
        }
        .sw-topcta { margin-left: auto !important; }
        .sw-route__label { background: var(--sw-accent) !important; color: #0B0D10 !important; border-color: transparent !important; }
        .world-quicklink { transition: color .2s, background .2s; }
        .world-quicklink:hover { color: #F5F7FA !important; background: rgba(255,255,255,0.08); }
        @media (max-width: 860px) {
          .world-quicklinks { display: none !important; }
        }
      `}</style>
      <div
        ref={logoRef}
        style={{ position: 'fixed', top: 'clamp(14px,2.4vw,26px)', left: 'clamp(18px,5vw,64px)', zIndex: 210 }}
      >
        <Logo />
      </div>
      <nav
        ref={navRef}
        className="world-quicklinks"
        style={{
          position: 'fixed', top: 'clamp(14px,2.4vw,26px)', right: 'clamp(90px,16vw,220px)',
          zIndex: 200, display: 'flex', gap: '4px', padding: '5px',
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(64,224,255,0.16)', borderRadius: '999px',
          alignItems: 'center',
        }}
      >
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="world-quicklink"
            style={{
              fontSize: '0.82rem', color: '#C9D3DC', textDecoration: 'none',
              padding: '7px 14px', borderRadius: '999px',
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div
        id="world"
        ref={containerRef}
        style={{
          '--sw-bg': '#0B0D10',
          '--sw-ink': '#F5F7FA',
          '--sw-ink-soft': '#9AA3AF',
          '--sw-accent': '#40E0FF',
        } as React.CSSProperties}
      />
      {mounted && createPortal(
        <div className="relative bg-[#0B0D10]" style={{ zIndex: 45 }}>
          <div
            className="absolute inset-x-0 top-0 h-[140vh] pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(11,13,16,0.25) 20%, rgba(11,13,16,0.55) 38%, rgba(11,13,16,0.8) 55%, #0B0D10 75%, #0B0D10 100%)',
            }}
          />
          <div className="relative flex flex-col items-center gap-6 pt-64 pb-16">
            <p className="font-[family-name:var(--font-mono)] text-xs text-[#9AA3AF] tracking-[0.2em] uppercase">
              Built With
            </p>
            <LogoTicker />
          </div>
          <Footer force />
        </div>,
        document.body
      )}
    </>
  );
}
