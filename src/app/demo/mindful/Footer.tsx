import Link from "next/link";
import { Flower2 } from "lucide-react";

/*
  Every Mindful page stopped at its last section with nothing beneath it. The
  wording here is drawn from copy already on the site; no contact details are
  invented, because the concept routes every enquiry through the booking form.
*/
const LINKS = [
  { label: "Sessions", href: "/demo/mindful/sessions" },
  { label: "About", href: "/demo/mindful/about" },
  { label: "Book a Session", href: "/demo/mindful/book" },
];

export default function MindfulFooter() {
  return (
    <footer
      className="border-t border-[#5b7052]/15 bg-[#f3ede4] px-6 sm:px-10 py-12"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/demo/mindful"
              className="flex items-center gap-2.5 mb-4"
            >
              <Flower2 className="w-5 h-5 text-[#5b7052]" aria-hidden="true" />
              <span
                className="text-2xl tracking-tight text-[#2b2a26]"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
              >
                Mindful
              </span>
            </Link>
            <p className="text-sm text-[#2b2a26]/55 leading-relaxed max-w-xs">
              A small private yoga practice — sessions arranged around your
              schedule, taught with patience.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-[#2b2a26]/60 hover:text-[#2b2a26] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-[#5b7052]/12 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#2b2a26]/40">
            Mindful is a concept brand created by{" "}
            <Link
              href="/case-studies"
              className="text-[#2b2a26]/60 underline underline-offset-4 hover:text-[#2b2a26] transition-colors"
            >
              WebMinor
            </Link>{" "}
            to demonstrate design and build work.
          </p>
          <p className="text-xs text-[#2b2a26]/40">
            &copy; {new Date().getFullYear()} WebMinor
          </p>
        </div>
      </div>
    </footer>
  );
}
