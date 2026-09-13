import type { Metadata } from "next";
import Image from "next/image";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import { Reveal, Counter } from "../motion";
import { Button, Eyebrow, Quote, SectionHead } from "../ui";
import { BASE, CREDENTIALS, IMG, STATS, TESTIMONIALS, TIMELINE, VALUES } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: "About Jessica — Mindful | WebMinor Concept Demo" },
  description: "Nine years teaching, the last four from a barn above the Tamar. Six in a class, on purpose.",
};

export default function AboutPage() {
  return (
    <main className={s.page}>
      <MindfulNav />

      {/* Portrait and the opening */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className={`${s.frame} ${s.frameTall} ${s.ring} aspect-[3/4]`}>
              <Image src={`${IMG}/portrait-laugh.webp`} alt="Jessica laughing in the meadow with a rolled yoga mat under one arm" fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <Eyebrow>About</Eyebrow>
            <h1 className={`${s.display} mt-5`}>
              Hey, I&rsquo;m <span className={s.italic}>Jessica.</span>
            </h1>
            <p className={`${s.lede} mt-7 max-w-xl`}>
              I teach private and small-group yoga from a barn behind my house,
              in a village above the Tamar, and I keep it small on purpose.
            </p>
            <p className={`${s.body} mt-5 max-w-xl`}>
              I came to this the way most of my clients do: a desk, a neck that
              had become a problem, and a teacher training I signed up for to fix
              it. It fixed it, and then it took over. Nine years on, the thing I
              am best at is looking at how someone stands, sits and breathes and
              building them ten minutes a day that undoes what the rest of the
              day does.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`${BASE}/book`} arrow>
                Book a free call
              </Button>
              <Button href={`${BASE}/work-with-me`} variant="ghost">
                Ways to work with me
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal stagger className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 border-t border-b py-12" style={{ borderColor: "var(--line)" }}>
          {STATS.map((st) => (
            <div key={st.label}>
              <p className={s.numeral}>
                <Counter value={st.value} suffix={st.suffix} />
              </p>
              <p className={`${s.small} mt-2`}>{st.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* The barn */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-6 lg:order-2">
            <div className={`${s.frame} aspect-[4/3]`}>
              <Image src={`${IMG}/about-barn.webp`} alt="The barn studio: six mats on a pale wooden floor, sun through the glass doors" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:order-1" delay={120}>
            <SectionHead
              eyebrow="The studio"
              title={
                <>
                  A barn, six mats, and a door that <span className={s.italic}>opens onto the meadow.</span>
                </>
              }
              lede="It was a hay store when we arrived. Now it has a floor that is warm underfoot, a wood burner for the winter, and a glass door that slides back so that on a good morning the practice is half outside. Six mats fit without anyone touching. That felt like enough, and it still does."
            />
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <SectionHead eyebrow="How I teach" title="Three things I will not compromise on." />
        </Reveal>
        <Reveal stagger className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          {VALUES.map((v, i) => (
            <div key={v.title} className="border-t pt-6" style={{ borderColor: "var(--line)" }}>
              <p className={s.weekNo}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className={`${s.h3} mt-4`}>{v.title}</h3>
              <p className={`${s.body} mt-3`}>{v.text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHead eyebrow="How I got here" title="A short history." />
              <div className={`${s.frame} mt-10 aspect-[4/3] hidden lg:block`}>
                <Image src={`${IMG}/breath.webp`} alt="Jessica with her eyes closed and a hand on her chest" fill sizes="30vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
          <Reveal stagger className="lg:col-span-8">
            {TIMELINE.map((t) => (
              <div key={t.year} className={s.week} style={{ gridTemplateColumns: "5.5rem 1fr" }}>
                <p className={s.weekNo} style={{ fontSize: "1.5rem", paddingTop: "0.3rem" }}>{t.year}</p>
                <p className={`${s.lede} max-w-xl`} style={{ fontSize: "1.2rem" }}>{t.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Credentials */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="rounded-[2rem] bg-white border p-8 sm:p-12" style={{ borderColor: "var(--line)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <Eyebrow>Training</Eyebrow>
                <h2 className={`${s.h2} mt-4`} style={{ fontSize: "2.2rem" }}>
                  What I trained in, and keep training in.
                </h2>
                <p className={`${s.body} mt-4`}>
                  Registered with Yoga Alliance Professionals. Insured, first-aid
                  trained, and still doing a course most years, because the
                  breath work alone has changed twice since I started.
                </p>
              </div>
              <dl className="lg:col-span-8">
                {CREDENTIALS.map((c) => (
                  <div key={c.year + c.what} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4 border-t" style={{ borderColor: "var(--line)" }}>
                    <dt className={`${s.eyebrow} pt-1`} style={{ color: "var(--ink-mute)" }}>{c.year}</dt>
                    <dd className={s.body} style={{ color: "var(--ink)" }}>{c.what}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      {/* A word from someone */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          <Quote {...TESTIMONIALS[2]} />
          <Quote {...TESTIMONIALS[3]} />
        </Reveal>
      </section>

      <MindfulFooter />
    </main>
  );
}
