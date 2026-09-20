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
    eyebrow: 'WebMinor · Saltash, Cornwall', title: 'Your website, designed free.',
    body: 'Hosting is £50 a month plus VAT. That gets you a home page, a contact page and an about page, usually live within five working days of getting your words and photos.',
    tags: [] as string[],
  },
  {
    id: 'design', label: 'The Design Bay',
    still: '/world/design.webp', clip: '/world/vid/design.mp4', clipMobile: '/world/vid/design-m.mp4',
    accent: '#5B3DF0', linger: 0.4,
    eyebrow: 'Website design', title: 'See your home page before you pay.',
    body: 'Your home page gets designed first and sent to you as a private link. Like it and the rest is built. If you don\u2019t, you owe nothing.',
    tags: ['Designed in Saltash', 'Yours to keep'],
  },
  {
    id: 'cargo', label: 'The Cargo Bay',
    still: '/world/cargo.webp', clip: '/world/vid/cargo.mp4', clipMobile: '/world/vid/cargo-m.mp4',
    accent: '#2563EB', linger: 0.4,
    eyebrow: 'Online shops', title: 'Selling online? The shop is built around your stock.',
    body: 'Shops are quoted per job, because forty products and four thousand are different builds. There are two on the work page to click through.',
    tags: ['Quoted per job'],
  },
  {
    id: 'core', label: 'The AI Core',
    still: '/world/core.webp', clip: '/world/vid/core.mp4', clipMobile: '/world/vid/core-m.mp4',
    accent: '#5B3DF0', linger: 0.4,
    eyebrow: 'Enquiries', title: 'Every enquiry lands on your phone.',
    body: 'The Growth plan adds click-to-call and WhatsApp buttons, so a customer standing on a driveway in Torpoint reaches you in one tap.',
    tags: ['Click-to-call', 'WhatsApp'],
  },
  {
    id: 'signal', label: 'The Signal Tower',
    still: '/world/signal.webp', clip: '/world/vid/signal.mp4', clipMobile: '/world/vid/signal-m.mp4',
    accent: '#40E0FF', linger: 0.4,
    eyebrow: 'Local SEO', title: 'Found by people in Saltash, not people in Swindon.',
    body: 'Local SEO and a properly set up Google Business Profile put you in front of people nearby who are searching for what you do.',
    tags: ['Local SEO', 'Google Business Profile'],
  },
  {
    id: 'finale', label: 'Deep Space',
    still: '/world/finale.webp', clip: '/world/vid/finale.mp4', clipMobile: '/world/vid/finale-m.mp4',
    accent: '#2563EB', scroll: 1.05, linger: 0.4,
    eyebrow: 'Since 1999', title: 'Twenty-five years of making things look right.',
    body: 'One person designs it, builds it and picks up the phone. Bigger projects and bespoke builds are quoted separately.',
    tags: [] as string[],
    cta: {
      primary: { label: 'Claim your free design', href: '/contact' },
      secondary: { label: 'See pricing', href: '/pricing' },
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
            <p className={styles.stripLabel}>The short version</p>
            <LogoTicker />
          </div>
          <Footer force />
        </div>,
        document.body
      )}
    </>
  );
}
