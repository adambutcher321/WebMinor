import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isPlaceholder, publishedCaseStudies } from "@/data/case-studies";
import type { CaseStudy } from "@/types";
import s from "./case-studies.module.css";

export const metadata: Metadata = {
  title: "Work — Concept Builds & Client Case Studies",
  description:
    "Concept brands WebMinor designed and built end to end — hospitality, wellness, hardware, trade and ecommerce — plus client case studies, published once the results are signed off.",
};

/* ------------------------------------------------------------------ *
 * Placeholder handling
 *
 * `src/data/case-studies.ts` ships template rows: the client names, the
 * problem/solution copy and every statistic are `[EDIT: ...]` prompts waiting
 * on real client information. Those are claims about real businesses, so they
 * cannot be filled in from here — inventing a name or a percentage would be
 * fabricating evidence.
 *
 * Instead the page treats an unfilled row as unpublished and never renders it.
 * The section shows a deliberate "published once signed off" state while the
 * set is empty, and the grid appears on its own the moment real values land in
 * the data file. Nothing here needs changing when that happens.
 * ------------------------------------------------------------------ */

const publishedStudies = publishedCaseStudies;

/* ------------------------------------------------------------------ */

interface WorkEntry {
  name: string;
  href: string;
  external?: boolean;
  disciplines: string;
  summary: string;
  image: string;
  alt: string;
  tag: string;
  spec: { term: string; value: string }[];
  cta: string;
}

const conceptBuilds: WorkEntry[] = [
  {
    name: "Boucher Tailored",
    href: "/demo/boucher",
    external: true,
    disciplines: "Outerwear · Ecommerce",
    summary:
      "One cropped puffer in five colourways: a product stage where the whole page tints with the jacket, a limited hand-drawn Doodle Edition, and a working basket and wishlist.",
    image: "/work/covers/boucher.webp",
    alt: "Boucher Tailored cover — the orange puffer floating in a beam of light",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Logo · Product · Cart" },
      { term: "Colourways", value: "Five" },
    ],
    cta: "View the build",
  },
  {
    name: "Fernhollow",
    href: "/demo/fernhollow",
    external: true,
    disciplines: "Hospitality · Short-stay",
    summary:
      "A cabin rental brand: full-bleed photography, a booking widget that floats with the scroll, and a browsable rooms gallery.",
    image: "/work/covers/fernhollow.webp",
    alt: "Fernhollow cover — the A-frame cabin glowing on a misty lake at blue hour",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Booking" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Mindful",
    href: "/demo/mindful",
    external: true,
    disciplines: "Wellness · Coaching",
    summary:
      "A private yoga and breath coach: an interactive hero, four ways to work together, an eight-week signature programme, dated retreats, a journal and a free guide, all routed through one booking flow.",
    image: "/work/covers/mindful.webp",
    alt: "Mindful cover — Jessica in tree pose on a hilltop at golden hour",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Illustration · Copy · UI" },
      { term: "Pages", value: "Nine" },
    ],
    cta: "View the build",
  },
  {
    name: "ALTRIX",
    href: "/demo/altrix",
    external: true,
    disciplines: "Hardware · Outdoor",
    summary:
      "An expedition smartwatch: a dark cinematic stage, a single ember accent, and an altimeter that climbs as you scroll.",
    image: "/work/covers/altrix-dawn.webp",
    alt: "ALTRIX cover — the watch propped on a frosted granite ledge at dawn, peaks behind",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Product · Motion" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Voltiva Electrical",
    href: "/demo/voltiva",
    external: true,
    disciplines: "Trade · Electrical contractor",
    summary:
      "A working electrician's site built to a client-supplied layout in their own brand: an eight-service grid that overlaps the hero, and a quote form that carries the job type through.",
    image: "/work/covers/voltiva.webp",
    alt: "Voltiva cover — an electrician beside a glowing EV charger on a wet street at dusk",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Copy" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Crookeries",
    href: "/demo/crookeries",
    external: true,
    disciplines: "Ecommerce · Kitchenware",
    summary:
      "A sustainable kitchenware storefront: a long editorial scroll of generated photography, a four-up product grid, and a product page built from the same rules.",
    image: "/work/covers/crookeries.webp",
    alt: "Crookeries cover — enamel casseroles on dark oak, steam in a shaft of window light",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Ecommerce" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Lucid",
    href: "/demo/lucid",
    external: true,
    disciplines: "Hardware · Spatial computing",
    summary:
      "A spatial headset launch page: an oversized pale wordmark behind the product, technical callouts on leader lines, and a headset that tilts and lifts with the cursor on its own layer.",
    image: "/work/covers/lucid-one.webp",
    alt: "Lucid cover — the headset on wet slate, its amber optics glowing",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Product · Motion" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "KLIK",
    href: "/demo/klik",
    external: true,
    disciplines: "Fintech · Consumer payments",
    summary:
      "A consumer payment app with attitude: oversized condensed type broken across the grid, a flocked brand character in oversized trainers, and payment flows that animate the product before the copy explains it.",
    image: "/work/covers/klik.webp",
    alt: "KLIK cover — the mascot mid-leap, flicking a glowing orange card",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Motion" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
];

