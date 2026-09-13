/*
  Everything Mindful says lives here. The pages are layout; this is the site.

  Mindful is a concept brand. Jessica, her clients, the dates and the prices
  are invented for the demo, and the copy is written to read as one person
  talking rather than a template: no "unlock your potential", no stacked
  benefits, no reassurance for its own sake.
*/

export const BASE = "/demo/mindful";
export const IMG = "/demo/mindful";

export type Way = {
  slug: string;
  name: string;
  eyebrow: string;
  price: string;
  unit: string;
  image: string;
  alt: string;
  promise: string;
  detail: string;
  includes: string[];
  bookAs: string;
};

/* Work with me — four ways, each framed by what it is for rather than what it contains. */
export const WAYS: Way[] = [
  {
    slug: "private",
    name: "Private sessions",
    eyebrow: "One to one",
    price: "£55",
    unit: "an hour",
    image: `${IMG}/private-session.webp`,
    alt: "Jessica kneeling beside a client resting in a supported child's pose in a sunlit living room",
    promise: "For the body you actually have, on the week you are actually having.",
    detail:
      "We start with twenty minutes of talking. Where it hurts, what you sit on all day, what you have tried. Then we move, and I build the hour around what I see rather than what a class plan says. You leave with three things to do before we meet again, written down, none of them longer than ten minutes.",
    includes: [
      "At your home, my studio, or on a video call",
      "A short practice to keep between sessions",
      "Move or cancel up to a day before, no charge",
    ],
    bookAs: "Private session",
  },
  {
    slug: "group",
    name: "Small group flow",
    eyebrow: "Six people, no more",
    price: "£18",
    unit: "a class",
    image: `${IMG}/studio-group.webp`,
    alt: "Jessica adjusting a small group of students in seated twists in a bright studio",
    promise: "A class small enough that I can see everyone, taught at a pace that lets you breathe.",
    detail:
      "Tuesday and Thursday evenings, Saturday mornings. Six mats, one room, a flow that changes every week and never rushes. I walk the room the whole hour, so an adjustment is a hand on your shoulder rather than a shout from the front.",
    includes: [
      "Mats, blocks and blankets are here",
      "Every level in the same room, on purpose",
      "Book a single class or a block of six",
    ],
    bookAs: "Group flow class",
  },
  {
    slug: "workplace",
    name: "Workplace sessions",
    eyebrow: "For teams",
    price: "from £180",
    unit: "a session",
    image: `${IMG}/workplace.webp`,
    alt: "Jessica leading a seated stretch for a team in a bright open-plan office",
    promise: "Forty-five minutes in the middle of the day that your team will actually turn up for.",
    detail:
      "No mats, no changing, no one has to be flexible. I come to the office and we work from chairs and standing, on the neck, shoulders, hips and breath that a desk quietly ruins. Teams keep it because it is short and because it works.",
    includes: [
      "Up to twenty people per session",
      "Weekly, fortnightly or as a one-off",
      "A five-minute desk routine for everyone to keep",
    ],
    bookAs: "Workplace session",
  },
  {
    slug: "retreat",
    name: "Retreat days",
    eyebrow: "Seasonal",
    price: "£140",
    unit: "a day",
    image: `${IMG}/retreat-dusk.webp`,
    alt: "Mats in a circle in the meadow at dusk with lanterns, Jessica seated at the head",
    promise: "A whole day out in the meadow, with nowhere to be afterwards.",
    detail:
      "Three practices, a long lunch, a walk, and more quiet than most people have had in a year. Eight of us at most. The next one is in October, and they tend to fill from the last one.",
    includes: [
      "Three guided practices and a breath session",
      "Lunch, tea, and the whole afternoon",
      "Eight people at most",
    ],
    bookAs: "Retreat day",
  },
];

