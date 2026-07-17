import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { playEntries } from "@/lib/content";

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

  it("describes Loom from its actual input and generation rules", () => {
    const loom = playEntries.find((entry) => entry.slug === "loom");

    expect(loom).toBeDefined();
    expect(loom!.hook).toBe(
      "Each answer to “What brings you joy?” seeds five colored threads on a digital loom.",
    );
    expect(loom!.exploration).toBe(
      "A text hash sets each thread’s position, hue, weight, and opacity. The same answer produces the same five-thread pattern.",
    );

    const sketch = readFileSync(
      resolve(process.cwd(), "public/play/loom/sketch.js"),
      "utf8",
    );
    expect(sketch).toContain("const THREADS_PER_RESPONSE = 5;");
    expect(sketch).toMatch(/const seed = hashString\(answer\);\s*randomSeed\(seed\);/);
    expect(sketch).toMatch(/const topIndex = floor\(random\(topPoints\.length\)\)/);
    expect(sketch).toMatch(/const bottomIndex = floor\(random\(bottomPoints\.length\)\)/);
    expect(sketch).toMatch(/const baseHue = \(seed \+ i \* 27\) % 360/);
    expect(sketch).toMatch(/alpha: random\(85, 170\)/);
    expect(sketch).toMatch(/weight: random\(0\.9, 2\.2\)/);
  });
});
