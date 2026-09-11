import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import FernhollowNav from "../Nav";
import ContactForm from "./ContactForm";
import FernhollowFooter from "../Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "Contact — Fernhollow Concept Demo | WebMinor" },
  description:
    "A concept short-stay booking site design by WebMinor, showing the kind of premium web design we can build for hospitality and travel businesses.",
};

export default function FernhollowContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0d1210] text-white">
      <FernhollowNav />

      <section className="grid grid-cols-1 lg:grid-cols-2 flex-1">
        {/* Left: image */}
        <div className="relative hidden lg:block">
          <Image
            src="/demo/fernhollow/room1.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 1px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1210]/40" />
          <div className="absolute bottom-0 left-0 right-0 p-10">
            <p
              className="text-sm italic text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              &ldquo;The quietest few days we&apos;ve had in years.&rdquo;
            </p>
          </div>
        </div>

        {/* Right: content */}
        <div className="px-6 sm:px-10 lg:px-16 py-16 flex flex-col justify-center">
          <p
            className="text-xs uppercase tracking-[0.25em] text-amber-300/90 mb-4"
            style={{ fontFamily: "var(--font-inter-fh)" }}
          >
            Contact
          </p>
          <h1
            className="text-4xl sm:text-5xl leading-[1.05] mb-5"
            style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
          >
            Plan your <span className="italic text-white/60">stay</span>
          </h1>
          <p
            className="text-white/60 leading-relaxed mb-10 max-w-md"
            style={{ fontFamily: "var(--font-inter-fh)" }}
          >
            Questions about a booking, a location, or something more
            particular? We reply within a day, usually much sooner.
          </p>

          <div
            className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 mb-10"
            style={{ fontFamily: "var(--font-inter-fh)" }}
          >
            <a
              href="tel:+441234567890"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 hover:border-amber-200/25 hover:bg-white/[0.05] transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
              <span className="text-sm text-white/80 whitespace-nowrap">
                +44 1234 567 890
              </span>
            </a>
            <a
              href="mailto:stay@fernhollow.example"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 hover:border-amber-200/25 hover:bg-white/[0.05] transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
              <span className="text-sm text-white/80 whitespace-nowrap">
                stay@fernhollow.example
              </span>
            </a>
          </div>

          <div
            className="flex items-start gap-3 mb-10 text-white/50"
            style={{ fontFamily: "var(--font-inter-fh)" }}
          >
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm leading-relaxed">
              Fernhollow Woods, Highland Lochs &mdash; by appointment, each
              cabin is a private booking
            </span>
          </div>

          <ContactForm />
        </div>
      </section>

      <FernhollowFooter />
    </main>
  );
}
