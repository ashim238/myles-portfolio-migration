import Image from "next/image";
import { Fragment } from "react";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { TikTokCoverBlobs, TikTokLogo } from "@/components/tiktok-dsa";
import { TIKTOK_TEMPLATES } from "@/lib/tiktok-data";

const tiktokProof = {
  label: "Inspect the template system",
  href: "#tt-template-inspector",
};

/** The legacy variant is used only by the protected review route. */
export function TikTokOpening({ legacy = false }: { legacy?: boolean }) {
  return <>
    <header className={`tt-cover tt-cover--preview${legacy ? "" : " tt-cover--work"}`} data-project-enter-cover>
      {legacy ? <TikTokCoverBlobs /> : null}
      <div className="tt-cover-inner">
        <p className="tt-eyebrow"><TikTokLogo /><span>Creative Strategist Intern · 2021</span></p>
        <h1 id="tt-title" className="project-hero-title tt-title">TikTok Dynamic Showcase Ads</h1>
        <p className="project-hero-lede tt-lede">The templates needed to appeal to different styles and aesthetics,
          so I had room to think outside the box.</p>
      </div>
      {legacy ? null : <div className="tt-cover-work tt-original-plates" aria-label="Original catalog templates" role="group">
        {TIKTOK_TEMPLATES.map(template => (
          <figure key={template.key} className="tt-original-plate">
            <Image src={template.fullTemplate} alt={template.name + " catalog template"} width={1080} height={1920}
              unoptimized loading="eager" />
            <figcaption>{template.name.split(/(?<=[a-z])(?=[A-Z])|(?<=\/)/).map((word, index) => (
              <Fragment key={word}>{index > 0 && <wbr />}{word}</Fragment>
            ))}</figcaption>
          </figure>
        ))}
      </div>}
    </header>
    <ProjectOpeningFacts
      role="Creative Strategist Intern · Global Creative Lab"
      goal="Give fashion brands three reusable templates for showing their catalogs on TikTok."
      outcome="Light Academia entered the launch library. I later learned through Global Creative Lab that American Eagle selected it."
      proof={tiktokProof}
    />
  </>;
}
