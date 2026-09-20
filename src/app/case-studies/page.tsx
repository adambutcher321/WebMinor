import { Fragment, type CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isPlaceholder, publishedCaseStudies } from "@/data/case-studies";
import type { CaseStudy } from "@/types";
import { conceptBuilds, type WorkEntry } from "./work-entries";
import WorkMotion from "./WorkMotion";
import s from "./case-studies.module.css";

export const metadata: Metadata = {
  title: "Work: Concept Builds and Case Studies",
  description:
    "Concept brands designed and built end to end by WebMinor, from hospitality to ecommerce. Client case studies are added once results are signed off.",
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

/** Stagger position for a revealed element, read by the stylesheet as --d. */
const step = (d: number) => ({ "--d": d }) as CSSProperties;

/**
 * A dense tick measure: one band per entry, down the left gutter on desktop
 * and across the top of the row on phones. It doubles as a progress measure.
 * Bands for entries already passed are filled, this entry's band fills as the
 * row is scrolled through (--p, written by WorkMotion), and the rest stay
 * white. Each band is a single element — see .tickBand in the stylesheet for
 * why that matters to the accent budget.
 */
function IndexTicks({
  active,
  total,
  axis,
}: {
  active: number;
  total: number;
  axis: "x" | "y";
}) {
  return (
    <div className={axis === "y" ? s.tickRail : s.tickStrip} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`${s.tickBand} ${i === active ? s.tickBandActive : ""}`}
          data-state={i < active ? "passed" : i === active ? "active" : "ahead"}
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
      <Link
        href={entry.href}
        {...external}
        className={`${s.row} ${s.rowLink}`}
        data-row
      >
        <div className="hidden lg:block">
          <IndexTicks active={index} total={total} axis="y" />
        </div>

        <div>
          <div className="lg:hidden" style={{ marginBottom: 20 }}>
            <IndexTicks active={index} total={total} axis="x" />
          </div>
          <p
            className={`${s.micro} ${s.microInk} ${s.reveal}`}
            data-reveal
            style={step(0)}
          >
            {String(index + 1).padStart(2, "0")}
            <span className={s.specTerm}>
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
          <h3
            className={`${s.section} ${s.reveal}`}
            style={{ marginTop: 16, ...step(1) }}
            data-reveal
          >
            {entry.name}
          </h3>
          <p
            className={`${s.micro} ${s.reveal}`}
            style={{ marginTop: 12, ...step(2) }}
            data-reveal
          >
            {entry.disciplines}
          </p>
          <p
            className={`${s.small} ${s.reveal}`}
            style={{ marginTop: 24, ...step(3) }}
            data-reveal
          >
            {entry.summary}
          </p>

          {entry.spec.length > 0 && (
            <dl className={`${s.spec} ${s.reveal}`} data-reveal style={step(4)}>
              {entry.spec.map((item) => (
                <div key={item.term} style={{ display: "contents" }}>
                  <dt className={`${s.micro} ${s.specTerm}`}>{item.term}</dt>
                  <dd className={`${s.micro} ${s.microInk}`}>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <span
            className={s.reveal}
            style={{ display: "block", marginTop: 32, ...step(5) }}
            data-reveal
          >
            <span className={`${s.micro} ${s.textLink}`}>
              {entry.cta}
              <ArrowRight
                width={14}
                height={14}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
          </span>
        </div>

        {entry.image && (
          <div className={s.frame} data-reveal="frame">
            <div className={s.plate}>
              <Image
                className={s.cover}
                src={entry.image}
                alt={entry.alt}
                fill
                sizes="(max-width: 1023px) 92vw, 56vw"
                preload={preload}
              />
              <span className={`${s.micro} ${s.frameTag}`}>{entry.tag}</span>
              {entry.logo && (
                <span
                  className={s.frameLogo}
                  style={
                    {
                      "--ar": entry.logo.width / entry.logo.height,
                    } as CSSProperties
                  }
                >
                  {/* Decorative: the build is already named in the row's heading. */}
                  <Image
                    src={entry.logo.src}
                    alt=""
                    width={entry.logo.width}
                    height={entry.logo.height}
                    sizes="260px"
                  />
                </span>
              )}
            </div>
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
            approved. Until then, the concept builds above are the work itself —
            every one of them is live and browsable.
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
            <ArrowRight
              width={14}
              height={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
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
const COUNT_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];

function spell(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

export default function CaseStudiesPage() {
  const hasStudies = publishedStudies.length > 0;

  const meta = [
    {
      term: "Concept builds",
      value: String(conceptBuilds.length).padStart(2, "0"),
      count: conceptBuilds.length,
    },
    {
      term: "Client studies",
      value: hasStudies
        ? String(publishedStudies.length).padStart(2, "0")
        : "In preparation",
    },
    { term: "Practice", value: "Design · Build · SEO" },
    { term: "Based", value: "Saltash, Cornwall" },
  ];

  const statement = `${spell(conceptBuilds.length)} brands, built end to end.`;

  return (
    <main className={`px-6 pt-28 pb-24 relative ${s.root}`} data-work-root>
      {/* With scripting off nothing can mark a row as arrived, so show it all. */}
      <noscript>
        <style>{`.${s.root} .${s.reveal}, .${s.root} .${s.frameLogo}, .${s.root} .${s.frameTag} { opacity: 1 !important; transform: none !important; } .${s.root} .${s.plate} { clip-path: none !important; } .${s.root} .${s.row} { --p: 1 !important; }`}</style>
      </noscript>
      <WorkMotion />
      <div className={s.ground} aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto">
        {/* Hero — the page's single display statement */}
        <section style={{ paddingBottom: 96 }}>
          <p
            className={`${s.micro} ${s.microAccent} ${s.rise}`}
            style={step(0)}
          >
            — Selected work
          </p>
          <h1
            className={s.display}
            style={{ marginTop: 24, maxWidth: "15ch" }}
            aria-label={statement}
          >
            {statement.split(" ").map((word, i) => (
              <Fragment key={i}>
                <span className={s.word} aria-hidden="true">
                  <span style={step(i + 1)}>{word}</span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>
          <p
            className={`${s.body} ${s.rise}`}
            style={{ marginTop: 32, maxWidth: "52ch", ...step(8) }}
          >
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
            {meta.map((item, i) => (
              <div key={item.term} className={s.rise} style={step(10 + i)}>
                <p className={`${s.micro} ${s.specTerm}`}>{item.term}</p>
                <p
                  className={`${s.micro} ${s.microInk}`}
                  style={{ marginTop: 10 }}
                  data-count={"count" in item ? item.count : undefined}
                >
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
          <p
            className={`${s.micro} ${s.microAccent}`}
            style={{ marginBottom: 20 }}
          >
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
