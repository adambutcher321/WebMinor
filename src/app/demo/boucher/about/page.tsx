import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TintProvider } from "../Tint";
import Nav from "../Nav";
import CartDrawer from "../CartDrawer";
import Footer from "../Footer";
import Reveal from "../Reveal";
import { Monogram } from "../Logo";
import { BASE, IMG } from "../shop";
import s from "../boucher.module.css";

export const metadata: Metadata = {
  title: { absolute: "About — Boucher Tailored | WebMinor Concept" },
  description: "Two people, one jacket, a factory in Porto.",
};

const YEARS = [
  { y: "2021", t: "Elise Boucher and Sam Tailored meet in a factory in Porto, both there to make a different jacket for somebody else. Both leave with a sketch of this one." },
  { y: "2022", t: "Eleven prototypes. The shine arrives at number eight and never leaves. The first run of two hundred, in black only, sells out in a fortnight from a folding table at a Lisbon market." },
  { y: "2023", t: "Ember and Cobalt. A studio on Rua das Flores, open three days a week because the other four are spent at the factory." },
  { y: "2024", t: "Acid Lime, after a year of being told not to. Mia Okafor starts drawing monsters." },
  { y: "2025", t: "The Doodle Edition. Three hundred numbered jackets, and a waiting list for the next print that we have not designed yet." },
];

export default function AboutPage() {
  return (
    <TintProvider initialSlug="onyx" autoplay={false}>
      <main className={s.screen}>
        <Nav />
        <section className={`${s.section} pb-10`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <Reveal className="lg:col-span-8">
              <p className={s.micro}>About us</p>
              <h1 className={`${s.display} mt-4`}>Two people. One jacket. A factory that lets us in on Sundays.</h1>
            </Reveal>
            <Reveal className="lg:col-span-4">
              <p className={s.body}>
                Boucher Tailored makes one thing. We think that is the only honest
                way to make something well enough to charge for it.
              </p>
            </Reveal>
          </div>
        </section>

        <section className={`${s.section} pt-6`}>
          <Reveal>
            <div className={`${s.card} relative aspect-[16/9] sm:aspect-[21/9] !rounded-[32px]`}>
              <Image src={`${IMG}/look-cobalt.webp`} alt="The cobalt puffer against a cobalt studio backdrop" fill priority sizes="100vw" className="object-cover" />
            </div>
          </Reveal>
        </section>

        <section className={`${s.section} pt-4`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Monogram size={56} />
              <h2 className={`${s.h2} mt-6`}>The mark</h2>
              <p className={`${s.body} mt-5`}>
                The badge on the sleeve, drawn down to its bones: a stitched
                label with three baffles inside it. It is stamped into the zip
                pull, embroidered inside the collar, and on the left arm of
                every jacket, small enough to miss. The jacket is the logo.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-7">
              {YEARS.map((r) => (
                <div key={r.y} className={`${s.rule} grid grid-cols-[5rem_1fr] gap-6 py-6`}>
                  <p className={`${s.h3} opacity-60`}>{r.y}</p>
                  <p className="text-[16px] leading-relaxed">{r.t}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className={`${s.section} pt-0`}>
          <Reveal>
            <div className={`${s.card} p-8 sm:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8 !rounded-[32px]`}>
              <div className="max-w-xl">
                <p className={s.micro}>Made in Porto</p>
                <h2 className={`${s.h2} mt-3`}>Cut, filled and sewn by the same forty people since day one.</h2>
                <p className={`${s.body} mt-4`}>
                  The down is traceable to the farm. The shell is woven forty
                  minutes away. When a zip fails, and one has, we replace the
                  jacket and keep the old one to find out why.
                </p>
              </div>
              <Link href={BASE} className={`${s.btn} ${s.btnFg} shrink-0`}>
                See the jacket
              </Link>
            </div>
          </Reveal>
        </section>
        <Footer />
      </main>
      <CartDrawer />
    </TintProvider>
  );
}
