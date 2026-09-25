/** Researched local copy for each town page. Nothing here describes work
    WebMinor has done: it says what businesses in the town need and how Adam
    would approach them. Real jobs go in as case studies once they exist. */
export interface TownContent {
  localHeading: string;
  local: string[];
  approachHeading: string;
  approach: string[];
  faqs: { q: string; a: string }[];
}

export const townContent: Record<string, TownContent> = {
  // Sources: https://en.wikipedia.org/wiki/Saltash, https://en.wikipedia.org/wiki/Tamar_Bridge, https://en.wikipedia.org/wiki/Saltash_railway_station, https://en.wikipedia.org/wiki/Landrake, https://en.wikipedia.org/wiki/Botus_Fleming
  saltash: {
    "localHeading": "Websites for the first town over the bridge",
    "local": [
      "I'm based in Saltash, so I know how the town works. The parish had 16,288 people at the 2021 census, and plenty of them earn their living across the water in Plymouth. The person searching for a plumber or a hairdresser might be at a desk in Devon, or on the train home over Brunel's Royal Albert Bridge, sorting out what needs doing once they're back.",
      "The Tamar Bridge only charges eastbound, so a Saltash customer weighing a Plymouth firm against a local one already has a reason to stay put. The job is making sure Google offers them the local choice. A trade covering Landrake, Botus Fleming, Landulph and Cargreen should name those places, on the site and on Google, rather than hoping the word Saltash stretches that far."
    ],
    "approachHeading": "What I'd build for a Saltash business",
    "approach": [
      "For a tradesperson, each service gets its own page, with the areas you cover written as real place names. For a café or salon, opening hours sit at the top and match Google, alongside a map and photos of your actual shopfront. Because I live here, we can sit down and talk the site through in person."
    ],
    "faqs": [
      {
        "q": "Is a website worth it if most of my work comes by word of mouth?",
        "a": "Word of mouth usually ends with someone typing your name into Google. If all they find is a Facebook page that went quiet years ago, some ring the next name. The design is free and hosting is £50 a month plus VAT."
      },
      {
        "q": "Can I show up in Plymouth searches as well as Saltash ones?",
        "a": "Yes, but it takes more than a mention. Plymouth is a crowded market, so I'd add pages for the parts of the city you really cover and set your Google Business Profile to match. Starter adds pages from £69 a month, and Growth, at £99, adds the local SEO and a managed Google Business Profile."
      },
      {
        "q": "Do we need to meet, or can it all be done online?",
        "a": "Whichever suits you. I'm in Saltash, so I'm happy to call in, and email works just as well. Either way you get a private link to the home page before anything else is built, so you can judge it first."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Plymouth, https://en.wikipedia.org/wiki/HMNB_Devonport, https://en.wikipedia.org/wiki/Torpoint_Ferry, https://en.wikipedia.org/wiki/Tamar_Bridge
  plymouth: {
    "localHeading": "Websites for a city people search by neighbourhood",
    "local": [
      "Plymouth had 277,695 people at the 2021 census, but nobody searches it as one place. Someone in Plympton wanting a dog groomer wants one in Plympton, not across the city in Stoke. Between Devonport, the largest naval base in Western Europe, and a university of more than 20,000 students, plenty of people here choose a business with no recommendation to go on.",
      "That makes competition uneven. A city-wide search for a plumber in Plymouth is crowded with directories and national firms paying for the top spots. Searches from Plymstock, Mannamead or Devonport are less contested, and they come from people ready to book. A small firm usually does better owning its corner of the city properly than chasing all of it at once."
    ],
    "approachHeading": "What I'd build for a Plymouth business",
    "approach": [
      "For a trade, I'd build pages around the districts you really cover, each with its own details, rather than one generic page stretched across the city. For a restaurant or shop near the Barbican or Royal William Yard, the menu, booking and opening hours come first, because some of those searches come from people already walking nearby. For businesses that serve students, clear prices matter most."
    ],
    "faqs": [
      {
        "q": "Why use a one-person studio instead of a Plymouth agency?",
        "a": "You deal with the person doing the work. I design it, I build it, and I'm just over the Tamar Bridge in Saltash. The design is free and hosting is £50 a month plus VAT, so there's no agency fee up front."
      },
      {
        "q": "Should I try to rank across the whole city or pick areas?",
        "a": "Start with the areas you serve most and do them well, then widen. A page per district and a Google Business Profile with the right service area are a realistic start. The Starter, Growth and Dominate plans (£69, £99 and £199 a month) build on that."
      },
      {
        "q": "I'm in Plymouth but work in Cornwall too. Can the site cover both?",
        "a": "Yes. The Tamar Bridge and the Torpoint Ferry put the Cornish side within reach, and your site should say so. I'd add pages for the places you cover over the river, such as Saltash or Torpoint, so a search from there finds you."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Torpoint, https://en.wikipedia.org/wiki/Torpoint_Ferry, https://en.wikipedia.org/wiki/HMS_Raleigh_(shore_establishment), https://en.wikipedia.org/wiki/Rame_Peninsula, https://en.wikipedia.org/wiki/Antony,_Cornwall
  torpoint: {
    "localHeading": "Websites for a town that runs on the ferry",
    "local": [
      "Torpoint was laid out on a grid in the eighteenth century and had 7,444 people in the parish at the 2021 census. It faces Devonport across the Hamoaze, and the chain ferries cross around the clock, so a Devonport customer is one crossing away. HMS Raleigh, the Royal Navy's basic training base, brings in people who don't know the area yet.",
      "Behind the town lies the Rame Peninsula: Antony, Millbrook, Crafthole, Sheviock, Portwrinkle, Kingsand and Cawsand. That gives a Torpoint business two kinds of customer. People living out on the peninsula need an electrician or a mobile hairdresser who will make the trip. Visitors want food, a bed or a walk to Mount Edgcumbe, and they search on their phones once they've arrived."
    ],
    "approachHeading": "What I'd build for a Torpoint business",
    "approach": [
      "For a trade, I'd list the peninsula villages by name and say plainly that you cross to Plymouth, because someone in Devonport may not assume a Cornish firm will come. For a pub, café or holiday let, the menu, rooms and booking go on the first screen, with directions from the ferry slipway. For anyone serving people new to the town, clear hours and a phone number beat a clever homepage."
    ],
    "faqs": [
      {
        "q": "Should my site mention Plymouth if I'm based in Torpoint?",
        "a": "If you work there, yes. The ferry runs 24 hours a day, so Devonport is nearer than it looks. Naming the areas you cover on both banks stops Google treating you as a Cornwall-only business. I'd build that into your service area pages from the start."
      },
      {
        "q": "I'm on the holiday booking platforms. Do I need my own site?",
        "a": "The platforms find you guests, but they take a cut and keep the relationship. Your own site lets returning guests book direct and shows what a listing can't, like the walk from your door. There's nothing to pay for the design."
      },
      {
        "q": "What does it cost to keep a site going each month?",
        "a": "Hosting is £50 a month plus VAT, and the design is free. Starter, at £69 a month, adds pages; Growth, at £99, adds local SEO and a managed Google Business Profile; Dominate, at £199, adds Google Ads. Before any of that, you see the home page on a private link."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Callington, https://en.wikipedia.org/wiki/Kit_Hill, https://callington-tc.gov.uk/community/honey-fair/, https://en.wikipedia.org/wiki/St_Dominick,_Cornwall, https://en.wikipedia.org/wiki/Stoke_Climsland
  callington: {
    "localHeading": "Websites for a market town under Kit Hill",
    "local": [
      "Callington was granted its market in 1267 and is still a working town more than a tourist one. Its largest employers are the food makers Ginsters and The Cornwall Bakery. With 5,983 people in the parish at the 2021 census, most businesses here lean on the surrounding villages too: Kelly Bray, St Dominick, Harrowbarrow, Stoke Climsland and out to Gunnislake.",
      "That spread is the real challenge online. A Callington roofer covers a patch of south-east Cornwall running to the Tamar, and someone in Harrowbarrow searching for a roofer near me may be shown a firm from a bigger town first. Kit Hill draws walkers and the Honey Fair fills the streets each October, but most trade here is local and year-round."
    ],
    "approachHeading": "What I'd build for a Callington business",
    "approach": [
      "For a trade or farm contractor, I'd give each main job its own page and name the villages you cover, with the same list on your Google Business Profile. For a shop or café in town, opening hours, parking and what you stock should be easy to find on a phone. Selling eggs or logs from the gate needs one plain page with prices and a map pin."
    ],
    "faqs": [
      {
        "q": "Most of my customers live in the villages. Should my site still say Callington?",
        "a": "Say both. Callington tells Google roughly where you are, but people search by where they live. I'd name each village you actually cover in ordinary sentences, not a keyword dump, and match them on your Google Business Profile. The Growth plan, at £99 a month plus VAT, adds that local SEO."
      },
      {
        "q": "Is a website worth it for a small sideline to the farm?",
        "a": "Often, because a sideline is exactly what people struggle to find. Logs, livery or a holiday cottage all get searched for, and one clear page does most of the work. Designing it costs you nothing, and hosting is £50 a month plus VAT."
      },
      {
        "q": "How long before a new site shows up on Google?",
        "a": "Google usually picks up a new site within a few weeks, but ranking for something like electrician Callington takes longer. A properly set up Google Business Profile often gets results sooner, because it feeds the map shown above the ordinary listings, so I'd set up both together."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Liskeard, https://en.wikipedia.org/wiki/St_Cleer, https://en.wikipedia.org/wiki/Dobwalls, https://en.wikipedia.org/wiki/Menheniot, https://en.wikipedia.org/wiki/Looe_Valley_Line
  liskeard: {
    "localHeading": "Websites for a market town on the A38",
    "local": [
      "Liskeard has held a market charter since 1240, and still acts as the shopping town for the farms and villages on the southern edge of Bodmin Moor. The parish had 10,902 people at the 2021 census, and Fore Street and Pike Street draw shoppers from St Cleer, Dobwalls and Menheniot. The livestock market closed in 2017. The Liskeard Show still takes the second Saturday in July.",
      "Plymouth is about 20 miles east, close enough that a search for a builder or an accountant here can turn up city firms with bigger budgets. The Looe Valley Line starts at Liskeard, so summer visitors pass through on their way to the coast. The job online is simpler than it looks: be the obvious local answer."
    ],
    "approachHeading": "What I'd build for a Liskeard business",
    "approach": [
      "For a trade, I'd write a service area page that names the places you really cover, St Cleer, Dobwalls, Menheniot and up towards the moor, instead of a vague 'south-east Cornwall'. For a Fore Street shop, I'd put opening hours, parking and what's in stock where a phone finds them first, and keep the photos on your Google Business Profile current."
    ],
    "faqs": [
      {
        "q": "Can a website bring in work from the villages, not just Liskeard itself?",
        "a": "Yes, if it says plainly where you work. Google matches searches to places, so a page naming St Cleer, Menheniot or Dobwalls, with the jobs you do there, gives it something to match. The Growth plan, £99 a month plus VAT after a one-off setup fee, includes that local SEO work."
      },
      {
        "q": "Is it worth competing with Plymouth firms online?",
        "a": "You don't need to win the searches for Plymouth. You need the ones made in and around Liskeard, where a local firm that can turn up the same day has the edge. I'd shape the site and your Google Business Profile around that and leave the city to the city firms."
      },
      {
        "q": "What do I pay before I know whether I like it?",
        "a": "Nothing. I design the site free and send you the home page as a private link before building the rest. If you go ahead, hosting is £50 a month plus VAT, and if you ever leave, you give 30 days' notice."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Tavistock, https://www.tavistock.gov.uk/council-services/pannier-market/markets, https://en.wikipedia.org/wiki/Whitchurch,_Devon, https://en.wikipedia.org/wiki/Lamerton, https://en.wikipedia.org/wiki/Mary_Tavy
  tavistock: {
    "localHeading": "Websites for a market town on the edge of Dartmoor",
    "local": [
      "Tavistock's market charter dates from 1105, and the Pannier Market still opens Tuesday to Saturday, with antiques on Tuesdays, crafts midweek and local produce at the Friday charter market. The town, 12,675 people at the 2021 census, sits on the edge of Dartmoor, so its customers come from two directions: people who shop here every week, and people passing through.",
      "Trade arrives in bursts and in a steady trickle. The Goose Fair each October and the fortnightly farmers' market bring crowds on fixed days, while Whitchurch, Lamerton, Mary Tavy, Peter Tavy and Horrabridge keep things ticking over the rest of the year. People there search as though Tavistock is their town, because it is, so a good site looks after the regular first."
    ],
    "approachHeading": "What I'd build for a Tavistock business",
    "approach": [
      "For a stallholder or independent shop, I'd show which market days you trade and where to find you, with photos that match what someone sees when they walk in. For a café or guest house, seasonal hours and a booking link go near the top. For a trade, each village gets named, and Plymouth, roughly fifteen miles down the A386, if you work there too."
    ],
    "faqs": [
      {
        "q": "I sell at the Pannier Market. Do I need a website as well as a stall?",
        "a": "A stall only sells on the days you're behind it. A simple site lets someone who bought from you on a Friday find you again and order in between. You pay nothing for the design, and the home page comes to you on a private link first."
      },
      {
        "q": "Can a Devon business use a web designer based in Cornwall?",
        "a": "Of course. I'm in Saltash, just across the Tamar, and happy to meet in Tavistock. What matters more is that your site speaks to people searching from Tavistock and its villages, and that has nothing to do with which side of the river the designer lives on."
      },
      {
        "q": "How do I get found by visitors as well as locals?",
        "a": "Largely through your Google Business Profile, which visitors see first on a phone. Accurate hours and good photos there often matter as much as the site itself. Managing that profile is part of the Growth and Dominate plans, £99 and £199 a month plus VAT."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Truro, https://en.wikipedia.org/wiki/Threemilestone, https://en.wikipedia.org/wiki/Tresillian, https://en.wikipedia.org/wiki/Carnon_Downs
  truro: {
    "localHeading": "Websites for the county's working city",
    "local": [
      "Truro is Cornwall's county town, and it is where much of the county comes to shop, visit the hospital or deal with the council. The parish had 21,046 people in 2021, yet the city holds around 22,000 jobs, so many of the people on Boscawen Street each day live elsewhere and arrive by car, by train or through the park and ride at Threemilestone.",
      "That shapes how a Truro business gets found. A customer might search on a lunch break at Treliske or Lys Kernow, or before driving in from Tresillian or Carnon Downs. Competition for the obvious searches is real, because the county's solicitors, clinics, estate agents and independent shops all gather in the county town."
    ],
    "approachHeading": "What a Truro site needs to do",
    "approach": [
      "For a clinic or a solicitor, I'd make booking or calling possible in two taps and give each service its own page, because 'physiotherapist Truro' and 'sports massage Truro' are different searches. For a city-centre shop, I'd show where to park and the nearest park and ride stop. For a trade, the service area would name Threemilestone, Kenwyn, Tresillian and Carnon Downs."
    ],
    "faqs": [
      {
        "q": "Truro is crowded online. Can a small business still rank?",
        "a": "Yes, though rarely for the broadest term at first. I'd go first for the specific searches your customers make, one well-written page each, backed by a Google Business Profile with real photos. When you want to appear above the organic results, Google Ads management is part of the Dominate plan."
      },
      {
        "q": "Most of my customers drive in from outside the city. Does that change anything?",
        "a": "It changes what goes near the top of the page. Someone coming in from Threemilestone or Tresillian wants to know where to park, whether they need to book and how long it will take. I'd answer those plainly rather than leaving them on a contact page."
      },
      {
        "q": "Do I need a website if I already have a Facebook page?",
        "a": "Facebook is useful, but you don't own it, and it rarely comes up when someone searches Google for a service in Truro. A proper site gives Google something to rank. I design it free and send the home page as a private link first, and hosting is £50 a month plus VAT."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Looe, https://discoverseafood.uk/a-day-in-looe/, https://en.wikipedia.org/wiki/Polperro, https://en.wikipedia.org/wiki/Pelynt, https://en.wikipedia.org/wiki/Looe_Valley_Line
  looe: {
    "localHeading": "Websites for a harbour town on both banks",
    "local": [
      "Looe is really two towns, East and West, joined by a seven-arched bridge opened in 1853 and made one town in 1898. The parish had 5,311 people at the 2021 census, and summer fills the quays with visitors. Day boats still land their catch here, and the fish market sells it at auction on the quayside early in the morning.",
      "Online, the river matters. Someone on the East Looe quay searching for lunch might be shown a place across the bridge, and a holiday let near Hannafore competes with one above East Looe beach. Some visitors come down the Looe Valley Line from Liskeard with no car, so how far you are on foot is useful information rather than a detail."
    ],
    "approachHeading": "What I'd put on a Looe business site",
    "approach": [
      "For a café or restaurant, I'd say which side of the river you're on in the first line, with a map and seasonal opening hours that stay accurate. For a boat trip or angling charter, online booking and a clear weather policy. For a holiday let, direct booking made easy. For a trade, a service area naming Polperro, Pelynt, Talland and Millendreath."
    ],
    "faqs": [
      {
        "q": "Do I need different opening hours on the site for winter?",
        "a": "You do, and on your Google Business Profile too. A locked door in November when Google says you're open costs you that customer and often a review. I'd set seasonal and holiday hours in both places and show you how to change them in a minute."
      },
      {
        "q": "Can a holiday let in Looe take bookings without the big listing sites?",
        "a": "It can take some. A site linked to your own calendar and booking system lets repeat guests book direct, so you avoid the commission on those stays; we'd agree the booking set-up at the start. A sensible split is to keep the listing sites for new guests and use your own site for people who already know you."
      },
      {
        "q": "Is it worth being found by people staying in Polperro?",
        "a": "Yes. Polperro is about four miles west and Pelynt about the same, so someone staying there who needs a plumber, a taxi or dinner may well search for Looe. A page that names those villages gives Google a reason to show you."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Newquay, https://en.wikipedia.org/wiki/Nansledan
  newquay: {
    "localHeading": "Websites for a town with two populations",
    "local": [
      "Newquay parish had 23,626 people at the 2021 census, and in summer the town can hold more than 100,000. Fistral may be the best known surf beach in Britain, Boardmasters brings around 50,000 people for one weekend in August, and the airport and the branch line from Par bring many more. Winter is a different town, and a business has to work in both.",
      "Newquay is also growing outwards. St Columb Minor, Porth, Crantock and Quintrell Downs are now counted as suburbs, and the Duchy of Cornwall's Nansledan is planned for up to 3,700 homes. So the customers are not all tourists. A plumber, a nursery or a hairdresser here serves a year-round population that searches for them in the same way."
    ],
    "approachHeading": "What I'd build for a Newquay business",
    "approach": [
      "For a surf school, I'd put lesson times, what's included, age limits and online booking on the first screen, with a note on what happens when the sea is flat or too big. For a café or bar, seasonal hours and a menu that loads on a weak signal. For a trade, a service area naming Porth, St Columb Minor, Quintrell Downs and Nansledan."
    ],
    "faqs": [
      {
        "q": "How do I keep work coming in over the winter?",
        "a": "Aim the site at both audiences. Summer pages speak to visitors, and winter pages speak to locals, with the services people in Newquay use all year. On the Growth plan I set up and look after your Google Business Profile, so it stays accurate through the quiet months."
      },
      {
        "q": "Should I build pages for each beach?",
        "a": "Only where you genuinely operate. A surf school working from Fistral should say so clearly, because people search by beach name. Thin copy-and-paste pages for every beach tend to do more harm than good, so I'd write fewer pages and make each one useful."
      },
      {
        "q": "Can the site handle a rush of bookings in August?",
        "a": "It can, if bookings go through a proper online system rather than a phone line, so the site takes them while you're in the water. We'd agree which booking system to use at the start. I design the site free and send you the home page as a private link first; hosting is £50 a month plus VAT."
      }
    ]
  },
  // Sources: https://en.wikipedia.org/wiki/Wadebridge, https://en.wikipedia.org/wiki/Camel_Trail, https://en.wikipedia.org/wiki/Egloshayle, https://en.wikipedia.org/wiki/Polzeath, https://www.cornwalls.co.uk/st-minver
  wadebridge: {
    "localHeading": "Websites for the town on the Camel",
    "local": [
      "Wadebridge grew around a bridge begun in 1468, five miles up the Camel from Padstow. The parish had 6,811 people at the 2021 census, and Molesworth Street has been pedestrianised since the bypass opened in 1991. The Camel Trail runs through town on the old railway line, and each June the Royal Cornwall Show fills the showground a mile and a half west for three days.",
      "The town sits between two quite different markets. To the north, St Minver's lowlands take in Rock and Polzeath, both busy with visitors, where holiday lets need cleaners, caterers and repairs between guests. Inland are the farms of St Kew, St Mabyn and St Breock. A Wadebridge firm may well serve both, and its website has to make sense to each."
    ],
    "approachHeading": "How I'd set up a Wadebridge site",
    "approach": [
      "For bike hire or a café on the Trail, I'd put opening times, prices and booking up front, with directions from the trail itself. For a trade, I'd list Egloshayle, St Minver, Rock, Polzeath, St Kew and St Mabyn as places you cover. A Royal Cornwall Show page that goes live in May earns its keep in June."
    ],
    "faqs": [
      {
        "q": "Can I win work from holiday let owners in Rock and Polzeath?",
        "a": "Yes. Polzeath is about six miles away, close enough to serve well. I'd give changeover, cleaning or maintenance its own page aimed at owners and agents, with the villages named. Growth, at £99 a month plus VAT after a one-off setup fee, includes the local SEO to support it."
      },
      {
        "q": "Does the Royal Cornwall Show matter for my website?",
        "a": "It can if you exhibit or your trade picks up around it. People planning a visit may look up stands and suppliers beforehand, so a page with your stand details, show offers and a way to get in touch afterwards makes three days last well beyond June."
      },
      {
        "q": "I've done fine on word of mouth. Why change now?",
        "a": "Word of mouth still works, but the person who hears your name will often check you on Google before ringing. If what they find is thin or out of date, the recommendation loses force. I'll design the site free and send the home page first; hosting is £50 a month plus VAT."
      }
    ]
  },
};
