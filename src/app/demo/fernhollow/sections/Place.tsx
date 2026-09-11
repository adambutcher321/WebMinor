import Image from 'next/image';
import s from './fernhollow-sections.module.css';

/** A single full-bleed plate between the shop and the booking, so the page
 *  breathes once before it asks for money. */
export default function Place() {
  return (
    <section className={s.place}>
      <Image
        src="/demo/fernhollow/place-loch.webp"
        alt="A still highland loch at dawn with mist on the water and dark pines along the far shore"
        fill
        sizes="100vw"
        className={s.placeImg}
      />
      <div className={s.placeScrim} aria-hidden="true" />
      <div className={s.placeCopy}>
        <blockquote className={s.placeQuote}>
          The nearest streetlight is nineteen miles away. You notice it on the
          first night.
        </blockquote>
        <p className={s.placeAttrib}>Loch Vaar, Argyll</p>
      </div>
    </section>
  );
}
