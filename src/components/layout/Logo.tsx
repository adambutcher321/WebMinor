import Image from 'next/image';
import Link from 'next/link';

// `large` is the footer's setting: the same lockup a step up, since the
// footer has room the header does not.
export default function Logo({ className = '', large = false }: { className?: string; large?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-0 shrink-0 ${className}`}>
      <Image
        src="/images/w-mark.png"
        alt="WebMinor logo"
        width={80}
        height={80}
        loading="eager"
        className={large ? 'w-[88px] h-[88px] -mr-4' : 'w-20 h-20 -mr-3'}
      />
      <span
        className={`${large ? 'text-[26px]' : 'text-[20px]'} font-bold tracking-tight text-[#F5F7FA]`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Web<span className="text-[#40E0FF]" data-wordmark="">Minor</span>
      </span>
    </Link>
  );
}
