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
        note: "A pulsing dot for the active recording state on /pulled-over.",
      },
      {
        tag: "Destructive-action labels",
        note: "Remove, unpublish, and sign-out.",
      },
      {
        tag: "Error copy on light",
        note: "Swaps to the darker severityCritical token for AA (~5.6:1 vs red's ~3.5:1).",
      },
      {
        tag: "iOS red on dark auth",
        note: "The contrast argument inverts, so default red passes there.",
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
        note: "Marks community observations apart from the institutional feeds.",
      },
      {
        tag: "Report FAB",
        note: "The same orange — the contribute-back affordance.",
      },
      {
        tag: "Route-preview hazard chips",
        note: "Police presence and low-light segments.",
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
        note: "Safety mode itself; never data state or sync.",
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
    role: "Gradient",
    swatch: "linear-gradient(135deg, #FFB347, #C4785A, #2D1B69)",
    carveOuts: [
      {
        tag: "Daylight polyline",
        note: "Color IS the data — a per-segment daylight score. A solid → dashed → dotted cadence carries it for WCAG 1.4.1.",
      },
    ],
  },
];
