import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { ExpandableImage } from "@/components/expandable-image";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectChapter } from "@/components/project-chapter";
import { TikTokOpening } from "@/components/tiktok-opening";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { ProjectEvidenceDisclosure } from "@/components/project-evidence-disclosure";
import { RecruiterCut } from "@/components/recruiter-cut";
import {
  TikTokTemplateSystem,
} from "@/components/tiktok-dsa";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { createRouteMetadata } from "@/lib/site-config";
import { LIGHT_ACADEMIA_TITLE, TIKTOK_TEMPLATES } from "@/lib/tiktok-data";
import styles from "./tiktok-four-beat.module.css";

const TIKTOK_DESCRIPTION =
  "Three static fashion catalog templates designed for TikTok's Dynamic Showcase Ads during a 2021 Global Creative Lab internship. Light Academia entered the launch library.";
const chapters = CASE_STUDY_CHAPTERS.tiktok;

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProjectBySlug("tiktok");
  const isPublic = project?.status === "published";

  return {
    ...createRouteMetadata({
      title: "TikTok Dynamic Showcase Ads",
      description: TIKTOK_DESCRIPTION,
      path: "/work/tiktok",
      image: "/og/tiktok",
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
          Projects
        </Link>
      </nav>

      <TikTokOpening />
      <RecruiterCut
        timeline="May – August 2021"
        moves={[
          "Review: I showed early sketches in weekly GCL huddles and refined the directions through internal critique.",
          "Research: I used market research and burner accounts to study how different TikTok subcultures presented themselves.",
          "Boundary: The work was reviewed internally. I wasn't told why American Eagle chose Light Academia or what happened to the other two templates. I didn't receive performance data.",
        ]}
      />

      <div className="case-book">
        <aside className="book-index" aria-label="Chapter index">
          <ProjectToc sections={chapters} />
        </aside>
        <div className="book-pages">
          <ProjectChapter
            entry={chapters[0]}
            index={1}
            total={chapters.length}
            variant="tiktok"
          >
            <div className="project-section tt-section">
              <div className="project-section-body">
                <p>
                  The brief asked for{" "}<strong>three templates for clients in the fashion
                  vertical.</strong>{" "}Each one had to hold a fashion product catalog while
                  appealing to a different style or aesthetic, but{" "}<strong>the dimensions
                  and product slots were set in stone</strong>{" "}before I received the brief.
                  I could change the type, color, texture, and supporting graphics.
                </p>
                <p>
                  I showed my first sketches to my manager and other Global Creative
                  Lab members during our weekly GCL huddle. I think there was enough
                  variation between them that, even with critiques, the team liked
                  the overall direction.
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
                    <dd>Reusable fashion catalog templates for clients</dd>
                  </div>
                  <div>
                    <dt>Deliverable</dt>
                    <dd>
                      Three static template directions as layered Photoshop files
                    </dd>
                  </div>
                  <div>
                    <dt>Fixed parts</dt>
                    <dd>Template dimensions, product slots, and the shared slot map</dd>
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
                  One point the team drove home during the internship was that
                  TikTok tailors the feed to what someone engages with. No surprise
                  there. Some subcultures drew a bigger crowd than others. There was
                  no one subculture that wholly represented the site. That pushed me
                  toward looking at several of them.
                </p>
                <p>
                  I did traditional market research. I also{" "}<strong>made burner accounts and
                  changed what each one engaged with</strong>{" "}to see what surfaced. Within
                  each aesthetic, I looked at popular posts, how community members
                  talked to each other, and how prominent creators presented
                  themselves. I was looking for things I could mimic in a 2D design,
                  mainly color, type, and texture.
                </p>
                <p>
                  I compared Y2K, Maximalism, Dark Academia, WitchTok, and
                  Cottagecore before narrowing the work to Dopamine Dressing,
                  e-Boy/e-Girl, and Light Academia. The assignment only allowed
                  three templates, so I did have to flatten the aesthetics
                  somewhat.
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
                  The saturated colors I saw in Dopamine Dressing posts were already
                  close to TikTok&apos;s own palette. I leaned into that overlap
                  and tried #OOTD in an early sketch. I wanted the ad to feel at
                  home among the outfit posts in someone&apos;s feed.
                </p>
                <p>
                  I dropped that sketch because the copy felt like it was trying
                  too hard and the whole thing looked like an ad for TikTok. A fashion
                  brand still had to be able to use it. In the final template, I{" "}
                  <strong>kept the colors bright and put “FIT CHECK” above the space for
                  the brand&apos;s product.</strong>
                </p>
                <p>
                  I built all three as layered Photoshop files around the same
                  product-slot map. I kept the type, color, texture, and supporting
                  graphics on separate layers.
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
              <ProjectEvidenceDisclosure summary="View all three sketch-to-template comparisons">
                <div className="tt-preview-process">
                  <p className="tt-preview-process-lede">
                    I started with loose sketches, then built each direction as a
                    layered Photoshop file. I don&apos;t remember the exact critique
                    language, so the notes below paraphrase the feedback visible in
                    the sketches and what I remember from Global Creative Lab.
                  </p>
                  <div className="tt-preview-process-list">
                    {TIKTOK_TEMPLATES.map((template) => (
                      <article key={template.key} className="tt-preview-process-card">
                        <header>
                          <h3>{template.name}</h3>
                          {template.launchLibraryStatus === "confirmed" ? (
                            <span>Launch library</span>
                          ) : null}
                        </header>
                        <div className="tt-preview-process-media">
                          <figure className="tt-preview-sketch">
                            <ExpandableImage
                              src={template.sketch}
                              alt={`Original process sketch for ${template.name}`}
                              width={template.sketchWidth}
                              height={template.sketchHeight}
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
              </ProjectEvidenceDisclosure>
            </div>
          </ProjectChapter>

          <ProjectChapter
            entry={chapters[3]}
            index={4}
            total={chapters.length}
            variant="tiktok"
          >
            <div className="project-section tt-section tt-section--wide tt-preview-outcome">
              {lightAcademia ? (
                <div className="tt-outcome-sequence">
                  <ol className="tt-outcome-steps" aria-label="Light Academia iteration sequence">
                  <li className="tt-outcome-step tt-outcome-step--critique">
                    <p className="tt-outcome-step-label">Critique</p>
                    <figure>
                      <ExpandableImage
                        src={lightAcademia.sketch}
                        alt="Light Academia process sketch"
                        width={4393}
                        height={2741}
                        sizes="(max-width: 700px) 84vw, (max-width: 1200px) 48vw, 608px"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                      <figcaption>
                        The sketch notes called for smaller type, a subtler Light
                        Academia treatment, reconsidered copy placement, and a calm
                        pastel palette.
                      </figcaption>
                    </figure>
                  </li>
                  <li className="tt-outcome-step">
                    <p className="tt-outcome-step-label">My response</p>
                    <figure>
                      <ExpandableImage
                        src={LIGHT_ACADEMIA_TITLE.src}
                        {...LIGHT_ACADEMIA_TITLE.detail}
                        style={{ height: "auto", display: "block" }}
                      />
                      <figcaption>
                        I scaled down the type, moved the copy, kept the fixed
                        catalog slot, and introduced the calmer palette.
                      </figcaption>
                    </figure>
                  </li>
                  <li className="tt-outcome-step tt-outcome-step--shipped">
                    <p className="tt-outcome-step-label">
                      Launch-library result
                    </p>
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
                </div>
              ) : null}
              <div className="project-section-body">
                <p>
                  The work was reviewed internally by Global Creative Lab and people
                  adjacent to the project. As far as I know, it wasn&apos;t shown to
                  external brands or audience members during my internship.
                </p>
                <p>
                  <mark className="case-highlight">
                    I later learned through Global Creative Lab that American Eagle
                    selected it.
                  </mark>{" "}
                  I wasn&apos;t told why American Eagle selected Light Academia.{" "}<strong>I
                  didn&apos;t receive performance data,</strong>{" "}and I don&apos;t know what happened
                  to the other two templates. Internships are very transitory, so
                  I&apos;m left doing work without knowing the full impact.
                </p>
                <p>
                  Now, I check with stakeholders at multiple stages to see if they
                  like the direction of the work. With tools like Claude Code and
                  Figma Make, a low-stakes, convincing mockup takes a lot less
                  investment. I can show the team something concrete before the
                  work feels too finished to change.
                </p>
              </div>
            </div>
          </ProjectChapter>
        </div>
      </div>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
      <CaseHighlightObserver />
    </ReaderShell>
  );
}
