import Image from 'next/image';
import page from '../crookeries.module.css';
import styles from './product-grid.module.css';
import DeckRow from '../motion/DeckRow';

const CATEGORIES = [
  { slug: 'cat-cup', name: 'CupEco', alt: 'A dark glazed stoneware cup on a turned wooden plinth' },
  { slug: 'cat-cutlery', name: 'EcoSpoonery', alt: 'Steel and pale wood cutlery on a deep green surface' },
  { slug: 'cat-utensil', name: 'NatureSip', alt: 'Wooden spoons standing in a speckled cream mug' },
  { slug: 'cat-pitcher', name: 'FreshPitcher', alt: 'Two hands holding a sage green insulated flask' },
];

export default function Categories() {
  return (
    <section className={`${styles.section} ${styles.sectionTight}`} id="categories">
      <div className={page.wrap}>
        <div className={page.headRow}>
          <h2 className={page.heading}>
            Explore our thoughtful and
            <span className={page.headingTail}>
              planet-first
              <span className={page.star} aria-hidden="true">
                ✧
              </span>
              <span className={page.it}>Categories</span>
            </span>
          </h2>
        </div>

        <div className={styles.rail}>
          <button className={`${styles.arrow} ${styles.arrowPrev}`} type="button" aria-label="Previous categories">
            <svg width="14" height="8" viewBox="0 0 16 9" fill="none">
              <path d="M16 4.5H2M5.5 1 2 4.5 5.5 8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
          <button className={`${styles.arrow} ${styles.arrowNext}`} type="button" aria-label="Next categories">
            <svg width="14" height="8" viewBox="0 0 16 9" fill="none">
              <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>

          <DeckRow className={styles.grid}>
            {CATEGORIES.map((category) => (
              <article className={styles.catCard} key={category.slug}>
                <Image
                  className={styles.catImg}
                  src={`/demo/crookeries/${category.slug}.webp`}
                  alt={category.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className={styles.catScrim} aria-hidden="true" />
                <p className={styles.catLabel}>
                  Explore
                  <span className={`${styles.catName} ${page.it}`}>{category.name}</span>
                </p>
                <a className={`${page.btn} ${page.btnCream}`} href="#bestselling">
                  Shop
                  <svg width="14" height="8" viewBox="0 0 16 9" fill="none" aria-hidden="true">
                    <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </a>
              </article>
            ))}
          </DeckRow>
        </div>
      </div>
    </section>
  );
}
