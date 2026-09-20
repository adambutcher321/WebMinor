'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Script from 'next/script';
import LogoTicker from '@/components/sections/LogoTicker';
import Footer from '@/components/layout/Footer';
import { LocalBusinessSchema } from '@/components/seo/JsonLd';
import styles from './home.module.css';

declare global {
  interface Window {
    mountScrollWorld?: (container: HTMLElement, config: Record<string, unknown>) => void;
  }
}


/*
  Scroll budget. `scroll` is viewport-heights of scrolling per camera flight and
  `linger` remaps that scroll to time so the camera settles mid-scene, where the
  copy peaks, and moves quicker at the seams.

  These two knobs are what hold the page to its length budget
  (webminor-design-system.md §6: 10 viewports). The previous values — 1.3/1.6
  per dive and 0.9 per connector — spent 13.9 viewports on the flight alone.
  Dwell is bought with `linger` instead of with scroll distance: the camera now
  holds on each scene for about as long as it did before, inside two-thirds of
  the page height. Connectors are pure transit between scenes and carry no copy,
  so they are the cheapest thing on the page to shorten.
*/
const SECTIONS = [
  {
    id: 'mission', label: 'Mission Control',
    still: '/world/mission.webp', clip: '/world/vid/mission.mp4', clipMobile: '/world/vid/mission-m.mp4',
    accent: '#40E0FF', scroll: 1.05, linger: 0.45,
    eyebrow: 'WebMinor', title: "We Don't Build Websites. We Launch Businesses.",
    body: 'Every project starts in mission control — planned, fuelled, and ready for liftoff.',
    tags: [] as string[],
  },
  {
    id: 'design', label: 'The Design Bay',
    still: '/world/design.webp', clip: '/world/vid/design.mp4', clipMobile: '/world/vid/design-m.mp4',
    accent: '#5B3DF0', linger: 0.4,
    eyebrow: 'Website Design', title: 'Premium Websites, Engineered Like Hardware.',
    body: 'Wireframes become fully working websites, built to hold under real traffic.',
    tags: ['Custom design', 'Built for speed'],
  },
  {
    id: 'cargo', label: 'The Cargo Bay',
    still: '/world/cargo.webp', clip: '/world/vid/cargo.mp4', clipMobile: '/world/vid/cargo-m.mp4',
    accent: '#2563EB', linger: 0.4,
    eyebrow: 'Ecommerce', title: 'Ecommerce That Loads Fast And Sells Faster.',
    body: 'Every product finds its way from the shelf to the checkout without friction.',
    tags: ['Fast checkout', 'Built to scale'],
  },
  {
    id: 'core', label: 'The AI Core',
    still: '/world/core.webp', clip: '/world/vid/core.mp4', clipMobile: '/world/vid/core-m.mp4',
    accent: '#5B3DF0', linger: 0.4,
    eyebrow: 'AI Automation + CRM', title: 'Automation And CRM On Autopilot.',
    body: 'Leads, follow-ups, and workflows run themselves while you focus on the work.',
    tags: ['AI Automation', 'CRM'],
  },
  {
    id: 'signal', label: 'The Signal Tower',
    still: '/world/signal.webp', clip: '/world/vid/signal.mp4', clipMobile: '/world/vid/signal-m.mp4',
    accent: '#40E0FF', linger: 0.4,
    eyebrow: 'SEO', title: 'SEO That Gets You Found In The Dark.',
    body: 'Your business shows up exactly where people are already looking.',
    tags: ['SEO', 'Local search'],
  },
  {
    id: 'finale', label: 'Deep Space',
    still: '/world/finale.webp', clip: '/world/vid/finale.mp4', clipMobile: '/world/vid/finale-m.mp4',
    accent: '#2563EB', scroll: 1.05, linger: 0.4,
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

/*
  `document.body` doesn't exist during the server render, so the tail below has
  to wait for hydration before it can be portalled into it. Reading that as an
  external store rather than as `useState(false)` + `useEffect(setState(true))`
  keeps it to a single render pass: React takes the server snapshot while
  hydrating and the client snapshot afterwards, with no cascading re-render.
  `subscribe` is a module-level constant so it never re-subscribes.
*/
const noopSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const engineReadyRef = useRef(false);
  const hydrated = useSyncExternalStore(noopSubscribe, onClient, onServer);

  function mount() {
    if (mountedRef.current || !engineReadyRef.current) return;
    const container = containerRef.current;
    if (!container || !window.mountScrollWorld) return;
    mountedRef.current = true;

    window.mountScrollWorld(container, {
      // The engine's own topbar (brand / nav / filled CTA) is switched off:
      // this page renders its own header as plain text.
      nav: false,
      hint: 'scroll to fly in',
      diveScroll: 0.9,
      connScroll: 0.4,
      sections: SECTIONS,
      connectors: CONNECTORS,
      connectorsMobile: CONNECTORS_MOBILE,
    });
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
      <LocalBusinessSchema />
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
      <div
        id="world"
        className={styles.world}
        ref={containerRef}
        style={{
          '--sw-bg': '#0B0D10',
          '--sw-ink': '#F5F7FA',
          '--sw-ink-soft': '#9AA3AF',
          '--sw-accent': '#40E0FF',
          // The engine is framework-agnostic and defaults these to system
          // stacks (ui-rounded / -apple-system), which leaked two unintended
          // typefaces into the homepage. Point them at the site's own fonts.
          '--sw-font-display': 'var(--font-display)',
          '--sw-font-body': 'var(--font-display)',
        } as React.CSSProperties}
      />
      {hydrated && createPortal(
        <div className={styles.tail} style={{ zIndex: 45 }}>
          <div className={styles.strip}>
            <p className={styles.stripLabel}>Built With</p>
            <LogoTicker />
          </div>
          <Footer force />
        </div>,
        document.body
      )}
    </>
  );
}