/* The Reset — the signature programme. Eight weeks, one person at a time. */
export const RESET = {
  name: "The Reset",
  strap: "Eight weeks. One hour a week with me, ten minutes a day on your own.",
  promise:
    "For people who have been meaning to start for years and would like to have actually started.",
  price: "£480",
  priceNote: "or two payments of £250",
  starts: "Next intake begins Monday 5 October 2026",
  places: "Four places each intake",
  image: `${IMG}/reset-hero.webp`,
  alt: "Jessica sitting on a wooden step at sunrise with a journal and a cup of tea",
  problem: [
    "You are stiff in the mornings and tired by three. You have a yoga app you opened twice. You know what you should do and you have known for a while.",
    "The problem was never information. It was that nobody built the habit around your actual week, and then stayed to see whether it held.",
  ],
  forWho: [
    "You sit for most of the day and your body has started to say so.",
    "You have tried classes, apps or a January resolution and none of it stuck.",
    "You would rather do ten honest minutes a day than an hour you keep skipping.",
    "You want someone to notice when you stop.",
  ],
  notFor: [
    "You want to be pushed hard. I will not do that.",
    "You are looking for a fitness plan. This is a practice, not a programme of workouts.",
  ],
  weeks: [
    { n: 1, title: "Where you are", text: "An hour of talking and moving. I watch how you stand, sit and breathe, and we agree on the one thing that matters most." },
    { n: 2, title: "The ten minutes", text: "Your daily practice, built and filmed on your phone so it is yours. It fits before the kettle boils." },
    { n: 3, title: "Hips and the chair", text: "The desk undone. Three shapes that give you your hips back, and where in the day they go." },
    { n: 4, title: "Breath", text: "The week most people say changed the most. Slower breathing, on purpose, at the moments you need it." },
    { n: 5, title: "Shoulders and neck", text: "Where the day collects. We unload it, and you learn to notice it loading again." },
    { n: 6, title: "Sleep", text: "A ten-minute wind-down that replaces the phone in bed. Most people are asleep before it ends." },
    { n: 7, title: "Making it yours", text: "We look at what you kept and what you dropped, and rebuild the practice around the honest answer." },
    { n: 8, title: "Where you are now", text: "Same hour as week one. You will be able to see the difference. So will I." },
  ],
  includes: [
    "Eight private hours with me, in person or on a call",
    "A daily ten-minute practice, filmed for you, that changes as you do",
    "Messages between sessions when something is not working",
    "A written record of where you started and where you ended",
    "A month of group classes afterwards, if you want the company",
  ],
  outcomes: [
    "A morning practice you have kept for eight weeks without being told to",
    "Hips, shoulders and neck that no longer set the tone for the day",
    "Sleep you get into faster and stay in longer",
    "A way of breathing you can reach for when you need it",
  ],
  faq: [
    { q: "I have never done yoga. Is that a problem?", a: "It is the usual starting point. Most people who do The Reset have never held a pose in their life, and the ten-minute practice is built so that there is nothing to get wrong." },
    { q: "What if I miss a day?", a: "You will, and it does not matter. The programme is designed around a real week. What we are building is the return, not a perfect record." },
    { q: "Do I need equipment?", a: "A patch of floor and something to sit on. A mat is nice but a rug is fine. I bring blocks to the sessions if we need them." },
    { q: "Can I do it entirely online?", a: "Yes. About half of my Reset clients do. The sessions are the same length and I can see enough on a call to adjust you properly." },
    { q: "What happens after the eight weeks?", a: "You keep the practice, obviously, and a month of group classes is included if you would like to keep the company. Some people come back for a single session every few months. Nobody needs to." },
  ],
};

/* Retreats — dated, placed, with an itinerary you can picture. */
export type Retreat = {
  slug: string;
  name: string;
  when: string;
  where: string;
  price: string;
  priceNote: string;
  places: string;
  image: string;
  alt: string;
  intro: string;
  itinerary: { time: string; what: string }[];
  includes: string[];
};

