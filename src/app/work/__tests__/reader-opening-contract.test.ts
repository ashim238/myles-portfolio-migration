import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type RouteOpening = {
  route: string;
  proofName: string;
  proofLabel: string;
  proofHref: string;
  opening: string;
  openingClose: string;
  dominantMedia: string;
};

const routes: RouteOpening[] = [
  {
    route: "fresh-greens",
    proofName: "freshGreensProof",
    proofLabel: "Try the safety-flow reconstruction",
    proofHref: "#fg-pulled-over",
    opening: '<section className="hero project-hero fg-hero"',
    openingClose: "</section>",
    dominantMedia: "<LeadMedia",
  },
  {
    route: "navi",
    proofName: "naviProof",
    proofLabel: "Try the booking flow",
    proofHref: "/work/navi/demo",
    opening: '<section className="hero project-hero nv-hero"',
    openingClose: "</section>",
    dominantMedia: "<LeadMedia",
  },
  {
    route: "understandingfafsa",
    proofName: "understandingFafsaProof",
    proofLabel: "Build a sample send",
    proofHref: "#uf-locked",
    opening: '<section className="hero project-hero uf-hero"',
    openingClose: "</section>",
    dominantMedia: "<LeadMedia",
  },
  {
    route: "tiktok",
    proofName: "tiktokProof",
    proofLabel: "Inspect the template system",
    proofHref: "#tt-system",
    opening: "data-project-enter-cover",
    openingClose: "</header>",
    dominantMedia: "<RecruiterCut",
  },
];

function sourceFor(route: string): string {
  return readFileSync(
    resolve(process.cwd(), `src/app/work/${route}/page.tsx`),
    "utf8",
  );
}

describe("Reader opening route contract", () => {
  it.each(routes)(
    "places $route facts after the opening and before dominant media without replacing RecruiterCut",
    ({ route, opening, openingClose, dominantMedia }) => {
      const source = sourceFor(route);
      const openingStart = source.indexOf(opening);
      const openingEnd = source.indexOf(openingClose, openingStart) + openingClose.length;
      const facts = source.indexOf("<ProjectOpeningFacts");
      const media = source.indexOf(dominantMedia, facts);
      const recruiterCut = source.indexOf("<RecruiterCut", facts);

      expect(openingStart).toBeGreaterThanOrEqual(0);
      expect(openingEnd).toBeGreaterThan(openingStart);
      expect(facts).toBeGreaterThan(openingEnd);
      expect(media).toBeGreaterThan(facts);
      expect(recruiterCut).toBeGreaterThan(facts);
    },
  );

  it.each(routes)(
    "reuses $route proof values for the opening and RecruiterCut evidence",
    ({ route, proofName, proofLabel, proofHref }) => {
      const source = sourceFor(route);

      expect(source).toContain(`const ${proofName} = {`);
      expect(source).toContain(`proof={${proofName}}`);
      expect(source).toContain(`cta: ${proofName}.label`);
      expect(source).toContain(`href: ${proofName}.href`);
      expect(source).toMatch(
        new RegExp(
          `const ${proofName} = \\{[\\s\\S]*label: "${proofLabel}",[\\s\\S]*href: "${proofHref}",`,
        ),
      );
    },
  );

  it("hides only the Reader breadcrumb inside the 767px mobile query", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/app/styles/reader-mode.css"),
      "utf8",
    );
    const mobileQuery = styles.match(/@media \(max-width: 767px\) \{([\s\S]*?)\n\}/)?.[1];

    expect(mobileQuery).toMatch(
      /\.reader-mode\.reader-mode \.project-topbar\s*\{\s*display:\s*none;/,
    );
    expect(styles.match(/\.reader-mode\.reader-mode \.project-topbar\s*\{\s*display:\s*none;/g)).toHaveLength(1);
  });
});
