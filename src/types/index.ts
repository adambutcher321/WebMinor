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

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
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
