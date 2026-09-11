"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";
import MindfulNav from "./Nav";

type Stage = "idle" | "playing" | "revealed";

const SESSION_CARDS = [
  {
    title: "1:1 Private Session",
    blurb: "One-on-one coaching, tailored to your body and your goals.",
    image: "/demo/mindful/lotus.webp",
  },
  {
    title: "Group Flow Class",
    blurb: "Small, friendly groups moving through a guided flow together.",
    image: "/demo/mindful/warrior.webp",
  },
  {
    title: "Retreat Day",
    blurb: "A full day of movement, breathwork, and quiet in the meadow.",
    image: "/demo/mindful/hero-wave-v2.webp",
  },
];

export default function InteractiveHero() {
  const [stage, setStage] = useState<Stage>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    setStage("playing");
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
    });
  };

  const handleReset = () => {
    setStage("idle");
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <div className="relative h-[100svh] w-full overflow-hidden bg-[#dce8d8]">
        <Image
          src="/demo/mindful/hero-wave-v2.webp"
          alt="Jessica waving, ready to begin your yoga session"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className={`object-cover transition-opacity duration-700 ${
            stage === "idle" ? "opacity-100" : "opacity-0"
          }`}
        />
        <video
          ref={videoRef}
          src="/demo/mindful/wave-to-pose-v2.mp4"
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          onEnded={() => setStage("revealed")}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            stage === "playing" ? "opacity-100" : "opacity-0"
          }`}
        />
        <Image
          src="/demo/mindful/pose-mountain.webp"
          alt="Jessica settled into a calm yoga pose"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${
            stage === "revealed" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

        <div className="absolute inset-x-0 top-0 z-30">
          <MindfulNav transparent />
        </div>

        {/* Overlay copy + controls */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 pointer-events-none pt-28 sm:pt-32">
          <p
            className={`max-w-xs text-white text-sm sm:text-base leading-snug uppercase tracking-wide transition-opacity duration-500 ${
              stage === "idle" ? "opacity-100" : "opacity-0"
            }`}
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
          >
            Find your focus, arrange private yoga sessions, and live the
            mindful way
          </p>

          {/*
            On a phone "Jessica", the Let's Start button and "Yoga Coach" were
            fighting over one 390px row: the button wrapped to two lines and sat
            hard against both display words. The two words are the composition
            and stay on one line together; the button takes its own row above
            them. From `sm` up, flex order restores the original arrangement —
            name, button, role — so the desktop design is untouched.
          */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="pointer-events-auto sm:order-2">
              {stage === "idle" && (
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2b2a26] text-white text-sm font-semibold px-6 py-3.5 hover:bg-[#3d3b34] transition-colors shadow-lg"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  <Play className="w-4 h-4" fill="currentColor" aria-hidden="true" />
                  Let&rsquo;s Start
                </button>
              )}
              {stage === "revealed" && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-full bg-white/90 text-[#2b2a26] text-sm font-semibold px-6 py-3.5 hover:bg-white transition-colors shadow-lg"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Back to Start
                </button>
              )}
            </div>

            <div className="flex items-end justify-between gap-4 sm:contents">
              <div
                className={`transition-opacity duration-500 sm:order-1 ${
                  stage === "idle" ? "opacity-100" : "opacity-0"
                }`}
              >
                <p
                  className="text-white/70 text-sm"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Hey, I am
                </p>
                <h1
                  className="text-white text-5xl sm:text-7xl leading-none"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
                >
                  Jessica
                  <span className="sr-only">, yoga coach</span>
                </h1>
              </div>

              <div
                className={`text-right transition-opacity duration-500 sm:order-3 ${
                  stage === "idle" ? "opacity-100" : "opacity-0"
                }`}
              >
                <p
                  className="text-white text-3xl sm:text-6xl leading-none"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
                >
                  Yoga
                  <br />
                  Coach
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session cards — reveal below the hero once the pose plays through */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-out ${
          stage === "revealed" ? "max-h-[1800px] sm:max-h-[600px]" : "max-h-0"
        }`}
      >
        <div
          className={`max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-6 transition-all duration-700 ${
            stage === "revealed"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          {SESSION_CARDS.map((card) => (
            <Link
              key={card.title}
              href="/demo/mindful/sessions"
              className="group relative rounded-2xl overflow-hidden bg-white shadow-xl border border-black/5 transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative h-40">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p
                  className="text-lg text-[#2b2a26]"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
                >
                  {card.title}
                </p>
                <p
                  className="text-xs text-[#2b2a26]/60 mt-1 leading-relaxed"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {card.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
