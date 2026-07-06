import type { Metadata } from 'next';
import LaunchNavbar from '@/components/launch/LaunchNavbar';
import LaunchHero from '@/components/launch/LaunchHero';

export const metadata: Metadata = {
  title: 'Launch Preview',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LaunchPage() {
  return (
    <main>
      <LaunchNavbar />
      <LaunchHero />
      <section
        id="about"
        className="flex min-h-[60vh] items-center justify-center bg-[#0B0D10] px-6 text-center text-white"
      >
        <p className="max-w-xl text-lg text-white/70">
          Orbit / About section placeholder — full content arrives in a later phase.
        </p>
      </section>
    </main>
  );
}
