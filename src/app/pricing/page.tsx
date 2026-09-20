import type { Metadata } from "next";
import Image from "next/image";
import PricingCards from "./PricingCards";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { FAQPageSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for trades websites. Free website design with £50/mo + VAT hosting, up to £199/mo + VAT for a fully managed digital marketing package. No hidden fees.",
};

const faqs = [
  {
    question: "What exactly do I get with the free website design?",
    answer:
      "Three pages: a home page, a contact us page and an about us page. We design and build them for free. You then pay £50 a month plus VAT for hosting, which covers the server and the SSL certificate, and that is the only charge. Extra pages, SEO and ads are not part of the free design; they start on Starter.",
  },
  {
    question: "Are there any hidden costs or setup fees I should know about?",
    answer:
      "No hidden costs, ever. The setup fee and monthly fee are clearly listed for each plan. Hosting, SSL, and support are all included in your monthly fee. The only optional extra is Google Ads spend if you're on the Dominate plan — and we'll agree a budget with you before spending a penny.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Absolutely. You can move between plans at any time. If you start on Starter and want to add SEO or Google Ads later, we'll upgrade you seamlessly. There's no lock-in and no penalty for changing your mind.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel any time with 30 days' notice. If you want to keep your website, we'll transfer it to you or another provider. We don't hold your site hostage — it's your business and your content.",
  },
  {
    question: "Do I own my website?",
    answer:
      "Yes. All content, copy, and design work we produce for you belongs to you. If you ever want to move to a different provider, we'll hand everything over. We keep clients because they want to stay, not because they're locked in.",
  },
  {
    question: "How quickly will I get my website?",
    answer:
      "Most Starter and Growth sites are live within 5 working days from receiving your content. Dominate builds with custom copywriting and multi-page sites typically take 10–14 days. We'll give you a clear timeline before we start.",
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
            No hidden fees. No long contracts. Pick the plan that fits your
            business and start getting more local work.
          </p>
        </div>
      </section>

      <div className="px-6">

      {/* Pricing Cards */}
      <PricingCards />

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