export const RETREATS: Retreat[] = [
  {
    slug: "autumn-meadow-day",
    name: "Autumn Meadow Day",
    when: "Saturday 17 October 2026",
    where: "The meadow at Coombe Farm, above the Tamar",
    price: "£140",
    priceNote: "lunch and everything else included",
    places: "Three of eight places left",
    image: `${IMG}/retreat-dusk.webp`,
    alt: "Mats in a circle in the meadow at dusk, lanterns lit, the valley behind",
    intro:
      "One day, eight people, a meadow that looks over the river. We practise outside if the weather holds and in the barn if it does not, and either is good. You go home tired in the right way.",
    itinerary: [
      { time: "9.30", what: "Tea, and the walk up to the meadow" },
      { time: "10.00", what: "A slow morning practice, the long kind" },
      { time: "11.45", what: "Breath work in the barn" },
      { time: "13.00", what: "Lunch from the farm kitchen, eaten slowly" },
      { time: "14.30", what: "A walk down to the river, or a sleep in the grass" },
      { time: "16.00", what: "Restorative practice as the light goes" },
      { time: "17.15", what: "Tea, and home" },
    ],
    includes: [
      "Three practices and a breath session",
      "Lunch and tea all day",
      "Mats and blankets, so bring nothing but warm layers",
    ],
  },
  {
    slug: "winter-rest-weekend",
    name: "Winter Rest Weekend",
    when: "Friday 27 to Sunday 29 November 2026",
    where: "Hollow Lodge, on the edge of Bodmin Moor",
    price: "£520",
    priceNote: "two nights, all meals, single rooms",
    places: "Six places, two left",
    image: `${IMG}/retreat-lodge.webp`,
    alt: "A timber lodge on the moor in morning mist, warm light in the windows",
    intro:
      "Two nights at a lodge with a wood burner and no phone signal worth mentioning. Six people. We practise twice a day, eat well, walk when it is dry and sit by the fire when it is not. It is the quietest weekend most people have all year.",
    itinerary: [
      { time: "Fri", what: "Arrive from four. Supper, then a gentle practice by the fire" },
      { time: "Sat", what: "Morning practice, a long moor walk, an afternoon of restorative work and rest, supper" },
      { time: "Sun", what: "Sunrise practice, a slow breakfast, home by early afternoon" },
    ],
    includes: [
      "Two nights in your own room",
      "Every meal, cooked at the lodge",
      "Five practices, two breath sessions, and a lot of nothing",
    ],
  },
];

/* The free guide. */
export const GUIDE = {
  name: "Seven Mornings",
  strap: "A week of ten-minute mornings, one a day, sent to your inbox.",
  intro:
    "The first thing I give every new client is a morning. Not a routine, a single morning, ten minutes long, with nothing in it you can get wrong. Seven Mornings is a week of them. Day one is three minutes of breathing. By day seven you have a practice, and you will know whether you want to keep it.",
  days: [
    { n: 1, title: "Breathe", text: "Three minutes, sitting on the edge of the bed. That is the whole thing." },
    { n: 2, title: "Spine", text: "Cat and cow, slowly, until your back remembers it can move." },
    { n: 3, title: "Hips", text: "Two shapes on the floor that undo a day of sitting before it starts." },
    { n: 4, title: "Shoulders", text: "Where the week collects. Five minutes to empty it." },
    { n: 5, title: "Standing", text: "The first standing shapes, held for the length of a slow breath." },
    { n: 6, title: "Putting it together", text: "Days two to five in one ten-minute flow." },
    { n: 7, title: "Yours", text: "The same flow, with the bits you liked, and none of the bits you did not." },
  ],
  image: `${IMG}/morning-ritual.webp`,
  alt: "Jessica by a window at first light with a cup of tea and an open journal",
};

