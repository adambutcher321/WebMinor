"use client";

import ExplodedBurger from "../engine/ExplodedBurger";
import { bySlug } from "../engine/burgers";
import { useBag } from "../BagProvider";
import s from "../burger-me.module.css";

/* Fills the sixth cell of the grid, so five cards never leave a hole: The
   Original held fully apart, the build every card on the menu starts from. */
export default function MenuNote() {
  const bag = useBag();
  return (
    <div className={s.menuNote}>
      <div className={s.menuNoteStage}>
        <ExplodedBurger burger={bySlug("the-original")!} explode={1} labels={0} />
      </div>
      <p className={s.display}>Same build, every time.</p>
      <button className={s.btn} onClick={() => bag.setOpen(true)}>Order for collection</button>
    </div>
  );
}
