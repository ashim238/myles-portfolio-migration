import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PROJECT_EVIDENCE_MAP,
  TIKTOK_DIRECTION_EVIDENCE_SURFACE,
} from "@/lib/project-evidence";

const page = readFileSync(
  resolve(process.cwd(), "src/app/work/tiktok/page.tsx"),
  "utf8",
);
const chooseChapter = page.slice(
  page.indexOf("entry={chapters[1]}"),
  page.indexOf("entry={chapters[2]}"),
);
const buildChapter = page.slice(
  page.indexOf("entry={chapters[2]}"),
  page.indexOf("entry={chapters[3]}"),
);

describe("TikTok evidence adjacency", () => {
  it("keeps the lightweight direction proof beside the Choose claim", () => {
    expect(chooseChapter).toMatch(
      /moved\s+three directions forward because they felt\s+clearly different/,
    );
    expect(chooseChapter).toContain("Three directions, one catalog structure.");
    expect(chooseChapter).toContain(
      "evidenceSurfaceData(TIKTOK_DIRECTION_EVIDENCE_SURFACE)",
    );
    expect(chooseChapter).toContain("TIKTOK_TEMPLATES.map");
    expect(chooseChapter).toContain("DIRECTION_SIGNALS[template.key]");
    expect(chooseChapter).not.toContain("<ExpandableImage");
    expect(chooseChapter).not.toContain("Authored regions");

    const proof = PROJECT_EVIDENCE_MAP.tiktok[1].proofs[0];
    expect(TIKTOK_DIRECTION_EVIDENCE_SURFACE).toMatchObject({
      proofId: proof.id,
      role: proof.role,
      kind: proof.kind,
      chapterId: proof.surfaceChapterId,
    });
    expect(proof.surfaceChapterId).toBe("tt-research");
  });

  it("keeps one full comparison in Build and removes the duplicate card stack", () => {
    expect(buildChapter).toContain("<TikTokTemplateSystem />");
    expect(buildChapter).not.toContain("tt-preview-process-list");
    expect(buildChapter).not.toContain("Process sketch");
    expect(buildChapter).toContain("Feedback summaries are paraphrased");
  });
});
