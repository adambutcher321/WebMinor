import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { posts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — Tips & Guides for Growing Businesses",
  description:
    "Practical advice on websites, local SEO, and getting more work online. Written for plumbers, electricians, builders, and tradespeople across the South West.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="relative h-[42vh] min-h-[300px] max-h-[480px] w-full">
          <Image
            src="/world/blog-hero.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
        </div>
        <div className="relative -mt-20 px-6 text-center max-w-5xl mx-auto">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — Blog
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
            Tips &amp; guides for{" "}
            <span className="text-[#40E0FF]">tradespeople</span>
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
            Practical advice on websites, local SEO, and getting more work online
            — written in plain English, not marketing waffle.
          </p>
        </div>
      </section>

      {/* Post Grid */}
      <section className="px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 flex flex-col transition-colors hover:border-[#40E0FF]/30 group"
          >
            {/* Date */}
            <p className="font-[family-name:var(--font-mono)] text-[12px] font-bold tracking-wider uppercase text-white/40 mb-4">
              {formatDate(post.date)}
            </p>

            {/* Title */}
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-3 group-hover:text-[#40E0FF] transition-colors">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-[#9AA3AF] text-sm leading-relaxed mb-6 flex-1">
              {post.excerpt}
            </p>

            {/* Read more */}
            <span className="flex items-center gap-2 text-[#40E0FF] text-sm font-[family-name:var(--font-sora)] font-semibold group-hover:gap-3 transition-all">
              Read more <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
