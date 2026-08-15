import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { AESTHETICS } from "@/lib/tiktok-data";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

const normalizeProse = (source: string) =>
  source.replaceAll("&apos;", "'").replace(/\s+/g, " ");

describe("TikTok public truthfulness contract", () => {
  it("uses the confirmed canonical role and original template names", () => {
    const page = read("src/app/work/tiktok/page.tsx");
    const content = read("content/projects/tiktok.md");

    expect(page).toContain(
      'role="Creative Strategist Intern · Global Creative Lab"',
    );
    expect(page).not.toContain('team="Global Creative Lab"');
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
      expect(normalizeProse(source)).toContain(
        "I later learned through Global Creative Lab that American Eagle selected it.",
      );
    }
  });

  it("uses confirmed launch-library language on public outcome surfaces", () => {
    const page = read("src/app/work/tiktok/page.tsx");
    const resume = read("src/app/resume/page.tsx");

    expect(page).toContain("Launch-library result");
    expect(page).not.toContain("Shipped result");
    expect(resume).toContain("Light Academia entered the launch library.");
    expect(resume).not.toContain(
      "Light Academia shipped in the launch library.",
    );
  });

  it("keeps review notes paraphrased and excludes unsupported outcome claims", () => {
    const page = read("src/app/work/tiktok/page.tsx");
    const data = read("src/lib/tiktok-data.ts");
    const publicCaseStudy = `${page}\n${data}`;

    expect(publicCaseStudy).toContain("paraphrase");
    expect(publicCaseStudy).not.toContain("<blockquote");
    expect(publicCaseStudy).not.toMatch(/worked (?:with|for) American Eagle/i);
    expect(publicCaseStudy).not.toMatch(/American Eagle client/i);
    expect(publicCaseStudy).not.toMatch(
      /\b(?:CTR|ROAS|conversion rate|click-through rate)\b/i,
    );
    expect(publicCaseStudy).not.toContain(
      "Global Creative Lab then took the static Light Academia design into production.",
    );
  });

  it("keeps the research method and three-template compression in the public story", () => {
    const page = normalizeProse(read("src/app/work/tiktok/page.tsx"));

    expect(page).toMatch(/fashion vertical/i);
    expect(page).toMatch(/dimensions and product slots (?:that )?were fixed/i);
    expect(page).toMatch(/weekly (?:Global Creative Lab|GCL) huddle/i);
    expect(page).toMatch(/traditional market research/i);
    expect(page).toMatch(/burner accounts/i);
    expect(page).toContain(
      "There was no one subculture that wholly represented the site.",
    );
    expect(page).toMatch(/popular posts/i);
    expect(page).toMatch(/how (?:people|community members) talked to each other/i);
    expect(page).toMatch(/prominent (?:users|creators)/i);
    expect(page).toMatch(/2D design/i);
    expect(page).toContain("I did have to flatten the aesthetics somewhat.");
  });

  it("states the evaluation and downstream limits in Myles's own register", () => {
    const page = normalizeProse(read("src/app/work/tiktok/page.tsx"));
    const data = normalizeProse(read("src/lib/tiktok-data.ts"));
    const publicCaseStudy = `${page}\n${data}`;

    expect(page).toMatch(/reviewed internally/i);
    expect(page).toMatch(/wasn't shown to external brands or audience members/i);
    expect(page).toContain(
      "I wasn't told why American Eagle selected Light Academia.",
    );
    expect(page).toContain("I don't know what happened to the other two templates.");
    expect(page).toContain(
      "Internships are very transitory, so I'm left doing work without knowing the full impact.",
    );
    expect(page).toMatch(/check with stakeholders at multiple stages/i);
    expect(publicCaseStudy).not.toMatch(/tested (?:with|by) (?:brands|audiences|users|customers)/i);
    expect(publicCaseStudy).not.toMatch(/campaign performance|campaign results/i);
    expect(publicCaseStudy).not.toMatch(
      /(?:other|remaining) (?:two )?templates? (?:were|got) (?:repurposed|stripped)/i,
    );
    expect(publicCaseStudy).not.toMatch(/stripped for parts/i);
    expect(publicCaseStudy).not.toMatch(/the more interesting part/i);
  });

  it("uses the populated single-phone mockup for the public cover", () => {
    const page = read("src/app/work/tiktok/page.tsx");
    const content = read("content/projects/tiktok.md");
    const notices = read("THIRD_PARTY_NOTICES.md");
    const cover = resolve(
      process.cwd(),
      "public/projects/tiktok/cover-phone-mockup.jpg",
    );

    expect(page).toContain('image: "/projects/tiktok/cover-phone-mockup.jpg"');
    expect(content).toContain(
      "coverImage: /projects/tiktok/cover-phone-mockup.jpg",
    );
    expect(page).not.toContain("composite-flower.png");
    expect(content).not.toContain("composite-flower.png");
    expect(existsSync(cover)).toBe(true);
    expect(notices).toContain("Free Phone Screen Mockup PSD");
    expect(notices).toContain("Bag on White Background");
    expect(notices).toContain("exported a flattened crop");
  });

  it("uses the confirmed formal title for the 2021 TikTok role", () => {
    const resume = read("src/app/resume/page.tsx");
    const role2021 = resume.match(
      /\{\s*role: "([^"]+)",\s*org: "TikTok \(ByteDance\)",\s*dates: "May – Aug 2021"/,
    );

    expect(role2021?.[1]).toBe("Creative Strategist Intern");
  });
});
