export const AESTHETICS = [
  {
    key: "dopamine",
    name: "#DopamineDressing",
    palette: [
      { hex: "#1323C2", label: "Medium Blue" },
      { hex: "#74F0ED", label: "Electric Blue" },
      { hex: "#FF5576", label: "Bright Pink" },
    ],
  },
  {
    key: "eboy",
    name: "#e-Boy/#e-Girl",
    palette: [
      { hex: "#141414", label: "Night" },
      { hex: "#313539", label: "Onyx" },
      { hex: "#6F7172", label: "Dim Gray" },
    ],
  },
  {
    key: "lightacademia",
    name: "#LightAcademia",
    palette: [
      { hex: "#141414", label: "Night" },
      { hex: "#EDC4AC", label: "Desert Sand" },
      { hex: "#F7F7F7", label: "Seasalt" },
    ],
  },
] as const;

export type TikTokTemplate = {
  key: "dopamine" | "eboy" | "lightacademia";
  name: "#DopamineDressing" | "#e-Boy/#e-Girl" | "#LightAcademia";
  fullTemplate: string;
  fullTemplateSource: string;
  sketch: string;
  sketchWidth: number;
  sketchHeight: number;
  launchLibraryStatus: "confirmed" | "unknown";
  palette: readonly { hex: string; label: string }[];
  iterationNote: string;
  regionOverlays: Partial<Record<TikTokTemplateRegion, TikTokRegionBox>>;
  regionNotes: { catalog: string; title?: string; supporting?: string };
  componentAssets: readonly {
    src: string;
    label: string;
    region: TikTokTemplateRegion;
    detail?: { previewSrc?: string; alt: string; width: number; height: number };
  }[];
};

export type TikTokTemplateRegion = "title" | "catalog" | "supporting";

export type TikTokRegionBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const LIGHT_ACADEMIA_TITLE = {
  src: "/projects/tiktok/system/academia-text.svg",
  detail: {
    previewSrc: "/projects/tiktok/system/academia-text-detail.svg",
    alt: "Light Academia editorial title asset",
    width: 388,
    height: 268,
  },
} as const;

export const TIKTOK_TEMPLATES = [
  {
    key: "dopamine",
    name: "#DopamineDressing",
    fullTemplate: "/projects/tiktok/system/dopamine.webp",
    fullTemplateSource: "/projects/tiktok/system/dopamine.svg",
    sketch: "/projects/tiktok/lofi-dopamine.png",
    sketchWidth: 1427,
    sketchHeight: 865,
    launchLibraryStatus: "unknown",
    palette: AESTHETICS[0].palette,
    iterationNote:
      "The sketch explores brand colors and copy such as #OOTD. I rejected the direction once the copy felt like it was trying too hard to belong and the visuals felt too TikTok-branded.",
    regionOverlays: {
      title: { left: 19.81, top: 12.71, width: 49.54, height: 5.94 },
      catalog: { left: 12.45, top: 19.18, width: 64.48, height: 41.97 },
    },
    regionNotes: {
      title: "“FIT CHECK” sits just above the photo. The black shadow keeps the white letters legible against the blue and teal.",
      catalog: "The brand’s product photo goes inside the pink frame below “FIT CHECK.”",
    },
    componentAssets: [
      {
        src: "/projects/tiktok/system/dopamine-title.svg",
        label: "Original title asset",
        region: "title",
        detail: { alt: "FIT CHECK title artwork", width: 515, height: 95 },
      },
    ],
  },
  {
    key: "eboy",
    name: "#e-Boy/#e-Girl",
    fullTemplate: "/projects/tiktok/system/eboy.webp",
    fullTemplateSource: "/projects/tiktok/system/eboy.svg",
    sketch: "/projects/tiktok/lofi-eboy.png",
    sketchWidth: 1637,
    sketchHeight: 865,
    launchLibraryStatus: "unknown",
    palette: AESTHETICS[1].palette,
    iterationNote:
      "The notes warned that the direction might stray too far from the guidelines. I was asked to build it out and find a way to make the nearly colorless treatment appealing.",
    regionOverlays: {
      catalog: { left: 11.11, top: 13.33, width: 66.67, height: 48.33 },
    },
    regionNotes: {
      catalog: "The gray panel is where the product photo goes. A strip of tape overlaps its upper-right corner, and the space above it has no headline.",
    },
    componentAssets: [],
  },
  {
    key: "lightacademia",
    name: "#LightAcademia",
    fullTemplate: "/projects/tiktok/system/academia.webp",
    fullTemplateSource: "/projects/tiktok/system/academia.svg",
    sketch: "/projects/tiktok/lofi-light-academia.png",
    sketchWidth: 4393,
    sketchHeight: 2741,
    launchLibraryStatus: "confirmed",
    palette: AESTHETICS[2].palette,
    iterationNote:
      "The sketch records the internal critique that shaped the final Light Academia direction.",
    regionOverlays: {
      // The four-line masthead occupies x660–949, y264–343 on the 1080 × 1920 export.
      title: { left: 60.19, top: 13.23, width: 28.7, height: 5.21 },
      catalog: { left: 10.84, top: 18.75, width: 66.94, height: 42.71 },
    },
    regionNotes: {
      title: "The Style Zine masthead sits above the product photo. The season and two smaller lines of type align with its right edge.",
      catalog: "The white rectangle holds the product photo. The masthead sits above it and the barcode runs along its left edge.",
      supporting: "The barcode sits in the left margin, beside the product photo.",
    },
    componentAssets: [
      {
        ...LIGHT_ACADEMIA_TITLE,
        label: "Original editorial title asset",
        region: "title",
      },
      {
        src: "/projects/tiktok/system/academia-barcode.svg",
        label: "Original barcode asset",
        region: "supporting",
      },
    ],
  },
] as const satisfies readonly TikTokTemplate[];
