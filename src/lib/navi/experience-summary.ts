import type { Experience } from "@/lib/navi/demo-data";

export type ExperienceSummary = Pick<
  Experience,
  | "slug"
  | "title"
  | "category"
  | "tone"
  | "neighborhood"
  | "borough"
  | "lat"
  | "lng"
  | "price"
  | "rating"
  | "reviews"
  | "impactPhrase"
  | "duration"
  | "groupSize"
  | "language"
  | "photos"
>;

export function toExperienceSummary(experience: Experience): ExperienceSummary {
  const {
    slug,
    title,
    category,
    tone,
    neighborhood,
    borough,
    lat,
    lng,
    price,
    rating,
    reviews,
    impactPhrase,
    duration,
    groupSize,
    language,
    photos,
  } = experience;

  return {
    slug,
    title,
    category,
    tone,
    neighborhood,
    borough,
    lat,
    lng,
    price,
    rating,
    reviews,
    impactPhrase,
    duration,
    groupSize,
    language,
    photos: photos.slice(0, 1),
  };
}
