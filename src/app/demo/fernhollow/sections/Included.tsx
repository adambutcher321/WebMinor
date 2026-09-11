import Image from 'next/image';
import s from './fernhollow-sections.module.css';

/**
 * What every cabin has, as a ledger rather than a grid of icon cards.
 * A numbered list of plain facts reads as a specification a business stands
 * behind; three line icons and a soft adjective read as filler.
 */
const included = [
  {
    name: 'A fire that does the heating',
    note: 'Cast-iron burner, kindling and a first basket of birch in every cabin.',
  },
  {
    name: 'No shared walls, no neighbours',
    note: 'Each cabin sits on its own ground. You will not see another building.',
  },
  {
    name: 'Beds made up before you arrive',
    note: 'Linen, wool blankets, and towels for however many of you are coming.',
  },
  {
    name: 'A kitchen you can actually cook in',
    note: 'Full hob and oven, sharp knives, a cafetière and more than four plates.',
  },
  {
    name: 'Water, off the hill',
    note: 'Filtered spring supply. Hot showers with proper pressure.',
  },
  {
    name: 'Signal when you want it',
    note: 'Starlink in every cabin, and a switch by the door to turn it off.',
  },
];

export default function Included() {
  return (
    <section className={s.band}>
      <div className={s.measure}>
        <p className={s.eyebrow}>In every cabin</p>
        <h2 className={s.heading}>
          The list is short because nothing on it is optional.
        </h2>
      </div>

      <div className={s.included}>
        {included.map((item, i) => (
          <div key={item.name} className={s.includedRow}>
            <span className={s.includedNo}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className={s.includedName}>{item.name}</h3>
              <p className={s.includedNote}>{item.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginTop: 56,
        }}
      >
        {[
          {
            src: '/demo/fernhollow/interior-hearth.webp',
            alt: 'A lit wood burner throwing warm light across a linen sofa facing a window onto a loch',
          },
          {
            src: '/demo/fernhollow/interior-loft.webp',
            alt: 'A bed in a timber sleeping loft directly beneath a large skylight full of stars',
          },
          {
            src: '/demo/fernhollow/interior-kitchen.webp',
            alt: 'A compact cabin kitchen in morning light with a stone sink beneath a window onto pines',
          },
        ].map((img) => (
          <div
            key={img.src}
            style={{ position: 'relative', aspectRatio: '3 / 2', borderRadius: 2, overflow: 'hidden' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 767px) 92vw, 30vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
