import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Clock, Quote } from "lucide-react";
import VoltivaNav from "./Nav";
import VoltivaLogo from "./Logo";
import VideoBand from "./VideoBand";
import QuoteForm from "./QuoteForm";
import { CONTACT, SERVICES, REASONS, STATS, TESTIMONIALS, TEAM, POSTS } from "./data";
import { Reveal, CountUp } from "./Motion";

export const metadata: Metadata = {
  title: { absolute: "Voltiva Electrical — Concept Demo | WebMinor" },
  description:
    "A concept site for an electrical contractor, designed and built by WebMinor to show what a trade brand can look like when the design is taken seriously.",
};

/* voltiva-bar.md §2 — every section opens with a micro eyebrow above its heading. */
function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`text-[13px] font-bold uppercase tracking-[0.18em] ${
        onDark ? "text-[#4E9BFF]" : "text-[#1677FF]"
      }`}
      style={{ fontFamily: "var(--font-inter-vt)" }}
    >
      {children}
    </p>
  );
}

function Heading({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`mt-4 text-[32px] leading-[1.12] font-bold sm:text-[44px] ${
        onDark ? "text-[#F5F7FA]" : "text-[#0B1D33]"
      } ${className}`}
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      {children}
    </h2>
  );
}

export default function VoltivaPage() {
  return (
    <div
      className="bg-[#F5F7FA] text-[#0B1D33]"
      style={{ fontFamily: "var(--font-inter-vt)" }}
    >
      <VoltivaNav />

      <main>
        {/* ── Hero. bar.md §4: the service grid starts inside the image, so the
              hero has no bottom edge of its own. ───────────────────────────── */}
        <section className="relative">
          <div className="relative min-h-[560px] overflow-hidden bg-[#0B1D33] pb-64 pt-20 sm:min-h-[640px] sm:pb-72">
            <Image
              src="/demo/voltiva/hero.webp"
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover object-[50%_0%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D33]/55 via-[#0B1D33]/30 to-[#0B1D33]/72" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_38%,rgba(11,29,51,0.55),transparent_70%)]"
            />

            <div className="relative mx-auto max-w-[1200px] px-6 text-center lg:px-8">
              <p
                className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#4E9BFF]"
                style={{ fontFamily: "var(--font-inter-vt)" }}
              >
                Powering safety. Delivering trust.
              </p>
              <h1
                className="mx-auto mt-5 max-w-4xl text-[40px] leading-[1.06] font-extrabold text-white sm:text-[56px] lg:text-[64px]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Electrical work you
                <br />
                <span className="text-[#4E9BFF]">never have to think about</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[20px] leading-relaxed text-[#F5F7FA]/70">
                Domestic and commercial electricians across Plymouth and the South
                West. Certified, fixed-price, and an engineer on the end of the phone out of hours.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#contact"
                  className="rounded-lg bg-[#1677FF] px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#0F5FD6]"
                >
                  Get a fixed price
                </a>
                <a
                  href={CONTACT.phoneHref}
                  className="flex items-center gap-2.5 rounded-lg border border-white/25 px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:border-white/60"
                >
                  <Phone className="h-4 w-4 text-[#0FA3A6]" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>

          {/* the grid overlaps the hero — bar.md §4 */}
          <div
            id="services"
            className="mx-auto -mt-56 max-w-[1200px] scroll-mt-24 px-6 pb-16 sm:pb-28 lg:px-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className={`group relative overflow-hidden rounded-2xl p-6 shadow-[0_8px_30px_rgba(11,29,51,0.10)] transition-transform duration-500 hover:-translate-y-1.5 ${
                      s.featured ? "bg-[#0F5FD6]" : "bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        s.featured ? "bg-white/18" : "bg-[#0FA3A6]/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${s.featured ? "text-white" : "text-[#0FA3A6]"}`}
                        aria-hidden="true"
                      />
                    </span>
                    <h3
                      className={`mt-5 text-[20px] leading-tight font-bold ${
                        s.featured ? "text-white" : "text-[#0B1D33]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`mt-2.5 text-[14px] leading-relaxed ${
                        s.featured ? "text-white" : "text-[#59636E]"
                      }`}
                    >
                      {s.blurb}
                    </p>
                    {/* bar.md §5 — the accent underline on every card */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl ${
                        s.featured ? "bg-[#0B1D33]" : "bg-[#1677FF]"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────────────── */}
        <section id="about" className="scroll-mt-24 pb-16 sm:pb-28">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
            <div>
              <Reveal><Eyebrow>About Voltiva</Eyebrow></Reveal>
              <Heading>
                Eighteen years of
                <br />
                other people&rsquo;s emergencies
              </Heading>
              <p className="mt-6 text-[20px] leading-relaxed text-[#59636E]">
                Voltiva started with one van and a simple rule: quote a number,
                honour it, and leave the place tidier than we found it. That rule
                has survived eighteen years, three engineers and about two and a half
                thousand jobs.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#59636E]">
                We work on Victorian terraces with cloth-covered wiring and on
                three-phase panels in working factories. Same certificates, same
                fixed prices, same engineer turning up when they said they would.
              </p>
              <a
                href="#why-us"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1677FF] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#0F5FD6]"
              >
                Why people call us back
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* the reference's two overlapping frames */}
            <div className="relative pb-14 pl-0 sm:pl-14">
              <div className="relative ml-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(11,29,51,0.10)]">
                <Image
                  src="/demo/voltiva/about-portrait.webp"
                  alt="A Voltiva engineer in a modern switchroom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-0 aspect-[4/3] w-2/3 max-w-[260px] overflow-hidden rounded-2xl border-4 border-[#F5F7FA] shadow-[0_8px_30px_rgba(11,29,51,0.10)] sm:w-1/2">
                <Image
                  src="/demo/voltiva/about-detail.webp"
                  alt="Fitting a modern linear ceiling light"
                  fill
                  sizes="(max-width: 640px) 66vw, 280px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Dark band + film. bar.md §3: the frame straddles the seam. ────── */}
        <section className="relative bg-[#0B1D33] pt-16 sm:pt-28">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-8">
            <Eyebrow onDark>On the tools since 2008</Eyebrow>
            <Heading onDark className="mx-auto max-w-3xl">
              The unglamorous half of the job is the half that matters
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-[20px] leading-relaxed text-[#F5F7FA]/70">
              Testing, labelling, certifying and clearing up. Anyone can pull cable
              — the certificate is what you are actually buying.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[1000px] translate-y-24 px-6 lg:px-8">
            <VideoBand />
          </div>
        </section>

        {/* ── Stats + why us ────────────────────────────────────────────────── */}
        <section id="why-us" className="scroll-mt-24 bg-[#F5F7FA] pb-16 pt-28 sm:pb-28 sm:pt-40">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(11,29,51,0.10)] sm:grid-cols-4 sm:p-10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <CountUp
                    value={s.value}
                    className="text-[32px] font-extrabold leading-none text-[#0B1D33] sm:text-[44px]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  />
                  <p className="mt-2 text-[14px] text-[#59636E]">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 text-center">
              <Reveal><Eyebrow>Why choose Voltiva</Eyebrow></Reveal>
              <Heading className="mx-auto max-w-2xl">
                Four things we will not compromise on
              </Heading>
            </div>

            <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_360px_1fr] lg:gap-10">
              <div className="space-y-12 lg:text-right">
                {REASONS.slice(0, 2).map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.title} className="lg:flex lg:flex-row-reverse lg:gap-5">
                      <span className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0FA3A6]/10 lg:mb-0">
                        <Icon className="h-5 w-5 text-[#0FA3A6]" aria-hidden="true" />
                      </span>
                      <div>
                        <h3
                          className="text-[20px] font-bold leading-snug text-[#0B1D33]"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {r.title}
                        </h3>
                        <p className="mt-2.5 text-[16px] leading-relaxed text-[#59636E]">
                          {r.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(11,29,51,0.10)]">
                <Image
                  src="/demo/voltiva/why-portrait.webp"
                  alt="A Voltiva engineer installing a recessed downlight"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-12">
                {REASONS.slice(2).map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.title} className="lg:flex lg:gap-5">
                      <span className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0FA3A6]/10 lg:mb-0">
                        <Icon className="h-5 w-5 text-[#0FA3A6]" aria-hidden="true" />
                      </span>
                      <div>
                        <h3
                          className="text-[20px] font-bold leading-snug text-[#0B1D33]"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {r.title}
                        </h3>
                        <p className="mt-2.5 text-[16px] leading-relaxed text-[#59636E]">
                          {r.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── What customers say. The brief critic's finding: every trust claim
              on the page was Voltiva talking about Voltiva. ─────────────────── */}
        <section className="bg-[#0B1D33] py-16 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="text-center">
              <Eyebrow onDark>What customers say</Eyebrow>
              <Heading onDark className="mx-auto max-w-2xl">
                The jobs people ring back about
              </Heading>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="flex h-full flex-col rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10"
                >
                  <Quote
                    className="h-6 w-6 shrink-0 text-[#0FA3A6]"
                    aria-hidden="true"
                  />
                  <blockquote className="mt-5 flex-1 text-[16px] leading-relaxed text-[#F5F7FA]/70">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-white/10 pt-5">
                    <span className="block text-[16px] font-semibold text-[#F5F7FA]">
                      {t.name}, {t.place}
                    </span>
                    <span className="mt-1 block text-[14px] text-[#F5F7FA]/70">
                      {t.job}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className="mt-10 text-center text-[14px] text-[#F5F7FA]/70">
              Voltiva is a concept brand — these illustrate the kind of work the
              site is designed to carry, and are not real customer reviews.
            </p>
          </div>
        </section>

        {/* ── Collage + services copy ───────────────────────────────────────── */}
        <section className="pb-16 sm:pb-28">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
            {/* The second tile used to carry mt-10, which pushed it out of the
                row and left the wide image below sitting against two different
                baselines. All three now share the same grid lines. */}
            <div className="grid grid-cols-2 gap-5">
              <Reveal className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src="/demo/voltiva/collage-tools.webp" alt="Electrical hand tools laid out on a workbench" fill sizes="(max-width: 1024px) 45vw, 260px" className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
              </Reveal>
              <Reveal delay={110} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src="/demo/voltiva/collage-light.webp" alt="A modern pendant light fitting" fill sizes="(max-width: 1024px) 45vw, 260px" className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
              </Reveal>
              <Reveal delay={220} className="relative col-span-2 aspect-[2/1] overflow-hidden rounded-2xl">
                <Image src="/demo/voltiva/collage-kitchen.webp" alt="A kitchen lit by newly installed downlights at dusk" fill sizes="(max-width: 1024px) 90vw, 540px" className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
              </Reveal>
            </div>

            <div>
              <Reveal><Eyebrow>How we work</Eyebrow></Reveal>
              <Heading>
                Survey, fixed price,
                <br />
                then no surprises
              </Heading>
              <p className="mt-6 text-[20px] leading-relaxed text-[#59636E]">
                Every job starts with an engineer actually looking at it — not a
                price over the phone from someone who has never seen your board.
                You get a written scope, a fixed number, and a date.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#59636E]">
                On the day we dust-sheet the room, work to the schedule we quoted,
                and hand over the certificate before we leave. If we find something
                genuinely unexpected behind a wall, we stop and talk to you before
                anything changes.
              </p>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1677FF] px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#0F5FD6]"
              >
                Book a survey
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Team ──────────────────────────────────────────────────────────── */}
        <section id="team" className="scroll-mt-24 bg-white py-16 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-8">
            <Reveal><Eyebrow>The engineers</Eyebrow></Reveal>
            <Heading className="mx-auto max-w-2xl">
              The person who quotes it is the person who does it
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-[20px] leading-relaxed text-[#59636E]">
              Three engineers, no subcontractors, no call centre between you and
              the van.
            </p>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {TEAM.map((m) => (
                <div key={m.name} className={m.featured ? "sm:-translate-y-6" : ""}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                    <Image
                      src={m.image}
                      alt={`${m.name}, ${m.role}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative mx-4 -mt-10 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(11,29,51,0.10)]">
                    <p
                      className="text-[20px] font-bold text-[#0B1D33]"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {m.name}
                    </p>
                    <p className="mt-1 text-[14px] text-[#59636E]">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Insights ──────────────────────────────────────────────────────── */}
        <section id="insights" className="scroll-mt-24 py-16 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-8">
            <Eyebrow>Insights</Eyebrow>
            <Heading className="mx-auto max-w-2xl">
              Plain answers to the questions we get asked most
            </Heading>

            <div className="mt-16 grid grid-cols-1 gap-8 text-left lg:grid-cols-2">
              {POSTS.map((p) => (
                <article key={p.title}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-5 text-[14px] text-[#59636E]">{p.meta}</p>
                  <h3
                    className="mt-3 text-[20px] font-bold leading-snug text-[#0B1D33]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-[#59636E]">
                    {p.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact. bar.md §3: this panel straddles the footer seam. ─────── */}
        <section id="contact" className="relative z-10 scroll-mt-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(11,29,51,0.10)] lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-14">
              <div>
                <Eyebrow>Get a quote</Eyebrow>
                <Heading>Tell us what&rsquo;s wrong</Heading>
                <p className="mt-6 text-[16px] leading-relaxed text-[#59636E]">
                  We&rsquo;ll come back with a fixed price, usually the same working
                  day. If the power is off right now, ring us instead — that line is
                  answered around the clock.
                </p>

                <dl className="mt-10 space-y-5">
                  {[
                    { Icon: Phone, label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
                    { Icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
                    { Icon: MapPin, label: "Workshop", value: CONTACT.address },
                    { Icon: Clock, label: "Hours", value: CONTACT.hours },
                  ].map(({ Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0FA3A6]/10">
                        <Icon className="h-4 w-4 text-[#0FA3A6]" aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#59636E]">
                          {label}
                        </dt>
                        <dd className="mt-1 text-[16px] text-[#0B1D33]">
                          {href ? (
                            <a href={href} className="hover:text-[#1677FF] transition-colors">
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <QuoteForm />
            </div>
          </div>

        </section>
      </main>

      {/* ── Footer. bar.md §7: giant ghosted wordmark behind the columns. ──── */}
      <footer className="relative -mt-28 overflow-hidden bg-[#0B1D33] pt-44 sm:-mt-32 sm:pt-52">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-2 select-none whitespace-nowrap text-center text-[min(15vw,180px)] font-extrabold leading-[0.8] tracking-[0.02em] text-white/[0.028]"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          VOLTIVA
        </span>

        <div className="relative mx-auto max-w-[1200px] px-6 pb-10 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <VoltivaLogo onDark />
              <p className="mt-5 max-w-xs text-[16px] leading-relaxed text-[#F5F7FA]/70">
                Certified domestic and commercial electricians across Plymouth and
                the South West. Fixed prices, tidy work, proper paperwork.
              </p>
            </div>

            <nav aria-label="Sections" className="flex flex-col gap-3">
              <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-[#F5F7FA]">
                Explore
              </p>
              {[
                ["Services", "#services"],
                ["About", "#about"],
                ["Why Voltiva", "#why-us"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="text-[16px] text-[#F5F7FA]/60 transition-colors hover:text-white">
                  {label}
                </a>
              ))}
            </nav>

            <nav aria-label="More" className="flex flex-col gap-3">
              <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-[#F5F7FA]">
                More
              </p>
              {[
                ["The engineers", "#team"],
                ["Insights", "#insights"],
                ["Get a quote", "#contact"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="text-[16px] text-[#F5F7FA]/60 transition-colors hover:text-white">
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-[#F5F7FA]">
                Contact
              </p>
              <a href={CONTACT.phoneHref} className="flex items-start gap-3 text-[16px] text-[#F5F7FA]/60 transition-colors hover:text-white">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#0FA3A6]" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-3 text-[16px] text-[#F5F7FA]/60 transition-colors hover:text-white">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#0FA3A6]" aria-hidden="true" />
                {CONTACT.email}
              </a>
              <p className="flex items-start gap-3 text-[14px] text-[#F5F7FA]/70">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#0FA3A6]" aria-hidden="true" />
                {CONTACT.address}
              </p>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[#F5F7FA]/70">
              Voltiva Electrical is a concept brand created by{" "}
              <Link href="/case-studies" className="text-[#F5F7FA]/60 underline underline-offset-4 transition-colors hover:text-white">
                WebMinor
              </Link>{" "}
              to demonstrate design and build work.
            </p>
            <p className="text-[13px] text-[#F5F7FA]/70">
              &copy; {new Date().getFullYear()} WebMinor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
