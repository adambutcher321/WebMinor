import Link from "next/link";
import { Wordmark } from "./Logo";
import { BASE, NAV } from "./shop";
import s from "./boucher.module.css";

export default function Footer() {
  return (
    <footer className={`${s.deep} px-6 lg:px-14 pt-16 pb-8`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Wordmark />
          <p className={`${s.body} mt-5 max-w-sm`}>
            One jacket, cut short and filled deep, made in Porto and sold in five
            colours that do not ask permission.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className={s.micro}>Shop</p>
          <ul className="mt-4 space-y-2.5">
            {[...NAV, { label: "Size guide", href: `${BASE}/size-guide` }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className={s.micro}>Studio</p>
          <p className="mt-4 text-sm opacity-70 leading-relaxed">
            14 Rua das Flores, Porto
            <br />
            Open Thursday to Saturday, 11 until 7
          </p>
          <Link href={`${BASE}/contact`} className={`${s.btn} ${s.btnPanel} mt-5`}>
            Say hello
          </Link>
        </div>
      </div>
      <div className={`${s.rule} mt-14 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2`}>
        <p className="text-xs opacity-50">
          Boucher Tailored is a concept brand created by{" "}
          <Link href="/case-studies" className="underline underline-offset-4 opacity-100">
            WebMinor
          </Link>{" "}
          to demonstrate design and build work. The jacket, the studio and the reviews are invented.
        </p>
        <p className="text-xs opacity-50">&copy; {new Date().getFullYear()} WebMinor</p>
      </div>
    </footer>
  );
}
