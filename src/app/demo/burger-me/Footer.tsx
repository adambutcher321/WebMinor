import Link from "next/link";
import { FOOTER } from "./content";
import s from "./burger-me.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <p className={`${s.display} ${s.footerWord}`} aria-hidden="true">Burger Me</p>
      <div className={s.footerGrid}>
        <p className={s.footerLine}>{FOOTER.line}</p>
        <Link href="/demo/burger-me#find-us" className={s.footerLink}>Find us <span aria-hidden="true">&rarr;</span></Link>
      </div>
      <p className={s.footerSmall}>{FOOTER.small}</p>
    </footer>
  );
}
