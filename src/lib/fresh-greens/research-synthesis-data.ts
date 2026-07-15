// Anonymized synthesis from six semi-structured driver interviews. Participant
// names and identifying details (cities, businesses, family specifics) are
// deliberately stripped; snippets are lightly paraphrased from real responses.
// Ordered so the four routing markers come first, then the community-data bet.

export type Cluster = {
  key: "light" | "police" | "wildlife" | "road" | "community";
  label: string;
  raisedBy: number; // of six
  insight: string;
  snippets: string[];
  designResponse: string;
};

export const SYNTHESIS: Cluster[] = [
  {
    key: "light",
    label: "Light",
    raisedBy: 6,
    insight:
      "People time trips around daylight and read lighting as safety. It came up in every interview.",
    snippets: [
      "Always leaving in the morning.",
      "I wouldn't feel comfortable driving at night.",
      "The street lights were sparse.",
    ],
    designResponse: "The daylight-graded route",
  },
  {
    key: "police",
    label: "Police presence",
    raisedBy: 5,
    insight:
      "Police proximity is a live fear, managed with behaviors taught by family and community.",
    snippets: [
      "Biggest fear is interacting with police.",
      "If the app said there's cops here, we're going around that.",
      "Wallet out, phone out, everything visible.",
    ],
    designResponse: "Police presence in the route score",
  },
  {
    key: "wildlife",
    label: "Wildlife",
    raisedBy: 3,
    insight: "Deer at dusk reroute people off certain roads after dark.",
    snippets: [
      "Deer at night, so I'd avoid those roads once evening hit.",
      "Deer-heavy areas.",
    ],
    designResponse: "Wildlife warnings timed to dusk",
  },
  {
    key: "road",
    label: "Road conditions",
    raisedBy: 5,
    insight:
      "Road size, quality, and flooding change the route people are willing to take.",
    snippets: [
      "Narrow backroads that can't fit two cars.",
      "A lot of places get flooded.",
      "I cared about road size and road quality.",
    ],
    designResponse: "Road-condition markers along the route",
  },
  {
    key: "community",
    label: "Community knowledge",
    raisedBy: 5,
    insight:
      "Five of six Black drivers described asking family or friends about an unfamiliar place before trusting institutional data.",
    snippets: [
      "I'd listen to family over the statistic. The powers that be aren't honest.",
      "For a new area, I'd ask friends who'd been there.",
      "I'd call someone who's already at the spot.",
    ],
    designResponse: "Community reports weighted alongside public data",
  },
];

// Features drivers described, unprompted, that Fresh Greens went on to ship.
export type FeatureRequest = { asked: string; became: string };

export const FEATURE_REQUESTS: FeatureRequest[] = [
  {
    asked:
      "Show the gradient of light, bright where you are and dark where you arrive. Your projected light coverage.",
    became: "The daylight-graded route.",
  },
  {
    asked: "Poor road conditions highlighted along the route.",
    became: "The road-conditions marker.",
  },
  {
    asked: "If the app said there's cops here, we're going around that.",
    became: "Police presence in the route score.",
  },
];
