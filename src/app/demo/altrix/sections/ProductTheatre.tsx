'use client';

/*
 * ALTRIX — Piece 2, the product theatre.
 *
 * Three consecutive dark sections that magnify the object: the dial at 1:1,
 * the crown at 12:1, the strap anchor at 8:1. Each runs over 1.0vh and uses
 * three type tokens only — section (56), body (17), micro (12). The 96px
 * statement token belongs to the hero and does not appear here.
 *
 * Client component: the reveals are driven by IntersectionObserver rather
 * than a scroll listener, so nothing loops, autoplays or runs off a timer.
 *
 * Imagery note — the three source PNGs are photographed on a pure #000000
 * ground with specular highlights that touch #ffffff, and the palette rule
 * forbids both. summit-03.png (the hero) was remapped offline into
 * [#050507 … #248] before it shipped. These three are not remapped files, so
 * the same range compression is done at composite time instead:
 *
 *   filter: brightness(0.9725)  →  255 lands on 248
 *   mix-blend-mode: screen over --void  →  0 lands on exactly #050507
 *
 * The screen blend also dissolves each frame's black surround into the page
 * ground, so the objects float with no plate, pedestal, edge or reflection.
 */

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './product-theatre.module.css';

type RailProps = {
  index: string;
  name: string;
  scale: string;
};

function Rail({ index, name, scale }: RailProps) {
  return (
    <div className={styles.rail} data-reveal="">
      <span className={styles.railIndex}>{index}</span>
      <span className={styles.railName}>{name}</span>
      <span className={styles.railRule} aria-hidden="true" />
      <span className={styles.railLabel}>Scale</span>
      <span className={styles.railValue}>{scale}</span>
    </div>
  );
}

const MATERIALS = [
  { label: 'Crystal', value: '2.1', unit: 'mm' },
  { label: 'Seal', value: '10', unit: 'ATM' },
  { label: 'Bolt torque', value: '0.6', unit: 'N·m' },
  { label: 'Mass', value: '61', unit: 'g' },
];

export default function ProductTheatre() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.setAttribute('data-in', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // §7: motion resolves in one direction. Once in, it stays in.
          entry.target.setAttribute('data-in', 'true');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '-6% 0px -12% 0px', threshold: 0.01 },
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.theatre} ref={rootRef}>
      {/* ------------------------------------------------- 01 — the dial */}

      <section className={styles.section} id="technology" aria-labelledby="theatre-dial">
        <div className={styles.inner}>
          <Rail index="01" name="Dial" scale="1 : 1" />

          <h2 id="theatre-dial" className={`${styles.title} ${styles.titleCentred}`} data-reveal="">
            Altitude, before anything else.
          </h2>

          <div className={styles.stage}>
            <Image
              className={styles.dialShot}
              src="/demo/altrix/dial-front.webp"
              alt="The ALTRIX dial straight on, reading 8848 M above the word EVEREST, with O₂ 92% and ALT 8848 on the lower rim."
              width={2048}
              height={2048}
              unoptimized
              data-reveal=""
            />

            <span className={`${styles.anno} ${styles.annoLeft}`} data-reveal="">
              <span className={styles.annoText}>Grade-5 titanium</span>
              <span className={styles.annoLine} aria-hidden="true" />
            </span>

            <span className={`${styles.anno} ${styles.annoRight}`} data-reveal="">
              <span className={styles.annoLine} aria-hidden="true" />
              <span className={styles.annoText}>Ember crown</span>
            </span>
          </div>

          {/* §2/§5: two-tone inside one paragraph — bone lead, ash continuation. */}
          <p className={`${styles.copy} ${styles.copyCentred}`} data-reveal="">
            <strong className={styles.lead}>The dial gives one number priority.</strong> A 35 mm
            sapphire face carries the altimeter at 480 nits and pushes every secondary readout out
            to the rim, so the figure that decides whether you keep climbing is the first one you
            see.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ 02 — the crown */}

      <section className={`${styles.section} ${styles.sectionFlush}`} aria-labelledby="theatre-crown">
        <div className={styles.inner}>
          <Rail index="02" name="Crown" scale="12 : 1" />

          <div className={styles.split}>
            <h2 id="theatre-crown" className={styles.title} data-reveal="">
              Turned with mittens on.
            </h2>

            <div className={styles.splitAside}>
              <p className={styles.copy} data-reveal="">
                <strong className={styles.lead}>The crown is knurled, not textured.</strong> Twelve
                detents give a click you can feel through a down mitt, and a screw-down collar seals
                the case to 10 ATM, so the mechanism keeps its bearing after a night at −41 °C.
              </p>

              <a className={styles.action} href="#specifications" data-reveal="">
                Case construction
                <svg className={styles.actionArrow} viewBox="0 0 20 10" fill="none" aria-hidden="true">
                  <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.band} data-reveal="">
          <Image
            className={styles.bandShot}
            src="/demo/altrix/macro-crown.webp"
            alt="Macro of the ember knurled crown seated in the brushed titanium case flank."
            width={2688}
            height={1520}
            unoptimized
          />
        </div>
      </section>

      {/* ----------------------------------------------- 03 — the anchor */}

      <section className={`${styles.section} ${styles.sectionFlush}`} aria-labelledby="theatre-anchor">
        <div className={styles.inner}>
          <Rail index="03" name="Anchor" scale="8 : 1" />
        </div>

        {/* §6: the one permitted divergence — a full-bleed olive plane.
            Bone text only; ember never touches it. */}
        <div className={styles.plane}>
          <div className={styles.inner}>
            <h2 id="theatre-anchor" className={styles.title} data-reveal="">
              Nothing here is glued.
            </h2>
          </div>
        </div>

        <div className={styles.anchorRow}>
          <div className={styles.anchorText}>
            <p className={styles.copy} data-reveal="">
              <strong className={styles.lead}>The strap bolts to the case.</strong> Two hex
              fasteners in the same grade-5 titanium pass through the lug and thread into the case
              body, so a torn strap is a two-minute job at base camp with a 2 mm key rather than a
              watch that goes back to a workshop.
            </p>

            <dl className={styles.materials} data-reveal="">
              {MATERIALS.map((item) => (
                <div className={styles.readout} key={item.label}>
                  <dt className={styles.readoutLabel}>{item.label}</dt>
                  <dd className={styles.readoutValue}>
                    {item.value} <span className={styles.readoutUnit}>{item.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.anchorShot} data-reveal="">
            <Image
              className={styles.bandShot}
              src="/demo/altrix/macro-strap.webp"
              alt="Macro of the strap, lug and hex bolt in near-monochrome, a single ember glint on the bolt head."
              width={2688}
              height={1520}
              unoptimized
            />
          </div>
        </div>
      </section>
    </div>
  );
}
