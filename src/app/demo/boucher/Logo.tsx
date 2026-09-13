/*
  The Boucher Tailored mark.

  A quilted badge: the rounded label that sits on the jacket's sleeve, with
  three stitched baffles inside it. It is pure geometry, so it is the same
  shape at 20px in the nav and at 200px on a hang tag, and it takes whatever
  colour the page is.

  The wordmark stacks BOUCHER in the heavy weight over TAILORED in the light
  one, tracked wide, so the two words read as one name at any size.
*/
export function Monogram({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3h24a9 9 0 0 1 9 9v24a9 9 0 0 1-9 9H12a9 9 0 0 1-9-9V12a9 9 0 0 1 9-9zm0 4a5 5 0 0 0-5 5v24a5 5 0 0 0 5 5h24a5 5 0 0 0 5-5V12a5 5 0 0 0-5-5H12z" />
      <rect x="12" y="12.5" width="24" height="6.5" rx="3.25" />
      <rect x="12" y="20.75" width="24" height="6.5" rx="3.25" />
      <rect x="12" y="29" width="24" height="6.5" rx="3.25" />
    </svg>
  );
}

export function Wordmark({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monogram size={compact ? 26 : 32} />
      <span className="hidden sm:flex flex-col leading-none" style={{ fontFamily: "var(--display)" }}>
        <span className="font-extrabold tracking-[0.14em]" style={{ fontSize: compact ? 13 : 15 }}>
          BOUCHER
        </span>
        <span className="font-medium tracking-[0.42em] opacity-85" style={{ fontSize: compact ? 7 : 8, marginTop: 4 }}>
          TAILORED
        </span>
      </span>
    </span>
  );
}
