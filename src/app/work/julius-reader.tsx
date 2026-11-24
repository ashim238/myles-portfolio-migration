import { Fragment } from "react";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { JuliusCoverFace } from "@/components/myles-97/julius-cover-art";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { ProjectToc } from "@/components/project-toc";
import { getPublishedProjects, readImageDimensions } from "@/lib/content";
import { TimingSpecimen } from "./julius-design-system/timing-specimen";
import { JuliusExhibit } from "./julius-exhibit";
import { LibraryInventory } from "./julius-design-system/library-inventory";
import { ComponentTrial } from "./julius-design-system/docs-trial";
import type { Exhibit, JuliusStudy } from "./julius-study-types";
import "./julius-reader.css";

export async function SizedExhibit({ exhibit, priority = false }: { exhibit: Exhibit; priority?: boolean }) {
  const urls = new Set<string>();
  if (exhibit.kind === "video") {
    urls.add(exhibit.poster);
    if (exhibit.phoneRecording) urls.add(exhibit.phoneRecording.poster);
  }
  const images = exhibit.kind === "image" ? [exhibit]
    : exhibit.kind === "compare" ? [...exhibit.items, ...(exhibit.phoneItems ?? [])]
    : exhibit.stills ?? [];
  for (const image of images) {
    urls.add(image.src);
    if (image.mobileSrc) urls.add(image.mobileSrc);
  }
  const entries = await Promise.all(Array.from(urls, async (url) => [url, await readImageDimensions(url)] as const));
  return <JuliusExhibit exhibit={exhibit} priority={priority} dimensions={Object.fromEntries(entries)} />;
}

function Copy({ paragraphs }: { paragraphs: string[] }) {
  if (!paragraphs.length) return null;
  return <div className="project-section-body">{paragraphs.map((p) => <p key={p}>{p}</p>)}</div>;
}

export async function JuliusReader({ study }: { study: JuliusStudy }) {
  const projects = await getPublishedProjects();
  const sections = study.chapters.map(({ id, stage, title }) => ({ id, stage, title }));
  return (
    <ReaderShell slug={study.slug} title={study.title} className="document-study julius-reader">
      <div className="case-frontispiece">
        <header className="hero project-hero">
          <p className="julius-dateline">Julius Education <span aria-hidden="true">/</span> {study.timeframe}</p>
          <h1 id="project-title" className="project-hero-title">{study.title}</h1>
          <p className="project-hero-lede">{study.summary}</p>
          {study.background && <p className="project-hero-lede">{study.background}</p>}
        </header>
        <div className="project-cover julius-cover" data-project-enter-cover>
          <JuliusCoverFace project="julius-design-system" animated />
        </div>
        <ProjectOpeningFacts
          role={study.role}
          team={study.team}
          goal={study.goal}
          outcome={study.outcome}
          proof={study.proof}
        />
      </div>
      <div className="case-book">
        <aside className="book-index" aria-label="Chapter index"><ProjectToc sections={sections} /></aside>
        <div className="book-pages">
          <div className="julius-library-specimen">
            <SizedExhibit exhibit={study.cover} />
            <LibraryInventory />
          </div>
          {study.chapters.map((chapter, index) => (
            <article key={chapter.id} className="project-chapter" aria-labelledby={chapter.id}>
              <header className="chapter-opening">
                <p className="project-chapter-meta">
                  <span className="project-chapter-stage">{chapter.stage}</span>
                  <span className="project-chapter-count">{index + 1} of {sections.length}</span>
                </p>
                <h2 className="project-chapter-title" id={chapter.id}>{chapter.title}</h2>
              </header>
              <Copy paragraphs={chapter.paragraphs} />
              {chapter.id === "shared-timing" && <TimingSpecimen />}
              {(chapter.id === "sidebar" || chapter.id === "color" || chapter.id === "docs-site") && <ComponentTrial kind={chapter.id} />}
              {chapter.id === "docs-site" && (
                <section className="julius-release-flow" aria-labelledby="component-review-flow">
                  <h3 id="component-review-flow">Component review and release</h3>
                  <ol>
                    <li><strong>Shared review form</strong><p>Alexis and I used the same Claude artifact each round. I put the live options beside my question so she could try them and leave me a note.</p><a href="#dialog-review">See the dialog review</a></li>
                    <li><strong>Visual check</strong><p>I listed the changes we’d agreed on in the pull request. Chromatic compared the Storybook examples with the previous version so we could spot anything else that moved.</p></li>
                    <li><strong>Docs update</strong><p>I wrote the usage guidance in the same pull request as the component. When we built the docs from a release, the examples used that version of the library.</p></li>
                  </ol>
                </section>
              )}
              {chapter.exhibits?.map((exhibit) => chapter.id === "color" ? (
                <details className="julius-color-reference" key={exhibit.title}>
                  <summary>See the button on Career Map</summary>
                  <SizedExhibit exhibit={exhibit} />
                </details>
              ) : <SizedExhibit key={exhibit.title} exhibit={exhibit} />)}
              {chapter.examples?.map(example => (
                <Fragment key={example.trial}>
                  <Copy paragraphs={[example.text]} />
                  <ComponentTrial kind={example.trial} />
                </Fragment>
              ))}
              {chapter.after && <Copy paragraphs={chapter.after} />}
            </article>
          ))}
        </div>
      </div>
      <ProjectWorkJump currentSlug={study.slug} projects={projects} />
    </ReaderShell>
  );
}
