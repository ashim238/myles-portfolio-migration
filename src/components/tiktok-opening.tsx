import { ProductThumbnail } from "@/components/myles-97/product-thumbnail";
import { ProjectOpeningFacts } from "@/components/project-opening-facts";
import { TikTokCoverBlobs, TikTokLogo } from "@/components/tiktok-dsa";

const tiktokProof = {
  label: "Inspect the template system",
  href: "#tt-system",
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
      {legacy ? null : <div className="tt-cover-work" role="img" aria-label="The three original fashion template directions: e-Boy/e-Girl, Light Academia and Dopamine Dressing.">
        <ProductThumbnail project="tiktok" active reduced />
      </div>}
    </header>
    <ProjectOpeningFacts
      role="Creative Strategist Intern · Global Creative Lab"
      scope="I designed three fashion catalog templates inside dimensions and product slots that were fixed before I received the brief."
      outcome="Light Academia entered the launch library. I later learned through Global Creative Lab that American Eagle selected it."
      proof={tiktokProof}
    />
  </>;
}
