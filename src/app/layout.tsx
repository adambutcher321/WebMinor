import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/sections/VideoBackground";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollAnimations from "@/components/sections/ScrollAnimations";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";
import FirstTouch from "@/components/analytics/FirstTouch";

/*
  One family, doing every job (webminor-bar.md §1). Adam ruled on 2026-08-23 that
  the bar wins over the three-family system, so Sora, Inter and Space Mono are
  gone and Space Grotesk does display, body, nav and micro-labels alike,
  differentiated by size, weight and tracking only.

  Space Grotesk rather than a neutral grotesque because it is the proportional
  sibling of the Space Mono the site already spoke in: the wide-tracked
  micro-label voice survives the collapse, and it has enough character at 56px to
  carry a display statement without a second face propping it up.

  The three old variable names are kept as aliases so ~350 existing utility
  usages across 13 routes keep resolving. They all point at the one font now — a
  font-family census reads a single family, which is what the mechanism checks.
*/
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Website Design in Cornwall & Devon | WebMinor",
    template: "%s | WebMinor",
  },
  description:
    "Free website design for Cornwall and Devon businesses, with hosting at £50 a month plus VAT, local SEO and Google Ads. A one-person studio in Saltash.",
  metadataBase: new URL("https://www.webminor.co.uk"),
  // "./" resolves against each route's own path, so every page inherits a
  // self-referencing canonical without having to declare one.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.webminor.co.uk",
    siteName: "WebMinor",
    title: "WebMinor — Free Website Design for Local Businesses",
    description:
      "Your website designed free, hosting £50 a month plus VAT, and you see your home page first. A one-person studio in Saltash, Cornwall.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "WebMinor — Free Website Design for Local Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebMinor — Free Website Design for Local Businesses",
    description:
      "Your website designed free, hosting £50 a month plus VAT, and you see your home page first. A one-person studio in Saltash, Cornwall.",
    images: ["/images/og-default.jpg"],
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
      className={`${display.variable} dark h-full antialiased bg-[#0B0D10]`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0D10] text-[#F5F7FA] font-[family-name:var(--font-display)] overflow-x-hidden">
        <OrganizationSchema />
        <WebSiteSchema />
        <FirstTouch />
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
