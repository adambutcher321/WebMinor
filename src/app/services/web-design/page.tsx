import type { Metadata } from "next";
import { services } from "@/data/services";
import ServicePage from "@/components/services/ServicePage";

const service = services.find((s) => s.slug === "web-design-for-trades")!;

export const metadata: Metadata = {
  // Written for the search result, not copied from the on-page subheading.
  title: "Website design for local businesses",
  description:
    "Websites for local businesses and trades, designed and built in Saltash. The three-page design is free and hosting is £50 a month + VAT.",
};

export default function WebDesignPage() {
  return (
    <ServicePage
      service={service}
      route="web-design"
      crumb="Web design"
      hero="/world/svc-web-design-hero.webp"
    />
  );
}
