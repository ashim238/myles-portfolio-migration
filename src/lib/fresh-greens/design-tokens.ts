// Token values copied 1:1 from the Fresh Greens app repo
// (theme/colors.ts and theme/spacing.ts), so the exhibit shows the real
// system rather than a screenshot of Figma.

export type ColorToken = { name: string; hex: string; role: string };

export const COLOR_TOKENS: ColorToken[] = [
  { name: "freshgreen", hex: "#41AD49", role: "primary CTA, in-flow links" },
  { name: "wiltedgreen", hex: "#326936", role: "secondary CTA, headers" },
  { name: "burntgreen", hex: "#003F04", role: "deep accents" },
  { name: "orange", hex: "#FF9500", role: "hazard" },
  { name: "red", hex: "#FF3B30", role: "alert" },
  { name: "yellow", hex: "#FFCC00", role: "caution" },
  { name: "navy", hex: "#041E49", role: "safety affordances" },
  { name: "surfacePage", hex: "#F4F4ED", role: "page, warm paper" },
  { name: "surfaceCard", hex: "#FEFDFB", role: "card surface" },
];

export type SpaceToken = { name: string; px: number };

// 4pt base ramp.
export const SPACING_TOKENS: SpaceToken[] = [
  { name: "xs", px: 4 },
  { name: "sm", px: 8 },
  { name: "md", px: 16 },
  { name: "lg", px: 24 },
  { name: "xl", px: 32 },
  { name: "xxl", px: 48 },
];
