import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const routes = [
  ["src/app/about/page.tsx", 'program="about"', 'title="About Myles"'],
  ["src/app/resume/page.tsx", 'program="resume"', 'title="Résumé"'],
  ["src/app/play/page.tsx", 'program="loose-parts"', 'title="Loose Parts"'],
] as const;

describe("Myles 98 secondary route shell", () => {
  it.each(routes)("keeps %s inside system document chrome", (path, program, title) => {
    const source = read(path);
    expect(source).toContain("SystemDocumentShell");
    expect(source).toContain(program);
    expect(source).toContain(title);
    expect(source).not.toContain("<SiteNav");
    expect(source).not.toContain('aria-label="Breadcrumb"');
  });

  it("keeps the Selected Work return affordance at the document-shell level", () => {
    const shell = read("src/components/myles-97/system-document-shell.tsx");
    expect(shell).toContain('href="/#selected-work"');
    expect(shell).toContain("Selected Work");

    const window = read("src/components/myles-97/program-window.tsx");
    expect(window).toContain("id={id}");
  });

  it("uses Loose Parts rather than the legacy Play label in Myles 98 navigation", () => {
    const play = read("src/app/play/page.tsx");
    const endcap = read("src/components/portfolio-endcap.tsx");
    expect(play).toContain("Loose Parts");
    expect(endcap).toContain('label: "Loose Parts"');
    expect(endcap).toContain('href="/#selected-work"');
  });

  it("keeps secondary document details and actions comfortably usable", () => {
    const polish = read("src/app/styles/myles-98-polish.css");
    const surfaces = read("src/app/styles/portfolio-surfaces.css");
    const latePolish = read("src/app/styles/late-polish.css");
    const revealObserver = read("src/components/scroll-reveal-fallback.tsx");

    expect(polish).toMatch(
      /\.myles98-system-document \.about-action\s*\{[\s\S]*?min-height:\s*44px;[\s\S]*?padding:\s*10px 12px;/,
    );
    expect(polish).toMatch(
      /\.myles98-system-document :is\(\.about-detail, \.resume-detail\)\s*\{[\s\S]*?padding:\s*14px 16px;/,
    );
    expect(polish).toMatch(
      /@media \(max-width: 767px\)[\s\S]*?\.myles98-system-document \.about-actions\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
    expect(polish).not.toContain("#fff07a");
    expect(polish).not.toMatch(/color:\s*#444;/);
    expect(surfaces).not.toMatch(
      /\.about-detail\s*\{[^}]*animation-timeline:\s*view\(\);/,
    );
    expect(latePolish).not.toMatch(/\.about-detail(?:\.sr-revealed)?/);
    expect(revealObserver).not.toContain('".about-detail"');
  });

  it("uses one compact rhythm system inside the About facts panel", () => {
    const polish = read("src/app/styles/myles-98-polish.css");

    expect(polish).toMatch(
      /\.myles98-system-document \.about-details\s*\{[^}]*gap:\s*0;/,
    );
    expect(polish).toMatch(
      /\.myles98-system-document \.about-detail\s*\{[^}]*gap:\s*6px;/,
    );
    expect(polish).toMatch(
      /\.myles98-system-document \.about-detail dt\s*\{[^}]*margin-bottom:\s*0;/,
    );
  });

  it("keeps the Reminders widget clear of overlapping windows at the narrow workstation band", () => {
    const pocket = read("src/app/styles/myles-97-pocket.css");

    expect(pocket).toMatch(
      /@media \(min-width: 1025px\) and \(max-width: 1080px\) and \(pointer: fine\)[\s\S]*?\.myles97-reminders-widget\s*\{[^}]*grid-column:\s*1;[^}]*align-self:\s*end;[^}]*justify-self:\s*start;/,
    );
  });
});
