import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { MYLES_98_TAGLINE } from "@/lib/myles-98-copy";

const welcomeSource = readFileSync(
  resolve(process.cwd(), "src/components/myles-97/welcome-program.tsx"),
  "utf8",
);
const pocketSource = readFileSync(
  resolve(process.cwd(), "src/components/myles-97/pocket-97-shell.tsx"),
  "utf8",
);

describe("Myles 98 welcome copy", () => {
  it("uses the approved tagline in both workstation and Pocket 98", () => {
    expect(MYLES_98_TAGLINE).toBe(
      "Design, code, and everything inbetween.",
    );
    expect(welcomeSource).toContain("{MYLES_98_TAGLINE}");
    expect(pocketSource).toContain("{MYLES_98_TAGLINE}");
    expect(`${welcomeSource}\n${pocketSource}`).not.toContain(
      "Design, code, whatever you need.",
    );
  });
});
