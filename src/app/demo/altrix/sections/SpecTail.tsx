'use client';

/*
 * ALTRIX — the specification and buy tail.
 *
 * bar.md §4 is the mechanism this piece exists to execute. Everything above
 * runs on --void. This component is the single switch to the light ground,
 * and it never switches back: all three sections below sit on --bone, and
 * --bone is painted on the wrapper so the seam at the top edge is one hard
 * cut rather than three.
 *
 * The type colours invert with the ground. --ash (#8A8178) measures 2.82:1
 * on --bone and fails AA, so the bone-ground counterpart --ash-deep is used
 * for continuation copy instead — see the note in spec-tail.module.css.
 * --ember measures 2.76:1 on --bone, so ember is never text here: it appears
 * once, as the pre-order pill, carrying --void text at 5.45:1.
 */

import { useState } from 'react';
import { CountFigure, Magnetic, RiseIn, Tilt } from '../motion';
import Image from 'next/image';
import styles from './spec-tail.module.css';

type SpecRow = {
  /** Row label. Archivo, always. */
  k: string;
  /** Row value. */
  v: string;
  /**
   * design-system.md §2: mono is for numbers read off an instrument, and
   * mono in prose is a fail. So the sheet flags each value rather than
   * setting the whole value column in JetBrains Mono.
   */
  mono?: boolean;
};

const SPEC_GROUPS: { name: string; rows: SpecRow[] }[] = [
  {
    name: 'Chassis',
    rows: [
      { k: 'Case material', v: 'Grade-5 titanium' },
      { k: 'Case diameter', v: '46.0 mm', mono: true },
      { k: 'Case thickness', v: '13.8 mm', mono: true },
      { k: 'Lug width', v: '24 mm', mono: true },
      { k: 'Crystal', v: 'Sapphire, anti-reflective' },
      { k: 'Weight, case only', v: '61 g', mono: true },
      { k: 'Weight, with strap', v: '92 g', mono: true },
    ],
  },
  {
    name: 'Display',
    rows: [
      { k: 'Panel', v: 'AMOLED, always-on' },
      { k: 'Display diameter', v: '38.6 mm', mono: true },
      { k: 'Resolution', v: '502 × 502 px', mono: true },
      { k: 'Peak brightness', v: '3000 nits', mono: true },
      { k: 'Refresh, ambient', v: '1 Hz', mono: true },
      { k: 'Cover', v: 'Sapphire crystal' },
    ],
  },
  /*
   * Group order is also the column balance. The sheet flows into two CSS
   * columns and `break-inside: avoid` makes each group indivisible, so the
   * order sets where the browser can split: 7 + 6 + 6 rows against
   * 10 + 7 + 5 leaves the shortest rag available from these six blocks.
   */
  {
    name: 'Power',
    rows: [
      { k: 'Autonomy, smartwatch', v: '120 h', mono: true },
      { k: 'Autonomy, expedition GNSS', v: '46 h', mono: true },
      { k: 'Autonomy, low power', v: '31 d', mono: true },
      { k: 'Cell', v: 'Lithium-polymer, sealed' },
      { k: 'Capacity', v: '610 mAh', mono: true },
      { k: 'Charge to 80 %', v: '42 min', mono: true },
    ],
  },
  {
    name: 'Sensing',
    rows: [
      { k: 'Positioning', v: 'Dual-frequency GNSS' },
      { k: 'Bands', v: 'L1 + L5', mono: true },
      { k: 'Constellations', v: 'GPS · Galileo · BeiDou' },
      { k: 'Altimeter', v: 'Barometric, temperature-compensated' },
      { k: 'Altimeter resolution', v: '±0.3 m', mono: true },
      { k: 'Compass', v: '3-axis, tilt-compensated' },
      { k: 'Heart rate', v: 'Five-LED optical array' },
      { k: 'Blood oxygen', v: 'SpO₂, acclimatisation mode' },
      { k: 'Skin temperature', v: '±0.1 °C', mono: true },
      { k: 'Accelerometer range', v: '32 g', mono: true },
    ],
  },
  {
    name: 'Environment',
    rows: [
      { k: 'Certified ceiling', v: '9000 m', mono: true },
      { k: 'Operating floor', v: '−41 °C', mono: true },
      { k: 'Operating ceiling', v: '55 °C', mono: true },
      { k: 'Water resistance', v: '100 m', mono: true },
      { k: 'Field verification', v: 'Everest, south col route' },
      { k: 'Verified altitude', v: '8848 m', mono: true },
      { k: 'Standards', v: 'ISO 22810 · MIL-STD-810H' },
    ],
  },
  {
    name: 'Connectivity',
    rows: [
      { k: 'Wireless', v: 'Bluetooth 5.4 · Wi-Fi 6 · NFC' },
      { k: 'Satellite', v: 'Two-way L-band messaging' },
      { k: 'Storage', v: '64 GB', mono: true },
      { k: 'Charging', v: 'Magnetic two-pin' },
      { k: 'Strap fitting', v: '24 mm quick-release', mono: true },
    ],
  },
];

/*
 * Both source PNGs carry a baked #000000 ground and no alpha. Pure #000000
 * is forbidden by the palette, so the pair is composited onto a --basalt
 * card with mix-blend-mode: lighten — a per-channel max against #181818,
 * which lifts the dead ground to --basalt exactly and leaves every pixel
 * above it untouched. No shadow, no pedestal, no reflection is introduced.
 */
