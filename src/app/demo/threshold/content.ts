import { WEEK, type ProgrammeId } from "./timetable";

/*
  Every word on the site, and the numbers behind the membership slider. Image
  paths point at public/demo/threshold; the files are made in the imagery
  tasks and the names here are final.
*/

const IMG = "/demo/threshold";

export interface Programme {
  id: ProgrammeId;
  name: string;
  line: string;
  days: string;
  image: string;
  alt: string;
}

export const PROGRAMMES: Programme[] = [
  {
    id: "strength",
    name: "Strength",
    line: "Barbell work in small groups. Squat, press, pull, hinge, coached rep by rep.",
    days: "Mon to Sat",
    image: `${IMG}/prog-strength-squat.webp`,
    alt: "An athlete under a loaded barbell in magenta and cyan light",
  },
  {
    id: "conditioning",
    name: "Conditioning",
    line: "Forty minutes on rowers, sleds and bikes. Hard, measured, over before you settle.",
    days: "Mon to Sat",
    image: `${IMG}/prog-conditioning.webp`,
    alt: "An athlete driving a sled across a dark floor in cold light",
  },
  {
    id: "mobility",
    name: "Mobility",
    line: "Slow work on the floor for hips, shoulders and spine. The session people skip and then miss.",
    days: "Mon to Sun",
    image: `${IMG}/prog-mobility.webp`,
    alt: "An athlete in a deep lunge on a dark floor, lit magenta and cyan",
  },
  {
    id: "open",
    name: "Open Floor",
    line: "The rig, the platforms and a coach in the room. Your programme, our eyes.",
    days: "Tue to Sun",
    image: `${IMG}/prog-open.webp`,
    alt: "An athlete chalking up at the rig in a dark industrial unit",
  },
];

export function programmeById(id: ProgrammeId): Programme {
  const p = PROGRAMMES.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown programme ${id}`);
  return p;
}

export interface Coach {
  slug: string;
  name: string;
  discipline: string;
  line: string;
  bio: string;
  portrait: string;
  action: string;
}

export const COACHES: Coach[] = [
  {
    slug: "ines",
    name: "Inês Carvalho",
    discipline: "Strength",
    line: "Former national-level weightlifter. Runs the barbell floor.",
    bio: "Inês lifted for Portugal for nine years before she coached anyone. She teaches the squat the way she was taught it: slowly, from the feet up, with the bar going nowhere until the position is right. Her Monday 06:30 has had a waiting list since the unit opened.",
    portrait: `${IMG}/coach-ines.webp`,
    action: `${IMG}/coach-ines-action.webp`,
  },
  {
    slug: "kofi",
    name: "Kofi Mensah",
    discipline: "Conditioning",
    line: "Rowed at Henley. Writes every conditioning piece on the board.",
    bio: "Kofi spent a decade in a boat and brought the ergometer with him. His sessions are timed to the second, scored on the board and over in forty minutes. He is the reason the rowers here are the most used machines in the building.",
    portrait: `${IMG}/coach-kofi.webp`,
    action: `${IMG}/coach-kofi-action.webp`,
  },
  {
    slug: "sana",
    name: "Sana Iqbal",
    discipline: "Mobility",
    line: "Physiotherapist. Keeps the other three programmes honest.",
    bio: "Sana came to Threshold as the physio the coaches sent people to, and stayed to stop them needing to. Her mobility floor is where the strength members fix what the barbell finds. She still sees members one to one on Thursdays.",
    portrait: `${IMG}/coach-sana.webp`,
    action: `${IMG}/coach-sana-action.webp`,
  },
  {
    slug: "marek",
    name: "Marek Nowak",
    discipline: "Open Floor",
    line: "Founder. Built the rig himself. Coaches the open sessions.",
    bio: "Marek took the lease on the unit in 2016 with a rack, a platform and a plan for four. He welded the rig, wrote the first programme and still coaches the open floor, where members train their own plan with a coach in the room. Ask him about the threshold bar at the door.",
    portrait: `${IMG}/coach-marek.webp`,
    action: `${IMG}/coach-marek-action.webp`,
  },
];

export function coachBySlug(slug: string): Coach {
  const c = COACHES.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown coach ${slug}`);
  return c;
}

export const LEVELS = [
  { sessions: 2, label: "Two a week", monthly: 89 },
  { sessions: 3, label: "Three a week", monthly: 119 },
  { sessions: 4, label: "Four a week", monthly: 145 },
  { sessions: 5, label: "Five a week", monthly: 165 },
  { sessions: "unlimited", label: "Unlimited", monthly: 189 },
] as const;

export type Billing = "monthly" | "annual";

/** Annual is ten months for the price of twelve. */
export function priceFor(levelIndex: number, billing: Billing): { perMonth: number; perYear: number; saving: number } {
  const monthly = LEVELS[levelIndex].monthly;
  if (billing === "monthly") return { perMonth: monthly, perYear: monthly * 12, saving: 0 };
  const perYear = monthly * 10;
  return { perMonth: Math.round(perYear / 12), perYear, saving: monthly * 2 };
}

export const FIGURES = {
  years: 10,
  coaches: COACHES.length,
  sessionsAWeek: WEEK.length,
};

export const COPY = {
  heroLine: "A strength and conditioning studio in a unit off Sutton Road. Coached sessions, small groups, no floor of machines.",
  manifesto: [
    "Threshold is the line you cross when the work gets hard and you keep going.",
    "We built a studio around that moment: a coach in every session, twelve to a barbell class, and a timetable you can actually get into.",
    "Ten years on, most people who start here are still here.",
  ],
  spaceLine: "A 1960s print works with the roof lights kept and the floor levelled. Three platforms, a twelve-station rig, eight rowers, and a bar across the door you step over on the way in.",
  address: ["Unit 4, Sutton Road", "Plymouth PL4 0HX"],
  hours: ["Mon to Fri 06:00 to 21:00", "Sat 07:30 to 13:00", "Sun 08:30 to 12:00"],
};

export const SPACE = [
  { src: `${IMG}/space-floor.webp`, alt: "The training floor under the roof lights, platforms in a row" },
  { src: `${IMG}/space-rig.webp`, alt: "The welded rig lit magenta from one side and cyan from the other" },
  { src: `${IMG}/space-door.webp`, alt: "The entrance, a steel bar set across the threshold" },
];
