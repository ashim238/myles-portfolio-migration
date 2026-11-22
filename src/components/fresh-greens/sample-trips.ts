import drawings from "./sample-route-geometry.json";
import { eveningCaptures } from "@/lib/fresh-greens/daylight-captures";

const native = "/projects/fresh-greens/daylight-key";

// Route times and lighting describe the saved iOS examples. The web map follows
// their streets on an offline OpenStreetMap extract, independent of device GPS.
export const sampleTrips = [
  {
    id: "brixton", name: "Windrush Square", area: "Brixton, London", street: "Sudbourne Road",
    light: "After dark", clock: "9:19", departureMinutes: 21 * 60 + 19,
    geometry: drawings.brixton, initialOption: 1,
    options: [
      { via: "Brixton Hill", minutes: 4, miles: "0.6" },
      { via: "Brixton Hill", minutes: 6, miles: "1.2" },
    ],
    preview: eveningCaptures + "/03-brixton-evening-preview.png",
  },
  {
    id: "weeksville", name: "Weeksville Heritage Center", area: "Brooklyn, New York", street: "Utica Avenue",
    light: "Daylight", clock: "12:57", departureMinutes: 12 * 60 + 57,
    geometry: drawings.weeksville, initialOption: 1,
    options: [
      { via: "Lincoln Place", minutes: 4, miles: "0.6" },
      { via: "Saint Johns Place", minutes: 5, miles: "0.6" },
    ],
    preview: native + "/01-weeksville-daylight-preview.png",
  },
] as const;

export type SampleTrip = (typeof sampleTrips)[number];

export function arrivalTime(trip: SampleTrip, optionIndex: number) {
  const minutes = trip.departureMinutes + trip.options[optionIndex].minutes;
  const hour = Math.floor(minutes / 60);
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
