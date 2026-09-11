import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProductBuy from './ProductBuy';
import { CartButton, CartDrawer } from '../sections/Cart';
import { Figtree, Playfair_Display } from 'next/font/google';
import page from '../crookeries.module.css';
import styles from './pdp.module.css';
import Tail from '../sections/Tail';
import Nav from '../sections/Nav';

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ribbed Kettle, Sage — Crookeries (WebMinor sample)',
  description:
    'The Crookeries ribbed kettle in sage, on an ash base. A sample ecommerce product page by WebMinor.',
};

/* Four views of the SAME kettle. These previously pointed at the cookware, the
   ceramic pots and the utensil mug — three different products presented as
   alternate views of this one. */
const THUMBS = [
  { slug: 'k-side', alt: 'The sage ribbed kettle in side profile' },
  { slug: 'k-top', alt: 'The kettle from above, showing the ribbed lid' },
  { slug: 'k-detail', alt: 'Macro of the ribbing meeting the ash wood base' },
  { slug: 'k-scene', alt: 'The kettle on a travertine worktop beside a mug' },
];

const SWATCHES = [
  { hex: '#7E8C6E', name: 'Sage' },
  { hex: '#C4A882', name: 'Oat' },
  { hex: '#2C4A3B', name: 'Forest' },
  { hex: '#C4612F', name: 'Terracotta' },
];

const SPECS = [
  { key: 'Capacity', value: '1.7 litres' },
  { key: 'Body', value: 'Recycled steel' },
  { key: 'Base', value: 'FSC ash' },
  { key: 'Guarantee', value: 'Five years' },
];

const ASSURANCES = [
  ['Carbon-neutral delivery', 'Two to four working days'],
  ['Repairable by design', 'Spares stocked for ten years'],
  ['Take-back scheme', 'We recycle it when it retires'],
];

export default function CrookeriesProduct() {
  return (
    <div className={`${page.page} ${figtree.variable} ${playfair.variable}`}>
      <div className={styles.navBar}>
        <Nav light />
      </div>

      <main className={styles.main}>
        <div className={styles.wrap}>
          <nav className={styles.crumb} aria-label="Breadcrumb">
            <Link className={styles.crumbLink} href="/demo/crookeries">
              Crookeries
            </Link>
            <span aria-hidden="true">/</span>
            <Link className={styles.crumbLink} href="/demo/crookeries#bestselling">
              Kettles
            </Link>
            <span aria-hidden="true">/</span>
            <span>Ribbed Kettle</span>
          </nav>

          <div className={styles.split}>
            <div>
              <div className={styles.stage}>
                <span className={styles.badge}>Customer favourite</span>
                <Image
                  className={styles.stageImg}
                  src="/demo/crookeries/k-side.webp"
                  alt="A sage green ribbed electric kettle on a pale ash wood base"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
              </div>
              <div className={styles.thumbs}>
                {THUMBS.map((thumb, i) => (
                  <button
                    className={`${styles.thumb} ${i === 0 ? styles.thumbOn : ''}`}
                    key={thumb.slug}
                    type="button"
                    aria-label={thumb.alt}
                  >
                    <Image
                      className={styles.thumbImg}
                      src={`/demo/crookeries/${thumb.slug}.webp`}
                      alt=""
                      fill
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className={styles.title}>
                Ribbed Kettle, <span className={page.it}>Sage</span>
              </h1>

              <p className={styles.rating}>
                <span className={styles.stars} aria-hidden="true">
                  ★★★★★
                </span>
                4.9 · 2,184 reviews
              </p>

              <p className={styles.price}>
                £129
                <span className={styles.was}>£155</span>
              </p>

              <p className={styles.blurb}>
                A 1.7-litre kettle in recycled steel on an FSC ash base, finished in a
                fine vertical rib that hides the fingerprints a gloss kettle collects in
                a week. Every part unscrews, and we stock every part.
              </p>

              <span className={styles.optionLabel}>Colour — Sage</span>
              <div className={styles.swatchRow}>
                {SWATCHES.map((swatch, i) => (
                  <button
                    className={`${styles.swatch} ${i === 0 ? styles.swatchOn : ''}`}
                    key={swatch.hex}
                    type="button"
                    style={{ background: swatch.hex }}
                    aria-label={swatch.name}
                  />
                ))}
              </div>

              <ProductBuy slug="p-kettle" styles={styles} />


              <div className={styles.assurances}>
                {ASSURANCES.map(([label, note]) => (
                  <p className={styles.assurance} key={label}>
                    <span>{label}</span>
                    <span className={styles.assuranceNote}>{note}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.specs}>
            {SPECS.map((spec) => (
              <div className={styles.spec} key={spec.key}>
                <p className={styles.specKey}>{spec.key}</p>
                <p className={styles.specVal}>{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      <CartButton />
      <CartDrawer />
      </main>

      <Tail />

      <footer className={page.credit}>
        <div className={page.creditInner}>
          <p>Crookeries · Sample website by WebMinor</p>
          <Link className={page.creditLink} href="/case-studies">
            Back to WebMinor
          </Link>
        </div>
      </footer>
    </div>
  );
}
