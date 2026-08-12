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
  shipped: boolean;
  palette: readonly { hex: string; label: string }[];
  iterationNote: string;
  regionOverlays: Partial<Record<TikTokTemplateRegion, TikTokRegionBox>>;
  componentAssets: readonly {
    src: string;
    label: string;
    region: TikTokTemplateRegion;
  }[];
};

export type TikTokTemplateRegion = "title" | "catalog" | "supporting";

export type TikTokRegionBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const TIKTOK_TEMPLATES = [
  {
    key: "dopamine",
    name: "#DopamineDressing",
    fullTemplate: "/projects/tiktok/system/dopamine.webp",
    fullTemplateSource: "/projects/tiktok/system/dopamine.svg",
    sketch: "/projects/tiktok/lofi-dopamine.png",
    shipped: false,
    palette: AESTHETICS[0].palette,
    iterationNote:
      "GCL feedback pushed me to bring more of TikTok's brand language and copy into the direction.",
    regionOverlays: {
      title: { left: 20.37, top: 13.02, width: 47.67, height: 4.92 },
      catalog: { left: 12.45, top: 19.18, width: 64.48, height: 41.97 },
    },
    componentAssets: [
      {
        src: "/projects/tiktok/system/dopamine-title.svg",
        label: "Original title asset",
        region: "title",
      },
    ],
  },
  {
    key: "eboy",
    name: "#e-Boy/#e-Girl",
    fullTemplate: "/projects/tiktok/system/eboy.webp",
    fullTemplateSource: "/projects/tiktok/system/eboy.svg",
    sketch: "/projects/tiktok/lofi-eboy.png",
    shipped: false,
    palette: AESTHETICS[1].palette,
    iterationNote:
      "The team liked the texture, but felt the direction was drifting too far from TikTok's upbeat visual language. I kept the edge and looked for more dimension.",
    regionOverlays: {
      catalog: { left: 11.11, top: 13.33, width: 66.67, height: 48.33 },
    },
    componentAssets: [],
  },
  {
    key: "lightacademia",
    name: "#LightAcademia",
    fullTemplate: "/projects/tiktok/system/academia.webp",
    fullTemplateSource: "/projects/tiktok/system/academia.svg",
    sketch: "/projects/tiktok/lofi-light-academia.png",
    shipped: true,
    palette: AESTHETICS[2].palette,
    iterationNote:
      "I kept the spare editorial structure and pushed the title, color, and supporting details further.",
    regionOverlays: {
      title: { left: 61.11, top: 13.28, width: 35.91, height: 13.98 },
      catalog: { left: 10.84, top: 18.75, width: 66.94, height: 42.71 },
    },
    componentAssets: [
      {
        src: "/projects/tiktok/system/academia-text.svg",
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
