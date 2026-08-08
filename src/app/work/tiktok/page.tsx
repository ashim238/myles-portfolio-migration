import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { ExpandableImage } from "@/components/expandable-image";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectChapter } from "@/components/project-chapter";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { RecruiterCut } from "@/components/recruiter-cut";
import {
  TikTokCoverBlobs,
  TikTokLogo,
  TikTokTemplateSystem,
} from "@/components/tiktok-dsa";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import {
  evidenceSurfaceData,
  TIKTOK_DIRECTION_EVIDENCE_SURFACE,
} from "@/lib/project-evidence";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";
import { TIKTOK_TEMPLATES } from "@/lib/tiktok-data";
import styles from "./tiktok-four-beat.module.css";

const TIKTOK_DESCRIPTION =
  "Static catalog templates designed for TikTok's Dynamic Showcase Ads during a 2021 Global Creative Lab internship. Light Academia shipped in the launch library.";
const chapters = CASE_STUDY_CHAPTERS.tiktok;
const DIRECTION_SIGNALS = {
  dopamine: "Bright color, oversized type, and more graphic energy.",
  eboy: "Dark texture, harder edges, and more visual density.",
  lightacademia: "Editorial type, softer color, and the most restraint.",
} as const;

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
        <Link href="/#selected-work">
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
            three static catalog templates for TikTok&apos;s Dynamic Showcase Ads.
            The product structure stayed fixed while the art direction changed.
          </p>
        </div>
      </header>

      <RecruiterCut
        role="Creative Strategist Intern"
        team="Global Creative Lab"
        timeline="May – August 2021"
        evidence={{
          type: "Static shipped deliverable with an interactive explanation",
          cta: "Inspect the template system",
          href: "#tt-system",
        }}
        outcomeValue="1"
        outcomeLabel="of 3 templates shipped in the launch library"
        moves={[]}
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
              Dynamic Showcase Ads turned brand catalogs into reusable ad
              templates with fixed product slots. My deliverable was three
              static, layered Photoshop directions built around the same slot
              map. Product placement stayed put; type, color, texture, and
              supporting graphics could change.
            </p>
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
              I looked at Y2K, Maximalism, Dark Academia, WitchTok, and
              Cottagecore, then moved three directions forward because they felt
              clearly different without changing the catalog structure.
            </p>
          </div>

          <figure
            className={styles.directionProof}
            aria-labelledby="tt-direction-proof-title"
            {...evidenceSurfaceData(TIKTOK_DIRECTION_EVIDENCE_SURFACE)}
          >
            <figcaption id="tt-direction-proof-title">
              <strong>Three directions, one catalog structure.</strong>
              <span>Color and tone changed. Product placement did not.</span>
            </figcaption>
            <ul
              className={styles.directionGrid}
              aria-label="Selected direction differences"
            >
              {TIKTOK_TEMPLATES.map((template) => (
                <li key={template.key}>
                  <strong className={styles.directionName}>
                    {template.name}
                  </strong>
                  <span className={styles.directionSwatches} aria-hidden="true">
                    {template.palette.map((color) => (
                      <span
                        key={color.hex}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </span>
                  <p className={styles.directionSignal}>
                    {DIRECTION_SIGNALS[template.key]}
                  </p>
                </li>
              ))}
            </ul>
          </figure>
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
              I built each direction as a layered Photoshop file and separated
              the type, color, texture, and supporting graphics. Most parts stayed
              inside their own visual system. Light Academia and e-Boy/e-Girl
              shared enough structure for a few pieces to cross over.
            </p>
          </div>
          <TikTokTemplateSystem />
          <div className="project-section-body">
            <p>
              Feedback summaries are paraphrased from Global Creative Lab review.
              The comparison shows the system and the art direction, not ad
              performance.
            </p>
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
