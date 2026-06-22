import { EXPERIENCES, type Experience, type ImpactTheme } from "@/lib/navi/demo-data";

export type ImpactThemeMeta = {
  id: ImpactTheme;
  label: string;
  anchor: string;
};

// Declared order is the page order. Anchor equals id so cross-links can
// target /work/navi/demo/impact#<id>.
export const IMPACT_THEMES: ImpactThemeMeta[] = [
  { id: "heritage", label: "Heritage preservation", anchor: "heritage" },
  { id: "education", label: "Education and youth programs", anchor: "education" },
  { id: "food-security", label: "Food security", anchor: "food-security" },
  { id: "environment", label: "Environment and ecology", anchor: "environment" },
  { id: "arts-funding", label: "Arts funding", anchor: "arts-funding" },
];

export type ImpactSection = ImpactThemeMeta & {
  experiences: Experience[];
};

// Groups every experience under its theme, in IMPACT_THEMES order. Pure:
// derived entirely from EXPERIENCES, stable across calls.
export function getImpactSummary(): ImpactSection[] {
  return IMPACT_THEMES.map((theme) => ({
    ...theme,
    experiences: EXPERIENCES.filter((e) => e.impactTheme === theme.id),
  }));
}
