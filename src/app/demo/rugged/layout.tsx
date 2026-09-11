import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter-rugged",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rugged — Concept Demo | WebMinor",
  description:
    "A concept product site design by WebMinor for a rugged outdoor watch brand, showing the kind of premium, cinematic web design we can build for hardware and lifestyle brands.",
  robots: { index: false, follow: false },
};

export default function RuggedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={inter.variable}>{children}</div>;
}
