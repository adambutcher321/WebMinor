import { describe, expect, it } from "vitest";
import type { CaseStudy } from "@/types";
import { caseStudies, isPublished, publishedCaseStudies } from "./case-studies";
import sitemap from "@/app/sitemap";

const filled: CaseStudy = {
  slug: "real-client",
  clientName: "Real Client Ltd",
  trade: "plumbers",
  town: "plymouth",
  problem: "The phone had gone quiet.",
  solution: "A new site and a Google Business Profile.",
  stats: [{ label: "Enquiries", value: "+120%" }],
  image: "/images/case-studies/real-client.jpg",
};

describe("case study publish gate", () => {
  it("publishes a row once its client name, problem and one stat are real", () => {
    expect(isPublished(filled)).toBe(true);
  });

  it("holds back a row while any of those is still an [EDIT] prompt", () => {
    expect(isPublished({ ...filled, clientName: "[EDIT: Client business name]" })).toBe(false);
    expect(isPublished({ ...filled, problem: "[edit: describe]" })).toBe(false);
    expect(
      isPublished({ ...filled, stats: [{ label: "Enquiries", value: "[EDIT: e.g. 340%]" }] })
    ).toBe(false);
  });

  it("keeps the shipped template rows unpublished", () => {
    expect(caseStudies.length).toBeGreaterThan(0);
    expect(publishedCaseStudies).toEqual([]);
  });
});

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("only advertises case study URLs that the detail route will serve", () => {
    const advertised = urls.filter((u) => /\/case-studies\/.+/.test(u));
    const servable = publishedCaseStudies.map(
      (cs) => `https://www.webminor.co.uk/case-studies/${cs.slug}`
    );
    expect(advertised.sort()).toEqual(servable.sort());
  });

  it("never leaks an unfilled template slug", () => {
    for (const cs of caseStudies.filter((c) => !isPublished(c))) {
      expect(urls).not.toContain(`https://www.webminor.co.uk/case-studies/${cs.slug}`);
    }
  });
});
