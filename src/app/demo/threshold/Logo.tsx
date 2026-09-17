import s from "./threshold.module.css";

/* THRESHOLD set wide, HOLD one weight heavier. No pictorial mark. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`${s.wordmark} ${className}`} aria-label="Threshold">
      THRES<b>HOLD</b>
    </span>
  );
}
