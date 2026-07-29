// Reserved-color palette for the Fresh Greens case study, §6.
// Swatch hexes are the app's real reserved palette from theme/colors.ts.
// The 12 carve-outs are the documented reserved-color exceptions from the
// app's .cursorrules, grouped by color.

export type CarveOut = { tag: string; note: string };

export type ReservedLane = {
  family: "red" | "orange" | "yellow" | "navy" | "daylight";
  name: string;
  role: string;
  /** Solid hex for the four reserved colors; a CSS gradient for daylight. */
  swatch: string;
  carveOuts: CarveOut[];
};

export const RESERVED_LANES: ReservedLane[] = [
  {
    family: "red",
    name: "Red",
    role: "Alert",
    swatch: "#FF3B30",
    carveOuts: [
      {
        tag: "Live audio-capture indicator",
        note: "Active recording on /pulled-over.",
      },
      {
        tag: "Destructive-action labels",
        note: "Remove, unpublish, and sign-out.",
      },
      {
        tag: "Error copy on light",
        note: "Uses darker severityCritical for AA on light surfaces.",
      },
      {
        tag: "iOS red on dark auth",
        note: "Default red passes on the dark auth surface.",
      },
    ],
  },
  {
    family: "orange",
    name: "Orange",
    role: "Hazard · caution",
    swatch: "#FF9500",
    carveOuts: [
      {
        tag: "Community-report pin",
        note: "Separates community observations from institutional feeds.",
      },
      {
        tag: "Report FAB",
        note: "Uses the same orange for contributing back.",
      },
      {
        tag: "Route-preview hazard chips",
        note: "Police and low-light segments.",
      },
    ],
  },
  {
    family: "yellow",
    name: "Yellow",
    role: "Caution",
    swatch: "#FFCC00",
    carveOuts: [
      {
        tag: "General caution teardrops",
        note: "Map hazards and weather advisories.",
      },
      {
        tag: "Trusted-station gold star",
        note: "A documented carve-out from the caution role.",
      },
    ],
  },
  {
    family: "navy",
    name: "Navy",
    role: "Safety affordance",
    swatch: "#041E49",
    carveOuts: [
      {
        tag: "En-route Shield",
        note: "Marks safety mode itself and never describes data state or sync.",
      },
      {
        tag: "/emergency SOS disc",
        note: "Kept distinct from the destructive-action red.",
      },
    ],
  },
  {
    family: "daylight",
    name: "Daylight",
    role: "Route grade",
    swatch: "linear-gradient(135deg, #FFB347, #C4785A, #2D1B69)",
    carveOuts: [
      {
        tag: "Daylight polyline",
        note: "A solid, dashed, and dotted cadence carries the daylight score for WCAG 1.4.1.",
      },
    ],
  },
];
