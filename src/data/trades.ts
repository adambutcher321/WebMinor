import type { Trade } from "@/types";

export const trades: Trade[] = [
  {
    slug: "plumbers",
    displayName: "Plumber",
    pluralName: "Plumbers",
    tagline: "Get more local plumbing jobs from Google",
    painPoints: [
      "You're relying on word-of-mouth and the odd Checkatrade lead, but the phone's gone quiet",
      "Your current website looks like it was built in 2012 and you know it's putting customers off",
      "You're paying for leads on directories where you're competing with 30 other plumbers on the same page",
      "Customers can't find you when they search 'plumber near me' — but your competitors show up every time",
    ],
    outcomes: [
      "A professional website that makes you look like the go-to plumber in your area",
      "Ranking on Google when locals search for plumbing services in your town",
      "Steady enquiries coming in through your website — not just word-of-mouth",
      "A Google Business Profile that's fully set up and actually bringing in calls",
    ],
    introTemplate:
      "Looking for a website that actually brings in plumbing work in {town}? Most {trade} we speak to are fed up with paying for shared leads or relying on mates passing their number around. We build websites that get found on Google by people in {town} who need a plumber right now — and turn those searches into real jobs.",
    faq: [
      {
        question: "Do I really need a website as a plumber?",
        answer:
          "Yes. Most people look you up online before they ring, even when a neighbour gave them your name. If you don't have a decent website, you're handing those jobs to plumbers who do. Even if most of your work comes from referrals, a professional site gives people confidence to actually pick up the phone.",
      },
      {
        question: "How long before I start getting enquiries?",
        answer:
          "It depends on the town and how many plumbers are already competing there, so we won't promise a number. A Google Business Profile can bring calls soon after it's verified; getting the website itself to rank usually takes a few months. Either way, you'll see where you stand in the monthly report.",
      },
      {
        question: "Can you help me get more Google reviews?",
        answer:
          "Yes — we set up your Google Business Profile properly and give you a simple system for asking happy customers to leave reviews. More reviews means better rankings and more trust. It's one of the easiest wins for any plumber.",
      },
      {
        question: "What if I already have a website but it's not getting any leads?",
        answer:
          "That's really common. We'll take a look at what's going wrong — it's usually a combination of poor SEO, slow loading times, and no clear call-to-action. We can rebuild it or rework what you've got to actually convert visitors into enquiries.",
      },
    ],
  },
  {
    slug: "electricians",
    displayName: "Electrician",
    pluralName: "Electricians",
    tagline: "Fill your diary with local electrical work from Google",
    painPoints: [
      "You're getting undercut on price by cowboys and losing out on the jobs you actually want",
      "Your website doesn't mention half the services you offer — rewires, fuseboard upgrades, EICRs — so people don't know to call you",
      "You've got all your qualifications and accreditations but none of it is visible online",
      "You're spending money on MyBuilder or Bark leads that go nowhere",
    ],
    outcomes: [
      "A website that showcases your full range of services and qualifications properly",
      "Local homeowners finding you on Google when they need an electrician they can trust",
      "Clear calls-to-action that make it easy for people to request a quote or call you directly",
      "A professional online presence that sets you apart from unqualified competition",
    ],
    introTemplate:
      "If you're an electrician in {town} and your phone isn't ringing as much as it should be, your online presence is probably the problem. We build websites for {trade} that rank on Google, show off your qualifications, and make it dead simple for people in {town} to get in touch. No gimmicks — just a site that works as hard as you do.",
    faq: [
      {
        question: "Can you show my NICEIC/NAPIT accreditation on the site?",
        answer:
          "Definitely — and you should. Accreditation logos build instant trust. We'll display your NICEIC, NAPIT, Part P, or any other certifications prominently on every page. It's one of the biggest things that separates you from unregistered electricians.",
      },
      {
        question: "I do domestic and commercial work — can the site cover both?",
        answer:
          "Yes. We'll create separate pages for domestic and commercial electrical services so you rank for both. This also helps customers find exactly what they're looking for, whether it's a consumer unit upgrade or a full commercial rewire.",
      },
      {
        question: "Will the website help me rank for specific services like EICR testing?",
        answer:
          "That's exactly how we approach it. We create dedicated service pages for things like EICR testing, fuseboard upgrades, rewires, and new build electrics. Each page is optimised to rank for those specific searches in your area.",
      },
    ],
  },
  {
    slug: "roofers",
    displayName: "Roofer",
    pluralName: "Roofers",
    tagline: "Get found by homeowners who need roofing work done now",
    painPoints: [
      "You're getting lumped in with cowboy roofers online and it's impossible to stand out",
      "Emergency call-outs go to whoever shows up first on Google — and that's not you",
      "You've got no photos of your work online, so customers can't see what you're capable of",
      "You're doing great work but nobody outside your existing network knows about it",
    ],
    outcomes: [
      "A professional website with a gallery that shows the quality of your roofing work",
      "Showing up on Google when someone searches for roofing repairs or a new roof in your area",
      "Emergency and urgent repair enquiries coming in when people actually need you",
      "A brand presence that makes you the obvious choice over cheaper, dodgy alternatives",
    ],
    introTemplate:
      "Homeowners in {town} search Google the moment a tile slips or a leak starts — and they go with whoever looks most professional and shows up first. We build websites for {trade} in {town} that rank locally, showcase your work with proper photos, and give customers the confidence to call you instead of the next bloke on the list.",
    faq: [
      {
        question: "Can you help me show up for emergency roof repair searches?",
        answer:
          "Yes — emergency and urgent searches are some of the highest-converting keywords for roofers. We optimise your site for terms like 'emergency roofer [your town]' and 'roof leak repair near me' so you're the one people call when they're in a panic.",
      },
      {
        question: "I've got loads of photos of past jobs — can you use those?",
        answer:
          "Please do send them over. A strong gallery is one of the best things a roofer's website can have. We'll organise them by job type — flat roofs, pitched roofs, lead work, guttering — so customers can see exactly the kind of work you do.",
      },
      {
        question: "Do I need a website if I mostly get work through builders?",
        answer:
          "Even if your main source of work is subcontracting, a website helps in two ways: it gives builders confidence in your work when they're vetting subcontractors, and it opens up a direct-to-homeowner channel so you're not entirely dependent on one or two builders for your income.",
      },
    ],
  },
  {
    slug: "builders",
    displayName: "Builder",
    pluralName: "Builders",
    tagline: "Win bigger building projects through your website",
    painPoints: [
      "You're quoting on jobs where the homeowner has already spoken to five other builders from Checkatrade",
      "Your website (if you've got one) doesn't reflect the quality of work you actually deliver",
      "You're doing extensions, loft conversions, and renovations but your site just says 'general builder'",
      "Homeowners can't tell the difference between you and a bloke with a van and a Facebook page",
    ],
    outcomes: [
      "A website with dedicated pages for extensions, loft conversions, renovations, and new builds",
      "Professional project galleries that show the full scope and quality of your building work",
      "Higher-value enquiries from homeowners who've already decided you're the right builder",
      "Ranking locally for specific building services, not just the generic 'builder near me'",
    ],
    introTemplate:
      "If you're a builder in {town}, you know the competition is fierce. The {trade} who win the best jobs aren't always the most skilled — they're the ones who look the most professional online. We build websites for {trade} in {town} that showcase your projects properly, rank on Google for the services you actually want to do, and bring in enquiries from homeowners who are ready to get started.",
    faq: [
      {
        question: "Can you create separate pages for each type of building work I do?",
        answer:
          "That's exactly what we recommend. A single 'services' page won't cut it. We'll create dedicated pages for extensions, loft conversions, renovations, new builds, garage conversions — whatever you specialise in. Each one gets optimised for local search so you rank for the jobs you actually want.",
      },
      {
        question: "I do big projects — can the website show before and after photos?",
        answer:
          "Absolutely. Before-and-after galleries are incredibly powerful for builders. We'll set up project case studies with multiple photos, descriptions of the work done, and the scope of each project. It lets homeowners see the transformation and picture what you could do for them.",
      },
      {
        question: "How do I compete with bigger building firms online?",
        answer:
          "Local SEO is the great equaliser. Big firms target broad areas, but we'll get you ranking in your specific towns and surrounding villages. A homeowner in {town} searching for a builder wants someone local and reliable — and that's where your website gives you the edge.",
      },
      {
        question: "Will the website help me get planning-stage enquiries?",
        answer:
          "Yes. We'll include content about the planning process, building regs, and what homeowners should expect. This brings in people who are researching early — before they've spoken to anyone else. Getting in at the planning stage means you're advising, not just quoting.",
      },
    ],
  },
];
