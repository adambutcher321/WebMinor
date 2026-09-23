import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Service } from "@/types";
import WebsiteHealthCheck from "@/components/audit/WebsiteHealthCheck";
import { ServiceSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";

/* One layout for the four service pages. They used to be four copies of the
   same file with the same six-bullet grid; the shape is still shared, but
   the length now comes from the data — a page with no list simply has none. */

export default function ServicePage({
  service,
  route,
  crumb,
  hero,
}: {
  service: Service;
  /** Path under /services, e.g. "local-seo". */
  route: string;
  /** Breadcrumb label. */
  crumb: string;
  hero: string;
}) {
  const url = `https://www.webminor.co.uk/services/${route}`;

  return (
    <main className="pb-20">
      <BreadcrumbSchema
        trail={[
          { name: "Services", path: "/services" },
          { name: crumb, path: `/services/${route}` },
        ]}
      />
      <ServiceSchema name={service.name} description={service.shortDescription} url={url} />

      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="relative h-[42vh] min-h-[300px] max-h-[480px] w-full">
          <Image src={hero} alt="" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
        </div>
        <div className="relative -mt-20 px-6 text-center max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
            {service.name}
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-3xl mx-auto leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 max-w-3xl mx-auto mb-16 space-y-6">
        {service.body.map((para, i) => (
          <p key={i} className="text-[#C4CAD3] text-[17px] sm:text-[18px] leading-[1.7]">
            {para}
          </p>
        ))}
      </section>

      {service.included && (
        <section className="px-6 max-w-3xl mx-auto mb-16">
          <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-white mb-6">
            {service.included.heading}
          </h2>
          <ul className="border-t border-white/[0.08]">
            {service.included.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 border-b border-white/[0.08] py-4"
              >
                <CheckCircle className="w-5 h-5 text-[#40E0FF] shrink-0 mt-1" />
                <span className="text-[#C4CAD3] text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Where it sits in the plans */}
      <section className="px-6 max-w-3xl mx-auto mb-20">
        <p className="text-[#9AA3AF] text-base leading-relaxed border-l-2 border-[#40E0FF]/60 pl-5">
          {service.planNote}{" "}
          <Link href="/pricing" className="text-[#40E0FF] underline-offset-4 hover:underline whitespace-nowrap">
            See every plan &rarr;
          </Link>
        </p>
      </section>

      {/* The offer: the same free health check on every service page */}
      <section className="px-6 max-w-5xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-6 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Free website health check
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            {service.offer.heading}
          </h2>
          <p className="text-[#9AA3AF] text-base max-w-xl mx-auto">{service.offer.lede}</p>
        </div>
        <WebsiteHealthCheck compact />
        <p className="mt-6 text-center text-[#768393] text-base">
          Rather talk to someone? Ring{" "}
          <a href="tel:01752845258" className="text-[#40E0FF] underline-offset-4 hover:underline">01752 845258</a> or{" "}
          <Link href="/contact" className="text-[#40E0FF] underline-offset-4 hover:underline">send a message</Link>.
        </p>
      </section>
    </main>
  );
}
