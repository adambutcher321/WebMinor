import s from './lucid.module.css';

/**
 * The LUCID mark.
 *
 * Drawn as SVG rather than generated as a picture: a logo has to stay crisp at
 * every size, sit on any ground, take a colour from CSS and be animatable. A
 * raster mark can do none of those.
 *
 * The idea is the product's own argument. An aperture ring — the iris of a
 * lens — cut open at the right so the ring is unclosed: the brand that does not
 * shut you out, and a shape that also reads as the C of LUCID. The pupil is the
 * one filled element and takes the accent, so the mark has a single point of
 * focus in the way the eye does.
 */
export default function Logo({ size = 18 }: { size?: number }) {
  return (
    <svg
      className={s.logoMark}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* The open aperture ring. The gap sits at the right, on the optical
          axis, so the mark reads as a lens that is still letting light in. */}
      <path
        d="M20.5 8.6A9.5 9.5 0 1 0 21.5 12"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      {/* Blades, set at the angles of a real iris rather than evenly, so the
          mark reads as a mechanism and not as a sunburst. */}
      <path
        d="M12 2.5v4M19.2 7.2l-3.3 2.2M4.8 7.2l3.3 2.2M6.4 19.1l2.1-3.4M17.6 19.1l-2.1-3.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.42"
      />
      <circle cx="12" cy="12" r="3.4" fill="var(--orange)" />
    </svg>
  );
}
