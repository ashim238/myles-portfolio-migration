import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { RecruiterCut } from "@/components/recruiter-cut";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { AESTHETICS } from "@/lib/tiktok-data";
import {
  AestheticShowcaseCard,
  HeroThreePhones,
  TemplateAnatomy,
  TikTokCoverBlobs,
  TikTokLogo,
} from "@/components/tiktok-dsa";
import { CaseHighlightObserver } from "@/components/case-highlight-observer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";

const TIKTOK_DESCRIPTION =
  "An internship-era template system for TikTok's Dynamic Showcase Ads, designed around the platform's subculture density and adopted by American Eagle.";

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProjectBySlug("tiktok");
  const isPublic = project?.status === "published";

  return {
    title: "TikTok Dynamic Showcase Ads",
    description: TIKTOK_DESCRIPTION,
    robots: isPublic
      ? undefined
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title: "TikTok Dynamic Showcase Ads",
      description: TIKTOK_DESCRIPTION,
      type: "article",
    },
  };
}

export default async function TikTokPage() {
  const project = await getProjectBySlug("tiktok");
  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await getPublishedProjects();

  return (
    <main
      className="page-shell project-page tt-page"
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

      <header className="tt-cover" data-project-enter-cover>
        <TikTokCoverBlobs />
        <div className="tt-cover-inner">
          <p className="tt-eyebrow">
            <TikTokLogo />
            <span>Internship · 2021</span>
          </p>
          <h1 id="tt-title" className="project-hero-title tt-title">
            TikTok Dynamic Showcase Ads
          </h1>
          <p className="project-hero-lede tt-lede">
            I designed three catalog ad templates during my 2021 Brand Studio
            internship. Each used the same structure with a different visual
            system, and American Eagle adopted the Light Academia template.
          </p>
          <div className="tt-hero-device">
            <HeroThreePhones />
          </div>
        </div>
      </header>

      <RecruiterCut
        problem="Dynamic Showcase Ads used reusable product-catalog templates. The launch batch needed multiple visual directions for TikTok's subcultures."
        role="Visual Designer, Brand Studio"
        contribution="Designed three of roughly ten templates in TikTok's Dynamic Showcase Ads launch batch."
        team="Brand Studio launch batch, roughly ten templates total"
        feedback="Reviews pushed the work toward TikTok's brand guidelines, more dimension and texture, and a more upbeat tone."
        timeline="May – August 2021"
        stack="Illustrator, Photoshop"
        stackLabel="Tools"
        outcomeValue="1"
        outcomeLabel="of 3 templates shipped, adopted by American Eagle"
        moves={[
          "Grouped five visual references into three aesthetic directions.",
          "Built all three templates against one shared slot map.",
          "Designed three templates. Light Academia shipped, and American Eagle adopted it.",
        ]}
      />

      <section className="project-section tt-section tt-section--wide" aria-labelledby="tt-system">
        <h2 id="tt-system">One skeleton. Three fills.</h2>
        <div className="project-section-body">
          <p>
            I drew one slot map for the title zone, catalog grid,
            supplementary graphics, and CTA. Those roles stayed fixed while
            typography, palette, ornament, and image treatment changed across
            each aesthetic.
          </p>
        </div>

        <TemplateAnatomy />
      </section>

      <section className="tt-aesthetics-section" aria-labelledby="tt-aesthetics">
        <h2 id="tt-aesthetics" className="tt-aesthetics-heading">Three aesthetics.</h2>
        <p className="tt-aesthetics-lede">
          Each card shows the sketch, finished template, palette, and feedback
          from Brand Studio reviews.
        </p>

        <AestheticShowcaseCard
          name={AESTHETICS[0].name}
          internalLabel={AESTHETICS[0].internalLabel}
          accentHex="#FF5576"
          palette={AESTHETICS[0].palette}
          anchorText="I used 70s psychedelia as the reference, with fluid forms and color doing most of the work."
          feedback="Continue incorporating TikTok's brand guidelines and brand copy."
          process={{
            src: "/projects/tiktok/lofi-dopamine.png",
            alt: "Hand-drawn lo-fi sketch for #DopamineDressing with notes: 'play with brand colors', 'broader abstract pattern', copy candidates '#OOTD', '#Daily fit', 'Dress for dopamine', 'The Fit'.",
          }}
          feature={{
            src: "/projects/tiktok/template-dopamine.png",
            alt: "Finished #DopamineDressing template. A denim shirt on a hanger with 'FIT CHECK' title over a blue and teal psychedelic-swirl background.",
            caption: "Finished template.",
          }}
        />

        <AestheticShowcaseCard
          name={AESTHETICS[1].name}
          internalLabel={AESTHETICS[1].internalLabel}
          accentHex="#313539"
          reverse
          palette={AESTHETICS[1].palette}
          anchorText="Grungy punk magazines gave this direction its texture and distress. I had to keep that edge close to TikTok's upbeat visual language."
          feedback="Continue working on the design, but note that the aesthetic deviates from what TikTok is known for. Use dimension and texture to elevate it."
          process={{
            src: "/projects/tiktok/lofi-eboy.png",
            alt: "Hand-drawn lo-fi sketch for #e-Boy/#e-Girl with notes: 'may stray too far from guidelines', 'build it out more', 'if no color find a way to make it appealing', 'wear and tear', 'magazine spine', 'title overcrowded'.",
          }}
          feature={{
            src: "/projects/tiktok/template-eboy.png",
            alt: "Finished #e-Boy/#e-Girl template. Denim shirt on a torn-paper-edge dark background with distressed magazine-spine texture.",
            caption: "Finished template.",
          }}
        />

        <AestheticShowcaseCard
          name={AESTHETICS[2].name}
          internalLabel={AESTHETICS[2].internalLabel}
          accentHex="#EDC4AC"
          palette={AESTHETICS[2].palette}
          anchorText="I pulled the clean, pastel frame from Acne Studios campaigns. The first pass felt under-built, so I worked on making the simplicity more deliberate."
          feedback="Lean into TikTok's upbeat tone. Consider how simplicity can strengthen a design."
          process={{
            src: "/projects/tiktok/lofi-light-academia.png",
            alt: "Hand-drawn lo-fi sketch for #LightAcademia with notes: 'scale down font, light academia is too subtle', 'rethink placement bug', 'gestalt, calming color palette', 'barcode generator'.",
          }}
          feature={{
            src: "/projects/tiktok/template-light-academia.png",
            alt: "Finished #LightAcademia template. Denim shirt centered on a peach background with 'THE STYLE ZINE' editorial title.",
            caption: "Finished template. The one American Eagle adopted.",
          }}
        />
      </section>

      <p className="project-section-body tt-outcome-closer">
        Of the three templates I designed,{" "}
        <mark className="case-highlight">
          American Eagle adopted the Light Academia template.
        </mark>
      </p>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
      <CaseHighlightObserver />
    </main>
  );
}
