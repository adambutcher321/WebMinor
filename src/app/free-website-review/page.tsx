import type { Metadata } from "next";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import WebsiteHealthCheck from "@/components/audit/WebsiteHealthCheck";

export const metadata: Metadata = {
  title: "Free website health check",
  description:
    "Type in your web address and get a score out of 100, the three things to fix first, and a full PDF report. Free, in under a minute, from WebMinor in Saltash.",
};

/* What the check covers, said plainly. Each line maps to real checks in
   src/lib/audit — don't add one here that the crawler doesn't do. */
const COVERS = [
  ["Being found on Google", "Sitemap, robots.txt, pages hidden from search, the www and non-www addresses, and pages that should say “not found” but don’t."],
  ["How you look in search", "Missing or duplicate titles and descriptions, ones Google cuts off, main headings, and pages too thin to rank."],
  ["Speed on a phone", "Google’s own speed test on your homepage, image weight, slow server responses and heavy code."],
  ["Links that work", "Every link between your pages, links out to other sites, and pages nothing links to."],
  ["Trust and getting in touch", "The padlock, a tap-to-call number, a way to send a message, a privacy policy, business details for Google Maps, and when your web address expires."],
];

export default function FreeWebsiteReviewPage() {
  return (
    <main className="px-6 pt-28 pb-20">
      <div className="max-w-5xl mx-auto">
        <section className="mb-14 max-w-3xl">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — Free website health check
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Find out why your competitors are getting the{" "}
            <span className="text-[#40E0FF]">calls you&apos;re missing</span>
          </h1>
          <p className="text-lg text-[#9AA3AF] leading-relaxed">
            Type in your web address. We&apos;ll read up to 60 pages of your site the way Google does, run
            Google&apos;s speed test on a phone, and give you a score out of 100 with the three things
            we&apos;d fix first.
          </p>
        </section>

        <section className="mb-24">
          <WebsiteHealthCheck />
        </section>

        <section className="mb-24">
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-8">
            What it checks
          </h2>
          <dl className="border-t border-white/[0.08]">
            {COVERS.map(([term, detail]) => (
              <div key={term} className="grid gap-2 sm:grid-cols-[260px_1fr] border-b border-white/[0.08] py-5">
                <dt className="font-[family-name:var(--font-sora)] font-semibold text-white text-[17px]">{term}</dt>
                <dd className="text-[#9AA3AF] text-base leading-relaxed">{detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[#768393] text-base max-w-3xl">
            It won&apos;t tell you your &ldquo;domain authority&rdquo; or count backlinks: those numbers come from paid
            databases, and they matter far less to a local business than whether the phone number works.
          </p>
        </section>

        <section className="bg-[#0B0D10]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-12">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-3">
              Rather talk to a person?
            </h2>
            <p className="text-[#9AA3AF] text-base">
              Leave your details and we&apos;ll look at the site ourselves and ring or email you within one
              working day. No website yet? Leave that box empty and we&apos;ll start with how you show up on
              Google.
            </p>
          </div>
          <LeadCaptureForm />
        </section>
      </div>
    </main>
  );
}
