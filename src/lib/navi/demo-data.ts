export type TransitOption = {
  mode: "subway" | "citibike" | "walk";
  label: string;
  detail: string;
};

export type BookingDate = { date: string; time: string };

export type Experience = {
  slug: string;
  title: string;
  category: string;
  tone: "neutral" | "popular" | "local";
  neighborhood: string;
  borough: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  reviews: number;
  host: { name: string };
  photos: { src: string; alt: string }[];
  impactPhrase: string;
  impactStatement: string;
  learn: string;
  plan: { bring: string; commitments: string; impactDetail: string };
  go: { addressLine1: string; addressLine2: string; transit: TransitOption[] };
  dates: BookingDate[];
};

export const CATEGORIES = [
  "Arts & Culture",
  "Community",
  "Cooking",
  "Architecture",
] as const;

// IMPLEMENTER: replace the seed content with real Figma copy and photo URLs
// extracted from nYimRBXiOSyDbTfAJ4gk8G (node 1860:1529 for cards, 2768:55607
// for detail content). Photo assets export to public/projects/navi-demo/.

export const EXPERIENCES: Experience[] = [
  {
    slug: "prospect-park-carriage",
    title: "Discover Prospect Park by horse-drawn carriage",
    category: "Community",
    tone: "local",
    neighborhood: "Park Slope",
    borough: "Brooklyn",
    lat: 40.6602,
    lng: -73.969,
    price: 48,
    rating: 4.9,
    reviews: 213,
    host: { name: "Paul Stein" },
    photos: [
      { src: "/projects/navi-demo/prospect-tunnel.jpg", alt: "Sunlit tunnel in Prospect Park" },
      { src: "/projects/navi-demo/prospect-trees.jpg", alt: "Autumn trees along the park drive" },
      { src: "/projects/navi-demo/prospect-carriage.jpg", alt: "Horse-drawn carriage with passengers" },
      { src: "/projects/navi-demo/prospect-pond.jpg", alt: "Pond at the edge of Prospect Park" },
    ],
    impactPhrase: "Funds Prospect Park tree care",
    impactStatement:
      "A share of every ride funds the Prospect Park Alliance's tree care program, which maintains the park's 30,000 trees year-round.",
    learn:
      "See the beautiful, historic, and scenic Prospect Park in a two-hour-long carriage ride that takes you through every inch of park grounds. Variation and drinks provided.",
    plan: {
      bring: "Comfortable shoes, a layer for shade, and a refillable water bottle.",
      commitments: "Arrive ten minutes before the start time. Reschedule with twenty-four hours notice.",
      impactDetail:
        "Each ride contributes to the Prospect Park Alliance's tree care program. Operators are paid a living wage and the route is reviewed quarterly for animal welfare.",
    },
    go: {
      addressLine1: "On the corner of",
      addressLine2: "Union Street and 8th Avenue, Brooklyn, New York NY 11215",
      transit: [
        { mode: "subway", label: "Take the", detail: "Q or R" },
        { mode: "citibike", label: "Grab a Citibike", detail: "0.2 miles away" },
        { mode: "walk", label: "Walk", detail: "30 min from Grand Army Plaza" },
      ],
    },
    dates: [
      { date: "Monday, March 23", time: "12:00 pm" },
      { date: "Tuesday, March 24", time: "12:00 pm" },
      { date: "Thursday, March 26", time: "12:00 pm" },
    ],
  },
  {
    slug: "dancehall-brooklyn-junction",
    title: "Dancehall Day Party in Brooklyn Junction",
    category: "Community",
    tone: "popular",
    neighborhood: "East Flatbush",
    borough: "Brooklyn",
    lat: 40.6478,
    lng: -73.9286,
    price: 19,
    rating: 4.7,
    reviews: 138,
    host: { name: "Yvette Bryan" },
    photos: [
      { src: "/projects/navi-demo/dancehall-1.jpg", alt: "Dancers at a Brooklyn day party" },
      { src: "/projects/navi-demo/dancehall-2.jpg", alt: "DJ setup at sunset" },
    ],
    impactPhrase: "Pays Caribbean-owned venues directly",
    impactStatement:
      "Every ticket flows directly to the Caribbean-owned venues and DJs hosting the event, with no platform middlemen.",
    learn:
      "An afternoon dancehall set hosted by long-standing Brooklyn Junction operators. All ages, all neighborhoods welcome.",
    plan: {
      bring: "Comfortable shoes you can dance in. Cash for the food vendors.",
      commitments: "Honor the venue's neighborhood-quiet policy after 9 pm.",
      impactDetail:
        "100 percent of ticket revenue goes to the venue. Navi takes zero booking fee on community-tagged events.",
    },
    go: {
      addressLine1: "1180 Flatbush Avenue",
      addressLine2: "Brooklyn, New York NY 11226",
      transit: [
        { mode: "subway", label: "Take the", detail: "Q or 2" },
        { mode: "walk", label: "Walk", detail: "8 min from Beverley Rd" },
      ],
    },
    dates: [
      { date: "Saturday, March 28", time: "3:00 pm" },
      { date: "Saturday, April 4", time: "3:00 pm" },
    ],
  },
  {
    slug: "bedstuy-bracelet-making",
    title: "Hand-forged bracelet-making experience",
    category: "Arts & Culture",
    tone: "neutral",
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    lat: 40.6872,
    lng: -73.9418,
    price: 65,
    rating: 4.95,
    reviews: 87,
    host: { name: "Iman Reeves" },
    photos: [
      { src: "/projects/navi-demo/bracelet-1.jpg", alt: "Hands shaping a metal bracelet" },
      { src: "/projects/navi-demo/bracelet-2.jpg", alt: "Workshop tools laid out" },
    ],
    impactPhrase: "Supports a Black-owned Bed-Stuy workshop",
    impactStatement:
      "Each booking sustains a Black-owned jewelry workshop in Bed-Stuy that trains apprentices from the neighborhood.",
    learn:
      "A two-hour metalwork session with a third-generation Bed-Stuy jeweler. You leave with a finished piece.",
    plan: {
      bring: "Closed-toe shoes and a layer you do not mind getting a little sooty.",
      commitments: "Apprentices may be on-shift; respect their workflow.",
      impactDetail:
        "Booking revenue funds a six-month neighborhood apprenticeship program and tool maintenance for the studio.",
    },
    go: {
      addressLine1: "Tompkins Avenue near Halsey Street",
      addressLine2: "Brooklyn, New York NY 11216",
      transit: [
        { mode: "subway", label: "Take the", detail: "A or C" },
        { mode: "walk", label: "Walk", detail: "5 min from Utica Ave" },
      ],
    },
    dates: [
      { date: "Wednesday, April 1", time: "6:30 pm" },
      { date: "Saturday, April 4", time: "11:00 am" },
    ],
  },
  {
    slug: "dumbo-industrial-architecture-walk",
    title: "DUMBO Industrial Architecture Walking Tour",
    category: "Architecture",
    tone: "local",
    neighborhood: "DUMBO",
    borough: "Brooklyn",
    lat: 40.7033,
    lng: -73.9881,
    price: 35,
    rating: 4.8,
    reviews: 162,
    host: { name: "Carlos Mendes" },
    photos: [
      { src: "/projects/navi-demo/dumbo-bridge.jpg", alt: "Manhattan Bridge framed by cobblestone streets" },
      { src: "/projects/navi-demo/dumbo-warehouse.jpg", alt: "Cast-iron warehouse facade in DUMBO" },
    ],
    impactPhrase: "Preserves DUMBO's industrial heritage",
    impactStatement:
      "Tour fees directly fund the DUMBO Improvement District's archival and preservation work on the neighborhood's remaining nineteenth-century warehouse structures.",
    learn:
      "A ninety-minute guided walk through DUMBO's cobblestone blocks led by a practicing architect. Learn how the neighborhood's cast-iron warehouses survived the waterfront's transformation into a tech hub, and what the ongoing zoning fights mean for what remains.",
    plan: {
      bring: "Comfortable walking shoes — the cobblestones are uneven. A camera is encouraged.",
      commitments: "Tours run rain or shine. Minimum group of four; cap of twelve.",
      impactDetail:
        "Revenue funds the archival photography and oral history project documenting DUMBO's remaining industrial-era structures.",
    },
    go: {
      addressLine1: "Under the Manhattan Bridge overpass,",
      addressLine2: "Washington Street at Water Street, Brooklyn, NY 11201",
      transit: [
        { mode: "subway", label: "Take the", detail: "A, C, or F to Jay St" },
        { mode: "walk", label: "Walk", detail: "12 min from Jay St–MetroTech" },
      ],
    },
    dates: [
      { date: "Sunday, March 29", time: "10:00 am" },
      { date: "Sunday, April 5", time: "10:00 am" },
    ],
  },
  {
    slug: "sunset-park-night-market",
    title: "Sunset Park Night Market",
    category: "Community",
    tone: "popular",
    neighborhood: "Sunset Park",
    borough: "Brooklyn",
    lat: 40.6459,
    lng: -74.0047,
    price: 12,
    rating: 4.6,
    reviews: 291,
    host: { name: "Rosa Huang" },
    photos: [
      { src: "/projects/navi-demo/sunsetpark-market-1.jpg", alt: "Street food stalls lit up at night in Sunset Park" },
      { src: "/projects/navi-demo/sunsetpark-market-2.jpg", alt: "Vendors serving hot food to a crowd" },
    ],
    impactPhrase: "Pays vendors full stall revenue",
    impactStatement:
      "Every ticket is a donation; all stall revenue goes directly to the participating small businesses — mostly immigrant-owned and family-run.",
    learn:
      "A weekly evening market in the heart of Sunset Park's Chinatown-Latin corridor. Fifty vendors, live music, and the best dollar dumplings in Brooklyn.",
    plan: {
      bring: "Cash preferred by most vendors. Reusable bag for takeaway.",
      commitments: "Entry ticket is a suggested donation — no one turned away for lack of funds.",
      impactDetail:
        "The market is organized as a cooperative. All stall revenue stays with the vendors. Organizing costs are funded separately by a neighborhood foundation.",
    },
    go: {
      addressLine1: "Eighth Avenue between 54th and 56th Streets,",
      addressLine2: "Brooklyn, NY 11220",
      transit: [
        { mode: "subway", label: "Take the", detail: "N or R to 53rd St" },
        { mode: "walk", label: "Walk", detail: "3 min" },
      ],
    },
    dates: [
      { date: "Friday, March 27", time: "6:00 pm" },
      { date: "Friday, April 3", time: "6:00 pm" },
    ],
  },
  {
    slug: "bedstuy-soul-food-cooking",
    title: "Bed-Stuy Soul Food Cooking Class",
    category: "Cooking",
    tone: "local",
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    lat: 40.6828,
    lng: -73.9385,
    price: 75,
    rating: 4.9,
    reviews: 54,
    host: { name: "Delores Washington" },
    photos: [
      { src: "/projects/navi-demo/soulfood-kitchen.jpg", alt: "Cast iron pans on a home stove" },
      { src: "/projects/navi-demo/soulfood-spread.jpg", alt: "Finished dishes laid out on a table" },
    ],
    impactPhrase: "Preserves a three-generation family recipe archive",
    impactStatement:
      "Delores has spent twenty years transcribing her grandmother's handwritten recipe cards. Every class booking contributes to digitizing and publishing that archive for the community.",
    learn:
      "A three-hour hands-on cooking class in Delores's Bed-Stuy home kitchen. Learn to make cornbread, collard greens, and smothered chicken from scratch. You'll eat what you cook.",
    plan: {
      bring: "An apron if you have one. All ingredients and equipment provided.",
      commitments: "Classes are capped at six people to keep it intimate. Let Delores know about any dietary restrictions in advance.",
      impactDetail:
        "Booking fees fund the digitization and publication of a three-generation soul food recipe archive from a Bed-Stuy family.",
    },
    go: {
      addressLine1: "Shared after booking confirmation,",
      addressLine2: "Bedford-Stuyvesant, Brooklyn, NY 11233",
      transit: [
        { mode: "subway", label: "Take the", detail: "A or C to Utica Ave" },
        { mode: "walk", label: "Walk", detail: "7 min" },
      ],
    },
    dates: [
      { date: "Saturday, March 28", time: "11:00 am" },
      { date: "Saturday, April 4", time: "11:00 am" },
    ],
  },
  {
    slug: "greenpoint-mural-walk",
    title: "Greenpoint Mural Walk",
    category: "Arts & Culture",
    tone: "popular",
    neighborhood: "Greenpoint",
    borough: "Brooklyn",
    lat: 40.7285,
    lng: -73.9493,
    price: 22,
    rating: 4.75,
    reviews: 109,
    host: { name: "Marta Kowalski" },
    photos: [
      { src: "/projects/navi-demo/greenpoint-mural-1.jpg", alt: "Large-scale mural on a warehouse wall in Greenpoint" },
      { src: "/projects/navi-demo/greenpoint-mural-2.jpg", alt: "Muralist talking to a tour group" },
    ],
    impactPhrase: "Pays muralists a fair commission",
    impactStatement:
      "Tour fees are split directly with the artists whose work you see. No gallery cut, no middleman.",
    learn:
      "A two-hour walking tour of Greenpoint's outdoor mural scene led by a local artist. Meet two working muralists and hear how the neighborhood's Polish heritage shows up — and disappears — in the public art.",
    plan: {
      bring: "Comfortable shoes. The walk covers about two miles on flat sidewalks.",
      commitments: "Group size capped at ten. Photos of the murals are encouraged; photos of private property are not.",
      impactDetail:
        "Fifty percent of ticket revenue goes directly to the featured artists. The other fifty funds the organizing collective's next commission.",
    },
    go: {
      addressLine1: "Corner of Manhattan Avenue and Greenpoint Avenue,",
      addressLine2: "Brooklyn, NY 11222",
      transit: [
        { mode: "subway", label: "Take the", detail: "G to Greenpoint Ave" },
        { mode: "walk", label: "Walk", detail: "2 min" },
      ],
    },
    dates: [
      { date: "Sunday, March 29", time: "1:00 pm" },
      { date: "Saturday, April 4", time: "1:00 pm" },
    ],
  },
  {
    slug: "harlem-brownstone-walking-tour",
    title: "Harlem Brownstone Architecture Tour",
    category: "Architecture",
    tone: "neutral",
    neighborhood: "Central Harlem",
    borough: "Manhattan",
    lat: 40.8116,
    lng: -73.9465,
    price: 40,
    rating: 4.85,
    reviews: 77,
    host: { name: "James Okafor" },
    photos: [
      { src: "/projects/navi-demo/harlem-brownstone-1.jpg", alt: "Row of brownstone stoops in Harlem" },
      { src: "/projects/navi-demo/harlem-brownstone-2.jpg", alt: "Detail of carved brownstone facade" },
    ],
    impactPhrase: "Supports the Harlem Brownstone Conservancy",
    impactStatement:
      "Tour proceeds support the Harlem Brownstone Conservancy, which provides pro bono legal and architectural assistance to homeowners facing displacement.",
    learn:
      "A ninety-minute walking tour of Harlem's Victorian-era brownstone blocks with architect and longtime Harlem resident James Okafor. Covers the architectural history, the redlining era, and the current preservation battles reshaping the neighborhood.",
    plan: {
      bring: "Comfortable shoes. Binoculars optional but helpful for looking at upper-floor details.",
      commitments: "Tours start on time. Arrive at the meeting point five minutes early.",
      impactDetail:
        "All proceeds fund the Harlem Brownstone Conservancy's pro bono legal and architectural assistance program for at-risk homeowners.",
    },
    go: {
      addressLine1: "Meeting point: corner of 120th Street and Malcolm X Boulevard,",
      addressLine2: "Manhattan, NY 10027",
      transit: [
        { mode: "subway", label: "Take the", detail: "2 or 3 to 116th St" },
        { mode: "walk", label: "Walk", detail: "5 min north" },
      ],
    },
    dates: [
      { date: "Saturday, March 28", time: "10:00 am" },
      { date: "Saturday, April 4", time: "10:00 am" },
    ],
  },
  {
    slug: "astoria-greek-baking",
    title: "Greek Pastry Baking Class in Astoria",
    category: "Cooking",
    tone: "popular",
    neighborhood: "Astoria",
    borough: "Queens",
    lat: 40.7721,
    lng: -73.9301,
    price: 68,
    rating: 4.88,
    reviews: 134,
    host: { name: "Eleni Papadopoulos" },
    photos: [
      { src: "/projects/navi-demo/greek-baking-1.jpg", alt: "Hands rolling phyllo dough" },
      { src: "/projects/navi-demo/greek-baking-2.jpg", alt: "Tray of freshly baked baklava" },
    ],
    impactPhrase: "Keeps an Astoria family bakery running",
    impactStatement:
      "Eleni's family has run a Greek pastry shop in Astoria for forty years. Booking a class directly funds the shop's operating costs as foot traffic declines.",
    learn:
      "Learn to make spanakopita, tiropita, and baklava from scratch in a three-hour class inside a working Astoria bakery. Eleni's family has been making these recipes since her grandmother brought them from Thessaloniki.",
    plan: {
      bring: "An apron. Everything else — ingredients, equipment, and coffee — is provided.",
      commitments: "Classes capped at eight. Advance booking only; no walk-ins.",
      impactDetail:
        "Class fees cover operating costs for the family bakery and fund Eleni's recipe-translation project, converting forty years of handwritten Greek recipes into a bilingual cookbook.",
    },
    go: {
      addressLine1: "31-10 Ditmars Boulevard,",
      addressLine2: "Astoria, Queens, NY 11105",
      transit: [
        { mode: "subway", label: "Take the", detail: "N or W to Ditmars Blvd" },
        { mode: "walk", label: "Walk", detail: "4 min" },
      ],
    },
    dates: [
      { date: "Sunday, March 29", time: "11:00 am" },
      { date: "Sunday, April 5", time: "11:00 am" },
    ],
  },
  {
    slug: "bronx-bodega-heritage-tour",
    title: "South Bronx Bodega Heritage Tour",
    category: "Community",
    tone: "local",
    neighborhood: "Mott Haven",
    borough: "Bronx",
    lat: 40.8093,
    lng: -73.9272,
    price: 25,
    rating: 4.72,
    reviews: 66,
    host: { name: "Luis Reyes" },
    photos: [
      { src: "/projects/navi-demo/bodega-1.jpg", alt: "Colorful bodega storefront in Mott Haven" },
      { src: "/projects/navi-demo/bodega-2.jpg", alt: "Owner behind the counter of a family bodega" },
    ],
    impactPhrase: "Connects visitors directly to bodega owners",
    impactStatement:
      "Every tour fee is shared equally among the five participating bodega owners, none of whom charge Navi any booking commission.",
    learn:
      "A two-hour walking tour of five family-run bodegas in Mott Haven and Port Morris with community organizer Luis Reyes. Learn the history of the Puerto Rican and Dominican-owned corner stores that have served the South Bronx through disinvestment, gentrification, and pandemic closures.",
    plan: {
      bring: "Cash to support the bodegas directly — you'll have time to shop at each stop.",
      commitments: "The tour moves at a relaxed pace. No mobility barriers — all stops are street-level.",
      impactDetail:
        "Tour fees are split equally among the five participating bodega owners. Luis organizes the tours as a volunteer; his compensation comes from the owners' association he helped found.",
    },
    go: {
      addressLine1: "Meeting point: Third Avenue Bridge, Mott Haven side,",
      addressLine2: "Bronx, NY 10454",
      transit: [
        { mode: "subway", label: "Take the", detail: "6 to 3rd Ave–138th St" },
        { mode: "walk", label: "Walk", detail: "6 min to bridge" },
      ],
    },
    dates: [
      { date: "Saturday, March 28", time: "2:00 pm" },
      { date: "Saturday, April 4", time: "2:00 pm" },
    ],
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.slug === slug);
}

export function tagLabelFor(e: Experience): string {
  if (e.tone === "local") return "Locally-owned";
  if (e.tone === "popular") return "Popular";
  return e.category;
}
