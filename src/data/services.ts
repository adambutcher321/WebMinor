import type { Service } from "@/types";
import { WEBSITE_REVIEW_OFFER } from "@/data/offers";

/* Fix brief 7.2: the four pages used to be one page written four times —
   an intro, "What's included", exactly six bullets, the same form. Each now
   runs to the length its subject needs, names real places, and only claims
   what the pricing page already commits to. */

export const services: Service[] = [
  {
    slug: "web-design-for-trades",
    name: "Web design",
    shortDescription:
      "A three-page website, designed in Saltash for nothing, then £50 a month + VAT to keep it online.",
    body: [
      "We design your home page first and send it to you as a private link, so you can see where it's heading before the rest is built. The contact and about pages follow, and the site is usually live within seven working days of us getting your words and photos.",
      "The design is free because you stay for the hosting: £50 a month plus VAT, which covers the server and the security certificate. That only works for us if the site is good enough that you want to keep it, which is a useful thing for a web designer to be stuck with.",
      "It's built for the phone first, because that's where someone in Torpoint with a leaking tap is looking. Your number sits at the top of every page and rings when it's tapped.",
    ],
    included: {
      heading: "On the three pages",
      items: [
        "A home page that says what you do, where you do it and how to get hold of you",
        "A contact page with your number, your email and the towns you cover",
        "An about page, so people know who's turning up",
      ],
    },
    price: "Free design, then £50 a month + VAT",
    planNote:
      "Need more than three pages, or want SEO from the start? Starter is £149 to set up and £69 a month + VAT, rolling monthly.",
    offer: {
      ...WEBSITE_REVIEW_OFFER,
      heading: "How’s your current site doing?",
      lede: "Type in your address for a free score and the three things we’d fix first. No website yet? Ring 01752 845258 and we’ll start with your home page.",
    },
    icon: "Monitor",
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    shortDescription:
      "Turning up when someone in Saltash, Liskeard or Plymouth searches for what you do.",
    body: [
      "Search for an electrician in Callington and Google shows three businesses on a map before it shows a single website. Local SEO is the work of getting into those three, and onto the first page underneath them, for the towns you actually cover.",
      "Most of it is unglamorous: making sure your name, address and number are written the same way everywhere Google looks, giving each service and each town its own page, choosing the right categories on your Google profile, and asking customers for reviews, politely and often.",
      "It takes months rather than weeks, which is why Growth has a three-month minimum. Every month you get a short report in plain English: where you rank for the searches that matter, and what changed.",
    ],
    included: {
      heading: "Every month",
      items: [
        "Where you rank for your trade in each town you cover, checked the way a customer searches",
        "Service and town pages written for the searches people actually make",
        "A report on one page, with no jargon in it",
      ],
    },
    price: "Part of Growth, £99 a month + VAT",
    planNote:
      "Local SEO is part of Growth: £299 to set up and £99 a month + VAT. Three months minimum, then rolling monthly.",
    offer: {
      ...WEBSITE_REVIEW_OFFER,
      heading: "Is your site ready to rank?",
      lede: "The free health check reads your pages the way Google does: titles, headings, descriptions, sitemap, links and speed. You get a score and the fixes that matter most.",
    },
    icon: "Search",
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile set-up",
    shortDescription:
      "The listing that shows on Google Maps, set up properly and kept that way.",
    body: [
      "Search for a plumber in Saltash and, before any website appears, Google shows a map with three businesses on it: their hours, their reviews, and a button that rings them. That's the Google Business Profile. It costs nothing to have, and for plenty of people it's the only part of Google they look at before they ring.",
      "It's easy to get subtly wrong. Pick the wrong main category and you won't show for your own trade. Share an address with another business, as we do with PrintMinor, and Google can suspend the pair of you as duplicates. Verification can mean a phone call, a postcard or a short video of your signage and tools, and it can take the best part of a week.",
      "We claim or create the listing, see it through verification, choose the categories, write the description, add your services and the towns you cover, and put up photos of real work. Then we set up a short link your customers can use to leave a review, which is what fills the listing out over time.",
    ],
    price: "Part of Growth, £99 a month + VAT",
    planNote:
      "Included in Growth, £99 a month + VAT. If the profile is all you need, ring 01752 845258 and we'll price it on its own.",
    offer: {
      ...WEBSITE_REVIEW_OFFER,
      heading: "Does your website back up your listing?",
      lede: "Google weighs your website alongside your profile. The free check shows whether your site tells Google your business details, loads fast on a phone and makes you easy to ring.",
    },
    icon: "MapPin",
  },
  {
    slug: "lead-generation-ppc",
    name: "Google Ads",
    shortDescription:
      "Paid adverts at the top of Google, shown only to people in the towns you cover.",
    body: [
      "SEO takes months. Google Ads can put you at the top of the page within days, and you pay only when someone clicks. The catch is how easy it is to pay for the wrong clicks: clicks from people 50 miles away or searching for something you don't do.",
      "So the area comes first. Your ads show to people in Saltash, Torpoint, Plymouth or wherever you work, and nowhere else. We block the searches that waste money, send each click to a page about that one service, and count the enquiries that come from it, so you can see what each one cost.",
      "You agree the monthly budget before a penny is spent. The ad spend is separate from our fee, and you can turn it down whenever you like.",
    ],
    included: {
      heading: "Every month",
      items: [
        "Your area and budget, agreed before anything goes live",
        "The list of wasted searches, blocked and kept up to date",
        "A landing page for each service you advertise",
        "A cost per enquiry, not just a count of clicks",
      ],
    },
    price: "Part of Dominate, £199 a month + VAT",
    planNote:
      "Google Ads management is part of Dominate: £499 to set up and £199 a month + VAT, plus the ad spend you agree. Three months minimum, then rolling monthly.",
    offer: {
      ...WEBSITE_REVIEW_OFFER,
      heading: "Is your site worth paying to send people to?",
      lede: "Ads send people to your website. If it’s slow or hard to ring you from, you pay for clicks that go nowhere. Check it free before spending a penny.",
    },
    icon: "TrendingUp",
  },
];
