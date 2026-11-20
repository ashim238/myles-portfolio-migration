import { describe, expect, it } from "vitest";
import * as tiktokData from "@/lib/tiktok-data";

type PreviewTemplate = {
  key: string;
  name: string;
  launchLibraryStatus: "confirmed" | "unknown";
  iterationNote: string;
  regionOverlays: Partial<
    Record<
      "title" | "catalog" | "supporting",
      { left: number; top: number; width: number; height: number }
    >
  >;
};

const templates = Reflect.get(
  tiktokData,
  "TIKTOK_TEMPLATES",
) as readonly PreviewTemplate[] | undefined;

describe("TikTok preview template data", () => {
  it("uses only the original project names", () => {
    expect(templates).toBeDefined();
    expect(templates?.map((template) => template.name)).toEqual([
      "#DopamineDressing",
      "#e-Boy/#e-Girl",
      "#LightAcademia",
    ]);
  });

  it("distinguishes a confirmed launch-library result from unknown outcomes", () => {
    expect(templates).toBeDefined();
    expect(
      templates?.map(({ key, launchLibraryStatus }) => ({
        key,
        launchLibraryStatus,
      })),
    ).toEqual([
      { key: "dopamine", launchLibraryStatus: "unknown" },
      { key: "eboy", launchLibraryStatus: "unknown" },
      { key: "lightacademia", launchLibraryStatus: "confirmed" },
    ]);
    for (const template of templates ?? []) {
      expect(template).not.toHaveProperty("shipped");
    }
  });

  it("keeps paraphrased GCL feedback as iteration notes", () => {
    expect(templates).toBeDefined();
    for (const template of templates ?? []) {
      expect(template).toHaveProperty("iterationNote");
      expect(template).not.toHaveProperty("feedbackQuote");
    }
  });

  it("keeps the approved source-bounded iteration notes stable", () => {
    expect(templates?.map(({ key, iterationNote }) => ({ key, iterationNote }))).toEqual([
      {
        key: "dopamine",
        iterationNote:
          "The sketch explores brand colors and copy such as #OOTD. I rejected the direction once the copy felt like it was trying too hard to belong and the visuals felt too TikTok-branded.",
      },
      {
        key: "eboy",
        iterationNote:
          "The notes warned that the direction might stray too far from the guidelines. I was asked to build it out and find a way to make the nearly colorless treatment appealing.",
      },
      {
        key: "lightacademia",
        iterationNote:
          "The sketch records the internal critique that shaped the final Light Academia direction.",
      },
    ]);
  });

  it("stores source-aligned region geometry with each artifact", () => {
    expect(templates?.[0].regionOverlays).toEqual({
      title: { left: 19.81, top: 12.71, width: 49.54, height: 5.94 },
      catalog: { left: 12.45, top: 19.18, width: 64.48, height: 41.97 },
    });
    expect(templates?.[1].regionOverlays).toEqual({
      catalog: { left: 11.11, top: 13.33, width: 66.67, height: 48.33 },
    });
    expect(templates?.[2].regionOverlays).toEqual({
      title: { left: 60.19, top: 13.23, width: 28.7, height: 5.21 },
      catalog: { left: 10.84, top: 18.75, width: 66.94, height: 42.71 },
    });
  });
});
