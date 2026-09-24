import type { Town } from "@/types";

// The towns WebMinor can honestly claim to serve from Saltash. The list was
// twelve cities as far off as Swindon; removed slugs are redirected in
// next.config.ts, so add one back there too if it ever returns.
export const towns: Town[] = [
  {
    slug: "saltash",
    displayName: "Saltash",
    county: "Cornwall",
    nearbyTowns: ["plymouth", "torpoint", "callington"],
    populationDescriptor: "the first town in Cornwall, on the west bank of the Tamar",
    region: "Cornwall",
  },
  {
    slug: "plymouth",
    displayName: "Plymouth",
    county: "Devon",
    nearbyTowns: ["saltash", "torpoint", "tavistock"],
    populationDescriptor: "the largest city on the south Devon coast",
    region: "Devon",
  },
  {
    slug: "torpoint",
    displayName: "Torpoint",
    county: "Cornwall",
    nearbyTowns: ["saltash", "plymouth", "liskeard"],
    populationDescriptor: "a town on the Cornwall bank of the Tamar, a ferry ride from Plymouth",
    region: "Cornwall",
  },
  {
    slug: "callington",
    displayName: "Callington",
    county: "Cornwall",
    nearbyTowns: ["saltash", "liskeard", "tavistock"],
    populationDescriptor: "a market town beneath Kit Hill in the Tamar Valley",
    region: "Cornwall",
  },
  {
    slug: "liskeard",
    displayName: "Liskeard",
    county: "Cornwall",
    nearbyTowns: ["looe", "saltash", "callington"],
    populationDescriptor: "an old market town in south-east Cornwall",
    region: "Cornwall",
  },
  {
    slug: "tavistock",
    displayName: "Tavistock",
    county: "Devon",
    nearbyTowns: ["callington", "plymouth", "saltash"],
    populationDescriptor: "a market town on the western edge of Dartmoor",
    region: "Devon",
  },
  {
    slug: "truro",
    displayName: "Truro",
    county: "Cornwall",
    nearbyTowns: ["newquay", "wadebridge", "liskeard"],
    populationDescriptor: "Cornwall's only city and commercial hub",
    region: "Cornwall",
  },
  {
    slug: "looe",
    displayName: "Looe",
    county: "Cornwall",
    nearbyTowns: ["liskeard", "torpoint", "saltash"],
    populationDescriptor: "a harbour town on the south-east Cornwall coast",
    region: "Cornwall",
  },
  {
    slug: "newquay",
    displayName: "Newquay",
    county: "Cornwall",
    nearbyTowns: ["wadebridge", "truro"],
    populationDescriptor: "a surf and holiday town on Cornwall's north coast",
    region: "Cornwall",
  },
  {
    slug: "wadebridge",
    displayName: "Wadebridge",
    county: "Cornwall",
    nearbyTowns: ["newquay", "truro", "liskeard"],
    populationDescriptor: "a market town on the Camel estuary in north Cornwall",
    region: "Cornwall",
  },
];

/** "Tavistock, Devon" — or just "Bristol" where the city is its own county. */
export function townPlace(town: Town): string {
  return town.county && town.county !== town.displayName
    ? `${town.displayName}, ${town.county}`
    : town.displayName;
}

/**
 * "a thriving cathedral city in Devon". The county is left off when the
 * descriptor already names it ("at the heart of Somerset") or the city is
 * its own county, so the sentence never says the same place twice.
 */
export function townDescriptor(town: Town): string {
  const namesCounty =
    town.county === town.displayName ||
    town.populationDescriptor.includes(town.county);
  return namesCounty
    ? town.populationDescriptor
    : `${town.populationDescriptor} in ${town.county}`;
}
