import type { EvidenceSurfaceMetadata } from "@/lib/project-evidence/types";

export function evidenceSurfaceData(metadata: EvidenceSurfaceMetadata) {
  return {
    "data-evidence-proof": metadata.proofId,
    "data-evidence-role": metadata.role,
    "data-evidence-kind": metadata.kind,
    "data-evidence-chapter": metadata.chapterId,
  } as const;
}

export function orientationSurfaceData(surface: string) {
  return {
    "data-reader-surface": surface,
    "data-evidence-role": "orientation",
  } as const;
}

export const FRESH_GREENS_REMINDER_EVIDENCE_SURFACE = {
  proofId: "fg-departure-reminder",
  role: "supporting",
  kind: "sequence",
  chapterId: "fg-design",
} as const satisfies EvidenceSurfaceMetadata;

export const NAVI_RESEARCH_EVIDENCE_SURFACE = {
  proofId: "nv-research-artifacts",
  role: "dominant",
  kind: "structured",
  chapterId: "nv-framework",
} as const satisfies EvidenceSurfaceMetadata;

export const NAVI_DEMO_EVIDENCE_SURFACE = {
  proofId: "nv-demo-embed",
  role: "dominant",
  kind: "working-product",
  chapterId: "nv-build",
} as const satisfies EvidenceSurfaceMetadata;

export const TIKTOK_DIRECTION_EVIDENCE_SURFACE = {
  proofId: "tt-direction-comparison",
  role: "dominant",
  kind: "structured",
  chapterId: "tt-research",
} as const satisfies EvidenceSurfaceMetadata;
