"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { sessionsOn, placesLeft, hasStarted, DAYS, DAYS_LONG, type Day, type ProgrammeId } from "./timetable";
import { programmeById, coachBySlug, PROGRAMMES } from "./content";
import { useBooking } from "./BookingProvider";
import { useNow } from "./Rail";
import { Reveal } from "./motion";
import s from "./threshold.module.css";

/** The DOM id a row is given, so a closed drawer can fall back to focusing
 *  its own row once the button that opened it (Book/Waitlist) is gone. */
export const weekRowId = (sessionId: string): string => `week-row-${sessionId}`;

const dayTabId = (d: string): string => `day-tab-${d}`;
const WEEK_PANEL_ID = "week-panel";

/*
  The timetable as a typographic wall: the time is the biggest thing on the
  row. Day tabs across the top, wired as a real tablist -- roving tabindex,
  arrow keys move and select with wrap, Home/End jump to Monday/Sunday, and
  the rows list is the tabpanel the selected tab controls. Rows re-mount on
  day change (key) so the stagger runs again. `initialDay` wins; otherwise
  today once the clock ticks.
*/
export default function Week({ initialDay, programme, full = false }: { initialDay?: Day; programme?: ProgrammeId; full?: boolean }) {
  const now = useNow();
  const [picked, setPicked] = useState<Day | null>(initialDay ?? null);
  const [filter, setFilter] = useState<ProgrammeId | "all">(programme ?? "all");
  const day: Day = picked ?? now?.day ?? 0;
  const { bookedIds, bookings, openDrawer } = useBooking();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rows = sessionsOn(day).filter((x) => filter === "all" || x.programme === filter);

  const selectDay = (i: number) => {
    setPicked(i as Day);
    tabRefs.current[i]?.focus();
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight") selectDay((i + 1) % DAYS.length);
    else if (e.key === "ArrowLeft") selectDay((i - 1 + DAYS.length) % DAYS.length);
    else if (e.key === "Home") selectDay(0);
    else if (e.key === "End") selectDay(DAYS.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <section id="week" className={`${s.onFrost} ${s.week}`} data-full={full}>
      <header className={s.weekHead}>
        <div>
          <p className={s.eyebrow}>This week</p>
          <h2 className={`${s.display} ${s.h2}`}>{DAYS_LONG[day]}</h2>
        </div>
        <div role="tablist" aria-label="Day" className={s.dayTabs}>
          {DAYS.map((d, i) => (
            <button
              key={d}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={dayTabId(d)}
              role="tab"
              type="button"
              aria-selected={day === i}
              aria-controls={WEEK_PANEL_ID}
              tabIndex={day === i ? 0 : -1}
              className={s.dayTab}
              onClick={() => selectDay(i)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
            >
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

      <ul
        id={WEEK_PANEL_ID}
        role="tabpanel"
        aria-labelledby={dayTabId(DAYS[day])}
        className={s.wall}
        key={`${day}-${filter}`}
      >
        {rows.length === 0 && <li className={s.wallEmpty}>Nothing on. The floor is closed.</li>}
        {rows.map((x, i) => {
          const left = placesLeft(x, bookedIds);
          const myBooking = bookings.find((b) => b.sessionId === x.id);
          const waitlisted = myBooking?.waitlist === true;
          const booked = myBooking != null && !waitlisted;
          const started = hasStarted(now, x);
          return (
            <Reveal as="li" key={x.id} delay={i * 70} className={s.row} threshold={0.05}>
              <div
                data-testid="row"
                data-sold-out={left === 0}
                data-started={started}
                id={weekRowId(x.id)}
                tabIndex={-1}
                className={s.rowInner}
              >
                <span className={`${s.display} ${s.rowTime}`}>{x.time}</span>
                <div className={s.rowMeta}>
                  <span className={s.rowName}>{programmeById(x.programme).name}</span>
                  <span className={s.rowCoach}>with {coachBySlug(x.coach).name.split(" ")[0]}</span>
                </div>
                <span className={s.rowPlaces}>
                  {!started && (
                    <>
                      <b data-testid="places">{left}</b> {left === 1 ? "place" : "places"} left
                    </>
                  )}
                </span>
                {waitlisted ? (
                  <span className={s.rowWaitlisted}>Waitlisted</span>
                ) : booked ? (
                  <span className={s.rowBooked}>Booked</span>
                ) : started ? (
                  <span className={s.rowDone}>Done</span>
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
