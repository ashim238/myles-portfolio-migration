export type NaviArchetype = {
  id: "cain" | "ororo" | "selina";
  name: string;
  need: string;
  productArea: string;
  scope: "Implemented" | "Future opportunity";
};

export type NaviJourneyStage = {
  id: "awareness" | "consideration" | "decision";
  label: string;
  action: string;
  productNeed: string;
};

export type NaviBookingStep = {
  id: "discover" | "detail" | "schedule" | "cost" | "confirm";
  label: string;
  detail: string;
};

export const NAVI_ARCHETYPES = [
  { id: "cain", name: "Cain", need: "Coordinate an activity around a group's needs.", productArea: "Group planning", scope: "Future opportunity" },
  { id: "ororo", name: "Ororo", need: "See what is happening in neighborhoods nearby.", productArea: "Neighborhood exploration", scope: "Implemented" },
  { id: "selina", name: "Selina", need: "Compare a shorter trip with precise filters.", productArea: "Search and filters", scope: "Implemented" },
] as const satisfies readonly NaviArchetype[];

export const NAVI_JOURNEY_STAGES = [
  { id: "awareness", label: "Awareness", action: "Look beyond the same tourist-heavy areas.", productNeed: "Nearby neighborhood context" },
  { id: "consideration", label: "Consideration", action: "Compare an activity, its host, timing, and requirements.", productNeed: "Details repeated at decision points" },
  { id: "decision", label: "Decision", action: "Review the full cost before confirming.", productNeed: "Transparent booking summary" },
] as const satisfies readonly NaviJourneyStage[];

export const NAVI_BOOKING_STEPS = [
  { id: "discover", label: "Neighborhood discovery", detail: "Start with a local area." },
  { id: "detail", label: "Activity detail", detail: "Review the host, activity, and requirements." },
  { id: "schedule", label: "Date and time", detail: "Choose an available session." },
  { id: "cost", label: "Cost review", detail: "See the total before committing." },
  { id: "confirm", label: "Confirmation", detail: "Keep the activity details and schedule together." },
] as const satisfies readonly NaviBookingStep[];
