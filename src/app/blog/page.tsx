import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Tips & Guides for Tradespeople",
  description:
    "Practical advice on websites, local SEO, and getting more work online. Written for plumbers, electricians, builders, and tradespeople across the South West.",
};

const posts = [
  {
    slug: "plumbers-plymouth-local-jobs",
    title: "How Plymouth plumbers get more local jobs from Google",
    excerpt:
      "If you're a plumber in Plymouth and your phone isn't ringing from Google, you're leaving money on the table. Here's exactly what you need to fix.",
    date: "2026-06-10",
  },
  {
    slug: "electricians-website-guide-2026",
    title: "5 things every South West electrician's website needs in 2026",
    excerpt:
      "Your website is your shopfront. If it's not doing these five things, it's costing you work. A practical checklist for electricians who want more enquiries.",
    date: "2026-06-17",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <main className="px-6 pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-16">
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
      </section>

      {/* Post Grid */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 flex flex-col transition-colors hover:border-[#40E0FF]/30 group"
          >
            {/* Date */}
            <p className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase text-white/40 mb-4">
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
