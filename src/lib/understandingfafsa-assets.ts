/** Asset paths for the Understanding FAFSA case study. */
export const UF_ASSET_BASE = "/projects/understandingfafsa";

export const UF_ASSETS = {
  /** §02 — full-scroll mobile captures */
  mobileBefore: `${UF_ASSET_BASE}/mobile-before.jpg`,
  mobileAfter: `${UF_ASSET_BASE}/mobile-after.jpg`,

  /** §04 — template variant switcher (Weekly + Event; counselor toolkit not live yet) */
  templateWeekly: `${UF_ASSET_BASE}/template-weekly.jpg`,
  templateEvent: `${UF_ASSET_BASE}/template-event.jpg`,

  /** §04 — locked vs swappable annotated exports from Figma */
  lockedSwappableBase: `${UF_ASSET_BASE}/modular-students.png`,
  lockedSwappableSwappable: `${UF_ASSET_BASE}/locked-swappable-swappable.png`,
  lockedSwappableLocked: `${UF_ASSET_BASE}/locked-swappable-locked.png`,

  /** §05 — same students block, design source vs shipped module */
  figmaSectionStudents: `${UF_ASSET_BASE}/figma-section-students.jpg`,
  mailchimpSectionStudents: `${UF_ASSET_BASE}/mailchimp-section-students.jpg`,

  modular: {
    header: `${UF_ASSET_BASE}/modular-header.png`,
    reading: `${UF_ASSET_BASE}/modular-reading.png`,
    related: `${UF_ASSET_BASE}/modular-related.png`,
    best: `${UF_ASSET_BASE}/modular-best.png`,
    students: `${UF_ASSET_BASE}/modular-students.png`,
    guides: `${UF_ASSET_BASE}/modular-guides.png`,
    closer: `${UF_ASSET_BASE}/modular-closer.png`,
  },
} as const;
