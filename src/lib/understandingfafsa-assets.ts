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

export const UF_ASSETS = {
  /** §02 — full-scroll mobile captures (tall single-column screenshots) */
  mobileBefore: {
    src: `${UF_ASSET_BASE}/mobile-before.jpg`,
    width: 780,
    height: 14612,
  },
  mobileAfter: {
    src: `${UF_ASSET_BASE}/mobile-after.jpeg`,
    width: 780,
    height: 15736,
  },

  /** §04 — template variant switcher */
  templateWeekly: {
    src: `${UF_ASSET_BASE}/template-weekly.jpeg`,
    width: 2188,
    height: 12894,
  },
  templateEvent: {
    src: `${UF_ASSET_BASE}/template-event.jpeg`,
    width: 2188,
    height: 3434,
  },

  /** §04 — locked vs swappable annotated exports from Figma */
  lockedSwappableBase: {
    src: `${UF_ASSET_BASE}/modular-students.png`,
    width: 2400,
    height: 3820,
  },
  lockedSwappableWarm: {
    src: `${UF_ASSET_BASE}/locked-swappable-warm.png`,
    width: 1200,
    height: 1910,
  },
  lockedSwappableCold: {
    src: `${UF_ASSET_BASE}/locked-swappable-cold.png`,
    width: 1200,
    height: 1910,
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
    height: 2562,
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
} as const satisfies Record<string, UfAsset | Record<string, UfAsset>>;
