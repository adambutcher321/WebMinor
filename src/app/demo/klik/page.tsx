'use client';

import { Anton, Inter } from 'next/font/google';
import { useLenisScrollTrigger } from '@/hooks/useLenisScrollTrigger';
import { useEffect, useState } from 'react';
import styles from './klik.module.css';
import Preloader from './motion/Preloader';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import { Send, Split, Tap } from './sections/Story';
import CardSection from './sections/Card';
import Travel from './sections/Travel';
import Pots from './sections/Pots';
import Spending from './sections/Spending';
import { Stats, Security, FinalCta, Footer } from './sections/Close';
import { HowItWorks, Fees } from './sections/Paper';

/**
 * Display is Anton — a heavy condensed grotesk that holds at the sizes the bar demands
 * (M2: headlines at 60%+ of viewport width, leading <= 0.92). UI is Inter.
 */
const display = Anton({
  variable: '--font-klik-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const ui = Inter({
  variable: '--font-klik-ui',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function Klik() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useLenisScrollTrigger({ enabled: !reduced });

  return (
    <div
      className={`${styles.page} ${display.variable} ${ui.variable}`}
      style={
        {
          '--tag-url': "url('/demo/klik/tag.svg')",
          '--grain-url': "url('/demo/klik/grain.png')",
        } as React.CSSProperties
      }
    >
      <Preloader />

      <div className={styles.tagGround} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <Nav />

      <main>
        <Hero />
        <Send />
        <Split />
        <Tap />
        <HowItWorks />
        <CardSection />
        <Travel />
        <Pots />
        <Spending />
        <Fees />
        <Stats />
        <Security />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
