import Image from 'next/image';
import page from '../crookeries.module.css';
import StackTrio from '../motion/StackTrio';
import GalleryDrift from '../motion/GalleryDrift';
import styles from './tail.module.css';

const GALLERY = [
  { slug: 'g-pan', caption: 'SizzlePro Non-Stick Pan', shape: 'tallA', alt: 'A charcoal non-stick frying pan with a terracotta lid on slate' },
  { slug: 'g-board', caption: 'Grain Slice Board Duo', shape: 'tallB', alt: 'Four round pale wooden chopping boards in a grid' },
  { slug: 'g-utensil', caption: 'Bamboo Utensil Set', shape: 'short', alt: 'A green canvas utensil wrap opened to show kitchen tools' },
  { slug: 'g-glowpot', caption: 'Glow Pot Ceramic', shape: 'tallB', alt: 'Three lidded ceramic storage pots on pale plinths' },
  { slug: 'g-cup', caption: 'StoneSip Ceramic Cup', shape: 'tallA', alt: 'A dark glazed ceramic cup and bowl on a wooden block' },
] as const;

const QUOTES = [
  { text: 'The glass jars are perfect for storage and the bamboo utensils get used every single day.', who: 'Jane', surname: 'Cooper', role: 'Nutritionist' },
  { text: 'Fantastic products and fast delivery. My kitchen feels so much greener already.', who: 'Darlene', surname: 'Robertson', role: 'Culinary Instructor', lead: true },
  { text: 'Love the eco-style. The jars keep everything fresh and the utensils are genuinely chic.', who: 'Jacob', surname: 'Jones', role: 'Food Blogger' },
  { text: 'The finish has held up through two years of daily use without a mark on it.', who: 'Esther', surname: 'Howard', role: 'Sous Chef' },
];

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg width="14" height="8" viewBox="0 0 16 9" fill="none" aria-hidden="true">
      {back ? (
        <path d="M16 4.5H2M5.5 1 2 4.5 5.5 8" stroke="currentColor" strokeWidth="1.3" />
      ) : (
        <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
      )}
    </svg>
  );
}

export default function Tail() {
  return (
    <>
      <section className={styles.section} id="gallery">
        <div className={styles.wrap}>
          <div className={page.headRow}>
            <h2 className={page.heading}>
              Thoughtful, planet-prioritising ideas
              <span className={page.headingTail}>
                and inspiration
                <span className={page.star} aria-hidden="true">
                  ✧
                </span>
                <span className={page.it}>Gallery</span>
              </span>
            </h2>
            <div className={styles.arrows}>
              <button className={styles.arrowBtn} type="button" aria-label="Previous gallery items">
                <Arrow back />
              </button>
              <button className={styles.arrowBtn} type="button" aria-label="Next gallery items">
                <Arrow />
              </button>
            </div>
          </div>

          <GalleryDrift className={styles.gallery}>
            {GALLERY.map((item) => (
              <figure className={`${styles.tile} ${styles[item.shape]}`} key={item.slug} style={{ margin: 0 }}>
                <Image
                  className={styles.tileImg}
                  src={`/demo/crookeries/${item.slug}.webp`}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
                <div className={styles.tileScrim} aria-hidden="true" />
                <figcaption className={`${styles.tileCaption} ${page.it}`}>{item.caption}</figcaption>
              </figure>
            ))}
          </GalleryDrift>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.reviews}>
            <div className={styles.reviewsHead}>
              <p className={`${styles.score} ${page.it}`}>
                4.9<span className={styles.scoreOf}>/5</span>
              </p>
              <p className={styles.scoreNote}>
                More than <strong>25,000</strong> five-star reviews for our award-winning
                eco products.
              </p>
            </div>

            <div className={styles.quotes}>
              {QUOTES.map((quote) => (
                <blockquote
                  className={`${styles.quote} ${quote.lead ? styles.quoteLead : ''}`}
                  key={quote.surname}
                >
                  <span className={styles.mark} aria-hidden="true">
                    &ldquo;
                  </span>
                  <p className={styles.quoteText}>{quote.text}</p>
                  <p className={styles.who}>
                    {quote.who} <span className={page.it}>{quote.surname}</span>
                    <span className={styles.role}>{quote.role}</span>
                  </p>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.closing}`}>
        <div className={styles.wrap}>
          <StackTrio className={styles.triptych}>
            <Image
              className={`${styles.tImg} ${styles.tSide}`}
              src="/demo/crookeries/c-left.webp"
              alt="A navy kettle beside a small sage bowl"
              width={300}
              height={380}
            />
            <Image
              className={`${styles.tImg} ${styles.tMid}`}
              src="/demo/crookeries/c-mid.webp"
              alt="A teal skillet with toast, a spatula and eggs on a stone counter"
              width={680}
              height={460}
            />
            <Image
              className={`${styles.tImg} ${styles.tSide}`}
              src="/demo/crookeries/c-right.webp"
              alt="A cream teapot on a terracotta plinth"
              width={300}
              height={380}
            />
          </StackTrio>

          <p className={styles.statement}>
            Discover our commitment to <span className={`${page.it} ${styles.lead}`}>sustainable</span>{' '}
            materials, low-impact production, and{' '}
            <span className={`${page.it} ${styles.lead}`}>ethical sourcing</span> partnerships —
            all crafted to support a healthier planet and a{' '}
            <span className={`${page.it} ${styles.lead}`}>greener kitchen</span>.
          </p>
        </div>
      </section>
    </>
  );
}
