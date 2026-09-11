import Image from 'next/image';
import Link from 'next/link';
import page from '../crookeries.module.css';
import styles from './product-grid.module.css';
import DeckRow from '../motion/DeckRow';
import { products, money } from '../shop';
import { AddToCart } from './Cart';

function Arrow() {
  return (
    <svg width="14" height="8" viewBox="0 0 16 9" fill="none" aria-hidden="true">
      <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function BestSelling() {
  return (
    <section className={styles.section} id="bestselling">
      <div className={page.wrap}>
        <div className={page.headRow}>
          <h2 className={page.heading}>
            Eco essentials, planet-friendly
            <span className={page.headingTail}>
              Bestselling
              <span className={page.star} aria-hidden="true">
                ✧
              </span>
              <span className={page.it}>Products</span>
            </span>
          </h2>
          <a className={page.moreLink} href="#categories">
            More products
            <Arrow />
          </a>
        </div>

        <div className={styles.rail}>
          <button className={`${styles.arrow} ${styles.arrowPrev}`} type="button" aria-label="Previous products">
            <svg width="14" height="8" viewBox="0 0 16 9" fill="none">
              <path d="M16 4.5H2M5.5 1 2 4.5 5.5 8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
          <button className={`${styles.arrow} ${styles.arrowNext}`} type="button" aria-label="Next products">
            <Arrow />
          </button>

          <DeckRow className={styles.grid}>
            {products.map((product) => (
              <article className={styles.card} key={product.slug}>
                <div className={styles.tile}>
                  <span className={styles.badge}>{product.badge}</span>
                  <Image
                    className={styles.tileImg}
                    src={`/demo/crookeries/${product.slug}.webp`}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.meta}>
                  <div className={styles.swatches} aria-hidden="true">
                    {product.swatches.map((colour) => (
                      <span className={styles.swatch} key={colour} style={{ background: colour }} />
                    ))}
                  </div>
                  <Link className={styles.titleLink} href="/demo/crookeries/product">
                    <p className={styles.title}>{product.title}</p>
                  </Link>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{money(product.price)}</span>
                    <AddToCart slug={product.slug} />
                  </div>
                </div>
              </article>
            ))}
          </DeckRow>
        </div>
      </div>
    </section>
  );
}
