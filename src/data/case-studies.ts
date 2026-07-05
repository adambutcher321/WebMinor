import type { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "plumber-plymouth-website-redesign",
    clientName: "[EDIT: Client business name]",
    trade: "plumbers",
    town: "plymouth",
    problem:
      "[EDIT: Describe the client's situation before working with WebMinor — e.g. outdated website, no Google presence, relying entirely on word-of-mouth, phone had gone quiet, etc.]",
    solution:
      "[EDIT: Describe what WebMinor did — e.g. built a new 5-page website, set up Google Business Profile, ran local SEO campaign targeting Plymouth and surrounding areas, created service-specific landing pages, etc.]",
    stats: [
      { label: "Increase in monthly enquiries", value: "[EDIT: e.g. 340%]" },
      { label: "Google ranking for 'plumber Plymouth'", value: "[EDIT: e.g. Page 1, Position 3]" },
      { label: "Monthly website visitors", value: "[EDIT: e.g. 850+]" },
    ],
    image: "/images/case-studies/[EDIT: plumber-plymouth.jpg]",
  },
  {
    slug: "electrician-bristol-local-seo",
    clientName: "[EDIT: Client business name]",
    trade: "electricians",
    town: "bristol",
    problem:
      "[EDIT: Describe the client's situation — e.g. had a basic website but wasn't ranking on Google, getting undercut by unqualified electricians, no reviews online, accreditations not visible, etc.]",
    solution:
      "[EDIT: Describe what WebMinor did — e.g. rebuilt website with service-specific pages for EICR, rewiring, fuseboards, ran local SEO targeting Bristol and surrounding areas, set up review generation system, etc.]",
    stats: [
      { label: "Google reviews collected", value: "[EDIT: e.g. 47 five-star reviews]" },
      { label: "Organic traffic growth", value: "[EDIT: e.g. 280%]" },
      { label: "Average monthly leads", value: "[EDIT: e.g. 25-30]" },
    ],
    image: "/images/case-studies/[EDIT: electrician-bristol.jpg]",
  },
  {
    slug: "builder-exeter-lead-generation",
    clientName: "[EDIT: Client business name]",
    trade: "builders",
    town: "exeter",
    problem:
      "[EDIT: Describe the client's situation — e.g. spending heavily on Checkatrade with poor return, website didn't reflect the quality of their extension and renovation work, competing with bigger firms, etc.]",
    solution:
      "[EDIT: Describe what WebMinor did — e.g. built a portfolio-focused website with dedicated pages for extensions, loft conversions, and renovations, ran Google Ads targeting Exeter and East Devon, set up proper project galleries with before/after photos, etc.]",
    stats: [
      { label: "Cost per lead reduction", value: "[EDIT: e.g. 65% lower than Checkatrade]" },
      { label: "Average project value from website leads", value: "[EDIT: e.g. £18,500]" },
      { label: "Website conversion rate", value: "[EDIT: e.g. 8.2%]" },
    ],
    image: "/images/case-studies/[EDIT: builder-exeter.jpg]",
  },
];