const COLOURWAYS = [
  {
    id: 'basalt',
    label: 'Basalt Black',
    strap: 'Vulcanised fluoroelastomer',
    ref: 'AX-S03-BK',
    src: '/demo/altrix/canonical.webp',
    alt: 'ALTRIX Summit Series 03 with the basalt black vulcanised strap, titanium case, altimeter reading 5,364 m.',
  },
  {
    id: 'olive',
    label: 'Alpine Olive',
    strap: 'Full-grain, cold-cured',
    ref: 'AX-S03-OL',
    src: '/demo/altrix/colourway-olive.webp',
    alt: 'ALTRIX Summit Series 03 with the alpine olive full-grain strap, titanium case, altimeter reading 2,835 m.',
  },
] as const;

const RESERVE_RAIL = [
  { label: 'Price', value: '€1,480' },
  { label: 'First deliveries', value: '12 Mar 2027' },
  { label: 'Expedition warranty', value: '5 yr' },
];

export default function SpecTail() {
  const [colourway, setColourway] = useState<string>(COLOURWAYS[0].id);

  return (
    /*
     * §4: the ground is painted once, here. Three sections, one bone slab,
     * no return to dark below it.
     */
    <div className={styles.tail}>
      {/* ------------------------------------------------ specification */}
      {/* Three type tokens: --type-micro, --type-section, --type-body. */}
      <section className={styles.spec} id="specifications">
        <div className={styles.inner}>
          <header className={styles.head}>
            <p className={styles.eyebrow}>Specification</p>
            <h2 className={styles.section}>Every figure, measured on the mountain.</h2>
            {/* §5: two-tone, one paragraph. */}
            <p className={styles.copy}>
              <strong className={styles.lead}>
                Nothing on this sheet was measured at sea level.
              </strong>{' '}
              Each number below was re-verified on the 2026 Khumbu traverse — at
              altitude, in the cold, on a wrist — and rewritten wherever the
              mountain disagreed with the bench.
            </p>
          </header>

          <div className={styles.sheet}>
            {SPEC_GROUPS.map((group) => (
              <section className={styles.group} key={group.name}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <dl className={styles.rows}>
                  {group.rows.map((row) => (
                    <div className={styles.row} key={row.k}>
                      <dt className={styles.key}>{row.k}</dt>
                      <dd className={row.mono ? styles.figure : styles.value}>
                        {row.mono ? <CountFigure value={row.v} /> : row.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- colourway */}
      <section className={styles.colourway}>
        <div className={`${styles.inner} ${styles.pick}`}>
          <div className={styles.pickCopy}>
            <p className={styles.eyebrow}>Colourway</p>
            <h2 className={styles.section}>Two straps. One instrument.</h2>
            <p className={styles.copy}>
              <strong className={styles.lead}>The chassis never changes.</strong>{' '}
              Grade-5 titanium, sapphire crystal and the same dual-frequency fix
              in either finish — the strap is the only decision left to you, and
              it is the one you wear for 120 hours at a stretch.
            </p>

            {/*
             * The accent is unavailable here: --ember measures 2.76:1 on
             * --bone, below the 3:1 floor for non-text UI, so selection is
             * carried by the --void fill rather than by colour temperature.
             */}
            <div className={styles.swatches} role="radiogroup" aria-label="Strap colourway">
              {COLOURWAYS.map((option) => {
                const active = option.id === colourway;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    key={option.id}
                    className={`${styles.swatch} ${active ? styles.swatchOn : ''}`}
                    onClick={() => setColourway(option.id)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <dl className={styles.strapMeta}>
              {COLOURWAYS.filter((option) => option.id === colourway).map((option) => (
                <div className={styles.readout} key={option.id}>
                  <dt className={styles.readoutLabel}>{option.strap}</dt>
                  <dd className={styles.readoutValue}>{option.ref}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* §5/§7: card, 28px radius, no border, no shadow. The object floats. */}
          <Tilt className={styles.card} max={5}>
            <div className={styles.stack}>
              {COLOURWAYS.map((option) => (
                <Image
                  key={option.id}
                  className={`${styles.product} ${
                    option.id === colourway ? styles.productOn : ''
                  }`}
                  src={option.src}
                  alt={option.alt}
                  width={2048}
                  height={2048}
                  sizes="(max-width: 900px) 88vw, 640px"
                  aria-hidden={option.id === colourway ? undefined : true}
                  /*
                   * unoptimized: the image pipeline re-encodes to lossy WebP,
                   * which crushes the dial's near-black back to #000000 and
                   * breaks the palette rule. The PNG is served as authored.
                   */
                  unoptimized
                />
              ))}
            </div>
          </Tilt>
        </div>
      </section>

      {/* ------------------------------------------------------ reserve */}
      {/* Three type tokens: --type-micro, --type-statement, --type-body. */}
      <section className={styles.reserve} id="reserve">
        <div className={`${styles.inner} ${styles.reserveInner}`}>
          <p className={styles.eyebrow}>Pre-order</p>
          <RiseIn className={styles.rise}>
            <h2 className={styles.statement}>Begin the ascent</h2>
          </RiseIn>
          <p className={styles.copy}>
            <strong className={styles.lead}>
              Summit Series 03 opens for pre-order today.
            </strong>{' '}
            Allocation is held to the first production run, every watch ships
            from Chamonix in March, and each one carries a five-year expedition
            warranty that covers everything except the summit itself.
          </p>

          <div className={styles.actions}>
            {/* §5: the single ember pill. One per viewport, --void text on it. */}
            <Magnetic>
              <a className={styles.pill} href="#reserve">
                Pre-order Summit 03
              </a>
            </Magnetic>
            <a className={styles.ghost} href="#specifications">
              Read the full sheet
            </a>
          </div>

          <dl className={styles.rail}>
            {RESERVE_RAIL.map((item) => (
              <div className={styles.readout} key={item.label}>
                <dt className={styles.readoutLabel}>{item.label}</dt>
                <dd className={styles.readoutValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
