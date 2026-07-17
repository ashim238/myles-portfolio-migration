import { describe, expect, it } from "vitest";
import * as tiktokData from "@/lib/tiktok-data";

type PreviewTemplate = {
  key: string;
  name: string;
  shipped: boolean;
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

  it("marks only Light Academia as shipped", () => {
    expect(templates).toBeDefined();
    expect(
      templates?.filter((template) => template.shipped),
    ).toEqual([
      expect.objectContaining({
        key: "lightacademia",
        name: "#LightAcademia",
      }),
    ]);
  });

  it("keeps paraphrased GCL feedback as iteration notes", () => {
    expect(templates).toBeDefined();
    for (const template of templates ?? []) {
      expect(template).toHaveProperty("iterationNote");
      expect(template).not.toHaveProperty("feedbackQuote");
    }
  });

  it("stores source-aligned region geometry with each artifact", () => {
    expect(templates?.[0].regionOverlays).toEqual({
      title: { left: 20.37, top: 13.02, width: 47.67, height: 4.92 },
      catalog: { left: 12.45, top: 19.18, width: 64.48, height: 41.97 },
    });
    expect(templates?.[1].regionOverlays).toEqual({
      catalog: { left: 11.11, top: 13.33, width: 66.67, height: 48.33 },
    });
    expect(templates?.[2].regionOverlays).toEqual({
      title: { left: 61.11, top: 13.28, width: 35.91, height: 13.98 },
      catalog: { left: 10.84, top: 18.75, width: 66.94, height: 42.71 },
    });
  });
});
