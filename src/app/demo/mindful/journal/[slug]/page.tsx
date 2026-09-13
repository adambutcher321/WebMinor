import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MindfulNav from "../../Nav";
import MindfulFooter from "../../Footer";
import { Reveal } from "../../motion";
import { Button, Eyebrow } from "../../ui";
import { BASE, GUIDE, POSTS } from "../../content";
import s from "../../mindful.module.css";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/demo/mindful/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.title} — Mindful Journal | WebMinor Concept Demo` },
    description: post.standfirst,
  };
}

export default async function JournalPost(props: PageProps<"/demo/mindful/journal/[slug]">) {
  const { slug } = await props.params;
  const idx = POSTS.findIndex((p) => p.slug === slug);
  if (idx < 0) notFound();
  const post = POSTS[idx];
  const next = POSTS[(idx + 1) % POSTS.length];

  return (
    <main className={s.page}>
      <MindfulNav />

      <article>
        <header className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 pb-12 text-center">
          <Reveal>
            <Link href={`${BASE}/journal`} className={s.eyebrow}>
              Journal
            </Link>
            <h1 className={`${s.display} mt-5`} style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}>
              {post.title}
            </h1>
            <p className={`${s.lede} mt-6`} style={{ color: "var(--ink-soft)" }}>
              {post.standfirst}
            </p>
            <p className={`${s.small} mt-6`}>
              Jessica · {post.date} · {post.readTime} read
            </p>
          </Reveal>
        </header>

        <Reveal className="max-w-5xl mx-auto px-6">
          <div className={`${s.frame} aspect-[16/9]`}>
            <Image src={post.image} alt={post.alt} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
          </div>
        </Reveal>

        <Reveal className="max-w-2xl mx-auto px-6 pt-16 pb-20">
          <div className={s.prose}>
            {post.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t flex items-center gap-4" style={{ borderColor: "var(--line)" }}>
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
              <Image src="/demo/mindful/portrait.webp" alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "1.2rem" }}>Jessica</p>
              <p className={s.small}>Private yoga and breath coaching, above the Tamar.</p>
            </div>
          </div>
        </Reveal>
      </article>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href={`${BASE}/journal/${next.slug}`} className={`${s.card} group flex flex-col`}>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={next.image} alt={next.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className={`object-cover ${s.zoom}`} />
            </div>
            <div className="p-7">
              <Eyebrow>Read next</Eyebrow>
              <h2 className={`${s.h3} mt-2`}>{next.title}</h2>
            </div>
          </Link>
          <div className={`${s.sagePanel} p-8 sm:p-10 flex flex-col justify-between`}>
            <div>
              <p className={s.eyebrow} style={{ color: "rgba(255,255,255,0.7)" }}>Free</p>
              <h2 className={`${s.h2} mt-2`} style={{ fontSize: "2.2rem" }}>{GUIDE.name}</h2>
              <p className={`${s.body} mt-3`} style={{ color: "rgba(255,255,255,0.78)" }}>{GUIDE.strap}</p>
            </div>
            <Button href={`${BASE}/free-guide`} variant="onInk" className="mt-8 w-fit" arrow>
              Send it to me
            </Button>
          </div>
        </Reveal>
      </section>

      <MindfulFooter />
    </main>
  );
}
