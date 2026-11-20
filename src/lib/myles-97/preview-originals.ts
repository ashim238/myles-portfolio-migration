import type { FeaturedProjectId } from "./programs";
import { UF_ASSETS } from "@/lib/understandingfafsa-assets";
import { TIKTOK_TEMPLATES } from "@/lib/tiktok-data";

export type ArtSample = {
  label: string;
  detail: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  // Bounds in fractions of the displayed original. Both views use the same bounds.
  crop: readonly [number, number, number, number];
  full?: { src: string; width: number; height: number; read?: boolean };
  evening?: ArtSample;
};

const route = "/projects/fresh-greens/v2";
const mail = "/projects/understandingfafsa";
const places = "/projects/navi";

// Bounds were measured on the 430 × 932 point screen. The originals are the 3× native captures.
function routeCapture(label: string, detail: string, alt: string, filename: string,
  [x, y, w, h]: readonly [number, number, number, number]): ArtSample {
  return { label, detail, alt, src: "/projects/fresh-greens/daylight-key/" + filename + ".png",
    width: 1290, height: 2796, crop: [x / 430, y / 932, w / 430, h / 932] };
}

export const arrivalLightSamples: readonly ArtSample[] = [
  {
    ...routeCapture("Plan", "Daylight at arrival", "Weeksville Heritage Center via Saint Johns Place. Five minutes, 0.6 miles, arriving at 1:02 PM in daylight.",
      "01-weeksville-daylight-preview", [16, 637, 321, 122]),
    evening: routeCapture("Plan", "After dark at arrival", "The alternate route to Windrush Square via Brixton Hill takes seven minutes and arrives at 9:52 PM after dark.",
      "03-brixton-evening-preview", [16, 727, 290, 115]),
  },
  {
    ...routeCapture("Drive", "Daylight beside the ETA", "Active navigation shows a 1:02 daylight ETA, 0.6 miles and five minutes remaining.",
      "02-weeksville-daylight-navigation", [125, 730, 180, 103]),
    evening: routeCapture("Drive", "After dark beside the ETA", "Active navigation shows a 9:52 after-dark ETA, 1.2 miles and seven minutes remaining.",
      "04-brixton-evening-navigation", [118, 730, 194, 103]),
  },
  routeCapture("Map key", "Brixton map key", "The reopened map key beside the Brixton route shows a solid amber line for daylight, dashes for dusk and dots for after dark.",
    "05-brixton-navigation-key-reopened", [10, 516, 146, 141]),
];

function emailSample(after: boolean): ArtSample {
  const origin = after ? UF_ASSETS.mobileAfter : UF_ASSETS.mobileBefore;
  return {
    label: after ? "Redesign" : "Prior send", detail: "Opening headline",
    alt: after ? "Redesigned email opening with the question What is the Student Aid Index?" : "Earlier newsletter opening about a week of college funding chaos.",
    src: mail + "/display/mobile-" + (after ? "after" : "before") + "-opening.webp",
    width: origin.width, height: Math.ceil(origin.width * 1.25),
    crop: after ? [.05, .32, .9, .45] : [.04, .19, .93, .25],
    full: { src: origin.originalSrc, width: origin.width, height: origin.height, read: true },
  };
}

export const projectSamples: Record<FeaturedProjectId, readonly ArtSample[]> = {
  "fresh-greens": [
    ...arrivalLightSamples,
    { label: "Support", detail: "Support options", alt: "The four choices in the Fresh Greens safety toolkit.", src: route + "/safety-toolkit.png", width: 1290, height: 2796, crop: [.025, .19, .95, .395] },
  ],
  understandingfafsa: [
    emailSample(true), emailSample(false),
    { label: "Mailchimp", detail: "Prompt module", alt: "The Give One Prompt a Try section in the built email.", src: mail + "/shipped-mailchimp.jpg", width: 1290, height: 1612, crop: [.04, .02, .92, .38] },
  ],
  navi: [
    { label: "Discover", detail: "Handpicked activities", alt: "Navi discovery page with activity cards.", src: places + "/flow-view-3.png", width: 2715, height: 1810, crop: [.04, .212, .246, .291] },
    { label: "Search", detail: "First search result", alt: "Experience search results next to their locations on the map.", src: places + "/flow-view-1.png", width: 2468, height: 1646, crop: [.01, .116, .572, .365] },
    { label: "Activity", detail: "Reservation options", alt: "The Prospect Park activity listing and reservation panel.", src: places + "/flow-view-2.png", width: 3504, height: 2342, crop: [.572, .26, .124, .178] },
  ],
  tiktok: [...TIKTOK_TEMPLATES].sort((a,b) => Number(b.launchLibraryStatus === "confirmed") - Number(a.launchLibraryStatus === "confirmed")).map(t => {
    const title = "title" in t.regionOverlays ? t.regionOverlays.title : undefined;
    const box = title ?? t.regionOverlays.catalog;
    const pad = .035;
    return {
      label: {lightacademia: "Academia", dopamine: "Dopamine", eboy: "e-Boy/e-Girl"}[t.key],
      detail: title ? (t.key === "lightacademia" ? "Style Zine masthead" : "Fit Check lettering") : "Catalog slot",
      alt: t.name + " original fashion catalog template.", src: t.fullTemplate, width: 1080, height: 1920,
      crop: [box.left / 100 - pad, box.top / 100 - pad, box.width / 100 + pad * 2, box.height / 100 + pad * 2],
    };
  }),
};
