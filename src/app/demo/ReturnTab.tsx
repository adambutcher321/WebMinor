import Link from "next/link";
import s from "./returnTab.module.css";

export default function ReturnTab() {
  return (
    <Link href="/case-studies" className={s.tab} aria-label="Return to the WebMinor website">
      <svg className={s.arrow} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M13 8H3m0 0 4-4M3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={s.label}>
        Return to <b>WebMinor</b>
      </span>
    </Link>
  );
}
