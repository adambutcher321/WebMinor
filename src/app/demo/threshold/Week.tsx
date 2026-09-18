"use client";

import { useState } from "react";
import { sessionsOn, placesLeft, DAYS, DAYS_LONG, type Day, type ProgrammeId } from "./timetable";
import { programmeById, coachBySlug, PROGRAMMES } from "./content";
import { useBooking } from "./BookingProvider";
import { useNow } from "./Rail";
import { Reveal } from "./motion";
import s from "./threshold.module.css";

/*
  The timetable as a typographic wall: the time is the biggest thing on the
  row. Day tabs across the top; rows re-mount on day change (key) so the
  stagger runs again. `initialDay` wins; otherwise today once the clock ticks.
*/
export default function Week({ initialDay, programme, full = false }: { initialDay?: Day; programme?: ProgrammeId; full?: boolean }) {
  const now = useNow();
  const [picked, setPicked] = useState<Day | null>(initialDay ?? null);
  const [filter, setFilter] = useState<ProgrammeId | "all">(programme ?? "all");
  const day: Day = picked ?? now?.day ?? 0;
  const { bookedIds, openDrawer } = useBooking();

  const rows = sessionsOn(day).filter((x) => filter === "all" || x.programme === filter);

  return (
    <section id="week" className={`${s.onFrost} ${s.week}`} data-full={full}>
      <header className={s.weekHead}>
        <div>
          <p className={s.eyebrow}>This week</p>
          <h2 className={`${s.display} ${s.h2}`}>{DAYS_LONG[day]}</h2>
        </div>
        <div role="tablist" aria-label="Day" className={s.dayTabs}>
          {DAYS.map((d, i) => (
            <button key={d} role="tab" type="button" aria-selected={day === i} className={s.dayTab} onClick={() => setPicked(i as Day)}>
              {d}
            </button>
          ))}
        </div>
      </header>

      {full && (
        <div className={s.filterRow} role="group" aria-label="Programme">
          <button type="button" data-on={filter === "all"} onClick={() => setFilter("all")}>All</button>
          {PROGRAMMES.map((p) => (
            <button key={p.id} type="button" data-on={filter === p.id} onClick={() => setFilter(p.id)}>{p.name}</button>
          ))}
        </div>
      )}

      <ul className={s.wall} key={`${day}-${filter}`}>
        {rows.length === 0 && <li className={s.wallEmpty}>Nothing on. The floor is closed.</li>}
        {rows.map((x, i) => {
          const left = placesLeft(x, bookedIds);
          const mine = bookedIds.includes(x.id);
          return (
            <Reveal as="li" key={x.id} delay={i * 70} className={s.row} threshold={0.05}>
              <div data-testid="row" data-sold-out={left === 0} className={s.rowInner}>
                <span className={`${s.display} ${s.rowTime}`}>{x.time}</span>
                <div className={s.rowMeta}>
                  <span className={s.rowName}>{programmeById(x.programme).name}</span>
                  <span className={s.rowCoach}>with {coachBySlug(x.coach).name.split(" ")[0]}</span>
                </div>
                <span className={s.rowPlaces}>
                  <b data-testid="places">{left}</b> {left === 1 ? "place" : "places"} left
                </span>
                {mine ? (
                  <span className={s.rowBooked}>Booked</span>
                ) : (
                  <button type="button" className={left === 0 ? s.pillGhost : s.pill} onClick={() => openDrawer(x)}>
                    {left === 0 ? "Waitlist" : "Book"}
                  </button>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
