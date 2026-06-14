/** Navi design tokens — validate against Figma file nYimRBXiOSyDbTfAJ4gk8G */

export const NAVI_COLORS = {
  darwin: "#F3722C",
  gumball: "#3A86FF",
  robinson: "#4A414D",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const NAVI_SPACING = [
  { token: "3xs", px: 2 },
  { token: "2xs", px: 4 },
  { token: "xs", px: 8 },
  { token: "sm", px: 12 },
  { token: "md", px: 16 },
  { token: "lg", px: 24 },
  { token: "xl", px: 32 },
  { token: "2xl", px: 64 },
  { token: "3xl", px: 128 },
] as const;

export const NAVI_TYPE_SAMPLES = [
  { family: "Jost", weight: 700, label: "Display Bold", sample: "Neighborhood-led travel" },
  { family: "Jost", weight: 500, label: "Display Medium", sample: "Learn · Plan · Go" },
  { family: "Jost", weight: 400, label: "Display Regular", sample: "Welcome to Manhattan" },
  { family: "Lato", weight: 700, label: "UI Bold", sample: "Locally owned" },
  { family: "Lato", weight: 400, label: "UI Regular", sample: "Curated for your mood today" },
  { family: "Lato", weight: 400, label: "UI Caption", sample: "14px · Supporting copy" },
] as const;

export const NAVI_BUTTON_VARIANTS = ["primary", "transparent", "outline"] as const;
export const NAVI_BUTTON_STATES = ["default", "hover", "disabled", "focus"] as const;

export const NAVI_TAB_STATES = ["selected", "unselected"] as const;
export const NAVI_TAB_INTERACTIONS = ["default", "hover", "focus", "disabled"] as const;

export const NAVI_FORM_STATES = ["default", "error", "success"] as const;
