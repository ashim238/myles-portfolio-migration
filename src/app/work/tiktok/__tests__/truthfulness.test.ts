import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { AESTHETICS } from "@/lib/tiktok-data";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("TikTok public truthfulness contract", () => {
  it("uses the confirmed role, team, and original template names", () => {
    const page = read("src/app/work/tiktok/page.tsx");
    const content = read("content/projects/tiktok.md");

    expect(page).toContain('role="Creative Strategist Intern"');
    expect(page).toContain('team="Global Creative Lab"');
    expect(content).toContain("role: Creative Strategist Intern · Global Creative Lab");
    expect(page).not.toContain('role="Creative Strategy Intern"');
    expect(content).not.toContain("role: Creative Strategy Intern · Global Creative Lab");
    expect(page).not.toContain("Brand Studio");
    expect(content).not.toContain("Brand Studio");
    expect(AESTHETICS.map(({ name }) => name)).toEqual([
      "#DopamineDressing",
      "#e-Boy/#e-Girl",
      "#LightAcademia",
    ]);
  });

  it("describes the American Eagle relationship without implying direct collaboration", () => {
    const publicSources = [
      "content/projects/tiktok.md",
      "src/app/about/page.tsx",
      "src/app/resume/page.tsx",
      "src/app/work/tiktok/page.tsx",
    ].map(read);

    for (const source of publicSources) {
      expect(source).not.toMatch(/American Eagle adopted/i);
    }

    const page = publicSources[3].replace(/\s+/g, " ");
    expect(page).toContain(
      "I later learned through Global Creative Lab that American Eagle selected it.",
    );
  });

  it("does not present paraphrased review sentiment as a quotation", () => {
    const component = read("src/components/tiktok-dsa.tsx");

    expect(component).not.toContain("<blockquote");
    expect(component).not.toContain("</blockquote>");
  });

  it("keeps uncertain production ownership out of the public case study", () => {
    const page = read("src/app/work/tiktok/page.tsx");

    expect(page).not.toContain(
      "Global Creative Lab then took the static Light Academia design into production.",
    );
  });

  it("uses a phone-free artifact for the public cover", () => {
    const page = read("src/app/work/tiktok/page.tsx");
    const content = read("content/projects/tiktok.md");

    expect(page).toContain('image: "/projects/tiktok/lofi-dopamine.png"');
    expect(content).toContain(
      "coverImage: /projects/tiktok/lofi-dopamine.png",
    );
    expect(page).not.toContain("composite-flower.png");
    expect(content).not.toContain("composite-flower.png");
  });

  it("uses the confirmed formal title for the 2021 TikTok role", () => {
    const resume = read("src/app/resume/page.tsx");
    const role2021 = resume.match(
      /\{\s*role: "([^"]+)",\s*org: "TikTok \(ByteDance\)",\s*dates: "May – Aug 2021"/,
    );

    expect(role2021?.[1]).toBe("Creative Strategist Intern");
  });
});
