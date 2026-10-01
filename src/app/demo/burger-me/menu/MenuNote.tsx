"use client";

import { useBag } from "../BagProvider";
import s from "../burger-me.module.css";

/* Fills the sixth cell of the grid, so five cards never leave a hole. */
export default function MenuNote() {
  const bag = useBag();
  return (
    <div className={s.menuNote}>
      <p className={s.display}>Same build, every time.</p>
      <button className={s.btn} onClick={() => bag.setOpen(true)}>Order for collection</button>
    </div>
  );
}
