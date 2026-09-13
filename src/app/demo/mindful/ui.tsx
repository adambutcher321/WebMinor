import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import s from "./mindful.module.css";

/* Small shared pieces. Anything that needs the browser lives in motion.tsx. */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`${s.eyebrow} ${className}`}>{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  className = "",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  const centre = align === "center";
  return (
    <div className={`${centre ? "text-center mx-auto" : ""} max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={`${s.h2} mt-4`}>{title}</h2>
      {lede && <p className={`${s.body} mt-5 max-w-xl ${centre ? "mx-auto" : ""}`}>{lede}</p>}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "ink" | "light" | "ghost" | "onInk" | "ghostOnInk";
  className?: string;
  arrow?: boolean;
};

export function Button({ href, children, variant = "ink", className = "", arrow = false }: ButtonProps) {
  const v = {
    ink: s.btnInk,
    light: s.btnLight,
    ghost: s.btnGhost,
    onInk: s.btnOnInk,
    ghostOnInk: s.btnGhostOnInk,
  }[variant];
  return (
    <Link href={href} className={`${s.btn} ${v} ${className}`}>
      {children}
      {(arrow || variant === "ghost" || variant === "ghostOnInk") && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
    </Link>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-b" style={{ borderColor: "var(--line)" }}>
      {items.map((f) => (
        <details key={f.q} className={s.faq}>
          <summary>{f.q}</summary>
          <p className={`${s.body} ${s.answer}`}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Quote({
  quote,
  name,
  detail,
  className = "",
}: {
  quote: string;
  name: string;
  detail: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <blockquote className={`${s.lede}`}>&ldquo;{quote}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-block w-8 h-px"
          style={{ background: "var(--sage)" }}
        />
        <span className={s.small}>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{name}</span>
          {" · "}
          {detail}
        </span>
      </figcaption>
    </figure>
  );
}
