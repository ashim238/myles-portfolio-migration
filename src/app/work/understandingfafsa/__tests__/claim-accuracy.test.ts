import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const applicantFacingFiles = [
  "content/projects/understandingfafsa.md",
  "src/app/work/understandingfafsa/page.tsx",
  "src/components/understandingfafsa.tsx",
  "src/app/about/page.tsx",
  "src/app/resume/page.tsx",
];

describe("UnderstandingFAFSA outcome claims", () => {
  it("shows the current project timeframe in the hero", () => {
    const projectPage = readFileSync(
      resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
      "utf8",
    );

    expect(projectPage).toContain("Product design · 2025–present");
    expect(projectPage).not.toContain("Product design · 2025</p>");
  });

  it("does not present the observed open-rate change as causal proof", () => {
    for (const file of applicantFacingFiles) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source).not.toMatch(/75% lift/i);
      expect(source).not.toMatch(/lost readers/i);
    }
  });

  it("preserves the measured result and its reporting context", () => {
    const projectPage = readFileSync(
      resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
      "utf8",
    );
    const visibleMetricParagraph = Array.from(
      projectPage.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g),
      ([, paragraph]) => paragraph,
    ).find((paragraph) =>
      paragraph.includes('<CountUp value="~52.6%" />'),
    );
    const visibleMetricCopy = visibleMetricParagraph?.replace(/\s+/g, " ");

    expect(visibleMetricCopy).toBeDefined();
    expect(visibleMetricCopy).toMatch(
      /November 4, 2025[\s\S]{0,100}observed[\s\S]{0,100}52\.6%[\s\S]{0,100}MPP excluded/i,
    );
    expect(visibleMetricCopy).toMatch(
      /earlier sends[\s\S]{0,50}around 30%/i,
    );
    expect(visibleMetricCopy).toContain(
      "Because this wasn&apos;t a controlled attribution test, I don&apos;t attribute the difference to the redesign.",
    );
    expect(visibleMetricCopy).not.toContain(
      "That result is supporting context",
    );
  });

  it("leads the condensed project summary with the shipped system", () => {
    const content = readFileSync(
      resolve(process.cwd(), "content/projects/understandingfafsa.md"),
      "utf8",
    );
    const summary = content.match(/^summary: (.+)$/m)?.[1];

    expect(summary).toMatch(/^Built a Mailchimp-native newsletter kit/);
    expect(summary).toContain("roughly 20 sends");
    expect(summary).toContain("observed");
    expect(summary).toContain("wasn't a controlled attribution test");
    expect(summary).not.toMatch(/versus prior|around 30%/);
  });

  it("spells out the Mailchimp measurement qualifier on condensed public surfaces", () => {
    const projectPage = readFileSync(
      resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
      "utf8",
    );
    const aboutPage = readFileSync(
      resolve(process.cwd(), "src/app/about/page.tsx"),
      "utf8",
    );
    const metadataDescription = projectPage.match(
      /const UF_DESCRIPTION\s*=\s*"([^"]+)";/,
    );

    expect(metadataDescription?.[1]).toContain(
      "with Mailchimp Privacy Protection excluded",
    );
    expect(projectPage).toMatch(/\{project\?\.summary\s*\?\?\s*UF_DESCRIPTION\}/);
    expect(aboutPage).toMatch(
      /first redesigned send had an observed 52\.6% open rate\s+with Mailchimp Privacy Protection excluded/,
    );
  });

  it("describes the artifact without unsupported effect or performance claims", () => {
    const projectPage = readFileSync(
      resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
      "utf8",
    );
    const comparisonComponent = readFileSync(
      resolve(process.cwd(), "src/components/understandingfafsa.tsx"),
      "utf8",
    );

    expect(projectPage).not.toContain("primary touchpoint");
    expect(projectPage).not.toContain("Subscribers were seeing two different brands");
    expect(projectPage).not.toContain("still in a healthy band");
    expect(projectPage).not.toMatch(
      /locked layers\s+carry the\s+review a designer would normally do/,
    );
    expect(projectPage).not.toMatch(/subscriber&apos;s\s+first impression/);
    expect(projectPage).not.toMatch(/read clearly in email/);
    for (const unsupported of [
      /saved (?:the founder )?time/i,
      /faster (?:assembly|workflow|production)/i,
      /improved efficiency/i,
      /reduced errors/i,
    ]) {
      expect(projectPage).not.toMatch(unsupported);
    }
    expect(comparisonComponent).not.toContain("stays on-brand no matter the order");
    expect(comparisonComponent).not.toContain("faster assembly");
    expect(comparisonComponent).not.toContain(
      "Pick a layer to isolate it; the other dims back.",
    );
    expect(comparisonComponent).toContain(
      "Event-specific newsletter with fewer blocks for invites and recaps.",
    );
    expect(comparisonComponent).toContain("Illustrative estimate:");
    expect(comparisonComponent).toContain("102 KB Gmail clipping threshold");
  });

  it("qualifies the open-rate labels in the mobile layout comparison", () => {
    const comparisonComponent = readFileSync(
      resolve(process.cwd(), "src/components/understandingfafsa.tsx"),
      "utf8",
    );

    expect(comparisonComponent).toContain("Prior sends · around 30% open rate");
    expect(comparisonComponent).toContain(
      "First redesigned send · ~52.6% open rate (MPP excluded)",
    );
    expect(comparisonComponent).toContain(
      "Newsletter mobile layouts and reported open rates",
    );
    expect(comparisonComponent).not.toContain("Before · ~30% open rate");
    expect(comparisonComponent).not.toContain("After · ~52.6% open rate");
    expect(comparisonComponent).not.toContain(
      "Newsletter open rate before and after redesign",
    );
    expect(comparisonComponent).toContain(
      "Reported open rates are shown for context. This was not a controlled attribution test.",
    );
  });

  it("keeps condensed About and resume surfaces observational without an unqualified comparison", () => {
    const about = readFileSync(
      resolve(process.cwd(), "src/app/about/page.tsx"),
      "utf8",
    );
    const resume = readFileSync(
      resolve(process.cwd(), "src/app/resume/page.tsx"),
      "utf8",
    );

    for (const source of [about, resume]) {
      expect(source).toMatch(/observed[^.]*52\.6%|52\.6%[^.]*observed/i);
      expect(source).not.toMatch(/52\.6%[^.]*prior sends around 30%/i);
      expect(source).not.toMatch(/52\.6%[^.]*compared with prior sends/i);
    }

    expect(resume).toContain(
      "founder could edit weekly sends herself and bring me back for new audiences or color pairings",
    );
    expect(resume).not.toContain("without a designer in the loop");
  });

  it("keeps a rendered space after the highlighted Gmail constraint", () => {
    const projectPage = readFileSync(
      resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
      "utf8",
    );

    expect(projectPage).toMatch(
      /constraint\.\s*<\/mark>\s*\{" "\}\s*Figma&apos;s spacing/,
    );
  });
});
