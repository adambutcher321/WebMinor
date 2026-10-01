import s from "./burger-me.module.css";

/* Provisional wordmark (candidate 1 on /lab/logos): Bricolage 800 at its
   narrowest width, tight tracking, ME in mustard. Size it with font-size;
   colour follows currentColor, the accent follows --logo-accent. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`${s.logo}${className ? ` ${className}` : ""}`} role="img" aria-label="Burger Me">
      <span aria-hidden="true">Burger</span>
      <span aria-hidden="true" className={s.logoMe}>Me</span>
    </span>
  );
}
