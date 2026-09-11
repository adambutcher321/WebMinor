'use client';

/*
 * ALTRIX — altitude and capability band.
 *
 * Two consecutive dark sections that sit in the middle of the page:
 *
 *   1. ASCENT     full-bleed documentary frame, an altimeter tape under it,
 *                 and the instrument rail on a full-bleed --olive ground.
 *   2. CAPABILITY a horizontal card track whose cards bleed off the right
 *                 edge to signal scrollability (bar.md §7).
 *
 * The hero's rail (9000 m / −41 °C / 120 h) is hidden under 640px because it
 * collides with the product. Those three readouts are re-homed here, on the
 * olive ground, and they survive at every width — the rail wraps rather than
 * disappearing.
 *
 * Client component: the readouts and the tape are scroll-driven, and the card
 * track reports its own scroll position. Everything is a pure function of
 * scroll offset — nothing autoplays, nothing loops (design-system §7).
 */

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './altitude-band.module.css';

/* Certified ceiling in metres. The tape is graduated every 500 m. */
const CEILING = 9000;
const TICKS = Array.from({ length: CEILING / 500 + 1 }, (_, i) => i * 500);
const MAJOR = 1500;

/* Start of each sweep. Altitude climbs from sea level, ambient temperature
   falls from the freezing point, autonomy accumulates. */
const FLOOR_C = -41;
const START_C = 6;
const AUTONOMY_H = 120;

