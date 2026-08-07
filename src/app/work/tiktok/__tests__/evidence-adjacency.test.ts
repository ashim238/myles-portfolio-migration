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
  it("keeps the selected-direction proof beside the Choose claim", () => {
    expect(chooseChapter).toContain(
      "Three directions moved forward because they created clearly different",
    );
    expect(chooseChapter).toContain("Selected direction signals");
    expect(chooseChapter).toContain(
      "evidenceSurfaceData(TIKTOK_DIRECTION_EVIDENCE_SURFACE)",
    );
    expect(chooseChapter).toContain("TIKTOK_TEMPLATES.map");
    expect(chooseChapter).not.toContain("<ExpandableImage");

    const proof = PROJECT_EVIDENCE_MAP.tiktok[1].proofs[0];
    expect(TIKTOK_DIRECTION_EVIDENCE_SURFACE).toMatchObject({
      proofId: proof.id,
      role: proof.role,
      kind: proof.kind,
      chapterId: proof.surfaceChapterId,
    });
    expect(proof.surfaceChapterId).toBe("tt-research");
  });

  it("keeps the full interactive comparison in Build", () => {
    expect(buildChapter).toContain("<TikTokTemplateSystem />");
    expect(buildChapter).toContain("tt-preview-process-list");
  });
});