/* Proof. */
export const TESTIMONIALS = [
  {
    name: "Helen R.",
    detail: "The Reset, spring intake",
    quote:
      "I have paid for three gym memberships and a yoga app and used none of them. Eight weeks with Jessica and I have a ten-minute thing I do every morning without thinking. My back has stopped being the first thing I notice.",
  },
  {
    name: "Tom and Priya",
    detail: "Private sessions, fortnightly",
    quote:
      "She noticed in the first ten minutes that I was breathing wrong. Nobody had ever said that. It is a small thing and it changed the whole hour.",
  },
  {
    name: "Cara M.",
    detail: "Group flow, Thursdays",
    quote:
      "Six people, and she knows all our names and all our bad knees. I have been to classes of forty where the teacher never looked up.",
  },
  {
    name: "Dan W.",
    detail: "Autumn Meadow Day",
    quote:
      "I went because my wife booked it. I slept in a field after lunch and I am not embarrassed about it. Booked the winter one myself.",
  },
  {
    name: "Rachel O.",
    detail: "Operations lead, Tamar Software",
    quote:
      "We tried a lunchtime yoga class once and four people came. Jessica's chair sessions get twenty, every fortnight, and people ask when the next one is.",
  },
  {
    name: "Mike B.",
    detail: "The Reset, autumn intake",
    quote:
      "I am fifty-eight and I had decided I was just stiff now. Week four, the breathing one, was the first time I have felt properly calm in about a decade.",
  },
];

export const STATS = [
  { value: 9, suffix: "", label: "years teaching" },
  { value: 1400, suffix: "+", label: "private hours" },
  { value: 6, suffix: "", label: "people in a class, never more" },
  { value: 10, suffix: " min", label: "the daily practice" },
];

export const CREDENTIALS = [
  { year: "2016", what: "200-hour teacher training, Hatha and Vinyasa, Triyoga London" },
  { year: "2018", what: "Yin and restorative, 60 hours, with Norman Blair" },
  { year: "2020", what: "Pranayama and breath coaching certification, Breath Body Mind" },
  { year: "2022", what: "Yoga for the workplace and chair-based practice, YogaCampus" },
  { year: "2024", what: "Trauma-informed teaching, Yoga Alliance continuing education" },
];

export const TIMELINE = [
  { year: "2016", text: "Trained in London while working in an office that had turned my neck into a problem. The training was supposed to fix that. It did, and then it took over." },
  { year: "2019", text: "Started teaching private sessions in the evenings, one client at a time, mostly people from the office who had watched me stop wincing." },
  { year: "2022", text: "Left the job. Moved west, to a village above the Tamar, and took the barn behind the house as a studio. Six mats fit. That felt like enough, and it still does." },
  { year: "2024", text: "Ran the first meadow day because a client asked for one. Eight people came. All eight came to the next." },
  { year: "Today", text: "Private sessions, small groups, a few teams in Plymouth and Exeter, and The Reset four times a year. I keep it small on purpose." },
];

export const VALUES = [
  { title: "Small, on purpose", text: "Six in a class and four in each Reset, because I want to see everyone, and because you can tell when a teacher is not looking." },
  { title: "Your week, not mine", text: "A practice that assumes a free hour every day is a practice you will drop. Ten minutes that fits before the kettle boils is one you will keep." },
  { title: "Nothing to prove", text: "I am not interested in what you can get into. I am interested in whether your shoulders are down by Friday." },
];

