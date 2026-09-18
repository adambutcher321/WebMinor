import type { Metadata } from "next";
import Membership from "../Membership";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "Membership — Threshold | WebMinor Concept" } };

export default function MembershipPage() {
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>Membership</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>One slider</h1>
        <p className={s.pageLine}>Sessions a week, that&apos;s the only choice. Coaching, the open floor and the mobility sessions are in every level.</p>
      </header>
      <Membership standalone />
    </main>
  );
}
