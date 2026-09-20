"use client";

import type { CSSProperties, PointerEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { pricingTiers } from "@/data/pricing";
import styles from "./pricing.module.css";

const MAX_TILT = 3.5;

function trackPointer(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse") return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty("--mx", `${x}px`);
  card.style.setProperty("--my", `${y}px`);
  card.style.setProperty("--ry", `${(x / rect.width - 0.5) * 2 * MAX_TILT}deg`);
  card.style.setProperty("--rx", `${(0.5 - y / rect.height) * 2 * MAX_TILT}deg`);
}

function releasePointer(e: PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

export default function PricingCards() {
  return (
    <section className={styles.stage}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grid}>
        {pricingTiers.map((tier, i) => (
          <div
            key={tier.slug}
            className={styles.enter}
            style={{ "--i": i } as CSSProperties}
          >
            <div
              className={`${styles.card} ${tier.highlighted ? styles.featured : ""}`}
              onPointerMove={trackPointer}
              onPointerLeave={releasePointer}
            >
              <div className={styles.head}>
                <div className={styles.nameRow}>
                  <h2 className={styles.name}>{tier.name}</h2>
                  {tier.badge && <span className={styles.badge}>{tier.badge}</span>}
                </div>

                <div className={styles.price}>
                  <span className={styles.amount}>
                    {tier.freeBuild ? "Free" : `£${tier.monthlyFee}`}
                  </span>
                  <span className={styles.unit}>
                    {tier.freeBuild ? "setup" : "/mo"}
                  </span>
                </div>

                <p className={styles.terms}>
                  {tier.freeBuild
                    ? `then £${tier.monthlyFee}/mo hosting`
                    : tier.setupFee > 0
                      ? `£${tier.setupFee} setup fee`
                      : "No setup fee"}
                </p>

                <p className={styles.tagline}>{tier.tagline}</p>

                <Link href="/free-website-review" className={styles.cta}>
                  {tier.cta}
                  <ArrowRight className={styles.ctaArrow} />
                </Link>
              </div>

              <div className={styles.body}>
                <p className={styles.listLabel}>
                  {tier.freeBuild ? "Exactly what you get" : "What's included"}
                </p>
                <ul className={styles.list}>
                  {tier.features.map((feature, n) => (
                    <li
                      key={feature}
                      className={styles.item}
                      style={{ "--n": n } as CSSProperties}
                    >
                      <span className={styles.tick}>
                        <Check strokeWidth={2.5} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.note && <p className={styles.note}>{tier.note}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