const CAPABILITIES = [
  {
    kicker: 'Positioning',
    figure: 'L1+L5',
    unit: '',
    lead: 'Two frequencies, one fix.',
    body: ' The second civil band rejects the multipath a rock wall throws back at a single-band receiver, so the track logged inside a couloir is the line that was actually climbed.',
  },
  {
    kicker: 'Altimetry',
    figure: '±1',
    unit: 'm',
    lead: 'Pressure first, satellites second.',
    body: ' A sealed barometric cell resolves a single metre of gain and recalibrates against GNSS altitude at every rest, so the ascent total is honest by the time it is written down.',
  },
  {
    kicker: 'Autonomy',
    figure: '120',
    unit: 'h',
    lead: 'Five days between charges.',
    body: ' Expedition mode drops sampling to a one-second cadence and hands the load back to the solar ring, which carries a summit push and the long descent that follows it.',
  },
  {
    kicker: 'Thermal',
    figure: '−41',
    unit: '°C',
    lead: 'Qualified as one assembly.',
    body: ' The display driver and the cell are cold-tested together rather than separately, so the screen still redraws at the temperature where a battery would normally have stopped answering.',
  },
  {
    kicker: 'Legibility',
    figure: '2000',
    unit: 'nit',
    lead: 'Readable against glacier glare.',
    body: ' Peak brightness is held for the whole daylight range and the altimeter face falls back to a high-contrast layout, so a reading can be taken through goggles without stopping to shade the dial.',
  },
];

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function AltitudeBand() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const autonomyRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- reveal ------------------------------------------------------ *
     * Server output carries data-inview="true", so no-JS and reduced
     * motion both render the resolved end state (§7). Only elements that
     * are still below the fold at mount are armed, so nothing that is
     * already on screen can flash. */
    let observer: IntersectionObserver | undefined;
    if (!reduced) {
      const vh = window.innerHeight;
      const pending = Array.from(
        root.querySelectorAll<HTMLElement>('[data-reveal]'),
      ).filter((el) => el.getBoundingClientRect().top > vh * 0.88);

      pending.forEach((el) => {
        el.dataset.inview = 'false';
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            (entry.target as HTMLElement).dataset.inview = 'true';
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      pending.forEach((el) => observer?.observe(el));
    }

    /* ---- card track -------------------------------------------------- */
    const track = trackRef.current;

    const readTrack = () => {
      if (!track) return;
      const span = track.scrollWidth - track.clientWidth;
      const fraction = span > 0 ? clamp(track.scrollLeft / span) : 0;
      const visible = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;

      if (thumbRef.current) {
        const width = Math.min(1, visible) * 100;
        thumbRef.current.style.width = `${width}%`;
        thumbRef.current.style.transform = `translateX(${
          (fraction * (100 - width) * 100) / Math.max(width, 0.001)
        }%)`;
      }

      /* Position readout, mapped off the same fraction as the bar so the two
         agree and the counter actually reaches the last card. */
      const cards = Array.from(track.children) as HTMLElement[];
      const active = Math.round(fraction * (cards.length - 1));
      cards.forEach((card, i) => {
        card.dataset.active = String(i === active);
      });
      if (counterRef.current) {
        counterRef.current.textContent = `${String(active + 1).padStart(2, '0')} / ${String(
          cards.length,
        ).padStart(2, '0')}`;
      }
    };

    /* ---- scroll-driven ascent ---------------------------------------- *
     * The altimeter only ever climbs: progress is latched at its peak, so
     * the sweep resolves in one direction and never springs back (§7). */
    let peak = 0;
    let queued = false;

    const paint = () => {
      queued = false;
      const vh = window.innerHeight;

      if (scaleRef.current) {
        const rect = scaleRef.current.getBoundingClientRect();
        const p = clamp((vh - rect.top) / (vh * 0.55));
        if (p > peak) peak = p;
      }

      /* ease-out, monotonic, no overshoot */
      const e = 1 - (1 - peak) * (1 - peak);
      const pct = e * 100;

      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      if (markerRef.current) markerRef.current.style.left = `${pct}%`;
      if (altRef.current) {
        altRef.current.textContent = String(Math.round((CEILING * e) / 5) * 5);
      }
      if (tempRef.current) {
        const c = Math.round(START_C + (FLOOR_C - START_C) * e);
        tempRef.current.textContent = c < 0 ? `−${Math.abs(c)}` : String(c);
      }
      if (autonomyRef.current) {
        autonomyRef.current.textContent = String(Math.round(AUTONOMY_H * e));
      }

      if (parallaxRef.current && frameRef.current) {
        const rect = frameRef.current.getBoundingClientRect();
        const passage = clamp((vh - rect.top) / (vh + rect.height));
        parallaxRef.current.style.transform = `translate3d(0, ${(0.5 - passage) * 4}%, 0)`;
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    readTrack();
    track?.addEventListener('scroll', readTrack, { passive: true });
    window.addEventListener('resize', readTrack);

    if (!reduced) {
      paint();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }

    return () => {
      observer?.disconnect();
      track?.removeEventListener('scroll', readTrack);
      window.removeEventListener('resize', readTrack);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* #expeditions is the nav's fourth anchor; #technology belongs to the
     product theatre, which sits above this band. */
  return (
    <div className={styles.band} ref={rootRef} id="expeditions">
      {/* ------------------------------------------------------- ascent */}
      <section className={styles.ascent} aria-labelledby="altrix-ascent-heading">
        <div className={styles.head}>
          <div className={styles.headLeft} data-reveal="" data-inview="true">
            <p className={styles.eyebrow}>Ascent profile</p>
            <h2 className={styles.heading} id="altrix-ascent-heading">
              Certified to nine thousand metres.
            </h2>
          </div>

          <p className={styles.copy} data-reveal="" data-inview="true">
            <strong className={styles.lead}>The altimeter is the last instrument to lie.</strong>{' '}
            A sealed barometric cell is cross-checked against dual-frequency GNSS on
            every sample, so the ascent rate read off the ridge is the ascent rate
            climbed — not a smoothed guess made for you at sea level.
          </p>
        </div>

        {/*
          bar.md §3 — the world is greyscale and the watch display is the only
          saturated thing in the frame. This is the whole mechanism, so the
          frame runs full-bleed and carries no overlay: a scrim would be a
          gradient, and gradients are forbidden.

          unoptimized: the image pipeline re-encodes to lossy WebP, which
          crushes the frame's near-black shadow down to #000000 and the dial's
          ember with it. The PNG is served exactly as authored, matching the
          precedent set by the hero product shot.
        */}
        <div className={styles.frame} ref={frameRef} data-reveal="" data-inview="true">
          <div className={styles.parallax} ref={parallaxRef}>
            <Image
              className={styles.photo}
              src="/demo/altrix/lifestyle-summit.webp"
              alt="A climber's wrist on a summit ridge at first light, the whole frame monochrome except the ALTRIX altimeter face reading 4,328 metres and the ember crown beside it."
              fill
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>

        {/* Altimeter tape. Graduated every 500 m, labelled every 1500 m. The
            fill and the marker are driven by scroll position, not by time. */}
        <div className={styles.scale} ref={scaleRef} aria-hidden="true">
          <span className={styles.scaleLine} />
          <span className={styles.scaleFill} ref={fillRef} />
          {TICKS.map((t) => (
            <span
              key={t}
              className={styles.tick}
              data-major={t % MAJOR === 0 ? 'true' : 'false'}
              data-edge={t === 0 ? 'start' : t === CEILING ? 'end' : ''}
              style={{ left: `${(t / CEILING) * 100}%` }}
            >
              {t % MAJOR === 0 ? <span className={styles.tickLabel}>{t}</span> : null}
            </span>
          ))}
          <span className={styles.marker} ref={markerRef} />
        </div>

        {/* §6 — the one permitted divergence: a full-bleed olive plane. Olive
            planes carry bone text only; ember measures 2.12:1 here and never
            touches it. Hierarchy is size, family and weight instead. */}
        <div className={styles.plane}>
          <dl className={styles.rail} data-reveal="" data-inview="true">
            <div className={styles.readout}>
              <dt className={styles.readoutLabel}>Certified ceiling</dt>
              <dd className={styles.readoutValue}>
                <span ref={altRef}>{CEILING}</span>
                <span className={styles.readoutUnit}>m</span>
              </dd>
            </div>

            <div className={styles.readout}>
              <dt className={styles.readoutLabel}>Operating floor</dt>
              <dd className={styles.readoutValue}>
                <span ref={tempRef}>{'−'}41</span>
                <span className={styles.readoutUnit}>°C</span>
              </dd>
            </div>

            <div className={styles.readout}>
              <dt className={styles.readoutLabel}>Autonomy</dt>
              <dd className={styles.readoutValue}>
                <span ref={autonomyRef}>{AUTONOMY_H}</span>
                <span className={styles.readoutUnit}>h</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* --------------------------------------------------- capability */}
      <section className={styles.capability} aria-labelledby="altrix-capability-heading">
        <div className={styles.head}>
          <div className={styles.headLeft} data-reveal="" data-inview="true">
            <p className={styles.eyebrow}>Capability</p>
            <h2 className={styles.heading} id="altrix-capability-heading">
              Five systems. One instrument.
            </h2>
          </div>

          <p className={styles.copy} data-reveal="" data-inview="true">
            <strong className={styles.lead}>Nothing here is a companion feature.</strong>{' '}
            Every subsystem runs on the watch itself, with no phone in the loop and
            no cell service assumed, because above the last camp neither one of them
            is coming with you.
          </p>
        </div>

        {/* bar.md §7 — cards bleed off the right edge to signal scrollability. */}
        <div className={styles.track} ref={trackRef} tabIndex={0} role="group" aria-label="Capabilities">
          {CAPABILITIES.map((c, i) => (
            <article
              className={styles.card}
              key={c.kicker}
              data-reveal=""
              data-inview="true"
              data-active={i === 0 ? 'true' : 'false'}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className={styles.cardTop}>
                <p className={styles.cardKicker}>{c.kicker}</p>
                <p className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</p>
              </div>

              <p className={styles.cardFigure}>
                {c.figure}
                {c.unit ? <span className={styles.cardUnit}>{c.unit}</span> : null}
              </p>

              <p className={styles.cardCopy}>
                <strong className={styles.lead}>{c.lead}</strong>
                {c.body}
              </p>
            </article>
          ))}
        </div>

        {/* The single ember in this section: ember is the interactive colour,
            and the track is the only interactive thing on the band. */}
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressTrack}>
            <span className={styles.progressThumb} ref={thumbRef} />
          </span>
          <span className={styles.counter} ref={counterRef}>
            01 / {String(CAPABILITIES.length).padStart(2, '0')}
          </span>
        </div>
      </section>
    </div>
  );
}