function studyToEntry(cs: CaseStudy): WorkEntry {
  const capitalise = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
  const headline = cs.stats.find(
    (stat) => !isPlaceholder(stat.value) && !isPlaceholder(stat.label),
  );

  return {
    name: cs.clientName,
    href: `/case-studies/${cs.slug}`,
    disciplines: `${capitalise(cs.trade)} · ${capitalise(cs.town)}`,
    summary: cs.problem,
    // Data rows carry their own imagery once supplied; until then the study
    // borrows nothing and simply renders without a frame.
    image: isPlaceholder(cs.image) ? "" : cs.image,
    alt: `${cs.clientName} — ${capitalise(cs.trade)} in ${capitalise(cs.town)}`,
    tag: "Client",
    spec: headline
      ? [
          { term: "Result", value: headline.value },
          { term: "Measure", value: headline.label },
        ]
      : [],
    cta: "Read the study",
    external: false,
  };
}

/* ------------------------------------------------------------------ */

/**
 * A dense tick measure down the left gutter. The rail carries one band per
 * entry and this entry's band is drawn in accent, so the rail reads as a
 * position indicator rather than decoration. Each band is a single element —
 * see .tickBand in the stylesheet for why that matters to the accent budget.
 */
function IndexTicks({ active, total }: { active: number; total: number }) {
  return (
    <div className={s.tickRail} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`${s.tickBand} ${i === active ? s.tickBandActive : ""}`}
        />
      ))}
    </div>
  );
}

