export default function RuggedLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#111111" />
      <rect x="1" y="1" width="30" height="30" rx="9" stroke="#f5f5f7" strokeOpacity="0.12" />
      <path d="M6 22.5L13 9l4.2 8.2L20.5 12 26 22.5" stroke="#f5f5f7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M17.2 17.2L20.5 12l1.8 3.4" stroke="#f56900" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
