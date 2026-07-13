import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Contact WebMinor — Get in Touch",
  description:
    "Get in touch with WebMinor. Call 01752 845258, email hello@webminor.com, or fill out the form for a free website review. Based in Saltash, Cornwall.",
};

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "01752 845258",
    href: "tel:01752845258",
    note: "Tap to call",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@webminor.com",
    href: "mailto:hello@webminor.com",
    note: null,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "07894 331253",
    href: "https://wa.me/447894331253",
    note: "Chat on WhatsApp",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Unit 3, Gwel Avon Business Park, Gilston Road, Saltash, Cornwall PL12 6TW",
    href: "https://maps.google.com/?q=Unit+3+Gwel+Avon+Business+Park+Gilston+Road+Saltash+Cornwall+PL12+6TW",
    note: null,
  },
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <main className="pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden mb-16">
          <div className="relative h-[46vh] min-h-[340px] max-h-[560px] w-full">
            <Image
              src="/world/contact-hero.webp"
              alt=""
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
          </div>
          <div className="relative -mt-24 px-6 text-center max-w-5xl mx-auto">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
              — Contact
            </p>
            <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
              Let&apos;s talk about your{" "}
              <span className="text-[#40E0FF]">website</span>
            </h1>
            <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
              Whether you need a new website, want to improve your Google rankings,
              or just want some honest advice — get in touch.
            </p>
          </div>
        </section>

        {/* Two-column layout */}
        <section className="px-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Left — Contact details */}
          <div className="space-y-8">
            {/* Response time */}
            <div className="bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-6 flex items-center gap-4">
              <Clock className="w-8 h-8 text-[#40E0FF] shrink-0" />
              <div>
                <p className="font-[family-name:var(--font-sora)] text-white font-bold">
                  We respond within 2 hours
                </p>
                <p className="text-[#9AA3AF] text-sm">
                  During business hours, you&apos;ll hear back fast.
                </p>
              </div>
            </div>

            {/* Contact cards */}
            <div className="space-y-4">
              {contactDetails.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "WhatsApp" ? "_blank" : undefined}
                  rel={item.label === "WhatsApp" ? "noopener noreferrer" : undefined}
                  className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6 flex items-start gap-4 transition-colors hover:border-[#40E0FF]/30 block"
                >
                  <item.icon className="w-6 h-6 text-[#40E0FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/60 mb-1">
                      {item.label}
                    </p>
                    <p className="text-white text-[15px]">{item.value}</p>
                    {item.note && (
                      <p className="text-[#40E0FF] text-sm mt-1">{item.note}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-[family-name:var(--font-sora)] text-base font-semibold text-white mb-4">
                Opening Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9AA3AF]">Monday &ndash; Friday</span>
                  <span className="text-white">8am &ndash; 4:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA3AF]">Saturday</span>
                  <span className="text-white">By appointment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA3AF]">Sunday</span>
                  <span className="text-white/40">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Lead capture form */}
          <div className="space-y-8">
            <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 sm:p-10 h-fit">
              <div className="mb-8">
                <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-white mb-2">
                  Get your free website review
                </h2>
                <p className="text-[#9AA3AF] text-sm">
                  Fill in the form and we&apos;ll review your current website (or
                  discuss building one from scratch) and get back to you within 2
                  hours.
                </p>
              </div>
              <LeadCaptureForm />
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] aspect-video">
              <iframe
                title="WebMinor location"
                src="https://www.google.com/maps?q=Unit+3+Gwel+Avon+Business+Park+Gilston+Road+Saltash+Cornwall+PL12+6TW&output=embed"
                className="h-full w-full grayscale invert-[0.92] contrast-[1.1]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
