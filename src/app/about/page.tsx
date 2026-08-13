import Link from "next/link";
import { SystemDocumentShell } from "@/components/myles-97/system-document-shell";
import { createRouteMetadata, siteConfig } from "@/lib/site-config";

export const metadata = createRouteMetadata({
  title: "About",
  description: `About ${siteConfig.name}: product designer based in Brooklyn.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <SystemDocumentShell program="about" title="About Myles">
      <section className="about-layout" aria-labelledby="about-title">
        <div className="about-primary">
          <p className="about-kicker">About</p>
          <h1 id="about-title" className="about-heading">
            {siteConfig.name}
          </h1>

          <div className="about-actions about-page-actions">
            <Link className="about-action" href="/#selected-work">
              See the work
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="about-action" href="/resume">
              Read the résumé
              <span aria-hidden="true">→</span>
            </Link>
            <a className="about-action" href={`mailto:${siteConfig.email}`}>
              Get in touch
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="about-body">
            <p>
              I came to product design through creative strategy at TikTok
              and Universal Music Group. I learned how brands talk to people,
              then realized I wanted to build rather than just shape. That led
              me to an MFA in Design and Technology at Parsons, which I
              completed in 2026.
            </p>
            <p>
              My thesis became Fresh Greens, a React Native wayfinding
              prototype for Black drivers. For UnderstandingFAFSA, I built
              reusable newsletter templates. The first redesigned send had an observed 52.6% open rate
              with Mailchimp Privacy Protection excluded. At TikTok, I designed
              three catalog templates. One
              entered the launch library and was later selected by American
              Eagle.
            </p>
            <p>
              Outside of work, I&apos;m a huge comic fan. The work Daniel
              Mora&apos;s been doing on World&apos;s Finest is
              &ldquo;chef&apos;s kiss.&rdquo; I&apos;ve also been trying to hike
              more, as much as the city and my allergies allow. If you want to
              talk product design, RPGs, or a bit of both, my email is below.
            </p>
          </div>
        </div>

        <section className="about-aside" aria-labelledby="about-details-title">
          <h2 className="sr-only" id="about-details-title">
            Quick details
          </h2>
          <dl className="about-details">
            <div className="about-detail">
              <dt>Based in</dt>
              <dd>Brooklyn, NY</dd>
            </div>
            <div className="about-detail">
              <dt>Education</dt>
              <dd>MFA · Design and Technology, Parsons · 2026</dd>
            </div>
            <div className="about-detail">
              <dt>Tools</dt>
              <dd>Figma · Adobe Suite · React Native · TypeScript</dd>
            </div>
            <div className="about-detail">
              <dt>Contact</dt>
              <dd>
                <a href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </section>
    </SystemDocumentShell>
  );
}
