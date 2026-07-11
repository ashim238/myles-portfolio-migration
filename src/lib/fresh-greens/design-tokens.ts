// Token values copied 1:1 from the Fresh Greens app repo
// (theme/colors.ts and theme/spacing.ts), so the exhibit shows the real
// system rather than a screenshot of Figma. Colors are grouped by the job
// they do, which mirrors the reserved-color story: green carries the work,
// four hues are held for safety signals, and two warm surfaces sit under it.

export type ColorToken = { name: string; hex: string; role: string };
export type ColorGroup = { key: string; label: string; tokens: ColorToken[] };

export const COLOR_GROUPS: ColorGroup[] = [
  {
    key: "brand",
    label: "Green carries the work",
    tokens: [
      { name: "freshgreen", hex: "#41AD49", role: "primary CTA, in-flow links" },
      { name: "wiltedgreen", hex: "#326936", role: "secondary CTA, headers" },
      { name: "burntgreen", hex: "#003F04", role: "deep accents" },
    ],
  },
  {
    key: "signal",
    label: "Four reserved safety signals",
    tokens: [
      { name: "orange", hex: "#FF9500", role: "hazard" },
      { name: "red", hex: "#FF3B30", role: "alert" },
      { name: "yellow", hex: "#FFCC00", role: "caution" },
      { name: "navy", hex: "#041E49", role: "safety affordances" },
    ],
  },
  {
    key: "surface",
    label: "Warm surfaces",
    tokens: [
      { name: "surfacePage", hex: "#F4F4ED", role: "page, warm paper" },
      { name: "surfaceCard", hex: "#FEFDFB", role: "card surface" },
    ],
  },
];

// Flattened, in case another surface wants the raw list.
export const COLOR_TOKENS: ColorToken[] = COLOR_GROUPS.flatMap((g) => g.tokens);

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