function WorkRow({
  entry,
  index,
  total,
  preload,
}: {
  entry: WorkEntry;
  index: number;
  total: number;
  preload: boolean;
}) {
  const external = entry.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <>
      <hr className={s.rule} />
      <Link href={entry.href} {...external} className={`${s.row} ${s.rowLink}`}>
        <div className="hidden lg:block">
          <IndexTicks active={index} total={total} />
        </div>

        <div>
          <p className={`${s.micro} ${s.microInk}`}>
            {String(index + 1).padStart(2, "0")}
            <span className={s.specTerm}> / {String(total).padStart(2, "0")}</span>
          </p>
          <h3 className={s.section} style={{ marginTop: 16 }}>
            {entry.name}
          </h3>
          <p className={s.micro} style={{ marginTop: 12 }}>
            {entry.disciplines}
          </p>
          <p className={s.small} style={{ marginTop: 24 }}>
            {entry.summary}
          </p>

          {entry.spec.length > 0 && (
            <dl className={s.spec}>
              {entry.spec.map((item) => (
                <div key={item.term} style={{ display: "contents" }}>
                  <dt className={`${s.micro} ${s.specTerm}`}>{item.term}</dt>
                  <dd className={`${s.micro} ${s.microInk}`}>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <span style={{ display: "block", marginTop: 32 }}>
            <span className={`${s.micro} ${s.textLink}`}>
              {entry.cta}
              <ArrowRight width={14} height={14} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </span>
        </div>

        {entry.image && (
          <div className={s.frame}>
            <Image
              src={entry.image}
              alt={entry.alt}
              fill
              sizes="(max-width: 1023px) 92vw, 56vw"
              preload={preload}
            />
            <span className={`${s.micro} ${s.frameTag}`}>{entry.tag}</span>
          </div>
        )}
      </Link>
    </>
  );
}

/* ------------------------------------------------------------------ */

/** What every published study sets out. True of the data shape, invents nothing. */
const studyContents = [
  { term: "The brief", value: "Where the business stood before we started" },
  { term: "The build", value: "What we designed, wrote and shipped" },
  { term: "The result", value: "Measured, and confirmed by the client" },
];

function ClientStudiesPending() {
  return (
    <>
      <hr className={s.rule} />
      <div style={{ paddingTop: 56, paddingBottom: 8 }}>
        <div style={{ maxWidth: "26ch" }}>
          <h2 className={s.section}>
            Published once the numbers are signed off.
          </h2>
        </div>
        <div style={{ maxWidth: "62ch" }}>
          <p className={s.small} style={{ marginTop: 24 }}>
            We don&apos;t put a client&apos;s figures on this page until
            they&apos;ve confirmed them. Studies appear here as they are
            approved. Until then, the concept builds above are the work itself
            — every one of them is live and browsable.
          </p>
        </div>

        <div className={s.ledger} style={{ marginTop: 48 }}>
          {studyContents.map((item, i) => (
            <div key={item.term} className={s.ledgerRow}>
              <span className={`${s.micro} ${s.specTerm}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`${s.micro} ${s.microInk}`}>{item.term}</span>
              <span className={s.small} style={{ letterSpacing: 0 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href="/contact" className={`${s.micro} ${s.textLink}`}>
            Talk to us about yours
            <ArrowRight width={14} height={14} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

/* The display statement names the count, and the spec strip below derives the
   same number from the array — so a hardcoded "Four" silently goes wrong the
   moment a build is added. Both now read from one source. */
const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

function spell(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

export default function CaseStudiesPage() {
  const hasStudies = publishedStudies.length > 0;

  const meta = [
    { term: "Concept builds", value: String(conceptBuilds.length).padStart(2, "0") },
    {
      term: "Client studies",
      value: hasStudies
        ? String(publishedStudies.length).padStart(2, "0")
        : "In preparation",
    },
    { term: "Practice", value: "Design · Build · SEO" },
    { term: "Based", value: "Saltash, Cornwall" },
  ];

  return (
    <main className="px-6 pt-28 pb-24 relative">
      <div className={s.ground} aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto">
        {/* Hero — the page's single display statement */}
        <section style={{ paddingBottom: 96 }}>
          <p className={`${s.micro} ${s.microAccent}`}>— Selected work</p>
          <h1 className={s.display} style={{ marginTop: 24, maxWidth: "15ch" }}>
            {spell(conceptBuilds.length)} brands, built end to end.
          </h1>
          <p className={s.body} style={{ marginTop: 32, maxWidth: "52ch" }}>
            Concept sites we designed, wrote and shipped to show the range —
            brand, interface, motion and copy, from a blank page.
          </p>

          {/* Masthead spec strip — runs the full measure so the display
              statement is not left with an empty right half. */}
          <hr className={s.rule} style={{ marginTop: 72 }} />
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-8"
            style={{ paddingTop: 28 }}
          >
            {meta.map((item) => (
              <div key={item.term}>
                <p className={`${s.micro} ${s.specTerm}`}>{item.term}</p>
                <p className={`${s.micro} ${s.microInk}`} style={{ marginTop: 10 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Concept builds — the work index. The masthead strip above already
            names and counts this section, so it carries no second label. */}
        <section style={{ marginTop: 40 }}>
          {conceptBuilds.map((entry, i) => (
            <WorkRow
              key={entry.name}
              entry={entry}
              index={i}
              total={conceptBuilds.length}
              preload={i === 0}
            />
          ))}
          <hr className={s.rule} />
        </section>

        {/* Client case studies — renders rows only when the data is real */}
        <section style={{ marginTop: 112 }}>
          <p className={`${s.micro} ${s.microAccent}`} style={{ marginBottom: 20 }}>
            — Client case studies
          </p>
          {hasStudies ? (
            publishedStudies.map((cs, i) => (
              <WorkRow
                key={cs.slug}
                entry={studyToEntry(cs)}
                index={i}
                total={publishedStudies.length}
                preload={false}
              />
            ))
          ) : (
            <ClientStudiesPending />
          )}
        </section>
      </div>
    </main>
  );
}
