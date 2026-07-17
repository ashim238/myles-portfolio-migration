import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (file: string) =>
  readFileSync(resolve(process.cwd(), file), "utf8");

describe("resume source", () => {
  it("publishes the canonical privacy-safe resume artifact and download action", () => {
    const source = readSource("src/app/resume/page.tsx");
    const publicPdf = resolve(
      process.cwd(),
      "public/myles-ashitey-resume.pdf",
    );

    expect(source).toContain('href="/myles-ashitey-resume.pdf"');
    expect(source).toContain('download="myles-ashitey-resume.pdf"');
    expect(source).toContain("Download résumé PDF");
    expect(source).not.toContain("PDF export is temporarily offline");
    expect(existsSync(publicPdf)).toBe(true);
  });

  it("gives the understated download action a full touch target", () => {
    const css = readSource("src/app/styles/base.css");
    const rule = css.match(/\.resume-note\s*\{([^}]+)\}/)?.[1] ?? "";

    expect(rule).toMatch(/display:\s*inline-flex/);
    expect(rule).toMatch(/align-items:\s*center/);
    expect(rule).toMatch(/min-height:\s*44px/);
  });

  it("keeps phone numbers out of resume source and test fixtures", () => {
    const phonePattern = /(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const publicSources = [
      "src/app/resume/page.tsx",
      "src/app/resume/__tests__/resume-page.test.tsx",
      "src/app/resume/__tests__/resume-source.test.ts",
      "src/app/resume/__tests__/resume-verifier.test.ts",
      "scripts/export-resume-pdf.mjs",
      "scripts/verify-resume-pdf.mjs",
    ];

    for (const file of publicSources) {
      expect(readSource(file), file).not.toMatch(phonePattern);
    }
  });

  it("uses heading semantics for every project, role, and degree", () => {
    const source = readSource("src/app/resume/page.tsx");

    expect(source).toContain('<h3 className="resume-role-title">');
    expect(source).toContain('<a href={project.href}>{project.name}</a>');
    expect(source).toContain('<h3 className="resume-role-title">{role.role}</h3>');
    expect(source.match(/<h3 className="resume-role-title">/g)).toHaveLength(4);
    expect(source).not.toMatch(/<p className="resume-role-title">/);
  });

  it("uses absolute production links for each independent project heading", () => {
    const source = readSource("src/app/resume/page.tsx");

    for (const path of [
      "/work/fresh-greens",
      "/work/understandingfafsa",
      "/work/navi",
    ]) {
      expect(source).toContain(`https://www.mylesdesignsthings.com${path}`);
    }
    expect(source).toContain('<h3 className="resume-role-title">');
    expect(source).toContain('<a href={project.href}>{project.name}</a>');
  });

  it("keeps contact links after the summary and before independent work", () => {
    const source = readSource("src/app/resume/page.tsx");
    const summary = source.indexOf('className="resume-body"');
    const email = source.indexOf("mailto:${siteConfig.email}");
    const linkedin = source.indexOf("https://linkedin.com/in/myles-ashitey");
    const portfolio = source.indexOf("siteConfig.siteUrl");
    const independentWork = source.indexOf("resume-independent-title");

    expect(summary).toBeGreaterThan(-1);
    expect(source).not.toContain('href="tel:');
    expect(email).toBeGreaterThan(summary);
    expect(linkedin).toBeGreaterThan(email);
    expect(portfolio).toBeGreaterThan(linkedin);
    expect(independentWork).toBeGreaterThan(portfolio);
  });

  it("labels the summary as the first resume section", () => {
    const source = readSource("src/app/resume/page.tsx");
    const summaryHeading = source.indexOf("Professional Summary");
    const independentWork = source.indexOf("Independent Work");

    expect(source).toContain('<header className="resume-layout"');
    expect(summaryHeading).toBeGreaterThan(-1);
    expect(independentWork).toBeGreaterThan(summaryHeading);
  });

  it("ends with candidate information instead of a marketing-style closer", () => {
    const source = readSource("src/app/resume/page.tsx");

    expect(source).not.toContain("The PDF has the full detail");
    expect(source).not.toContain("30-second read");
    expect(source).not.toContain('className="resume-footnote"');
    expect(readSource("src/app/styles/base.css")).not.toContain(".resume-footnote");
  });

  it("rejects the retired Navi preference claim", () => {
    const source = readSource("src/app/resume/page.tsx");

    expect(source).not.toContain("78%");
    expect(source).not.toMatch(/preferred neighborhood-led/i);
    expect(source).not.toMatch(/generic top-ten/i);
  });

  it("frames Fresh Greens as a working prototype without claiming safety validation", () => {
    const source = readSource("src/app/resume/page.tsx");

    expect(source).toMatch(/working React Native prototype/i);
    expect(source).not.toMatch(/designed and shipped solo/i);
    expect(source).not.toMatch(/auditable/i);
    for (const supportedFact of [
      "Black drivers",
      "three-layer architecture",
      "reserved-color signaling system",
      "WCAG dash-pattern encoding",
      "dynamic type",
      "VoiceOver support",
    ]) {
      expect(source).toContain(supportedFact);
    }
    expect(source).not.toContain("Black travel in America");
  });

  it("keeps the FAFSA result measurement-qualified", () => {
    const page = readSource("src/app/resume/page.tsx");
    const verifier = readSource("scripts/verify-resume-pdf.mjs");

    expect(page).toContain("with Mailchimp Privacy Protection excluded");
    expect(verifier).toContain("with Mailchimp Privacy Protection excluded");
    expect(page).not.toMatch(/Open rates went from/i);
    expect(verifier).toContain("open rates went from");
  });

  it("credits the shared FAFSA audit work", () => {
    const page = readSource("src/app/resume/page.tsx");
    const verifier = readSource("scripts/verify-resume-pdf.mjs");
    const sharedAudit =
      "With one collaborator, compiled and evaluated 120+ newsletter examples across four criteria";

    expect(page.replace(/\s+/g, " ")).toContain(sharedAudit);
    expect(verifier).toContain(sharedAudit);
    expect(page).not.toContain("Ran a competitive audit of 120+");
  });

  it("keeps the confirmed UMG merchandise work as a separate bullet", () => {
    const page = readSource("src/app/resume/page.tsx");
    const verifier = readSource("scripts/verify-resume-pdf.mjs");
    const confirmed =
      "Coordinated a last-minute custom-merch rollout for charlieonnafriday on Tate McRae’s tour";

    expect(page).toContain(confirmed);
    expect(page).toContain("role.bullets.map");
    expect(verifier).toContain("custom-merch rollout for charlieonnafriday");
  });

  it("defines a bounded one-page A4 print presentation", () => {
    const css = readSource("src/app/styles/base.css");
    const printStart = css.indexOf("/* Resume PDF candidate */");
    const printEnd = css.indexOf("/* End resume PDF candidate */");
    const printCss = css.slice(printStart, printEnd);

    expect(printStart).toBeGreaterThan(-1);
    expect(printEnd).toBeGreaterThan(printStart);
    expect(printCss).toMatch(/@media print/);
    expect(printCss).toMatch(/size:\s*A4 portrait/);
    expect(printCss).toMatch(/\.site-header[\s\S]*display:\s*none\s*!important/);
    expect(printCss).toMatch(/\.resume-layout[\s\S]*display:\s*block/);
    expect(printCss).toMatch(/body::after\s*\{[\s\S]*display:\s*none\s*!important/);
    expect(printCss).toMatch(
      /\.resume-role-title a\s*\{[\s\S]*text-decoration:\s*underline/,
    );
    expect(printCss).toMatch(/\.resume-role-summary[\s\S]*font-size:\s*8\.5pt/);
    expect(printCss).toMatch(
      /\.resume-skill-group dt,[\s\S]*\.resume-skill-group dd[\s\S]*font-size:\s*8\.5pt/,
    );
    expect(printCss).not.toMatch(/transform:\s*scale/);
  });

  it("keeps resume details immediately visible without scroll reveal selectors", () => {
    const fallback = readSource("src/components/scroll-reveal-fallback.tsx");
    const polish = readSource("src/app/styles/late-polish.css");

    expect(fallback).not.toContain('".resume-detail"');
    expect(polish).not.toMatch(/\.resume-detail(?:\.sr-revealed)?\s*,?/);
  });

  it("exports through tagged Chrome DevTools PDF options", () => {
    const source = readSource("scripts/export-resume-pdf.mjs");

    expect(source).toContain('"Page.printToPDF"');
    expect(source).toMatch(/generateTaggedPDF:\s*true/);
    expect(source).toMatch(/generateDocumentOutline:\s*true/);
    expect(source).toMatch(/preferCSSPageSize:\s*true/);
    expect(source).toContain('"Emulation.setEmulatedMedia"');
    expect(source).toContain("/json/protocol");
    expect(source).toContain("waitForDocumentReady");
    expect(source).toContain("findOpenPort");
    expect(source).not.toContain('"--remote-debugging-port=0"');
    expect(source).toContain("document.fonts.ready");
    expect(source).toContain("--url");
    expect(source).toContain("--out");
  });

  it("streams the PDF through bounded DevTools requests", () => {
    const source = readSource("scripts/export-resume-pdf.mjs");

    expect(source).toContain('transferMode: "ReturnAsStream"');
    expect(source).toContain('client.send("IO.read"');
    expect(source).toContain("PDF_STREAM_CHUNK_SIZE = 256 * 1024");
    expect(source).toContain("size: PDF_STREAM_CHUNK_SIZE");
    expect(source).toContain('client.send("IO.close"');
    expect(source).toContain("timed out after");
    expect(source).toContain("EXPORT_OPERATION_TIMEOUT_MS");
    expect(source).toContain("MAX_PDF_BYTES");
    expect(source).toContain("MAX_PDF_CHUNKS");
    expect(source).toMatch(/PDF stream exceeded.*byte/i);
    expect(source).toMatch(/PDF stream exceeded.*chunk/i);
    expect(source).toContain("AbortSignal.timeout");
    expect(source).toMatch(/fetch\([\s\S]*signal:/);
    expect(source).toMatch(/WebSocket open timed out/);
    expect(source).not.toContain('transferMode: "ReturnAsBase64"');
  });

  it("verifies structure, order, links, fonts, and retired claims", () => {
    const source = readSource("scripts/verify-resume-pdf.mjs");

    for (const gate of [
      "pdfinfo",
      "pdftotext",
      "pdffonts",
      "Tagged: yes",
      "StructTreeRoot",
      "MarkInfo",
      "Outlines",
      "mailto:mylesashitey@gmail.com",
      "https://linkedin.com/in/myles-ashitey",
      "https://www.mylesdesignsthings.com",
      "https://www.mylesdesignsthings.com/work/fresh-greens",
      "https://www.mylesdesignsthings.com/work/understandingfafsa",
      "https://www.mylesdesignsthings.com/work/navi",
      "preferred neighborhood-led",
      "generic top-ten",
      "78%",
      "h3Texts",
      "h1Texts",
      "h2Texts",
      "linkAssociations",
      "roleMap",
      "pdfVersion",
      "Phone number found",
      'startsWith("tel:")',
      "MAX_PDF_BYTES",
      "verifyFileSize",
    ]) {
      expect(source).toContain(gate);
    }
    expect(source).toContain('["Creative Strategist Intern", 2]');
    expect(source).not.toContain('["Creative Strategy Intern", 1]');
    expect(source).toContain("The team audited six travel platforms");
    expect(source).toContain("Light Academia shipped in the launch library");
  });

  it("exposes reproducible candidate-only PDF commands", () => {
    const pkg = JSON.parse(readSource("package.json"));

    expect(pkg.scripts["resume:pdf"]).toBe("node scripts/export-resume-pdf.mjs");
    expect(pkg.scripts["resume:pdf:verify"]).toBe(
      "node scripts/verify-resume-pdf.mjs public/myles-ashitey-resume.pdf",
    );
  });
});
