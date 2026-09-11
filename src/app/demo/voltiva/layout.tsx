import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";

/*
  Two families, exactly as the Voltiva brand sheet specifies: Montserrat Bold for
  headings, Inter Regular for body (voltiva-design-system.md §2).
*/
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-vt",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function VoltivaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${montserrat.variable} ${inter.variable}`}>{children}</div>
  );
}
