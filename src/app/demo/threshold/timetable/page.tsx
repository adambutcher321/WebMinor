import type { Metadata } from "next";
import Week from "../Week";
import { PROGRAMMES } from "../content";
import type { ProgrammeId } from "../timetable";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "This week — Threshold | WebMinor Concept" } };

export default async function TimetablePage({ searchParams }: { searchParams: Promise<{ programme?: string }> }) {
  const { programme } = await searchParams;
  const valid = PROGRAMMES.some((p) => p.id === programme) ? (programme as ProgrammeId) : undefined;
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>Timetable</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>This week</h1>
        <p className={s.pageLine}>Every session, every day. Book a place, or take the waitlist on a full one.</p>
      </header>
      <Week full programme={valid} />
    </main>
  );
}
