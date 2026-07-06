import Link from 'next/link';

export default function LaunchNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="font-[family-name:var(--font-sora)] text-lg font-bold text-white">
        Web<span className="text-[#40E0FF]">Minor</span>
      </Link>
      <Link
        href="/contact"
        className="rounded-full border border-white/20 px-5 py-2 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wide text-white transition-colors hover:border-[#40E0FF] hover:text-[#40E0FF]"
      >
        Get In Touch
      </Link>
    </nav>
  );
}
