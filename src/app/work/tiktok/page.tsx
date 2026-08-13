import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { ExpandableImage } from "@/components/expandable-image";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectChapter } from "@/components/project-chapter";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { RecruiterCut } from "@/components/recruiter-cut";
import {
  TikTokCoverBlobs,
  TikTokLogo,
  TikTokTemplateSystem,
} from "@/components/tiktok-dsa";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";
import { TIKTOK_TEMPLATES } from "@/lib/tiktok-data";
import styles from "./tiktok-four-beat.module.css";

const TIKTOK_DESCRIPTION =
  "Static catalog templates designed for TikTok's Dynamic Showcase Ads during a 2021 Global Creative Lab internship. Light Academia shipped in the launch library.";
const chapters = CASE_STUDY_CHAPTERS.tiktok;
const tiktokProof = {
  label: "Inspect the template system",
  href: "#tt-system",
};

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProjectBySlug("tiktok");
  const isPublic = project?.status === "published";

  return {
    ...createRouteMetadata({
      title: "TikTok Dynamic Showcase Ads",
      description: TIKTOK_DESCRIPTION,
      path: "/work/tiktok",
      image: "/projects/tiktok/lofi-dopamine.png",
      type: "article",
    }),
    robots: isPublic
      ? undefined
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function TikTokPage() {
  const project = await getProjectBySlug("tiktok");
  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await getPublishedProjects();
  const lightAcademia = TIKTOK_TEMPLATES.find(
    (template) => template.key === "lightacademia",
  );

  return (
    <ReaderShell
      slug="tiktok"
      title="TikTok Dynamic Showcase Ads"
      className="tt-page tt-preview-page"
    >
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">←</span>
          Selected work
        </Link>
      </nav>

      <header className="tt-cover tt-cover--preview" data-project-enter-cover>
        <TikTokCoverBlobs />
        <div className="tt-cover-inner">
          <p className="tt-eyebrow">
            <TikTokLogo />
            <span>Creative Strategist Intern · 2021</span>
          </p>
          <h1 id="tt-title" className="project-hero-title tt-title">
            TikTok Dynamic Showcase Ads
          </h1>
          <p className="project-hero-lede tt-lede">
            During my 2021 internship with Global Creative Lab, I designed
            three static catalog templates for TikTok&apos;s Dynamic Showcase
            Ads. The product slot stayed fixed while the type, color, and
            supporting graphics changed.
          </p>
        </div>
      </header>

      <ProjectOpeningFacts
        role="Creative Strategist Intern · Global Creative Lab"
        scope="I designed three static catalog templates for Dynamic Showcase Ads during my Global Creative Lab internship."
        outcome="Light Academia was 1 of 3 templates shipped in the launch library."
        proof={tiktokProof}
      />
      <RecruiterCut
        timeline="May – August 2021"
        moves={[
          "Studied Y2K, Maximalism, Dark Academia, WitchTok, and Cottagecore before choosing the final directions.",
          "Used one product slot map across Dopamine Dressing, e-Boy/e-Girl, and Light Academia.",
          "Built the files in parts and tested which elements could mix across directions.",
        ]}
      />

      <ProjectToc sections={chapters} />

      <ProjectChapter
        entry={chapters[0]}
        index={1}
        total={chapters.length}
        variant="tiktok"
      >
        <div className="project-section tt-section">
          <div className="project-section-body">
            <p>
              I came into my 2021 Global Creative Lab internship knowing very
              little about the client. The brief was to make static catalog
              templates that could work across product categories while keeping
              the product slots fixed. I used type, color, and supporting
              graphics to give each direction its own visual logic.
            </p>
            <dl className={styles.briefFacts}>
              <div>
                <dt>Role</dt>
                <dd>Creative Strategist Intern</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>Global Creative Lab</dd>
              </div>
              <div>
                <dt>Intended use</dt>
                <dd>Reusable templates for brand catalog content</dd>
              </div>
              <div>
                <dt>Deliverable</dt>
                <dd>
                  Three static template directions as layered Photoshop files
                </dd>
              </div>
              <div>
                <dt>Fixed parts</dt>
                <dd>Product slots and the shared slot map</dd>
              </div>
              <div>
                <dt>Variable parts</dt>
                <dd>Type, color, texture, and supporting graphics</dd>
              </div>
            </dl>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[1]}
        index={2}
        total={chapters.length}
        variant="tiktok"
      >
        <div className="project-section tt-section">
          <div className="project-section-body">
            <p>
              I looked at TikTok subcultures because I needed to understand the
              range of voices and perspectives on the platform. I compared Y2K,
              Maximalism, Dark Academia, WitchTok, and Cottagecore through type,
              color, texture, and imagery. The final directions had to make
              sense for their audiences. Dopamine Dressing could stay closer to
              TikTok&apos;s own visual language. e-Boy/e-Girl and Light Academia
              could move farther away when the theme called for it.
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[2]}
        index={3}
        total={chapters.length}
        variant="tiktok"
      >
        <div className="project-section tt-section tt-section--wide">
          <div className="project-section-body">
            <p>
              I built each direction as a layered Photoshop file around the
              same product-slot map. Type, color, texture, and supporting
              graphics stayed on separate layers.
            </p>
          </div>
          <TikTokTemplateSystem />
          <div className="project-section-body">
            <p>
              Most parts stayed within their own direction because I wanted each
              theme to hold together. I only proposed sharing a few pieces
              between Light Academia and e-Boy/e-Girl where the structure
              already aligned.
            </p>
          </div>
          <div className="tt-preview-process">
            <p className="tt-preview-process-lede">
              I started with loose sketches, then built each direction as a
              layered Photoshop file. The notes below paraphrase feedback from
              Global Creative Lab.
            </p>
            <div className="tt-preview-process-list">
              {TIKTOK_TEMPLATES.map((template) => (
                <article key={template.key} className="tt-preview-process-card">
                  <header>
                    <h3>{template.name}</h3>
                    {template.shipped ? <span>Shipped</span> : null}
                  </header>
                  <div className="tt-preview-process-media">
                    <figure className="tt-preview-sketch">
                      <ExpandableImage
                        src={template.sketch}
                        alt={`Original process sketch for ${template.name}`}
                        width={1600}
                        height={900}
                        sizes="(max-width: 768px) 100vw, 640px"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                      <figcaption>Process sketch</figcaption>
                    </figure>
                    <figure className="tt-preview-final">
                      <ExpandableImage
                        src={template.fullTemplate}
                        alt={`Finished static ${template.name} catalog template`}
                        width={1080}
                        height={1920}
                        sizes="(max-width: 768px) 75vw, 320px"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                      <figcaption>Static template</figcaption>
                    </figure>
                  </div>
                  <p className="tt-preview-iteration">
                    <strong>Iteration note</strong>
                    <span>{template.iterationNote}</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </ProjectChapter>

      <ProjectChapter
        entry={chapters[3]}
        index={4}
        total={chapters.length}
        variant="tiktok"
      >
        <div className="project-section tt-section tt-preview-outcome">
          {lightAcademia ? (
            <ol
              className="tt-outcome-sequence"
              aria-label="Light Academia iteration sequence"
            >
              <li className="tt-outcome-step">
                <p className="tt-outcome-step-label">Critique</p>
                <figure>
                  <ExpandableImage
                    src={lightAcademia.sketch}
                    alt="Light Academia process sketch"
                    width={1600}
                    height={900}
                    sizes="(max-width: 768px) 84vw, 280px"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <figcaption>
                    Global Creative Lab felt the simplicity was working and
                    encouraged a more upbeat, deliberate direction.
                  </figcaption>
                </figure>
              </li>
              <li className="tt-outcome-step">
                <p className="tt-outcome-step-label">My response</p>
                <figure>
                  <ExpandableImage
                    src="/projects/tiktok/system/academia-text.svg"
                    alt="Light Academia editorial title asset"
                    width={388}
                    height={268}
                    sizes="(max-width: 768px) 84vw, 280px"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <figcaption>
                    I kept the fixed catalog slot and refined the editorial
                    title, color, and supporting details.
                  </figcaption>
                </figure>
              </li>
              <li className="tt-outcome-step tt-outcome-step--shipped">
                <p className="tt-outcome-step-label">Shipped result</p>
                <figure>
                  <ExpandableImage
                    src={lightAcademia.fullTemplate}
                    alt="Finished Light Academia catalog template"
                    width={1080}
                    height={1920}
                    sizes="(max-width: 768px) 70vw, 220px"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <figcaption>
                    Light Academia entered the launch library.
                  </figcaption>
                </figure>
              </li>
            </ol>
          ) : null}
          <div className="project-section-body">
            <p>
              <mark className="case-highlight">
                I later learned through Global Creative Lab that American Eagle
                selected it.
              </mark>
            </p>
          </div>
        </div>
      </ProjectChapter>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
      <CaseHighlightObserver />
    </ReaderShell>
  );
}
