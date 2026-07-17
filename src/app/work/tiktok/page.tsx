import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { ExpandableImage } from "@/components/expandable-image";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { RecruiterCut } from "@/components/recruiter-cut";
import { SiteNav } from "@/components/site-nav";
import {
  TikTokCoverBlobs,
  TikTokLogo,
  TikTokTemplateSystem,
} from "@/components/tiktok-dsa";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";
import { createRouteMetadata } from "@/lib/site-config";
import { TIKTOK_TEMPLATES } from "@/lib/tiktok-data";

const TIKTOK_DESCRIPTION =
  "Static catalog templates designed for TikTok's Dynamic Showcase Ads during a 2021 Global Creative Lab internship. Light Academia shipped in the launch library.";

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
    <main
      className="page-shell project-page tt-page tt-preview-page"
      id="main-content"
      data-project-slug="tiktok"
    >
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">← </span>
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

      <RecruiterCut
        role="Creative Strategist Intern"
        team="Global Creative Lab"
        timeline="May – August 2021"
        outcomeValue="1"
        outcomeLabel="of 3 templates shipped in the launch library"
        moves={[
          "Studied Y2K, Maximalism, Dark Academia, WitchTok, and Cottagecore before choosing the final directions.",
          "Used one product slot map across Dopamine Dressing, e-Boy/e-Girl, and Light Academia.",
          "Built the files in parts and tested which elements could mix across directions.",
        ]}
      />

      <ProjectToc
        sections={[
          { title: "Fashion subcultures on TikTok", id: "tt-research" },
          { title: "Defining the fixed catalog structure", id: "tt-system" },
          { title: "Templates as modular parts", id: "tt-modular" },
          { title: "From sketches to layered files", id: "tt-templates" },
          { title: "What shipped from the launch batch", id: "tt-outcome" },
        ]}
      />

      <section
        className="project-section tt-section"
        aria-labelledby="tt-research"
      >
        <h2 id="tt-research">Fashion subcultures on TikTok</h2>
        <div className="project-section-body">
          <p>
            Before I moved into mockups, I looked at Y2K, Maximalism, Dark
            Academia, WitchTok, and Cottagecore. Those references helped me
            compare how different parts of TikTok&apos;s fashion community used
            type, color, texture, and imagery. I moved forward with Dopamine
            Dressing, e-Boy/e-Girl, and Light Academia because the differences
            were obvious at a glance.
          </p>
        </div>
      </section>

      <section
        className="project-section tt-section tt-section--wide"
        aria-labelledby="tt-system"
      >
        <h2 id="tt-system">Defining the fixed catalog structure</h2>
        <div className="project-section-body">
          <p>
            Brands added their product catalog to a pre-made template. I
            handed off layered Photoshop files with a slot map showing where
            each asset would go.
          </p>
        </div>
        <TikTokTemplateSystem />
      </section>

      <section
        className="project-section tt-section"
        aria-labelledby="tt-modular"
      >
        <h2 id="tt-modular">Templates as modular parts</h2>
        <div className="project-section-body">
          <p>
            I built each template in parts so the catalog content could drop
            into a fixed structure. While working that way, I started to see
            the individual pieces as a system brands could potentially
            customize rather than a single locked composition.
          </p>
          <p>
            I pitched that direction while I was constructing the files, and
            GCL encouraged me to keep exploring it. Most combinations worked
            best inside their own visual system. Light Academia and
            #e-Boy/#e-Girl shared enough structure that I could borrow some
            parts between them.
          </p>
        </div>
      </section>

      <section className="tt-preview-process" aria-labelledby="tt-templates">
        <h2 id="tt-templates">From sketches to layered files</h2>
        <p className="tt-preview-process-lede">
          I started with loose sketches, then built each direction as a layered
          Photoshop file. The notes below paraphrase feedback from Global
          Creative Lab.
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
                    style={{ width: "100%", height: "auto", display: "block" }}
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
                    style={{ width: "100%", height: "auto", display: "block" }}
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
      </section>

      <section
        className="project-section tt-section tt-preview-outcome"
        aria-labelledby="tt-outcome"
      >
        <h2 id="tt-outcome">What shipped from the launch batch</h2>
        {lightAcademia ? (
          <ol className="tt-outcome-sequence" aria-label="Light Academia iteration sequence">
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
                  The simplicity was working. GCL asked me to make it feel more upbeat and deliberate.
                </figcaption>
              </figure>
            </li>
            <li className="tt-outcome-step">
              <p className="tt-outcome-step-label">Design move</p>
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
                  I kept the fixed catalog slot and refined the editorial title and supporting details.
                </figcaption>
              </figure>
            </li>
            <li className="tt-outcome-step tt-outcome-step--shipped">
              <p className="tt-outcome-step-label">Shipped direction</p>
              <figure>
                <ExpandableImage
                  src={lightAcademia.fullTemplate}
                  alt="Finished Light Academia catalog template"
                  width={1080}
                  height={1920}
                  sizes="(max-width: 768px) 70vw, 220px"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <figcaption>Light Academia entered the launch library.</figcaption>
              </figure>
            </li>
          </ol>
        ) : null}
        <div className="project-section-body">
          <p>
            Light Academia shipped in the launch library.{" "}
            <mark className="case-highlight">
              I later learned through Global Creative Lab that American Eagle
              selected it.
            </mark>
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}
