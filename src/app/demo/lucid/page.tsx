import Link from 'next/link';
import Headset from './Headset';
import FilmCard from './FilmCard';
import Exploded from './Exploded';
import Logo from './Logo';
import Configure from './Configure';
import Contact from './Contact';
import { SmoothScroll, Magnetic } from './Motion';
import s from './lucid.module.css';

/*
  LUCID — a concept spatial-computing product homepage.

  Structure follows the brief: an oversized pale "Spatial." behind the product,
  black headline type at the left, the product floating on its own layer at the
  centre, technical callouts on leader lines, a film card at the foot and a
  specification strip along the bottom. The one action is an orange pill with a
  circular arrow.

  Only this homepage exists. The navigation names the sections of a launch site
  that is not built, so those links are marked as unavailable rather than
  pretending to lead somewhere.
*/

const NAV = [
  { label: 'Device', href: '#lucid-hero' },
  { label: 'Teardown', href: '#teardown' },
  { label: 'Buy', href: '#buy' },
  { label: 'Contact', href: '#contact' },
];

const SPEC = [
  { k: 'Display', v: '4K micro-OLED per eye' },
  { k: 'Field of view', v: '116° horizontal' },
  { k: 'Passthrough', v: '11 ms, full colour' },
  { k: 'Mass', v: '284 g on the face' },
];

function ArrowCircle() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none">
      <path
        d="M4 12L12 4M12 4H6M12 4v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LucidPage() {
  return (
    <>
    <SmoothScroll />
    <div className={s.shell} id="lucid-hero">
      <header className={s.nav}>
        <a className={s.brand} href="#lucid-hero">
          <Logo />
          LUCID
        </a>

        <nav aria-label="Primary">
          <ul className={s.navLinks}>
            {NAV.map((item) => (
              <li key={item.label}>
                <a className={s.navLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.navRight}>
          <button type="button" className={s.cart}>
            Bag
            <span className={s.cartCount}>0</span>
          </button>
          <Magnetic strength={0.28} radius={70}>
            <a className={s.pill} href="#buy">
              Reserve
              <span className={s.pillDisc} aria-hidden="true">
                <ArrowCircle />
              </span>
            </a>
          </Magnetic>
        </div>
      </header>

      <main className={s.stage}>
        <p className={s.bigword} aria-hidden="true">
          Spatial<span className={s.bigwordDot}>.</span>
        </p>

        <div className={s.copy}>
          <p className={s.eyebrow}>Lucid One · Spring 2026</p>
          <h1 className={s.headline}>The screen was always in the way.</h1>
          <p className={s.sub}>
            Your work, at the size it deserves, placed in the room you are
            already standing in. Then it gets out of the way.
          </p>
          <div className={s.actions}>
            <Magnetic>
              <a className={s.pill} href="#buy">
                Reserve yours
                <span className={s.pillDisc} aria-hidden="true">
                  <ArrowCircle />
                </span>
              </a>
            </Magnetic>
            <span className={s.price}>£2,890 · Ships March</span>
          </div>
        </div>

        {/* The product is its own layer so it can be animated without moving
            the typography, the stage or anything else in the composition. */}
        <Headset scopeId="lucid-hero" />

        <div className={`${s.callout} ${s.calloutA}`} aria-hidden="true">
          <span className={s.calloutDot} />
          <span className={s.calloutLine} />
          <span className={s.calloutText}>
            <b>Exposed optics</b>
            Four barrels, 4,000 nits each
          </span>
        </div>

        <div className={`${s.callout} ${s.calloutB}`} aria-hidden="true">
          <span className={s.calloutDot} />
          <span className={s.calloutLine} />
          <span className={s.calloutText}>
            <b>Titanium exoframe</b>
            Skeletal. Carries no weight
          </span>
        </div>

        <div className={`${s.callout} ${s.calloutC}`} aria-hidden="true">
          <span className={s.calloutDot} />
          <span className={s.calloutLine} />
          <span className={s.calloutText}>
            <b>Halo band</b>
            284 g, and it forgets it is there
          </span>
        </div>

        <div className={s.rail} aria-hidden="true">
          <div className={s.railDots}>
            <span className={`${s.railDot} ${s.railDotOn}`} />
            <span className={s.railDot} />
            <span className={s.railDot} />
            <span className={s.railDot} />
          </div>
          <span className={s.railText}>Scroll to explore</span>
          <span className={s.railArrow}>↓</span>
        </div>

        <FilmCard />
      </main>

      <footer className={s.foot}>
        {SPEC.map((item) => (
          <div className={s.footItem} key={item.k}>
            <span className={s.footKey}>{item.k}</span>
            <span className={s.footVal}>{item.v}</span>
          </div>
        ))}
        <p className={s.footCredit}>
          Lucid is a concept brand built by{' '}
          <Link href="/case-studies">WebMinor</Link>
        </p>
      </footer>
    </div>

    {/* The teardown lives below the hero: the hero is one screen, this is the
        scroll. */}
    <Exploded />
    <Configure />
    <Contact />
    </>
  );
}
