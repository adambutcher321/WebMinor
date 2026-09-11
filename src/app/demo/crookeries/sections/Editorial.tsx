import Image from 'next/image';
import page from '../crookeries.module.css';
import styles from './editorial.module.css';

const FEATURES = [
  {
    lead: 'Natural',
    label: 'Finish',
    path: 'M10 17c0-5 3-8 8-9-1 6-3 9-8 9Zm0 0c0-3-1-5-4-6',
  },
  {
    lead: 'Eco',
    label: 'Innovation',
    path: 'M14 4a10 10 0 1 0 10 10h-10V4Z',
  },
  {
    lead: 'Sustainable',
    label: 'Materials',
    path: 'M4 18c5-6 10-6 14-10-1 7-5 11-11 11H4Zm0 0c3 0 5 1 6 3',
  },
];

function Leaf({ path }: { path: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="14" height="8" viewBox="0 0 16 9" fill="none" aria-hidden="true">
      <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function StatementBand() {
  return (
    <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.band}>
            <Image
              className={styles.bandImg}
              src="/demo/crookeries/band-kitchen.webp"
              alt="An olive green shaker kitchen with a central island and daylight through tall doors"
              fill
              sizes="100vw"
            />
            <div className={styles.bandScrim} aria-hidden="true" />
            <p className={styles.bandCopy}>
              We craft <span className={page.it}>kitchenware</span> you can trust for years
              to come — through everyday meals and <span className={page.it}>evolving lifestyles</span>.
              Each piece is thoughtfully made with <span className={page.it}>sustainable materials</span>
            </p>
          </div>

          <div className={styles.features}>
            {FEATURES.map((feature, i) => (
              <div
                className={`${styles.feature} ${i === 1 ? styles.featureMid : ''}`}
                key={feature.label}
              >
                <span className={styles.featureIcon}>
                  <Leaf path={feature.path} />
                </span>
                <p className={styles.featureLabel}>
                  <span className={page.it}>{feature.lead}</span>
                  <span className={styles.featureLead}>{feature.label}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}

export default function Splits() {
  return (
    <>
      <section className={styles.section}>
        <div className={`${styles.wrap} ${styles.split}`}>
          <div className={styles.splitCopy}>
            <h2 className={styles.splitTitle}>
              Best <span className={page.it}>sellers</span>
            </h2>
            <p className={styles.splitBody}>
              Three colourways of the OasiSteam cooker, in sage, cream and blush. One
              chamber, eight programmes, and a steel liner that will outlive the kitchen
              you buy it for.
            </p>
            <a className={`${page.btn} ${page.btnPrimary}`} href="#bestselling">
              Shop now
              <Arrow />
            </a>
          </div>
          <figure className={styles.splitFigure} style={{ margin: 0 }}>
            <Image
              className={styles.splitImg}
              src="/demo/crookeries/best-sellers.webp"
              alt="Three retro rice cookers in sage, cream and blush on painted plinths"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </figure>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.wrap} ${styles.split} ${styles.splitReverse}`}>
          <figure className={styles.splitFigure} style={{ margin: 0 }}>
            <Image
              className={styles.splitImg}
              src="/demo/crookeries/new-arrival.webp"
              alt="A deep green ribbed rice cooker on a terracotta table setting"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </figure>
          <div className={`${styles.splitCopy} ${styles.splitCopyRight}`}>
            <h2 className={styles.splitTitle}>
              New <span className={page.it}>Arrival</span>
            </h2>
            <p className={styles.splitBody}>
              The OasiSteam in deep green, laid for a long lunch. Steam-cooks a whole
              tray of seasonal vegetables at once, so the odds and ends at the bottom of
              the drawer become the meal rather than the compost.
            </p>
            <a className={`${page.btn} ${page.btnPrimary}`} href="#bestselling">
              Shop now
              <Arrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
