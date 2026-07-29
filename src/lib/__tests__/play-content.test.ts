import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, expectTypeOf, it } from "vitest";
import {
  playEntries,
  type PlayEntry,
  type PlayState,
} from "@/lib/content";

describe("play entry copy", () => {
  it("does not publish capture-device or Apple editing metadata with the sculpture photos", () => {
    const photo = readFileSync(
      resolve(process.cwd(), "public/play/sukunas-finger/01.jpg"),
    ).toString("latin1");

    const privateMetadata = [
      "iPhone 15 Plus",
      "2024:12:12 16:40:23",
      "Apple Photos Clean Up",
      "compositeWithTrainedAlgorithmicMedia",
    ];

    expect(privateMetadata.filter((value) => photo.includes(value))).toEqual(
      [],
    );
  });

  it("uses the closed Play state union and keeps next optional", () => {
    expectTypeOf<PlayState>().toEqualTypeOf<
      "live" | "testing" | "complete" | "archived"
    >();
    expectTypeOf<PlayEntry["state"]>().toEqualTypeOf<PlayState>();
    expectTypeOf<PlayEntry["next"]>().toEqualTypeOf<string | undefined>();
  });

  it("publishes the approved working notes for Sukuna and Loom", () => {
    const sukuna = playEntries.find((entry) => entry.slug === "sukunas-finger");
    const loom = playEntries.find((entry) => entry.slug === "loom");

    expect(sukuna).toMatchObject({
      question:
        "How much surface detail could survive a PLA print and hand-painted finish?",
      medium: "Digital sculpt, PLA, acrylic paint, matte varnish",
      state: "complete",
      whatChanged:
        "A digital model became a printable form, then paint carried the skin, wounds, and color variation.",
      next: "Add the original 3D model once the source file is ready for the web.",
      updated: "July 2026",
    });
    expect(sukuna?.process?.join(" → ")).toBe(
      "Digital sculpt → fabrication constraints → printed object → painted surface",
    );
    expect(sukuna?.embedPath).toBeUndefined();

    expect(loom).toMatchObject({
      question: "Can the same short answer always produce the same woven pattern?",
      medium: "p5.js, text hashing, generative drawing",
      state: "testing",
      whatChanged:
        "A static study became a text input where the same answer produces the same five threads.",
      next: "Test whether a shared weave stays readable as more people add responses.",
      updated: "July 2026",
    });
  });
});
