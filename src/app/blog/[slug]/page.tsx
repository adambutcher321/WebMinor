import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { posts, type BlogPostData } from "@/data/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleJsonLd({ post }: { post: BlogPostData }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Adam Butcher",
    },
    publisher: {
      "@type": "Organization",
      name: "WebMinor",
      url: "https://www.webminor.co.uk",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <ArticleJsonLd post={post} />
      <main className="px-6 pt-28 pb-20">
        {/* Back link */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#9AA3AF] text-sm hover:text-[#40E0FF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>

        {/* Article header */}
        <article className="max-w-3xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <p className="font-[family-name:var(--font-mono)] text-[12px] font-bold tracking-wider uppercase text-white/40">
                {formatDate(post.date)}
              </p>
              <span className="text-white/20">|</span>
              <p className="font-[family-name:var(--font-mono)] text-[12px] font-bold tracking-wider uppercase text-white/40">
                {post.readingTime}
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </header>

          {/* Article body */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-[family-name:var(--font-sora)] prose-headings:text-white
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-[#9AA3AF] prose-p:leading-relaxed prose-p:text-[16px]
              prose-li:text-[#9AA3AF] prose-li:text-[16px]
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-[#40E0FF] prose-a:no-underline hover:prose-a:underline
              prose-ul:space-y-2 prose-ol:space-y-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author */}
          <div className="mt-16 pt-8 border-t border-white/[0.07]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full flex items-center justify-center">
                <span className="font-[family-name:var(--font-sora)] text-[#40E0FF] font-bold text-sm">
                  AB
                </span>
              </div>
              <div>
                <p className="font-[family-name:var(--font-sora)] text-white font-semibold text-sm">
                  Adam Butcher
                </p>
                <p className="text-[#9AA3AF] text-sm">
                  Founder, WebMinor
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* CTA */}
        <section className="max-w-3xl mx-auto mt-20 bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
          <div className="text-center mb-8">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
              — Free Website Review
            </p>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
              Want to know where your website{" "}
              <span className="text-[#40E0FF]">stands?</span>
            </h2>
            <p className="text-[#9AA3AF] max-w-xl mx-auto">
              We&apos;ll review your current website and show you exactly
              what&apos;s working, what&apos;s not, and what to fix first.
            </p>
          </div>
          <LeadCaptureForm />
        </section>
      </main>
    </>
  );
}
