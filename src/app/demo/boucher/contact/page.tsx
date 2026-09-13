import type { Metadata } from "next";
import { TintProvider } from "../Tint";
import Nav from "../Nav";
import CartDrawer from "../CartDrawer";
import Footer from "../Footer";
import Reveal from "../Reveal";
import ContactForm from "./ContactForm";
import s from "../boucher.module.css";

export const metadata: Metadata = {
  title: { absolute: "Contact — Boucher Tailored | WebMinor Concept" },
  description: "The studio on Rua das Flores, and the two people who answer the email.",
};

const ROWS = [
  { k: "Email", v: "hello@bouchertailored.com" },
  { k: "Studio", v: "14 Rua das Flores, 4050-262 Porto" },
  { k: "Open", v: "Thursday to Saturday, 11 until 7" },
  { k: "Repairs", v: "Free for life on the zip and the seams. Post it or bring it." },
  { k: "Returns", v: "Thirty days, worn or not, any reason." },
];

export default function ContactPage() {
  return (
    <TintProvider initialSlug="cobalt" autoplay={false}>
      <main className={s.screen}>
        <Nav />
        <section className={s.section}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <Reveal className="lg:col-span-6">
              <p className={s.micro}>Contact</p>
              <h1 className={`${s.display} mt-4`}>Two inboxes, no ticket numbers.</h1>
              <p className={`${s.body} mt-6 max-w-md`}>
                Write to us about a jacket you have, a jacket you want, or a
                jacket that needs fixing. Elise answers on Mondays and Tuesdays,
                Sam the rest of the week.
              </p>
              <dl className="mt-10">
                {ROWS.map((r) => (
                  <div key={r.k} className={`${s.rule} grid grid-cols-[6rem_1fr] gap-4 py-4`}>
                    <dt className={`${s.micro} pt-1`}>{r.k}</dt>
                    <dd className="text-[15px] leading-relaxed">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal className="lg:col-span-6">
              <ContactForm />
            </Reveal>
          </div>
        </section>
        <Footer />
      </main>
      <CartDrawer />
    </TintProvider>
  );
}
