import { beforeEach, describe, expect, it, vi } from "vitest";

const fixture = vi.hoisted(() => ({ source: "" }));
vi.mock("node:fs/promises", () => ({
  default: {
    readdir: async () => ["fixture.md"],
    readFile: async () => fixture.source,
  },
}));

import { getAllProjects } from "@/lib/content";

function projectSource(status: string) {
  return `---
slug: fixture
title: Fixture
summary: Fixture summary
role: Product Designer
timeframe: 2026
status: ${status}
order: 1
tags: []
sections: []
---`;
}

describe("project status contract", () => {
  beforeEach(() => {
    fixture.source = "";
  });

  it.each(["published", "draft", "hidden"] as const)(
    "accepts %s",
    async (status) => {
      fixture.source = projectSource(status);
      const [project] = await getAllProjects();
      expect(project.status).toBe(status);
    },
  );

  it("rejects an unknown status instead of publishing it", async () => {
    fixture.source = projectSource("private");
    await expect(getAllProjects()).rejects.toThrow(
      "Project status must be published, draft, or hidden",
    );
  });
});
