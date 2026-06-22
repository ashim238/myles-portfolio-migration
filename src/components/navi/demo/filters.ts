export type PriceBand = "any" | "under30" | "30to60" | "over60";
export type DurationBand = "any" | "under2h" | "halfDay" | "fullDay";
export type GroupBand = "any" | "solo" | "small" | "large";

export type Filters = {
  price: PriceBand;
  duration: DurationBand;
  group: GroupBand;
  languages: string[];
  neighborhoods: string[];
};

export const DEFAULT_FILTERS: Filters = {
  price: "any",
  duration: "any",
  group: "any",
  languages: [],
  neighborhoods: [],
};

export function activeCount(f: Filters): number {
  let n = 0;
  if (f.price !== "any") n += 1;
  if (f.duration !== "any") n += 1;
  if (f.group !== "any") n += 1;
  n += f.languages.length;
  n += f.neighborhoods.length;
  return n;
}
