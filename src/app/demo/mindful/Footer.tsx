import Link from "next/link";
import { Flower2 } from "lucide-react";
import { BASE, GUIDE, RESET } from "./content";
import s from "./mindful.module.css";

const COLUMNS = [
  {
    head: "Work with me",
    links: [
      { label: "Private sessions", href: `${BASE}/work-with-me#private` },
      { label: "Small group flow", href: `${BASE}/work-with-me#group` },
      { label: "Workplace sessions", href: `${BASE}/work-with-me#workplace` },
      { label: RESET.name, href: `${BASE}/the-reset` },
    ],
  },
  {
    head: "Elsewhere",
    links: [
      { label: "Retreats", href: `${BASE}/retreats` },
      { label: "Journal", href: `${BASE}/journal` },
      { label: "About Jessica", href: `${BASE}/about` },
      { label: "Book", href: `${BASE}/book` },
    ],
  },
];

export default function MindfulFooter() {
  return (
    <footer className="border-t border-[#5b7052]/15 bg-[#f3ede4] px-6 sm:px-10 pt-16 pb-10" style={{ fontFamily: "var(--font-manrope)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link href={BASE} className="flex items-center gap-2.5 mb-5">
              <Flower2 className="w-5 h-5 text-[#5b7052]" aria-hidden="true" />
              <span className="text-2xl tracking-tight text-[#2b2a26]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}>
                Mindful
              </span>
            </Link>
            <p className={`${s.body} max-w-sm`}>
              Private yoga and breath coaching from a barn above the Tamar. Six in a
              class, four in each Reset, ten minutes a day. Small on purpose.
            </p>
            <Link
              href={`${BASE}/free-guide`}
              className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-[#faf6f0] border border-[#5b7052]/15 px-5 py-4 max-w-sm hover:border-[#5b7052]/40 transition-colors group"
            >
              <span>
                <span className="block text-[#2b2a26] text-[15px]" style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "1.25rem" }}>
                  {GUIDE.name}, free
                </span>
                <span className={`${s.small} block mt-0.5`}>{GUIDE.strap}</span>
              </span>
              <span aria-hidden="true" className="text-[#5b7052] transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {COLUMNS.map((c) => (
            <nav key={c.head} aria-label={c.head} className="md:col-span-3">
              <p className={s.eyebrow}>{c.head}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[15px] text-[#2b2a26]/65 hover:text-[#2b2a26] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-1" />
        </div>

        <div className="mt-14 border-t border-[#5b7052]/12 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#2b2a26]/40">
            Mindful is a concept brand created by{" "}
            <Link href="/case-studies" className="text-[#2b2a26]/60 underline underline-offset-4 hover:text-[#2b2a26] transition-colors">
              WebMinor
            </Link>{" "}
            to demonstrate design and build work. Jessica, her clients and the dates are invented.
          </p>
          <p className="text-xs text-[#2b2a26]/40">&copy; {new Date().getFullYear()} WebMinor</p>
        </div>
      </div>
    </footer>
  );
}
