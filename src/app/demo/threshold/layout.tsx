import type { Metadata } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import { BookingProvider } from "./BookingProvider";
import Rail from "./Rail";
import Nav from "./Nav";
import Footer from "./Footer";
import s from "./threshold.module.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Threshold — Strength and conditioning, coached | WebMinor Concept" },
  description:
    "A concept strength studio by WebMinor: cold dual-lit photography, a live timetable you can book into, and a membership slider that prices as you move it.",
  robots: { index: false, follow: false },
};

/* Booking state lives here so it survives navigation between the five pages.
   Rail, Nav and Footer wrap every page. */
export default function ThresholdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${archivo.variable} ${instrument.variable} ${s.site}`}>
      <BookingProvider>
        <Rail />
        <Nav />
        {children}
        <Footer />
      </BookingProvider>
    </div>
  );
}
