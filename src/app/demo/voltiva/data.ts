import {
  Zap,
  ShieldCheck,
  PlugZap,
  Gauge,
  Flame,
  CarFront,
  House,
  Wrench,
  BadgeCheck,
  Clock,
  Receipt,
  MapPin,
} from "lucide-react";

/*
  The reference template is lorem ipsum from top to bottom. Every string below is
  written for Voltiva — a concept brand, so the contact details are deliberate
  placeholders in the same style as the Fernhollow and Mindful demos.
*/

export const CONTACT = {
  phone: "01752 000 000",
  phoneHref: "tel:+441752000000",
  email: "hello@voltiva.example",
  address: "Unit 7, Longbridge Industrial Estate, Plymouth PL6",
  hours: "Mon–Fri 07:30–18:00 · 24/7 emergency call-out",
};

export const SERVICES = [
  {
    icon: Flame,
    title: "Emergency Repairs",
    blurb: "Power loss, tripping circuits and burning smells — answered 24/7.",
  },
  {
    icon: Gauge,
    title: "Consumer Units",
    blurb: "18th Edition boards with RCBO protection on every circuit.",
    featured: true,
  },
  {
    icon: PlugZap,
    title: "Installation & Rewiring",
    blurb: "Full and partial rewires, planned around you living in the house.",
  },
  {
    icon: Zap,
    title: "Commercial Panels",
    blurb: "Three-phase distribution, maintenance and thermal imaging.",
  },
  {
    icon: ShieldCheck,
    title: "Testing & EICR",
    blurb: "Landlord certificates and periodic inspection, reported plainly.",
  },
  {
    icon: CarFront,
    title: "EV Charge Points",
    blurb: "OZEV-approved units, load-balanced to your existing supply.",
  },
  {
    icon: House,
    title: "Smart Home & Lighting",
    blurb: "Scene lighting, blinds and heating on one controller.",
  },
  {
    icon: Wrench,
    title: "Fault Finding",
    blurb: "The intermittent ones nobody else could pin down.",
  },
];

export const REASONS = [
  {
    icon: BadgeCheck,
    title: "NICEIC approved, every job certified",
    text: "Each install leaves with its certificate and a schedule of what was tested, not just an invoice.",
  },
  {
    icon: Receipt,
    title: "Fixed prices, quoted before we start",
    text: "You approve a number, not an estimate. Where a job runs short, the price comes down.",
  },
  {
    icon: Clock,
    title: "Out-of-hours calls answered by an engineer",
    text: "A real engineer on the phone out of hours — not a call centre — and in the city we aim to have a van moving inside two hours.",
  },
  {
    icon: MapPin,
    title: "One team, not a franchise",
    text: "The engineer who quotes your job is the engineer who does it, and you get their number.",
  },
];

export const STATS = [
  { value: "2,400+", label: "Jobs completed" },
  { value: "18", label: "Years trading" },
  { value: "612", label: "EICRs issued" },
  { value: "2 hrs", label: "Emergency response target" },
];

/*
  A concept brand cannot have real reviews, and inventing a platform rating would
  be worse than having none. These are written as what a customer would say,
  attributed the way a trade site attributes them — first name and area — and the
  section states plainly that they illustrate the concept.
*/
export const TESTIMONIALS = [
  {
    quote:
      "Came out at half nine at night because the whole downstairs had gone. Found it in twenty minutes — a nail through a cable from when we had the floors done.",
    name: "Hannah",
    place: "Peverell",
    job: "Emergency call-out",
  },
  {
    quote:
      "Quoted for a full rewire, stuck to it, and worked round us being in the house with a toddler. The certificate came through the same afternoon they finished.",
    name: "Dev",
    place: "Plympton",
    job: "Full rewire",
  },
  {
    quote:
      "We manage six units and Voltiva does all the periodic inspections. First contractor who explains the codes instead of just handing over a form.",
    name: "Louise",
    place: "Estover",
    job: "Commercial EICR",
  },
];

export const TEAM = [
  {
    name: "Marcus Ellery",
    role: "Founder & Qualifying Supervisor",
    image: "/demo/voltiva/team-1.webp",
  },
  {
    name: "Priya Raut",
    role: "Commercial Projects Lead",
    image: "/demo/voltiva/team-2.webp",
    featured: true,
  },
  {
    name: "Tom Whitcombe",
    role: "Domestic & EV Engineer",
    image: "/demo/voltiva/team-3.webp",
  },
];

export const POSTS = [
  {
    title: "What an EICR actually checks — and what a bad one misses",
    meta: "Marcus Ellery · 14 August 2026 · 6 min read",
    excerpt:
      "A periodic inspection is not a walk round with a torch. Here is the schedule we work through, what each code means, and the three shortcuts that make a certificate worthless.",
    image: "/demo/voltiva/blog-board.webp",
    alt: "A newly installed consumer unit with neatly dressed cabling",
  },
  {
    title: "Home EV charging: what your supply can take before it needs upgrading",
    meta: "Priya Raut · 2 August 2026 · 8 min read",
    excerpt:
      "Most homes do not need a supply upgrade to charge at 7kW — they need load balancing. What we measure on the survey, and when the answer really is a bigger fuse.",
    image: "/demo/voltiva/blog-ev.webp",
    alt: "An electrician installing a wall-mounted EV charger at dusk",
  },
];
