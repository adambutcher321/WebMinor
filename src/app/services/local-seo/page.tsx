import type { Metadata } from "next";
import { services } from "@/data/services";
import ServicePage from "@/components/services/ServicePage";

const service = services.find((s) => s.slug === "local-seo")!;

export const metadata: Metadata = {
  // Written for the search result, not copied from the on-page subheading.
  title: "Local SEO in Cornwall and Devon",
  description:
    "Show up when someone nearby searches for what you do. On-page fixes, Google Business Profile work and a monthly report in plain English.",
};

export default function LocalSeoPage() {
  return (
    <ServicePage
      service={service}
      route="local-seo"
      crumb="Local SEO"
      hero="/world/svc-local-seo-hero.webp"
    />
  );
}
