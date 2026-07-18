/**
 * Asset paths + intrinsic dimensions for the Understanding FAFSA case
 * study. Dimensions are baked in so next/image reserves the correct
 * aspect ratio at build time (no jumpy layout, no squashed mobile shots).
 */
export const UF_ASSET_BASE = "/projects/understandingfafsa";

export type UfAsset = {
  src: string;
  width: number;
  height: number;
};

export type UfTiledAsset = {
  originalSrc: string;
  width: number;
  height: number;
  tiles: readonly UfAsset[];
};

export const UF_ASSETS = {
  /** §02 — full-scroll mobile captures (tall single-column screenshots) */
  mobileBefore: {
    originalSrc: `${UF_ASSET_BASE}/mobile-before.jpg`,
    width: 749,
    height: 14492,
    tiles: [
      { src: `${UF_ASSET_BASE}/display/mobile-before-01.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-before-02.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-before-03.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-before-04.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-before-05.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-before-06.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-before-07.webp`, width: 640, height: 95 },
    ],
  },
  mobileAfter: {
    originalSrc: `${UF_ASSET_BASE}/mobile-after.jpeg`,
    width: 684,
    height: 15638,
    tiles: [
      { src: `${UF_ASSET_BASE}/display/mobile-after-01.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-02.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-03.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-04.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-05.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-06.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-07.webp`, width: 640, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/mobile-after-08.webp`, width: 640, height: 296 },
    ],
  },

  /** §04 — template variant switcher */
  templateWeekly: {
    originalSrc: `${UF_ASSET_BASE}/template-weekly.jpeg`,
    width: 2188,
    height: 12807,
    tiles: [
      { src: `${UF_ASSET_BASE}/display/template-weekly-01.webp`, width: 1080, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/template-weekly-02.webp`, width: 1080, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/template-weekly-03.webp`, width: 1080, height: 2048 },
      { src: `${UF_ASSET_BASE}/display/template-weekly-04.webp`, width: 1080, height: 178 },
    ],
  },
  templateEvent: {
    src: `${UF_ASSET_BASE}/template-event.jpeg`,
    width: 2188,
    height: 3338,
  },

  /** §04 — locked vs swappable: base students block (annotated in code) */
  lockedSwappableBase: {
    src: `${UF_ASSET_BASE}/modular-students.png`,
    width: 2400,
    height: 3820,
  },

  /** §05 — same students block, design source vs shipped module */
  figmaSection: {
    src: `${UF_ASSET_BASE}/figma-section-lead.png`,
    width: 1200,
    height: 2386,
  },
  mailchimpSection: {
    src: `${UF_ASSET_BASE}/mailchimp-section-lead.jpeg`,
    width: 1317,
    height: 2549,
  },

  modular: {
    header: { src: `${UF_ASSET_BASE}/modular-header.png`, width: 2400, height: 884 },
    reading: { src: `${UF_ASSET_BASE}/modular-reading.png`, width: 2400, height: 3888 },
    related: { src: `${UF_ASSET_BASE}/modular-related.png`, width: 2400, height: 1927 },
    best: { src: `${UF_ASSET_BASE}/modular-best.png`, width: 2400, height: 1968 },
    students: { src: `${UF_ASSET_BASE}/modular-students.png`, width: 2400, height: 3820 },
    guides: { src: `${UF_ASSET_BASE}/modular-guides.png`, width: 2400, height: 2425 },
    closer: { src: `${UF_ASSET_BASE}/modular-closer.png`, width: 2400, height: 2452 },
  },
} as const satisfies Record<
  string,
  UfAsset | UfTiledAsset | Record<string, UfAsset>
>;
