import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import type { CaseStudy } from "@/types";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import s from "../case-studies.module.css";

/* ------------------------------------------------------------------ *
 * Placeholder gate — mirrors src/app/case-studies/page.tsx.
 *
 * The rows in `src/data/case-studies.ts` are templates: client names, copy and
 * every statistic are `[EDIT: ...]` prompts awaiting real client information.
 * Those are claims about real businesses and cannot be filled in from here, so
 * an unfilled row is treated as unpublished: it is not routed, not prerendered
 * and not indexed. It starts working the moment real values land in the data.
 * ------------------------------------------------------------------ */

const PLACEHOLDER = /\[\s*EDIT\b/i;

function isPlaceholder(value: string | undefined): boolean {
  return !value || PLACEHOLDER.test(value);
}

function isPublished(cs: CaseStudy): boolean {
  return (
    !isPlaceholder(cs.clientName) &&
    !isPlaceholder(cs.problem) &&
    cs.stats.some((stat) => !isPlaceholder(stat.value) && !isPlaceholder(stat.label))
  );
}

function findPublished(slug: string): CaseStudy | undefined {
  const cs = caseStudies.find((c) => c.slug === slug);
  return cs && isPublished(cs) ? cs : undefined;
}

const capitalise = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return caseStudies.filter(isPublished).map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata(
  props: PageProps<"/case-studies/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const cs = findPublished(slug);
  if (!cs) return {};

  return {
    title: `${cs.clientName} — ${capitalise(cs.trade)} in ${capitalise(cs.town)} | Case Study`,
    description: cs.problem.slice(0, 160),
  };
}

export default async function CaseStudyPage(
  props: PageProps<"/case-studies/[slug]">,
) {
  const { slug } = await props.params;
  const cs = findPublished(slug);
  if (!cs) notFound();

  const tradeLabel = capitalise(cs.trade);
  const townLabel = capitalise(cs.town);
  // Only render values the client has actually supplied.
  const stats = cs.stats.filter(
    (stat) => !isPlaceholder(stat.value) && !isPlaceholder(stat.label),
  );
  const hasSolution = !isPlaceholder(cs.solution);
  const hasImage = !isPlaceholder(cs.image);

  return (
    <main className="px-6 pt-28 pb-24 relative">
      <div className={s.ground} aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto">
        {/* Hero — the page's single display statement */}
        <section style={{ paddingBottom: 56 }}>
          <p className={`${s.micro} ${s.microAccent}`}>— Client case study</p>
          <h1 className={s.display} style={{ marginTop: 24, maxWidth: "16ch" }}>
            {cs.clientName}
          </h1>
          <div
            className="flex flex-wrap gap-x-12 gap-y-3"
            style={{ marginTop: 32 }}
          >
            <p className={`${s.micro} ${s.microInk}`}>
              <span className={s.specTerm}>Trade </span>
              {tradeLabel}
            </p>
            <p className={`${s.micro} ${s.microInk}`}>
              <span className={s.specTerm}>Location </span>
              {townLabel}
            </p>
          </div>
        </section>

        {hasImage && (
          <section style={{ paddingBottom: 72 }}>
            <div className={s.frame}>
              <Image
                src={cs.image}
                alt={`${cs.clientName} — ${tradeLabel} in ${townLabel}`}
                fill
                sizes="(max-width: 1023px) 92vw, 1280px"
                preload
              />
            </div>
          </section>
        )}

        {/* Results first — the reason a visitor is on this page */}
        {stats.length > 0 && (
          <section className={s.panel} style={{ marginBottom: 72 }}>
            <p className={s.micro} style={{ marginBottom: 32 }}>
              The result
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className={s.statValue}>{stat.value}</p>
                  <p className={s.micro} style={{ marginTop: 12 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={s.panel} style={{ marginBottom: 72 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[168px_1fr] gap-x-10 gap-y-6">
            <p className={s.micro}>The brief</p>
            <p className={s.body} style={{ maxWidth: "64ch" }}>
              {cs.problem}
            </p>
          </div>
        </section>

        {hasSolution && (
          <section className={s.panel} style={{ marginBottom: 96 }}>
            <div className="grid grid-cols-1 lg:grid-cols-[168px_1fr] gap-x-10 gap-y-6">
              <p className={s.micro}>The build</p>
              <p className={s.body} style={{ maxWidth: "64ch" }}>
                {cs.solution}
              </p>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className={s.panel}>
          <div className="max-w-2xl">
            <h2 className={s.section}>Want a page like this about your business?</h2>
            <p className={s.small} style={{ marginTop: 20 }}>
              Get a free website review and we&apos;ll tell you what is costing
              you local work — no obligation.
            </p>
          </div>
          <div style={{ marginTop: 40 }}>
            <LeadCaptureForm prefilledTrade={cs.trade} prefilledTown={cs.town} />
          </div>
          <div style={{ marginTop: 40 }}>
            <Link href="/case-studies" className={`${s.micro} ${s.textLink}`}>
              All work
              <ArrowRight width={14} height={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
