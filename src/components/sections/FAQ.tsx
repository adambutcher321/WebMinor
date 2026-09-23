"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { generalFaqs } from "@/data/faq";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — FAQ
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Common questions
          </h2>
        </div>

        {/* FAQ list in a dark glass card */}
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl divide-y divide-white/[0.07]">
          {generalFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer transition-colors hover:bg-white/[0.02]"
                  aria-expanded={isOpen}
                >
                  <span className="font-[family-name:var(--font-sora)] text-base font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#9AA3AF] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-base text-[#9AA3AF] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
