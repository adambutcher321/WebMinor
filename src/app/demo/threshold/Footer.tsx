import Link from "next/link";
import { COPY } from "./content";
import s from "./threshold.module.css";

export default function Footer() {
  return (
    <footer className={`${s.onNavy} ${s.footer}`}>
      <p className={`${s.display} ${s.footerMark}`} aria-hidden="true">Threshold</p>
      <div className={s.footerGrid}>
        <div>
          <p className={s.eyebrow}>Find us</p>
          {COPY.address.map((l) => <p key={l}>{l}</p>)}
        </div>
        <div>
          <p className={s.eyebrow}>Hours</p>
          {COPY.hours.map((l) => <p key={l}>{l}</p>)}
        </div>
        <div>
          <p className={s.eyebrow}>Pages</p>
          <p><Link href="/demo/threshold/timetable">This week</Link></p>
          <p><Link href="/demo/threshold/coaches">Coaches</Link></p>
          <p><Link href="/demo/threshold/membership">Membership</Link></p>
          <p><Link href="/demo/threshold/about">About</Link></p>
        </div>
        <div>
          <p className={s.eyebrow}>Concept</p>
          <p>A WebMinor concept build.</p>
          <p><Link href="/case-studies">Back to the work</Link></p>
        </div>
      </div>
    </footer>
  );
}
