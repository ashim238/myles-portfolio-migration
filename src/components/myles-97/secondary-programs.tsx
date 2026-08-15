import Link from "next/link";
import {
  LoosePartsProgram,
  type LoosePartSummary,
} from "@/components/myles-97/loose-parts-program";
import type { ProgramId } from "@/lib/myles-97/programs";
import { siteConfig } from "@/lib/site-config";

export type SecondaryProgramId = Extract<
  ProgramId,
  "about" | "loose-parts" | "resume"
>;

function AboutPreview() {
  return (
    <div className="myles97-secondary-program">
      <p className="myles97-eyebrow">About</p>
      <h2>{siteConfig.name}</h2>
      <p>
        Product designer based in Brooklyn. I came to product design through
        creative strategy at TikTok and Universal Music Group, then completed an
        MFA in Design and Technology at Parsons in 2026.
      </p>
      <dl>
        <div>
          <dt>Based in</dt>
          <dd>Brooklyn, NY</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>Product design + working prototypes</dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </dd>
        </div>
      </dl>
      <Link className="myles97-primary-button" href="/about">
        Open full About page
      </Link>
    </div>
  );
}

function ResumePreview() {
  return (
    <div className="myles97-secondary-program">
      <p className="myles97-eyebrow">Résumé · updated August 2026</p>
      <h2>{siteConfig.name}</h2>
      <p>
        Product designer with an MFA from Parsons and a creative-strategy
        background at TikTok and Universal Music Group. Work spans research,
        visual systems, prototypes, and React Native builds.
      </p>
      <dl>
        <div>
          <dt>Focus</dt>
          <dd>Product Design</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>New York, NY</dd>
        </div>
        <div>
          <dt>Education</dt>
          <dd>MFA, Design &amp; Technology · Parsons · 2026</dd>
        </div>
      </dl>
      <div className="myles97-secondary-actions">
        <Link className="myles97-primary-button" href={siteConfig.resumeUrl}>
          Open full résumé
        </Link>
        <a href="/myles-ashitey-resume.pdf" download="myles-ashitey-resume.pdf">
          Download PDF
        </a>
      </div>
    </div>
  );
}

export function SecondaryProgram({
  id,
  looseParts,
}: {
  id: SecondaryProgramId;
  looseParts: readonly LoosePartSummary[];
}) {
  switch (id) {
    case "about":
      return <AboutPreview />;
    case "loose-parts":
      return <LoosePartsProgram entries={looseParts} />;
    case "resume":
      return <ResumePreview />;
  }
}
