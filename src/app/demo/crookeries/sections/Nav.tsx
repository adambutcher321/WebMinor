import Link from 'next/link';
import page from '../crookeries.module.css';

const NAV_LINKS = [
  ['Shop', '/demo/crookeries#bestselling'],
  ['Bestsellers', '/demo/crookeries#bestselling'],
  ['Gallery', '/demo/crookeries#gallery'],
  ['About', '/demo/crookeries#categories'],
] as const;

/**
 * One nav, two skins. Over the hero photograph it is white-on-image; on the
 * product page there is no photograph to sit on, so `light` swaps it to ink on
 * paper. Keeping it as one component is what stops the two pages drifting into
 * looking like two different shops.
 */
export default function Nav({ light = false }: { light?: boolean }) {
  return (
    <nav className={`${page.nav} ${light ? page.navLight : ''}`} aria-label="Crookeries">
      <ul className={page.navLinks}>
        {NAV_LINKS.map(([label, href]) => (
          <li key={label}>
            <Link className={page.navLink} href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link className={page.wordmark} href="/demo/crookeries">
        Crook<span className={page.it}>eries</span>
      </Link>

      <div className={page.navRight}>
        <div className={page.search} aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Search product…
        </div>
        <button className={page.iconBtn} type="button" aria-label="Basket">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 5.5h12l-1 9.5H4L3 5.5ZM6.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className={page.iconBtn} type="button" aria-label="Account">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M3.5 15.5a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
