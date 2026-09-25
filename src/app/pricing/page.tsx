import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PricingCards from "./PricingCards";
import GoogleReviews from "@/components/sections/GoogleReviews";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { FAQPageSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Website Prices: Free Design, £50/mo Hosting",
  description:
    "Free three-page website design with hosting at £50 a month + VAT. Bigger plans from £69 to £199 a month + VAT, and nothing longer than a rolling month.",
};

const faqs = [
  {
    question: "What exactly do I get with the free website design?",
    answer:
      "Three pages: a home page, a contact us page and an about us page. We design and build them for free. You then pay £50 a month plus VAT for hosting, which covers the server and the SSL certificate. You also pay for your domain name. Changes after the site is live are £25 + VAT for a small one, such as new wording or a photo swap, and £50 an hour + VAT for anything bigger, quoted before we start. Extra pages, SEO and ads are not part of the free design; they start on Starter.",
  },
  {
    question: "How can the design be free?",
    answer:
      "Because you stay for the hosting. The design costs you nothing and the £50 a month plus VAT is where we earn our keep, so it only works if the site is good enough that you want to keep it. Your home page is designed first and sent to you as a private link, so you can see where it's heading before the rest is built.",
  },
  {
    question: "Are there any hidden costs or setup fees I should know about?",
    answer:
      "No hidden costs, ever. The setup fee and monthly fee are clearly listed for each plan. Hosting, SSL, and support are all included in your monthly fee. On the free design plan, your domain name is paid for separately, and changes after launch are £25 + VAT for a small one or £50 an hour + VAT for bigger work, always quoted first. The only optional extra is Google Ads spend if you're on the Dominate plan — and we'll agree a budget with you before spending a penny.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Absolutely. You can move between plans at any time. If you start on Starter and want to add SEO or Google Ads later, we'll upgrade you seamlessly. There's no lock-in and no penalty for changing your mind.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel any time with 30 days' notice. On the free design plan the site stays with us, because the design was free in return for the hosting. On paid plans, what you take with you is set out in the written agreement for your project.",
  },
  {
    question: "Do I own my website?",
    answer:
      "On the free design plan, no. We design and build the site for nothing, and in return it stays ours while you pay to host it. On paid plans, ownership is set out in the written agreement for your project, before any work starts.",
  },
  {
    question: "How quickly will I get my website?",
    answer:
      "Free sites are usually live within 7 working days of receiving your content, and most Starter and Growth sites within 5. Dominate builds with custom copywriting and multi-page sites typically take 10–14 days. We'll give you a clear timeline before we start.",
  },
  {
    question: "Is there a contract or minimum term?",
    answer:
      "No long-term contracts. All plans are rolling monthly. We ask for a minimum of 3 months on Growth and Dominate plans to give SEO time to start working — but after that, you're free to cancel any time.",
  },
];

export default function PricingPage() {
  return (
    <main className="pb-20">
      <FAQPageSchema faqs={faqs} />
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="relative h-[46vh] min-h-[340px] max-h-[560px] w-full">
          <Image
            src="/world/pricing-hero.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10] via-transparent to-transparent h-24" />
        </div>
        <div className="relative -mt-24 px-6 text-center max-w-5xl mx-auto">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — Pricing
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
            Simple, transparent{" "}
            <span className="text-[#40E0FF]">pricing</span>
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
            Every price is on this page and nothing runs longer than a rolling
            month. The website design is free, and your home page is sent
            to you as a private link before the rest is built.
          </p>
        </div>
      </section>

      <div className="px-6">

      {/* Pricing Cards */}
      <PricingCards />

      {/* Custom work */}
      <section className="max-w-7xl mx-auto -mt-16 mb-24 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-7 py-6">
        <div>
          <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-white mb-1">
            Bigger project?
          </h2>
          <p className="text-[#9AA3AF] text-base leading-relaxed max-w-2xl">
            Online shops, bespoke builds, automation and CRM set-ups, and
            brand work are quoted per job. The work page has nine builds to
            click through first.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/case-studies"
            className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-3 font-[family-name:var(--font-sora)] text-base font-semibold text-white transition-colors hover:bg-white/[0.08]"
          >
            See the work
          </Link>
          <Link
            href="/contact"
            className="rounded-xl bg-[#40E0FF] px-5 py-3 font-[family-name:var(--font-sora)] text-base font-semibold text-[#0B0D10] transition-colors hover:bg-[#7AEAFF]"
          >
            Talk it through
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto mb-24">
        <div className="text-center mb-12">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — FAQ
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white">
            Common questions about{" "}
            <span className="text-[#40E0FF]">pricing</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6"
            >
              <h3 className="font-[family-name:var(--font-sora)] text-base font-semibold text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Full-bleed: cancels the px-6 wrapper so the cards run off the screen edge. */}
      <div className="-mx-6 mb-24">
        <GoogleReviews />
      </div>

      {/* Lead Capture */}
      <section className="max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Get Started
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to grow your{" "}
            <span className="text-[#40E0FF]">business?</span>
          </h2>
          <p className="text-[#9AA3AF] max-w-xl mx-auto">
            Start with a free website review. We&apos;ll show you exactly
            what&apos;s holding you back and recommend the right plan for your
            business.
          </p>
        </div>
        <LeadCaptureForm />
      </section>
      </div>
    </main>
  );
}
