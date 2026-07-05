import type { Metadata } from "next";
import { Inter, Space_Mono, Sora } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/sections/VideoBackground";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollAnimations from "@/components/sections/ScrollAnimations";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WebMinor — Websites That Get South West Tradespeople More Local Jobs",
    template: "%s | WebMinor",
  },
  description:
    "WebMinor builds fast, conversion-focused websites for plumbers, electricians, roofers and builders across the South West. Transparent pricing from £49/mo. Based in Saltash, Cornwall.",
  metadataBase: new URL("https://webminor.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://webminor.com",
    siteName: "WebMinor",
    title: "WebMinor — Websites That Get South West Tradespeople More Local Jobs",
    description:
      "Fast, SEO-optimised websites for local trades businesses. Transparent pricing. 5-day delivery. Based in Saltash, Cornwall.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${spaceMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0D10] text-[#F5F7FA] font-[family-name:var(--font-inter)] overflow-x-hidden">
        <VideoBackground />
        <Header />
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
          <Footer />
        </div>
        <WhatsAppButton />
        <ScrollAnimations />
      </body>
    </html>
  );
}
