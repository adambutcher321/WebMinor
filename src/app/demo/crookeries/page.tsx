import type { Metadata } from "next";
import Image from "next/image";
import { Figtree, Playfair_Display } from "next/font/google";
import styles from "./crookeries.module.css";
import BestSelling from "./sections/BestSelling";
import Categories from "./sections/Categories";
import Splits, { StatementBand } from "./sections/Editorial";
import Tail from "./sections/Tail";
import Footer from "./sections/Footer";
import { CartButton, CartDrawer } from "./sections/Cart";
import Nav from "./sections/Nav";
import MotionRoot from "./motion/MotionRoot";
import Loader from "./motion/Loader";
import HeroStage from "./motion/HeroStage";
import IntroReveal from "./motion/IntroReveal";
import CountUp from "./motion/CountUp";
import Reveal from "./motion/Reveal";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crookeries — Sustainable Kitchenware (WebMinor sample)",
  description:
    "Crookeries — small-batch, planet-first kitchenware. A sample ecommerce storefront by WebMinor.",
};

export default function Crookeries() {
  return (
    <MotionRoot>
      <div
        className={`${styles.page} ${figtree.variable} ${playfair.variable}`}
      >
        <Loader />
        <HeroStage className={styles.heroStage} heroClassName={styles.hero}>
          <Image
            className={styles.heroImg}
            src="/demo/crookeries/hero-film/poster.webp"
            alt="A sage-green period kitchen in morning light, herbs on the windowsill and copper pans on the range"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroScrim} aria-hidden="true" />

          <Nav />

          <div className={styles.heroBody}>
            <IntroReveal className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>
                Sustainable <span className={styles.it}>Kitchenware</span> for
                <br />a greener home
              </h1>
              <p className={styles.heroLead}>
                Small-batch stoneware, cookware and utensils made from materials
                that give back more than they take. Built to outlast the kitchen
                they arrive in.
              </p>
              <a
                className={`${styles.btn} ${styles.btnCream}`}
                href="#bestselling"
              >
                Shop now
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 16 9"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </a>
            </IntroReveal>

            <div className={styles.stat}>
              <svg
                className={styles.statIcon}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 4c0 6.5-3.5 10-8 10-1 0-2-.2-2.8-.6M4 16c0-4.5 2.5-8 8-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <p className={styles.statLabel}>
                Natural.
                <br />
                Sustainable.
                <br />
                Eco-conscious.
              </p>
              <p className={`${styles.statValue} ${styles.it}`}>
              <CountUp to={96} suffix="%" />
            </p>
            </div>
          </div>
        </HeroStage>

        <BestSelling />
        <StatementBand />
        {/* The reference runs Categories between the feature row and the two
          image/copy splits, not after them. */}
        <Categories />
        <Splits />
        <Tail />

        {/* The one-line credit strip is now the bottom row of a real footer. */}
        <Footer />
        <CartButton />
        <CartDrawer />
      </div>
    </MotionRoot>
  );
}
