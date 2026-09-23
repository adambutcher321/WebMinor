import type { Metadata } from "next";
import { services } from "@/data/services";
import ServicePage from "@/components/services/ServicePage";

const service = services.find((s) => s.slug === "google-business-profile")!;

export const metadata: Metadata = {
  // Written for the search result, not copied from the on-page subheading.
  title: "Google Business Profile set-up",
  description:
    "Your Google listing set up properly: the right categories, services, areas and photos, so you appear in Maps when local customers search.",
};

export default function GoogleBusinessProfilePage() {
  return (
    <ServicePage
      service={service}
      route="google-business-profile"
      crumb="Google Business Profile"
      hero="/world/svc-google-business-profile-hero.webp"
    />
  );
}
