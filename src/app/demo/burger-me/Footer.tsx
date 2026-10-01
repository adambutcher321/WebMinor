import { FOOTER, HOURS, LOCATIONS } from "./content";
import s from "./burger-me.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <p className={`${s.display} ${s.footerWord}`} aria-hidden="true">Burger Me</p>
      <div className={s.footerGrid}>
        <p className={s.footerLine}>{FOOTER.line}</p>
        {LOCATIONS.map((l) => (
          <div key={l.name}>
            <h3 className={s.footerH}>{l.name}</h3>
            <p>{l.address}</p>
          </div>
        ))}
        <div>
          <h3 className={s.footerH}>Hours</h3>
          <dl>
            {HOURS.map((h) => (<div key={h.d} style={{ display: "contents" }}><dt>{h.d}</dt><dd>{h.h}</dd></div>))}
          </dl>
        </div>
      </div>
      <p className={s.footerSmall}>{FOOTER.small}</p>
    </footer>
  );
}
