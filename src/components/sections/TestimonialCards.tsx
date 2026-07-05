import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export default function TestimonialCards() {
  return (
    <section className="relative z-10 px-6 py-20" data-animate-card data-tilt>
      <div className="max-w-6xl mx-auto bg-[rgba(11,13,16,0.82)] border border-white/[0.07] rounded-2xl p-10 sm:p-14">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Reviews
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            What our clients say
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-stagger-children>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-[#F5F7FA]/90 italic leading-relaxed mb-6 flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="border-t border-white/[0.07] pt-4">
                <p className="font-[family-name:var(--font-sora)] text-sm font-bold text-white">
                  {testimonial.name}
                </p>
                <p className="text-xs text-[#9AA3AF] mt-0.5">
                  {testimonial.business} &middot;{" "}
                  {testimonial.town.charAt(0).toUpperCase() +
                    testimonial.town.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
