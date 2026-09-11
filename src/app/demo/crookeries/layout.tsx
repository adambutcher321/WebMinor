import type { Metadata } from "next";
import { CartProvider } from "./CartProvider";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Decides whether the intro runs *during HTML parse*, before anything is painted.
 *
 * Hydration is too late for this: the overlay ships visible in the server HTML so the
 * first visit never flashes the finished page, which means a returning visitor would
 * otherwise see that overlay until React booted. This runs first and marks the document
 * so the stylesheet can drop the overlay before it is ever drawn.
 */
const INTRO_GATE = `try{
  var s=false;try{s=sessionStorage.getItem('crookeries-intro-seen')==='1'}catch(e){s=true}
  if(s||matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.setAttribute('data-crookeries-intro','skip')
  }
}catch(e){}`;

export default function CrookeriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      {/* The basket is mounted here, not in the page, so it is not torn down
          and remounted when the visitor navigates to /checkout. */}
      <CartProvider>{children}</CartProvider>
    </>
  );
}
