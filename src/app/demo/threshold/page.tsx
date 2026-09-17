import type { Metadata } from "next";
import Hero from "./Hero";

export const metadata: Metadata = {
  title: { absolute: "Threshold — Strength and conditioning, coached | WebMinor Concept" },
};

export default function ThresholdHome() {
  return (
    <main>
      <Hero />
    </main>
  );
}
