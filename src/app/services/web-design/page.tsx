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
      offers={{
        "@type": "Offer",
        name: "Free website design",
        description:
          "A home page, a contact page and an about page, designed and built free. Hosting is £50 a month plus VAT.",
        url: "https://www.webminor.co.uk/pricing",
        priceSpecification: [
          { "@type": "PriceSpecification", name: "Design and build", price: 0, priceCurrency: "GBP" },
          {
            "@type": "UnitPriceSpecification",
            name: "Hosting",
            price: 50,
            priceCurrency: "GBP",
            unitText: "month",
            valueAddedTaxIncluded: false,
          },
        ],
      }}
    />
  );
}
