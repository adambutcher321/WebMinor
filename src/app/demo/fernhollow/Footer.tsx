import Link from "next/link";
import { TreePine } from "lucide-react";

/*
  Every Fernhollow page previously ended on its last section with nothing under
  it — no wordmark, no way back, no sign the site was finished rather than cut
  off. The details here are the ones the contact page already carries; nothing
  about the business is invented.
*/
const LINKS = [
  { label: "Rooms", href: "/demo/fernhollow/rooms" },
  { label: "Experiences", href: "/demo/fernhollow/experiences" },
  { label: "Contact", href: "/demo/fernhollow/contact" },
];

export default function FernhollowFooter() {
  return (
    <footer
      className="border-t border-white/10 bg-[#0d1210] px-6 sm:px-10 py-12"
      style={{ fontFamily: "var(--font-inter-fh)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/demo/fernhollow"
              className="flex items-center gap-2.5 mb-4"
            >
              <TreePine className="w-5 h-5 text-amber-300" aria-hidden="true" />
              <span
                className="text-xl tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
              >
                Fernhollow
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Handpicked cabins in the wildest, quietest corners of the map.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href="tel:+441234567890"
              className="text-white/60 hover:text-white transition-colors"
            >
              +44 1234 567 890
            </a>
            <a
              href="mailto:stay@fernhollow.example"
              className="text-white/60 hover:text-white transition-colors"
            >
              stay@fernhollow.example
            </a>
            <span className="text-white/40">Fernhollow Woods, Highland Lochs</span>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.08] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            Fernhollow is a concept brand created by{" "}
            <Link
              href="/case-studies"
              className="text-white/55 underline underline-offset-4 hover:text-white transition-colors"
            >
              WebMinor
            </Link>{" "}
            to demonstrate design and build work.
          </p>
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} WebMinor
          </p>
        </div>
      </div>
    </footer>
  );
}