/* Journal. */
export type Post = {
  slug: string;
  title: string;
  standfirst: string;
  date: string;
  readTime: string;
  image: string;
  alt: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "ten-minutes-is-the-whole-secret",
    title: "Ten minutes is the whole secret",
    standfirst: "Why every practice I build is short enough to be boring, and why that is the point.",
    date: "4 September 2026",
    readTime: "4 min",
    image: `${IMG}/morning-ritual.webp`,
    alt: "First light through a window, a cup of tea and an open journal",
    body: [
      "Every January I get a run of enquiries from people who want an hour a day. They are serious, they have bought the mat, and they have cleared six to seven in the morning. I say yes, and then I quietly build them ten minutes, because I know what six in the morning looks like on a Tuesday in February.",
      "The ten minutes is not a compromise. It is the version that survives contact with a real week. An hour asks you to be a different person, one with an empty morning and no children and a body that wants to be on the floor before coffee. Ten minutes asks nothing. It fits between the alarm and the kettle. You do it on the day the boiler breaks.",
      "And here is the part people do not expect: the ten minutes grows. Not because I add to it, but because on a good morning you do not want to stop, and you find you have been down there for twenty-five. The short practice is the door. Nobody keeps a door they cannot get through.",
      "So if you have been meaning to start, start with three minutes of breathing on the edge of the bed. That is day one of Seven Mornings, and it is the hardest day, because it is the first one.",
    ],
  },
  {
    slug: "what-your-chair-is-doing-to-your-hips",
    title: "What your chair is doing to your hips",
    standfirst: "The one thing I see in almost every new client, and the two shapes that undo it.",
    date: "19 August 2026",
    readTime: "5 min",
    image: `${IMG}/desk-stretch.webp`,
    alt: "A person stretching beside a desk in a bright room, laptop closed",
    body: [
      "Sit down for eight hours and your hip flexors, the muscles at the front of the hip that lift the knee, spend the whole day short. They get comfortable like that. Stand up and they do not lengthen back; they pull the pelvis forward and the lower back takes the strain. That ache you feel at the end of the day, just above the belt, is very often not your back at all.",
      "I can usually see it before anyone says anything. A slight forward tilt in standing, a reluctance to straighten the back leg in a lunge, and a look of surprise when I ask where it hurts and they point to their hips rather than their spine.",
      "Two shapes help, and neither needs a mat. The first is a low lunge with the back knee on the floor and the hips pressed gently forward, held for five slow breaths on each side. The second is lying on your back with one knee hugged in and the other leg long on the floor, letting the long leg get heavy. Do both after work rather than before, when the tightness is at its worst and there is something to undo.",
      "Give it two weeks. The ache does not vanish, but it stops being the first thing you notice when you stand up, and that is how these things go: not away, but quieter.",
    ],
  },
  {
    slug: "the-breath-you-use-when-it-goes-wrong",
    title: "The breath you use when it goes wrong",
    standfirst: "One breathing pattern, learnt in a calm room, for the moments that are not.",
    date: "2 August 2026",
    readTime: "3 min",
    image: `${IMG}/breath.webp`,
    alt: "Jessica with her eyes closed and a hand on her chest, morning light on her face",
    body: [
      "Breathing exercises are easy to do on a mat, in a quiet room, with someone telling you what to do. They are less easy in a car park before a meeting you are dreading. The trick is to practise the one you will actually reach for, in the calm, enough times that your body knows the shape of it.",
      "Mine is simple. In through the nose for four. Out through the nose for six. The out-breath is the important half: longer out than in tells your nervous system that whatever is happening, you are not running from it. Four rounds. Under a minute.",
      "Do it once a day when nothing is wrong. Waiting for the kettle is good. Then, the first time something goes sideways, you will find your body already knows the pattern, and you will get four rounds in before your mind has caught up with what you are doing.",
    ],
  },
  {
    slug: "why-six-people-and-never-more",
    title: "Why six people, and never more",
    standfirst: "The number that shapes every class I teach, and what a bigger room costs you.",
    date: "14 July 2026",
    readTime: "4 min",
    image: `${IMG}/studio-group.webp`,
    alt: "Jessica adjusting a small group of students in a bright studio",
    body: [
      "I taught a class of forty once, in a hotel gym in London, and I remember it because I could not see the back row. I do not mean it metaphorically. There was a pillar. I called out adjustments to people I had never looked at, and they nodded, and I have no idea whether any of it helped.",
      "Six is the number where I can see every hip and every shoulder from wherever I am standing, walk the room in the time it takes to hold a pose, and put a hand on someone's shoulder blade rather than describing where their shoulder blade ought to be. It is also the number where people learn each other's names by the second week and start turning up for each other, which does more for attendance than anything I do.",
      "It costs me, obviously. Six people at eighteen pounds is not forty people at twelve, and the barn would fit twelve at a push. But the class I am proud of is the one where the person who has never done this before gets exactly as much of me as the person who has done it for years, and that only happens in a room I can actually see.",
    ],
  },
  {
    slug: "a-wind-down-that-replaces-the-phone",
    title: "A wind-down that replaces the phone",
    standfirst: "Week six of The Reset, and the ten minutes that most people say they will keep for good.",
    date: "28 June 2026",
    readTime: "4 min",
    image: `${IMG}/wind-down.webp`,
    alt: "A dim bedroom at dusk, a lamp on, a folded blanket at the foot of the bed",
    body: [
      "The phone in bed is not the problem. It is what the phone is instead of. Most people get into bed still running at the speed of the day, and the phone is the only thing to hand that is slower than their thoughts. Take it away and you are left with the thoughts.",
      "So I do not ask anyone to take it away. I give them something else that is slower. Legs up the wall for three minutes, then lying flat with one hand on the belly and the other on the chest, breathing so that only the lower hand moves. Then a slow scan from the feet up, letting each part get heavy. Ten minutes. Most people do not finish it, because they are asleep.",
      "Do it for a week and the phone gets left on the side, not by discipline but because there is something better to do. That is how every habit in The Reset is built: not by removing the bad one, but by putting something in the space it used to fill.",
    ],
  },
  {
    slug: "the-first-meadow-day",
    title: "The first meadow day",
    standfirst: "A client asked for a whole day. Eight people came. Here is what happened, and why we kept doing it.",
    date: "10 June 2026",
    readTime: "5 min",
    image: `${IMG}/retreat-dusk.webp`,
    alt: "Mats in a circle in the meadow at dusk, lanterns lit",
    body: [
      "Cara asked first. She had been coming on Thursdays for a year and said, quite reasonably, that an hour a week was not enough and could we do a day. I said I would think about it, which meant no. Then two more people asked, and I found myself walking the top field with a tape measure working out where eight mats would go.",
      "The first one was in May. It rained until nine and then it did not. We practised in the wet grass with the valley steaming below us and nobody minded the damp because nobody had been outside that long in a year. Lunch went on for two hours. Dan, who had been brought by his wife and had told me on arrival that he did not really do this sort of thing, fell asleep under the oak and woke up for the four o'clock practice looking ten years younger.",
      "I learnt that the schedule is a suggestion, that the afternoon should have nothing in it, and that eight is the right number for the same reason six is right in the barn: I could see everyone, all day, and everyone could see each other. All eight came to the next one. Three of them have done every one since.",
      "The next is in October. The oak will have turned. Bring layers.",
    ],
  },
];

