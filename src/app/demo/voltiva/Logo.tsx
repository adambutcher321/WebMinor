/*
  The Voltiva mark from the brand sheet: a solid V with a lightning bolt cutting
  through its right arm. Drawn as SVG rather than shipped as a bitmap so it stays
  crisp at every size and can take the two colourways the sheet specifies —
  ink-on-light for the header on `--paper`, white-on-dark for the footer.
*/
export default function VoltivaLogo({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 44 40"
        className="h-8 w-8 shrink-0"
        role="img"
        aria-label="Voltiva Electrical"
      >
        <path
          d="M2 3h9.5l9 23.5L27 3h4l-11 34h-6.5L2 3Z"
          fill={onDark ? "#F5F7FA" : "#0B1D33"}
        />
        <path d="M33 1 20.5 21h8L24.5 39 42 16.5h-9L37.5 1H33Z" fill="#1677FF" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[16px] font-extrabold tracking-[0.14em] ${
            onDark ? "text-[#F5F7FA]" : "text-[#0B1D33]"
          }`}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          VOLTIVA
        </span>
        <span
          className="mt-1 text-[8px] font-semibold tracking-[0.34em] text-[#0FA3A6]"
          style={{ fontFamily: "var(--font-inter-vt)" }}
        >
          ELECTRICAL
        </span>
      </span>
    </span>
  );
}
