/**
 * Navi design tokens — single source of truth.
 * Two-tier: brand primitives -> semantic aliases. Components reference
 * semantic tokens (emitted as CSS vars under .nv-ui in globals.css).
 * Validate exact values against Figma nYimRBXiOSyDbTfAJ4gk8G during execution.
 */

export const NAVI_PRIMITIVES = {
  darwin: "#F3722C", // brand orange — decorative/large fills only
  gumball: "#3A86FF", // brand blue
  robinson: "#4A414D", // brand neutral (dark)
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const NAVI_SEMANTIC = {
  // interactive: darkened orange that clears AA (white-on-action = 4.54)
  action: "#C4541A",
  actionStrong: "#9E3F0B", // selected/pressed pin + emphasis
  surface: "#FFFFFF",
  surfaceMuted: "#F5F5F5",
  textDefault: "#2B2B2B",
  textMuted: "#5A5560",
  border: "#E2E0E3",
  focus: "#9E3F0B", // = action-strong; the 6.07:1 ring the product paints (--nv-focus)
  error: "#C2371F", // replaces off-palette red asterisk
  info: "#3A86FF", // replaces off-palette purple help icon (use brand blue)
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

export const NAVI_RADII = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  pill: "999px",
} as const;

export const NAVI_TYPE = {
  display: { family: "Jost, system-ui, sans-serif", weight: 700, size: "2rem", line: 1.1 },
  title: { family: "Jost, system-ui, sans-serif", weight: 500, size: "1.25rem", line: 1.3 },
  body: { family: "Lato, system-ui, sans-serif", weight: 400, size: "1rem", line: 1.55 },
  caption: { family: "Lato, system-ui, sans-serif", weight: 400, size: "0.85rem", line: 1.4 },
} as const;

/** WCAG 2.1 relative-luminance contrast ratio between two hex colors. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string): number => {
    const h = hex.replace("#", "");
    const ch = [0, 2, 4].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
