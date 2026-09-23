export type Region = "Devon" | "Cornwall";

export interface Trade {
  slug: string;
  displayName: string;
  pluralName: string;
  tagline: string;
  painPoints: string[];
  outcomes: string[];
  introTemplate: string;
  faq: FAQ[];
}

export interface Town {
  slug: string;
  displayName: string;
  county: string;
  nearbyTowns: string[];
  populationDescriptor: string;
  region: Region;
}

/** The free thing a service page offers in exchange for the form. */
export interface ServiceOffer {
  /** Leads the email subject, e.g. "Free rankings check". */
  name: string;
  /** Submit button text. */
  cta: string;
  /** Shown once the form has sent: what happens next, and when. */
  next: string;
  /** Heading and lede above the form. */
  heading: string;
  lede: string;
}

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  /** Paragraphs, as many as the subject needs. */
  body: string[];
  /** Optional short list under its own heading. Deliberately not the same
      length on every page — some pages have none. */
  included?: { heading: string; items: string[] };
  /** Which plan it sits in, and the price, in one line. */
  price: string;
  /** Longer plan note under the body on the service page. */
  planNote: string;
  offer: ServiceOffer;
  icon: string;
}

export interface PricingTier {
  slug: string;
  name: string;
  setupFee: number;
  monthlyFee: number;
  features: string[];
  highlighted: boolean;
  cta: string;
  tagline: string;
  /** Build costs nothing; monthlyFee is hosting only. */
  freeBuild?: boolean;
  badge?: string;
  note?: string;
}

export interface CaseStudy {
  slug: string;
  clientName: string;
  trade: string;
  town: string;
  problem: string;
  solution: string;
  stats: { label: string; value: string }[];
  image: string;
}

export interface Testimonial {
  name: string;
  business: string;
  trade: string;
  town: string;
  quote: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  image?: string;
  readingTime: number;
}
