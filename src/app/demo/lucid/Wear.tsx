'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from './Motion';
import Logo from './Logo';
import s from './wear.module.css';

/*
  The three sections that turn a product page into a launch site: what Lucid
  One is for, what it is like to wear, and what people ask before they reserve.
  The imagery is generated from the same headset render the hero uses, so the
  device in every scene is the device on the stage.
*/

const SCENES = [
  {
    n: '01',
    title: 'Work, at the size it deserves',
    text: 'Three panels where a monitor used to be. Pin one to the desk, one to the wall, and take the third with you to the kettle.',
    src: '/demo/lucid/scene-work.webp',
    alt: 'A woman at a pale oak desk wearing Lucid One, three translucent panels floating in front of her',
  },
  {
    n: '02',
    title: 'A cinema that fits in a flat',
    text: 'A screen the width of the room, in a room that does not have one. Sound aimed at your ears and nobody else’s.',
    src: '/demo/lucid/scene-watch.webp',
    alt: 'A man on a sofa at dusk wearing Lucid One, looking up at a vast floating screen',
  },
  {
    n: '03',
    title: 'Make it before you make it',
    text: 'A model at true scale, on the bench, turned by hand. The chair exists before the first cut.',
    src: '/demo/lucid/scene-make.webp',
    alt: 'A furniture maker in a workshop wearing Lucid One, a holographic chair floating above the bench',
  },
];

const FACTS = [
  { k: 'On the face', v: '284 g. The band carries it; the visor carries nothing.' },
  { k: 'Exoframe', v: 'Machined titanium, 61 g, skeletal so heat leaves and hair does not catch.' },
  { k: 'Halo band', v: 'Knitted, breathable, swappable in ten seconds. Titanium, woven or carbon.' },
  { k: 'A full day', v: 'Six hours on the frame, all day with the pocket cell, which weighs less than a phone.' },
  { k: 'Prescription', v: 'Bonded inserts made to your prescription at the factory. No clip-ons.' },
];

const FAQ = [
  { q: 'Can I wear it with glasses?', a: 'You will not need to. Send your prescription after ordering and the optical inserts are bonded at the factory, single vision or varifocal. Contact lenses work as they are.' },
  { q: 'How long does the battery last?', a: 'About six hours on the frame alone. The pocket cell adds a full working day and charges the frame while you wear it.' },
  { q: 'Does it work with my laptop?', a: 'Yes, over the local network, with no cable. Mac, Windows and Linux. Your existing windows become panels; nothing has to be rewritten.' },
  { q: 'What if it does not suit me?', a: 'Thirty days, no questions. Try it in a studio first if you would rather: London, Manchester and Bristol, no appointment needed.' },
  { q: 'When does it ship?', a: 'March, in the order reservations were placed. A reservation is a place in the queue, not a payment.' },
];

const QUOTES = [
  { text: '“The first headset I forgot I was wearing. That is the whole review.”', src: 'Signal Magazine' },
  { text: '“The teardown page alone should embarrass most hardware companies.”', src: 'Loupe' },
  { text: '“A monitor that comes with you to the kitchen. I did not know I wanted that until it happened.”', src: 'The Desk Review' },
];

export function InTheRoom() {
  return (
    <section className={s.section} id="wear">
      <div className={s.wrap}>
        <Reveal>
          <div className={`${s.head} ${s.headRow}`}>
            <div>
              <p className={s.eyebrow}>In the room</p>
              <h2 className={s.title}>Three things a screen could never do.</h2>
            </div>
            <p className={s.lede}>
              Lucid One puts your work, your films and your models into the room
              you are already in, at the size they should have been all along.
            </p>
          </div>
        </Reveal>
        <div className={s.scenes}>
          {SCENES.map((sc, i) => (
            <Reveal key={sc.n} delay={i * 110}>
              <figure className={s.scene}>
                <Image src={sc.src} alt={sc.alt} fill sizes="(max-width: 820px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                <figcaption className={s.sceneCopy}>
                  <span className={s.sceneNo}>{sc.n}</span>
                  <h3 className={s.sceneTitle}>{sc.title}</h3>
                  <p className={s.sceneText}>{sc.text}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Worn() {
  return (
    <section className={`${s.section} ${s.sectionTint}`} id="worn">
      <div className={s.wrap}>
        <div className={s.worn}>
          <Reveal>
            <div className={s.macros}>
              <div className={s.macro}>
                <Image src="/demo/lucid/macro-frame.webp" alt="The brushed titanium lattice of the exoframe, an amber optic glowing behind it" fill sizes="(max-width: 980px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                <span className={s.macroLabel}>Exoframe · Ti 6Al-4V</span>
              </div>
              <div className={s.macro}>
                <Image src="/demo/lucid/macro-band.webp" alt="The knitted grey halo band where it meets the titanium hinge" fill sizes="(max-width: 980px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                <span className={s.macroLabel}>Halo band · knit</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className={s.head}>
              <p className={s.eyebrow}>Made to be worn</p>
              <h2 className={s.title}>The weight is on the band. The band is on you.</h2>
              <p className={s.lede}>
                Everything heavy sits at the back of the head, where necks are
                built to carry it. The visor in front weighs what a pair of
                sunglasses does, and the frame between them is mostly air.
              </p>
            </div>
            <dl className={s.facts}>
              {FACTS.map((f) => (
                <div key={f.k} className={s.fact}>
                  <dt className={s.factKey}>{f.k}</dt>
                  <dd className={s.factVal} style={{ margin: 0 }}>{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Questions() {
  return (
    <section className={s.section} id="questions">
      <div className={s.wrap}>
        <div className={s.qa}>
          <Reveal>
            <div className={s.head}>
              <p className={s.eyebrow}>Before you reserve</p>
              <h2 className={s.title}>Asked, every day, in the studios.</h2>
            </div>
            <div className={s.quotes}>
              {QUOTES.map((q) => (
                <blockquote key={q.src} className={s.quote}>
                  <p className={s.quoteText}>{q.text}</p>
                  <cite className={s.quoteSrc}>{q.src}</cite>
                </blockquote>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ borderBottom: '1px solid var(--line, #e2e2df)' }}>
              {FAQ.map((f) => (
                <details key={f.q} className={s.faq}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const FOOT = [
  { head: 'Product', links: [['Device', '#lucid-hero'], ['Teardown', '#teardown'], ['In the room', '#wear'], ['Build yours', '#buy']] },
  { head: 'Studios', links: [['London', '#contact'], ['Manchester', '#contact'], ['Bristol', '#contact']] },
  { head: 'Company', links: [['Contact', '#contact'], ['Questions', '#questions'], ['Press', '#contact']] },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div>
          <a className={s.footBrand} href="#lucid-hero">
            <Logo />
            LUCID
          </a>
          <p className={s.footBlurb}>
            Lucid One. Spatial computing that gets out of the way. Designed in
            London, assembled in Cork.
          </p>
        </div>
        {FOOT.map((col) => (
          <div key={col.head}>
            <p className={s.footHead}>{col.head}</p>
            <ul className={s.footList}>
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={s.footBase}>
        <p style={{ margin: 0 }}>
          Lucid is a concept brand built by <Link href="/case-studies">WebMinor</Link>. The device, the studios and the press are invented.
        </p>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} WebMinor</p>
      </div>
    </footer>
  );
}
