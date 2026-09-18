import type { Metadata } from "next";
import Coaches from "../Coaches";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "Coaches — Threshold | WebMinor Concept" } };

export default function CoachesPage() {
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>Coaches</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>Four people</h1>
        <p className={s.pageLine}>No rota, no cover. The person on the timetable is the person in the room.</p>
      </header>
      <Coaches long />
    </main>
  );
}