/* Frequently asked, on the home and work pages. */
export const FAQ = [
  { q: "Do I need to be flexible?", a: "No, and I would gently push back on the idea that yoga is for flexible people. It is for people with bodies. Most of my clients arrived unable to touch their knees and none of them needed to." },
  { q: "Where are you?", a: "A village above the Tamar, a few miles from Saltash. The studio is the barn behind the house. I also come to you across Plymouth, Saltash and the villages between, and I teach on video calls to people much further away." },
  { q: "Can I try a group class before committing?", a: "Yes. Book a single class for eighteen pounds. If you come back for a block, the first class comes off the price." },
  { q: "What should I wear?", a: "Whatever you can move in. Nobody here is looking. Mats and props are provided, so bring nothing but yourself and a layer for the end." },
  { q: "I have an injury. Can I still come?", a: "Almost certainly, but tell me first. Send a message when you book and we will talk before you arrive. Most injuries change what we do, not whether we do it." },
];

export const NAV = [
  { label: "Work with me", href: `${BASE}/work-with-me` },
  { label: "The Reset", href: `${BASE}/the-reset` },
  { label: "Retreats", href: `${BASE}/retreats` },
  { label: "Journal", href: `${BASE}/journal` },
  { label: "About", href: `${BASE}/about` },
];
