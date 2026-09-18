import type { Metadata } from "next";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import ProgrammesRail from "./ProgrammesRail";
import Week from "./Week";
import Coaches from "./Coaches";

export const metadata: Metadata = {
  title: { absolute: "Threshold — Strength and conditioning, coached | WebMinor Concept" },
};

export default function ThresholdHome() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <ProgrammesRail />
      <Week />
      <Coaches />
    </main>
  );
}
