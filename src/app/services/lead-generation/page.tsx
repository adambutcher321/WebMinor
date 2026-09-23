import type { Metadata } from "next";
import { services } from "@/data/services";
import ServicePage from "@/components/services/ServicePage";

const service = services.find((s) => s.slug === "lead-generation-ppc")!;

export const metadata: Metadata = {
  // Written for the search result, not copied from the on-page subheading.
  title: "Google Ads for local businesses",
  description:
    "Google Ads that only reach people in the towns you cover, searching for work you do. You agree the budget before anything is spent.",
};

export default function LeadGenerationPage() {
  return (
    <ServicePage
      service={service}
      route="lead-generation"
      crumb="Google Ads"
      hero="/world/svc-lead-generation-hero.webp"
    />
  );
}
