import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InteractiveHero from "./InteractiveHero";
import MindfulFooter from "./Footer";
import { Reveal, Counter, Marquee } from "./motion";
import { Button, Eyebrow, Faq, SectionHead } from "./ui";
import { BASE, FAQ, GUIDE, IMG, POSTS, RESET, RETREATS, STATS, TESTIMONIALS, WAYS } from "./content";
import s from "./mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: "Mindful — Private yoga and breath coaching with Jessica | WebMinor Concept" },
  description:
    "A concept wellness-coaching site by WebMinor: private sessions, small group flow, The Reset eight-week programme, retreats and a journal.",
};

const FEELS = [
  "Stiff before you have stood up.",
  "Tired by three, wired by eleven.",
  "A yoga app you opened twice.",
  "Shoulders somewhere near your ears.",
  "Meaning to start, for about four years.",
];

export default function MindfulHomePage() {
  const nextRetreat = RETREATS[0];
  const posts = POSTS.slice(0, 3);

  return (
    <main className={s.page}>
      <InteractiveHero />

      {/* Do you ever feel — the pain points, named plainly, then the turn. */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Sound familiar?</Eyebrow>
            <h2 className={`${s.h2} mt-4`}>Do you ever feel&hellip;</h2>
            <p className={`${s.body} mt-6 max-w-md`}>
              Most people who find me are not looking for yoga. They are looking
              for a version of the day that does not start with an ache and end
              with a phone in bed. That is a smaller problem than it feels, and
              it is the one I work on.
            </p>
            <Button href={`${BASE}/the-reset`} variant="ghost" className="mt-8">
              Start with The Reset
            </Button>
          </Reveal>
          <Reveal stagger className="lg:col-span-7 lg:pt-2">
            {FEELS.map((f, i) => (
              <p
                key={f}
                className={`${s.lede} py-5 flex items-baseline gap-6`}
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <span className={`${s.eyebrow} tabular-nums`} style={{ color: "var(--ink-mute)" }}>
                  0{i + 1}
                </span>
                {f}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Three ways in. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <SectionHead
            eyebrow="Work with me"
            title={
              <>
                Four ways in, and none of them <span className={s.italic}>need you to be flexible.</span>
              </>
            }
          />
        </Reveal>
        <Reveal stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {WAYS.map((w) => (
            <Link key={w.slug} href={`${BASE}/work-with-me#${w.slug}`} className={`${s.card} group flex flex-col`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={w.image} alt={w.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={`object-cover ${s.zoom}`} />
              </div>
              <div className="p-7 sm:p-8 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <p className={s.eyebrow}>{w.eyebrow}</p>
                  <p className={s.small}>
                    <span style={{ color: "var(--ink)", fontFamily: "var(--serif)", fontSize: "1.35rem", fontWeight: 600 }}>{w.price}</span> {w.unit}
                  </p>
                </div>
                <h3 className={`${s.h3} mt-3`}>{w.name}</h3>
                <p className={`${s.body} mt-3`}>{w.promise}</p>
                <span className={`${s.btn} ${s.btnGhost} mt-6`}>
                  Read more
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* The Reset — the signature programme, given the full width. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <div className={`${s.inkPanel} grid grid-cols-1 lg:grid-cols-2 overflow-hidden`}>
            <div className="relative min-h-[360px] lg:min-h-[560px]">
              <Image src={RESET.image} alt={RESET.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-10 sm:p-14 flex flex-col justify-center">
              <p className={s.eyebrow} style={{ color: "#b9c9b1" }}>
                The signature programme
              </p>
              <h2 className={`${s.h2} mt-4`}>{RESET.name}</h2>
              <p className={`${s.lede} mt-5`} style={{ color: "rgba(255,255,255,0.85)" }}>
                {RESET.strap}
              </p>
              <p className={`${s.body} mt-5`} style={{ color: "rgba(255,255,255,0.65)" }}>
                {RESET.promise} Eight private hours with me, a filmed ten-minute practice
                that changes as you do, and someone who notices when you stop.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <p style={{ color: "#fff" }}>
                  <span className={s.numeral} style={{ fontSize: "2.4rem" }}>{RESET.price}</span>
                  <span className={s.small} style={{ color: "rgba(255,255,255,0.55)" }}> {RESET.priceNote}</span>
                </p>
                <p className={s.small} style={{ color: "rgba(255,255,255,0.55)" }}>
                  {RESET.places} · {RESET.starts}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={`${BASE}/the-reset`} variant="onInk" arrow>
                  See the eight weeks
                </Button>
                <Button href={`${BASE}/book?session=${encodeURIComponent(RESET.name)}`} variant="ghostOnInk">
                  Apply for October
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Proof — counters and the marquee. */}
      <section className="pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal stagger className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 border-t border-b py-12" style={{ borderColor: "var(--line)" }}>
            {STATS.map((st) => (
              <div key={st.label}>
                <p className={s.numeral}>
                  <Counter value={st.value} suffix={st.suffix} />
                </p>
                <p className={`${s.small} mt-2`}>{st.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal className="mt-16">
          <Marquee>
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="w-[22rem] sm:w-[26rem] shrink-0 rounded-[1.75rem] bg-white border p-7" style={{ borderColor: "var(--line)" }}>
                <blockquote className={s.lede} style={{ fontSize: "1.2rem" }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className={`${s.small} mt-5`}>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>{t.name}</span> · {t.detail}
                </figcaption>
              </figure>
            ))}
          </Marquee>
        </Reveal>
      </section>

      {/* Jessica — who is behind it. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className={`${s.frame} ${s.frameTall} ${s.ring} aspect-[3/4] max-w-md`}>
              <Image src={`${IMG}/breath.webp`} alt="Jessica with her eyes closed and a hand on her chest, morning light on her face" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <Eyebrow>Hey, I&rsquo;m Jessica</Eyebrow>
            <h2 className={`${s.h2} mt-4`}>
              I keep it small so that I can <span className={s.italic}>see you.</span>
            </h2>
            <p className={`${s.body} mt-6 max-w-xl`}>
              Nine years teaching, the last four from a barn behind my house in a
              village above the Tamar. Six in a class, four in each Reset, a few
              teams in Plymouth and Exeter. I trained in London while working a
              desk job that had turned my neck into a problem, and I have been
              undoing desks for other people ever since.
            </p>
            <p className={`${s.body} mt-4 max-w-xl`}>
              I am not interested in what you can get into. I am interested in
              whether your shoulders are down by Friday.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`${BASE}/about`} variant="light" arrow>
                More about me
              </Button>
              <Button href={`${BASE}/book`} variant="ghost">
                Book a free call
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Next retreat. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <Link href={`${BASE}/retreats#${nextRetreat.slug}`} className={`${s.card} group grid grid-cols-1 lg:grid-cols-12 !rounded-[2rem]`}>
            <div className="relative lg:col-span-7 min-h-[300px] lg:min-h-[460px] overflow-hidden">
              <Image src={nextRetreat.image} alt={nextRetreat.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className={`object-cover ${s.zoom}`} />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center">
              <p className={s.eyebrow}>Next retreat · {nextRetreat.places}</p>
              <h2 className={`${s.h2} mt-4`}>{nextRetreat.name}</h2>
              <p className={`${s.lede} mt-4`}>{nextRetreat.when}</p>
              <p className={`${s.body} mt-4`}>{nextRetreat.intro}</p>
              <p className="mt-6">
                <span className={s.numeral} style={{ fontSize: "2.2rem" }}>{nextRetreat.price}</span>
                <span className={s.small}> {nextRetreat.priceNote}</span>
              </p>
              <span className={`${s.btn} ${s.btnGhost} mt-6`}>
                The day, hour by hour <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* The free guide. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <div className={`${s.sagePanel} grid grid-cols-1 lg:grid-cols-12 overflow-hidden`}>
            <div className="lg:col-span-7 p-10 sm:p-14">
              <p className={s.eyebrow} style={{ color: "rgba(255,255,255,0.7)" }}>
                Free, and the place to start
              </p>
              <h2 className={`${s.h2} mt-4`}>{GUIDE.name}</h2>
              <p className={`${s.lede} mt-5`} style={{ color: "rgba(255,255,255,0.9)" }}>
                {GUIDE.strap}
              </p>
              <p className={`${s.body} mt-5 max-w-lg`} style={{ color: "rgba(255,255,255,0.72)" }}>
                Day one is three minutes of breathing on the edge of the bed. By
                day seven you have a practice, and you will know whether you want
                to keep it.
              </p>
              <Button href={`${BASE}/free-guide`} variant="onInk" className="mt-8" arrow>
                Send me the seven mornings
              </Button>
            </div>
            <div className="relative lg:col-span-5 min-h-[280px]">
              <Image src={GUIDE.image} alt={GUIDE.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Journal. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Journal" title="Things I say in every session, written down." />
          <Button href={`${BASE}/journal`} variant="ghost">
            All entries
          </Button>
        </Reveal>
        <Reveal stagger className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((p) => (
            <Link key={p.slug} href={`${BASE}/journal/${p.slug}`} className={`${s.card} group flex flex-col`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className={`object-cover ${s.zoom}`} />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className={s.small}>
                  {p.date} · {p.readTime}
                </p>
                <h3 className={`${s.h3} mt-2`} style={{ fontSize: "1.45rem" }}>
                  {p.title}
                </h3>
                <p className={`${s.body} mt-2`} style={{ fontSize: "15px" }}>
                  {p.standfirst}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* FAQ. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHead eyebrow="Before you ask" title="The things people ask before they book." />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Faq items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* Close. */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] min-h-[420px] flex items-end">
            <Image src={`${IMG}/country-walk.webp`} alt="" fill sizes="100vw" className="object-cover object-[72%_center]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a26]/85 via-[#2b2a26]/45 to-[#2b2a26]/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a26]/60 to-transparent" />
            <div className="relative p-10 sm:p-14 text-white max-w-2xl">
              <h2 className={s.h2}>Start with a free twenty-minute call.</h2>
              <p className={`${s.body} mt-4`} style={{ color: "rgba(255,255,255,0.78)" }}>
                We talk about your week and your body, and I tell you honestly
                which of these, if any, is the right place to start.
              </p>
              <Button href={`${BASE}/book`} variant="onInk" className="mt-8" arrow>
                Book the call
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <MindfulFooter />
    </main>
  );
}
