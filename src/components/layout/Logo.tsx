import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-0 shrink-0 ${className}`}>
      <Image
        src="/images/w-icon.png"
        alt="WebMinor logo"
        width={80}
        height={80}
        className="w-20 h-20 -mr-3"
      />
      <span
        className="text-[16px] font-bold tracking-tight text-[#F5F7FA]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Web<span className="text-[#40E0FF]">Minor</span>
      </span>
    </Link>
  );
}
