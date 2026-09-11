import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KLIK — Money moves. So should you. (WebMinor concept)',
  description:
    'KLIK — send it, split it, tap it, spend it. A consumer payments concept by WebMinor.',
  robots: { index: false, follow: false },
};

/**
 * Decides during HTML parse whether the opening sequence runs, before anything paints.
 * Same gate as the Crookeries demo: the overlay ships visible in the server HTML so a
 * first visit never flashes the page behind it, which makes hydration too late to
 * decide for a returning visitor.
 */
const INTRO_GATE = `try{
  var s=false;try{s=sessionStorage.getItem('klik-intro-seen')==='1'}catch(e){s=true}
  if(s||matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.setAttribute('data-klik-intro','skip')
  }
}catch(e){}`;

export default function KlikLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      {children}
    </>
  );
}
