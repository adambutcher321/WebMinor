import type { Metadata } from "next";
import Image from "next/image";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import s from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact WebMinor — Get in Touch",
  description:
    "Get in touch with WebMinor. Call 01752 845258, email hello@webminor.com, or fill out the form for a free website review. Based in Saltash, Cornwall.",
};

type ContactRow = {
  label: string;
  value: string;
  href: string;
  note: string | null;
  external?: boolean;
};

const contactRows: ContactRow[] = [
  {
    label: "Phone",
    value: "01752 845258",
    href: "tel:01752845258",
    note: "Tap to call",
  },
  {
    label: "Email",
    value: "hello@webminor.com",
    href: "mailto:hello@webminor.com",
    note: "Replies in under 2 hours",
  },
  {
    label: "WhatsApp",
    value: "07894 331253",
    href: "https://wa.me/447894331253",
    note: "Open a chat",
    external: true,
  },
  {
    label: "Address",
    value: "Unit 3, Gwel Avon Business Park, Gilston Road, Saltash, Cornwall PL12 6TW",
    href: "https://maps.google.com/?q=Unit+3+Gwel+Avon+Business+Park+Gilston+Road+Saltash+Cornwall+PL12+6TW",
    note: "Open in Maps",
    external: true,
  },
];

const openingHours = [
  { day: "Mon — Fri", hours: "08:00 — 16:30" },
  { day: "Saturday", hours: "By appointment" },
  { day: "Sunday", hours: "Closed" },
];

function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "WebMinor",
    description:
      "Professional websites and local SEO for tradespeople across the South West.",
    url: "https://webminor.com",
    telephone: "01752845258",
    email: "hello@webminor.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 3, Gwel Avon Business Park, Gilston Road",
      addressLocality: "Saltash",
      addressRegion: "Cornwall",
      postalCode: "PL12 6TW",
      addressCountry: "GB",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "16:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    founder: {
      "@type": "Person",
      name: "Adam Butcher",
    },
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify does not escape `<`; swap it for its unicode form so the
      // payload can never break out of the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <main className={`${s.page} pb-24 lg:pb-32`}>
        {/* Hero — the page's single display statement, on the left rail */}
        <section className="relative">
          <div className="relative h-[38vh] min-h-[280px] max-h-[440px] w-full overflow-hidden">
            <Image
              src="/world/contact-hero.webp"
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Saturation is confined to the artwork; the gradient hands it back
                to --ground before any UI sits on top of it. */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/70 to-[#0B0D10]/20" />
          </div>

          <div className="relative mx-auto -mt-16 max-w-7xl px-5 lg:-mt-20 lg:px-8">
            <p className={s.micro}>Contact</p>
            <h1 className={`${s.display} mt-6 max-w-[16ch]`}>
              Let&apos;s talk about your{" "}
              <span className={s.accentWord}>website</span>
            </h1>
            <p className={`${s.body} mt-8 max-w-[54ch]`}>
              A new website, better Google rankings, or honest advice on what you
              already have. Tell us which and we&apos;ll come back the same working
              day.
            </p>
          </div>
        </section>

        {/* Enquiry — details on the rail, form in the wide right column */}
        <section className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-x-16 gap-y-14 px-5 lg:mt-24 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <div className="pb-8">
              <p className={s.micro}>Average reply</p>
              <p className={`${s.value} mt-3`}>
                Under 2 hours, Monday to Friday
              </p>
            </div>

            {contactRows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                target={row.external ? "_blank" : undefined}
                rel={row.external ? "noopener noreferrer" : undefined}
                className={s.row}
              >
                <span className={`${s.micro} block`}>{row.label}</span>
                <span className={`${s.value} mt-3 block`}>{row.value}</span>
                {row.note && (
                  <span className={`${s.microQuiet} mt-3 block`}>
                    {row.note} {row.external ? "↗" : "→"}
                  </span>
                )}
              </a>
            ))}

          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#F5F7FA1A] bg-[#151A21] p-6 sm:p-10">
              <h2 className={s.section}>Get your free website review</h2>
              <p className={`${s.body} mt-5 mb-10 max-w-[52ch]`}>
                Fill this in and we&apos;ll look over your current site — or talk
                through building one from scratch — and come back within two hours.
              </p>
              <LeadCaptureForm />
            </div>
          </div>
        </section>

        {/* Where we are — the map gets the full rail rather than a corner */}
        <section className="mx-auto mt-20 max-w-7xl px-5 lg:mt-28 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-[#F5F7FA1A] pt-8">
            <p className={s.micro}>Studio — Saltash, Cornwall</p>
            <p className={s.microQuiet}>50.4085&deg; N, 4.2183&deg; W</p>
          </div>
          <div className="mt-8 h-[320px] overflow-hidden rounded-2xl border border-[#F5F7FA1A] sm:h-[420px]">
            <iframe
              title="WebMinor location — Unit 3, Gwel Avon Business Park, Saltash"
              src="https://www.google.com/maps?q=Unit+3+Gwel+Avon+Business+Park+Gilston+Road+Saltash+Cornwall+PL12+6TW&output=embed"
              className={`${s.map} h-full w-full`}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Opening hours sit with the map, not in the enquiry rail — it keeps
              the two enquiry columns the same length and puts the hours next to
              the thing they qualify. */}
          <dl className="mt-8 grid grid-cols-1 gap-x-16 sm:grid-cols-3">
            {openingHours.map((slot) => (
              <div
                key={slot.day}
                className="flex items-baseline justify-between gap-6 border-b border-[#F5F7FA1A] py-4 sm:block sm:border-b-0 sm:border-t sm:py-0 sm:pt-5"
              >
                <dt className={s.micro}>{slot.day}</dt>
                <dd className={`${s.microQuiet} ${s.figures} sm:mt-2`}>
                  {slot.hours}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}
