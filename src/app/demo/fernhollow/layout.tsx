import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-fh",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FernhollowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${fraunces.variable} ${inter.variable}`}>{children}</div>
  );
}
