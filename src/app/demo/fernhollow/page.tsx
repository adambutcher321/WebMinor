import type { Metadata } from "next";
import { Star } from "lucide-react";
import FernhollowNav from "./Nav";
import FernhollowHeroVideo from "./HeroVideo";
import BookingWidget from "./BookingWidget";
import FernhollowFooter from "./Footer";
import { BasketProvider } from "./BasketProvider";
import Cabins from "./sections/Cabins";
import Included from "./sections/Included";
import Extras from "./sections/Extras";
import Place from "./sections/Place";
import GuestWords from "./sections/GuestWords";
import BasketBar from "./sections/BasketBar";
import s from "./sections/fernhollow-sections.module.css";

export const metadata: Metadata = {
  // `absolute` because the root layout applies a "%s | WebMinor" template, which
  // was rendering "Fernhollow — Concept Demo | WebMinor | WebMinor".
  title: { absolute: "Fernhollow — Concept Demo | WebMinor" },
  description:
    "A concept short-stay booking site design by WebMinor, showing the kind of premium web design and booking commerce we can build for hospitality and travel businesses.",
};

export default function FernhollowHomePage() {
  return (
    <BasketProvider>
      <div className={s.root}>
        {/*
          The hero was three absolutely-positioned blocks over a fixed-height
          screen: headline top-left, blurb bottom-left, booking widget
          bottom-right. On a phone they landed on top of each other — the widget
          covered both the last line of the headline and the whole blurb. It is a
          flow layout now, which leaves the desktop composition identical (blurb
          and widget on one baseline row at the foot of the screen) and lets the
          same three blocks stack in order on a narrow screen.
        */}
        <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#0d1210] text-white">
          <FernhollowHeroVideo />

          <div className="relative z-10 flex flex-1 flex-col">
            <FernhollowNav transparent />

            <div className="max-w-2xl px-6 pt-[10vh] sm:px-10 sm:pt-[14vh]">
              <p
                className="mb-6 text-xs uppercase tracking-[0.25em] text-amber-300/90"
                style={{ fontFamily: "var(--font-inter-fh)" }}
              >
                Highland Lochs &amp; Beyond
              </p>
              <h1
                className="text-5xl leading-[1.05] sm:text-7xl md:text-8xl"
                style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
              >
                Your Escape
                <br />
                <span className="italic text-white/55">Into The</span>
                <br />
                Quiet Wild
              </h1>
            </div>

            <div className="mt-auto flex flex-col gap-8 px-6 pb-10 pt-14 sm:px-10 sm:pb-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xs">
                <p
                  className="mb-4 text-sm leading-relaxed text-white/70"
                  style={{ fontFamily: "var(--font-inter-fh)" }}
                >
                  Four cabins in the wildest, quietest corners of the map.
                  Unplug, breathe, and reconnect with what matters most.
                </p>
                <div
                  className="flex items-center gap-2"
                  style={{ fontFamily: "var(--font-inter-fh)" }}
                >
                  <Star
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">4.9</span>
                  <span className="text-sm text-white/60">from 2,400+ stays</span>
                </div>
              </div>

              <BookingWidget />
            </div>
          </div>
        </main>

        {/* The body: choose a cabin, see what it comes with, add to the stay,
            then one plate of the place before the closing proof. */}
        <Cabins />
        <Included />
        <Extras />
        <Place />
        <GuestWords />

        {/* The clearance belongs to the footer, not to the section above it:
            on the paper section it opened an unpainted dark gap between the
            last band and the footer, and it is the footer's own credit line
            that the dock was covering. */}
        <div className={s.dockClearance}>
          <FernhollowFooter />
        </div>
        <BasketBar />
      </div>
    </BasketProvider>
  );
}
