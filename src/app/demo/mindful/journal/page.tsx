import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import { Reveal } from "../motion";
import { Button, Eyebrow } from "../ui";
import { BASE, GUIDE, POSTS } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: "Journal — Mindful | WebMinor Concept Demo" },
  description: "Short pieces on breath, hips, sleep and keeping a practice, from Jessica.",
};

export default function JournalPage() {
  const [lead, ...rest] = POSTS;
  return (
    <main className={s.page}>
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-14">
        <Reveal>
          <Eyebrow>Journal</Eyebrow>
          <h1 className={`${s.display} mt-5 max-w-3xl`}>
            Things I say in every session, <span className={s.italic}>written down.</span>
          </h1>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Reveal>
          <Link href={`${BASE}/journal/${lead.slug}`} className={`${s.card} group grid grid-cols-1 lg:grid-cols-12 !rounded-[2rem]`}>
            <div className="relative lg:col-span-7 min-h-[280px] lg:min-h-[440px] overflow-hidden">
              <Image src={lead.image} alt={lead.alt} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className={`object-cover ${s.zoom}`} />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center">
              <p className={s.small}>
                Latest · {lead.date} · {lead.readTime}
              </p>
              <h2 className={`${s.h2} mt-3`}>{lead.title}</h2>
              <p className={`${s.body} mt-4`}>{lead.standfirst}</p>
              <span className={`${s.btn} ${s.btnGhost} mt-6`}>
                Read it <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p) => (
            <Link key={p.slug} href={`${BASE}/journal/${p.slug}`} className={`${s.card} group flex flex-col`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className={`object-cover ${s.zoom}`} />
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

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <div className={`${s.sagePanel} p-10 sm:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8`}>
            <div className="max-w-xl">
              <p className={s.eyebrow} style={{ color: "rgba(255,255,255,0.7)" }}>Rather do it than read it?</p>
              <h2 className={`${s.h2} mt-3`}>{GUIDE.name}</h2>
              <p className={`${s.body} mt-3`} style={{ color: "rgba(255,255,255,0.78)" }}>{GUIDE.strap}</p>
            </div>
            <Button href={`${BASE}/free-guide`} variant="onInk" arrow>
              Send it to me
            </Button>
          </div>
        </Reveal>
      </section>

      <MindfulFooter />
    </main>
  );
}
