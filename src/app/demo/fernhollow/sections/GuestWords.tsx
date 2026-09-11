import s from './fernhollow-sections.module.css';

/* Concept copy for a concept brand. These are written to sound like the kind
   of thing a guest actually writes — one specific detail each, no superlatives
   — rather than the five-star filler a template ships with. */
const words = [
  {
    quote:
      'We did not open the laptop once. That has never happened on a holiday before.',
    who: 'Rhona & Tom · Birchfell · March',
  },
  {
    quote:
      'The hot tub was hot when we got there, which after five hours of driving felt like a small miracle.',
    who: 'Priya S. · Corrie · January',
  },
  {
    quote:
      'Our collie has never been welcome anywhere. Here there was a bed by the fire with his name on the tag.',
    who: 'Mark D. · Duneholm · October',
  },
];

export default function GuestWords() {
  return (
    <section className={`${s.band} ${s.bandPaper}`}>
      <div className={s.measure}>
        <p className={s.eyebrow}>Guests</p>
        <h2 className={s.heading}>What people say when they get home.</h2>
      </div>

      <ul className={s.words}>
        {words.map((w) => (
          <li key={w.who} className={s.word}>
            <blockquote className={s.wordQuote}>&ldquo;{w.quote}&rdquo;</blockquote>
            <p className={s.wordWho}>{w.who}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
