import type { Town } from "@/types";

export const towns: Town[] = [
  {
    slug: "exeter",
    displayName: "Exeter",
    county: "Devon",
    nearbyTowns: ["torquay", "taunton", "plymouth"],
    populationDescriptor: "a thriving cathedral city",
    region: "Devon",
  },
  {
    slug: "plymouth",
    displayName: "Plymouth",
    county: "Devon",
    nearbyTowns: ["exeter", "torquay", "truro"],
    populationDescriptor: "the largest city on the south Devon coast",
    region: "Devon",
  },
  {
    slug: "bristol",
    displayName: "Bristol",
    county: "Bristol",
    nearbyTowns: ["bath", "gloucester", "cheltenham"],
    populationDescriptor: "the South West's largest and most dynamic city",
    region: "Avon",
  },
  {
    slug: "bath",
    displayName: "Bath",
    county: "Somerset",
    nearbyTowns: ["bristol", "swindon", "taunton"],
    populationDescriptor: "a historic World Heritage city",
    region: "Avon",
  },
  {
    slug: "taunton",
    displayName: "Taunton",
    county: "Somerset",
    nearbyTowns: ["exeter", "bath", "bristol"],
    populationDescriptor: "a busy county town at the heart of Somerset",
    region: "Somerset",
  },
  {
    slug: "truro",
    displayName: "Truro",
    county: "Cornwall",
    nearbyTowns: ["plymouth", "exeter"],
    populationDescriptor: "Cornwall's only city and commercial hub",
    region: "Cornwall",
  },
  {
    slug: "torquay",
    displayName: "Torquay",
    county: "Devon",
    nearbyTowns: ["exeter", "plymouth"],
    populationDescriptor: "a popular coastal resort town on the English Riviera",
    region: "Devon",
  },
  {
    slug: "bournemouth",
    displayName: "Bournemouth",
    county: "Dorset",
    nearbyTowns: ["poole", "bath", "swindon"],
    populationDescriptor: "a thriving coastal city with a fast-growing population",
    region: "Dorset",
  },
  {
    slug: "poole",
    displayName: "Poole",
    county: "Dorset",
    nearbyTowns: ["bournemouth", "bath"],
    populationDescriptor: "a busy harbour town with a booming property market",
    region: "Dorset",
  },
  {
    slug: "gloucester",
    displayName: "Gloucester",
    county: "Gloucestershire",
    nearbyTowns: ["cheltenham", "bristol", "swindon"],
    populationDescriptor: "a cathedral city with a mix of heritage and new development",
    region: "Gloucestershire",
  },
  {
    slug: "swindon",
    displayName: "Swindon",
    county: "Wiltshire",
    nearbyTowns: ["bath", "gloucester", "cheltenham"],
    populationDescriptor: "one of the South West's fastest-growing towns",
    region: "Wiltshire",
  },
  {
    slug: "cheltenham",
    displayName: "Cheltenham",
    county: "Gloucestershire",
    nearbyTowns: ["gloucester", "swindon", "bristol"],
    populationDescriptor: "an affluent Regency spa town",
    region: "Gloucestershire",
  },
];

/** "Exeter, Devon" — or just "Bristol" where the city is its own county. */
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
