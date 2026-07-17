import { resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const coverPath = resolve(
  process.cwd(),
  "public/projects/fresh-greens/cover.png",
);

function isNearNeutralBright(red: number, green: number, blue: number) {
  const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
  return red >= 225 && green >= 220 && blue >= 215 && chroma <= 20;
}

describe("Fresh Greens cover asset", () => {
  it("does not leave a pale footer strip inside the centered phone", async () => {
    const { data, info } = await sharp(coverPath)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const startX = Math.floor(info.width * 0.3);
    const endX = Math.ceil(info.width * 0.7);
    const startY = Math.floor(info.height * 0.65);
    const endY = Math.ceil(info.height * 0.9);
    let longestRun = 0;

    for (let y = startY; y < endY; y += 1) {
      let currentRun = 0;

      for (let x = startX; x < endX; x += 1) {
        const offset = (y * info.width + x) * info.channels;
        const matches = isNearNeutralBright(
          data[offset],
          data[offset + 1],
          data[offset + 2],
        );

        currentRun = matches ? currentRun + 1 : 0;
        longestRun = Math.max(longestRun, currentRun);
      }
    }

    expect(longestRun / info.width).toBeLessThan(0.08);
  });
});
