import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BURGERS, bySlug } from "../../engine/burgers";
import Detail from "./Detail";

export function generateStaticParams() {
  return BURGERS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = bySlug((await params).slug);
  return { title: { absolute: `${b?.name ?? "Burger"} — Burger Me | WebMinor Concept` }, robots: { index: false, follow: false } };
}

export default async function BurgerPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = bySlug((await params).slug);
  if (!b) notFound();
  return <Detail initial={b.slug} />;
}
