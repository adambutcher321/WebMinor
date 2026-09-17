"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCountdown, minutesUntil, nextClass, DAYS, type Day } from "./timetable";
import { programmeById } from "./content";
import { useBooking } from "./BookingProvider";
import s from "./threshold.module.css";

/*
  The rail. Fixed to the left edge from 1024px: a section index, a live
  countdown to the next class, and socials. Below 1024px it becomes a bottom
  bar with Book and Join. The clock is read only inside an effect so the
  server HTML never contains a time.
*/

const SECTIONS = [
  { id: "programmes", label: "Programmes" },
  { id: "week", label: "This week" },
  { id: "coaches", label: "Coaches" },
  { id: "membership", label: "Membership" },
  { id: "space", label: "The space" },
];

export function useNow(): { day: Day; minutes: number } | null {
  const [now, setNow] = useState<{ day: Day; minutes: number } | null>(null);
  useEffect(() => {
    const read = () => {
      const d = new Date();
      setNow({ day: ((d.getDay() + 6) % 7) as Day, minutes: d.getHours() * 60 + d.getMinutes() });
    };
    const t = setTimeout(read, 0);
    const i = setInterval(read, 15_000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);
  return now;
}

export default function Rail() {
  const now = useNow();
  const { setJoinOpen } = useBooking();
  const next = now ? nextClass(now) : null;
  const gap = now && next ? formatCountdown(minutesUntil(now, next)) : "--:--";

  return (
    <aside className={s.rail} aria-label="Site rail">
      <div className={s.railTop}>
        <span className={s.railLabel}>Next class</span>
        <span className={s.railClock} data-testid="countdown">{gap}</span>
        <span className={s.railNext} data-testid="next-name">
          {next ? `${programmeById(next.programme).name} · ${DAYS[next.day]} ${next.time}` : " "}
        </span>
      </div>

      <nav className={s.railIndex} aria-label="Sections">
        {SECTIONS.map((x) => (
          <a key={x.id} href={`/demo/threshold#${x.id}`} className={s.railDot}>
            <i />
            <span>{x.label}</span>
          </a>
        ))}
      </nav>

      <div className={s.railSocial}>
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="YouTube">YT</a>
      </div>

      <div className={s.railBar}>
        <Link href="/demo/threshold/timetable" className={s.pill}>Book</Link>
        <button type="button" className={s.pillGhost} onClick={() => setJoinOpen(true)}>Join</button>
      </div>
    </aside>
  );
}
