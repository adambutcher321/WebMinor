import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import { CartProvider } from "./CartProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* The basket lives here so it survives navigation between the four pages. */
export default function BoucherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${montserrat.variable} ${manrope.variable}`}>
      <CartProvider>{children}</CartProvider>
    </div>
  );
}
