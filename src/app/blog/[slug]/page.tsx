import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  content: string;
}

const posts: BlogPostData[] = [
  {
    slug: "plumbers-plymouth-local-jobs",
    title: "How Plymouth plumbers get more local jobs from Google",
    excerpt:
      "If you're a plumber in Plymouth and your phone isn't ringing from Google, you're leaving money on the table. Here's exactly what you need to fix.",
    date: "2026-06-10",
    readingTime: "5 min read",
    content: `<p>If you're a plumber working in and around Plymouth, there's a good chance you're getting most of your work from word-of-mouth, the odd Checkatrade lead, and maybe a few repeat customers. That's fine — until the phone goes quiet.</p>

<p>The reality is, hundreds of people in Plymouth search for a plumber on Google every single month. "Plumber Plymouth," "emergency plumber near me," "boiler repair Plymouth" — these are real searches, made by real people, who need someone right now. If your business isn't showing up, someone else's is. And they're getting the call instead of you.</p>

<h2>Why most plumber websites don't work</h2>

<p>Most plumbers we speak to either don't have a website at all, or they've got one that was built years ago and hasn't been touched since. It might look alright, but it's not doing anything — it's not ranking on Google, it's not converting visitors into calls, and it's certainly not paying for itself.</p>

<p>The problem usually comes down to three things:</p>

<ul>
<li><strong>No local SEO.</strong> The site isn't optimised for Plymouth-specific searches, so Google doesn't know where you work or what you do.</li>
<li><strong>No Google Business Profile.</strong> Or it's set up but not optimised — no photos, no reviews, no posts. It's basically invisible.</li>
<li><strong>No clear call to action.</strong> People land on the site and don't know what to do next. There's no phone number in the header, no contact form, no reason to pick up the phone.</li>
</ul>

<h2>What actually works</h2>

<p>Getting more plumbing jobs from Google isn't complicated, but it does need to be done properly. Here's the approach that works for the plumbers we work with:</p>

<ol>
<li><strong>A website built for your area.</strong> Service pages targeting the specific areas you cover — Plymouth, Saltash, Ivybridge, Tavistock. Each page tells Google exactly where you work and what you offer.</li>
<li><strong>A fully optimised Google Business Profile.</strong> Photos of your work, regular posts, and a system for collecting reviews. This is what gets you into the map pack — the three results that show up at the top of local searches.</li>
<li><strong>Proper on-page SEO.</strong> Title tags, meta descriptions, heading structure, schema markup — the technical stuff that tells Google what your site is about.</li>
<li><strong>A site that converts.</strong> Click-to-call buttons, contact forms, trust signals like accreditations and reviews. When someone lands on your site, they should feel confident enough to call you.</li>
</ol>

<h2>The bottom line</h2>

<p>If you're a plumber in Plymouth and you're not getting regular enquiries from your website, something's wrong. It's not that online marketing doesn't work for plumbers — it's that your current setup isn't doing its job.</p>

<p>We build websites specifically for tradespeople in the South West. We know what works, we know what doesn't, and we can usually have you ranking on Google within a few months. If you want to know what's holding your website back, get in touch for a free review.</p>`,
  },
  {
    slug: "electricians-website-guide-2026",
    title: "5 things every South West electrician's website needs in 2026",
    excerpt:
      "Your website is your shopfront. If it's not doing these five things, it's costing you work. A practical checklist for electricians who want more enquiries.",
    date: "2026-06-17",
    readingTime: "6 min read",
    content: `<p>If you're an electrician in the South West, your website is probably one of two things: either it's a basic page you threw together years ago and haven't touched since, or it's something a mate built that "does the job." Either way, it's probably not bringing in the work it should be.</p>

<p>In 2026, people expect more. They're checking you out on their phone before they call. They're comparing you to three other electricians. And if your site doesn't tick the right boxes in about five seconds, they're gone.</p>

<p>Here are the five things your website needs to be doing right now.</p>

<h2>1. Mobile-first design</h2>

<p>Over 70% of people searching for an electrician are doing it on their phone. If your site doesn't look right, load fast, and work smoothly on mobile, you're losing most of your potential customers before they even see what you offer. This isn't optional anymore — it's the baseline.</p>

<h2>2. Service-specific pages</h2>

<p>Don't just list your services on one page. You need dedicated pages for each core service — EICRs, rewiring, consumer unit upgrades, new builds, emergency call-outs. Why? Because Google ranks pages, not websites. If someone searches "EICR inspection Bristol," you want a page that's specifically about EICR inspections in Bristol, not a generic "services" page that mentions it in a bullet point.</p>

<h2>3. Trust signals front and centre</h2>

<p>You're asking people to let you into their home and work on their electrics. They need to trust you. Your website should prominently display:</p>

<ul>
<li>Your NICEIC, NAPIT, or ELECSA registration</li>
<li>Public liability insurance</li>
<li>Google reviews (and a link to leave one)</li>
<li>Photos of your actual work — not stock photos</li>
<li>Your real name and face</li>
</ul>

<p>People hire people, not logos. If they can see who they're calling, they're far more likely to actually call.</p>

<h2>4. Local SEO foundations</h2>

<p>Your website needs to tell Google three things: what you do, where you do it, and why you're the right choice. That means:</p>

<ul>
<li>Your town or city in your page titles and headings</li>
<li>A Google Business Profile that's fully filled out and regularly updated</li>
<li>Consistent NAP (name, address, phone) across your website, Google profile, and directory listings</li>
<li>Schema markup so Google can read your business information properly</li>
</ul>

<p>Most electricians' websites have none of this. That's why they don't rank.</p>

<h2>5. A clear path to contact</h2>

<p>Every page on your site should make it dead easy to get in touch. That means:</p>

<ul>
<li>A phone number in the header that you can tap to call on mobile</li>
<li>A simple contact form (name, phone, what they need — that's it)</li>
<li>A WhatsApp button for people who'd rather message</li>
<li>Your response time — "We get back to you within 2 hours" builds confidence</li>
</ul>

<p>If someone has to scroll around looking for how to contact you, you've already lost them.</p>

<h2>The takeaway</h2>

<p>Your website isn't a brochure — it's a tool. If it's not bringing in enquiries, it's not doing its job. These five things aren't nice-to-haves; they're the minimum your site needs to compete in 2026.</p>

<p>If you want to know how your current site stacks up, we'll review it for free. No sales pitch, no obligation — just a straight assessment of what's working and what isn't.</p>`,
  },
];

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
