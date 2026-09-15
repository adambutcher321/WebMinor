import s from './lucid.module.css';

/**
 * The LUCID mark.
 *
 * Drawn as SVG rather than generated as a picture: a logo has to stay crisp at
 * every size, sit on any ground, take a colour from CSS and be animatable. A
 * raster mark can do none of those.
 *
 * One continuous stroke: the outline of the visor, run round from the bottom
 * edge, over the top and down the right, where instead of closing it turns in
 * on a diagonal and stops inside the loop. It is the product's silhouette and
 * it is also a Q — a lens that is open, still letting light in — and because
 * it is a single line it reads at favicon size where a drawing would not.
 * The stroke takes `currentColor`, so the lock-up recolours with its context
 * and the hover state can warm it without a second asset.
 *
 * `size` is the height; the mark is 1.6× as wide as it is tall.
 */
export const LOGO_PATH = 'M19 17H9A7 7 0 0 1 9 3H23A7 7 0 0 1 25.2 16.6L17.2 9.6';

export default function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg
      className={s.logoMark}
      width={Math.round(size * 1.6)}
      height={size}
      viewBox="0 0 32 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={LOGO_PATH}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
