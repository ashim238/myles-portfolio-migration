import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { metadata } from "@/app/work/navi/(minisite)/layout";

describe("Navi minisite metadata boundary", () => {
  it("keeps every synthetic minisite route out of search results", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("relies on the root layout as the single owner of the skip link", () => {
    const rootLayout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const minisiteLayout = readFileSync(
      join(process.cwd(), "src/app/work/navi/(minisite)/layout.tsx"),
      "utf8",
    );

    expect(rootLayout).toContain('className="skip-link"');
    expect(minisiteLayout).not.toContain('className="skip-link"');
  });
});
