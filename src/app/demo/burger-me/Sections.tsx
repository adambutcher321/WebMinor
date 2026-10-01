"use client";

import Link from "next/link";
import ExplodedBurger from "./engine/ExplodedBurger";
import { bySlug, formatPrice } from "./engine/burgers";
import { HOURS, LOCATIONS, SOURCING } from "./content";
import { useBag } from "./BagProvider";
import s from "./burger-me.module.css";

const TEASER = ["the-original", "bacon-cheese", "smokehouse"].map((slug) => bySlug(slug)!);

export function MenuTeaser() {
  return (
    <section className={s.teaser} aria-labelledby="teaser-title">
      <h2 id="teaser-title" className={`${s.display} ${s.teaserTitle}`}>Five burgers. One way of building them.</h2>
      <ul className={s.teaserGrid}>
        {TEASER.map((b) => (
          <li key={b.slug}>
            <Link href={`/demo/burger-me/menu/${b.slug}`} className={s.teaserCard}>
              <div className={s.teaserPanel}>
                <ExplodedBurger burger={b} explode={0} compact />
              </div>
              <div className={s.teaserMeta}>
                <h3 className={`${s.display} ${s.teaserName}`}>{b.name}</h3>
                <span className={`${s.price} ${s.teaserPrice}`}>{formatPrice(b.price)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/demo/burger-me/menu" className={`${s.btn} ${s.teaserCta}`}>See the full menu</Link>
    </section>
  );
}

export function Sourcing() {
  return (
    <section id="beef" className={s.sourcing} aria-labelledby="beef-title">
      <p className={`${s.kicker} ${s.kickerInk}`}>{SOURCING.kicker}</p>
      <h2 id="beef-title" className={`${s.display} ${s.sourcingTitle}`}>{SOURCING.title}</h2>
      <p className={s.sourcingBody}>{SOURCING.body}</p>
      <dl className={s.facts}>
        {SOURCING.facts.map((f) => (
          <div key={f.k} className={s.fact}>
            <dt className={`${s.display} ${s.factNum}`}>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function FindUs() {
  const bag = useBag();
  return (
    <section id="find-us" className={`${s.findUs} ${s.stageGround}`} aria-labelledby="find-title">
      <h2 id="find-title" className={`${s.display} ${s.findTitle}`}>Find us</h2>
      <div className={s.findGrid}>
        {LOCATIONS.map((l) => (
          <div key={l.name} className={s.loc}>
            <h3 className={`${s.display} ${s.locName}`}>{l.name}</h3>
            <p>{l.address}</p>
            <BranchMap name={l.name} town={l.town} address={l.address} />
          </div>
        ))}
      </div>
      <div className={s.findFoot}>
        <div>
          <h3 className={s.footerH}>Hours, both sites</h3>
          <dl className={s.hours}>
            {HOURS.map((h) => (<div key={h.d} style={{ display: "contents" }}><dt>{h.d}</dt><dd>{h.h}</dd></div>))}
          </dl>
        </div>
        <button className={s.btn} onClick={() => bag.setOpen(true)}>Order for collection</button>
      </div>
    </section>
  );
}

/* A Google Maps embed recoloured into the brand: the map is greyscaled and
   inverted to a dark ground with light roads, then a mustard multiply turns
   the roads mustard and an oxblood screen lifts the ground to the stage
   colour. Google's own pin would come out green, so a branded pin sits over
   it (the embed always centres on the searched address). Overlays ignore the
   pointer, so the map still pans and zooms. */
function BranchMap({ name, town, address }: { name: string; town: string; address: string }) {
  const q = encodeURIComponent(`${address}, UK`);
  return (
    <div className={s.map}>
      <iframe
        className={s.mapFrame}
        src={`https://www.google.com/maps?q=${q}&z=16&output=embed`}
        title={`Map of Burger Me ${name}, ${town}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <span className={s.mapTintRoads} aria-hidden="true" />
      <span className={s.mapTintGround} aria-hidden="true" />
      <span className={s.mapPin} aria-hidden="true">
        <svg viewBox="0 0 40 52"><path d="M20 51C20 51 38 30.5 38 19A18 18 0 0 0 2 19c0 11.5 18 32 18 32Z" /><circle cx="20" cy="19" r="7" /></svg>
      </span>
      <a className={s.mapLink} href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener noreferrer">
        Directions <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}
