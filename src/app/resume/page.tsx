import Link from "next/link";
import { PortfolioEndcap } from "@/components/portfolio-endcap";
import { SiteNav } from "@/components/site-nav";
import { createRouteMetadata, siteConfig } from "@/lib/site-config";

const RESUME_UPDATED = "July 2026";

type ResumeRole = {
  role: string;
  org: string;
  dates: string;
  bullets: string[];
};

type IndependentProject = {
  name: string;
  href: string;
  role: string;
  dates: string;
  summary: string;
};

const INDEPENDENT_WORK: IndependentProject[] = [
  {
    name: "Fresh Greens",
    href: "https://www.mylesdesignsthings.com/work/fresh-greens",
    role: "Solo Designer & Engineer",
    dates: "2025 – 2026",
    summary:
      "Working React Native prototype for Black drivers, designed and built solo. Uses a three-layer architecture, reserved-color signaling system, and accessibility features: WCAG dash-pattern encoding, dynamic type, and VoiceOver support.",
  },
  {
    name: "UnderstandingFAFSA",
    href: "https://www.mylesdesignsthings.com/work/understandingfafsa",
    role: "Product Designer",
    dates: "Feb 2025 – Present",
    summary:
      "Newsletter redesign for a nonprofit navigating financial aid. Built modular Figma to Mailchimp templates with locked-vs-swappable rules so a non-designer founder could ship on-brand without a designer in the loop. With one collaborator, compiled and evaluated 120+ newsletter examples across four criteria to ground the redesign. The first redesigned send had an observed 52.6% open rate with Mailchimp Privacy Protection excluded.",
  },
  {
    name: "Navi",
    href: "https://www.mylesdesignsthings.com/work/navi",
    role: "UI/UX Designer",
    dates: "Jan – Jun 2025",
    summary:
      "Graduate-studio concept for NYC neighborhood experiences. The team audited six travel platforms and reviewed 14 resident-survey responses. I synthesized the findings and created three research-informed archetypes using survey responses, platform audits, and secondary research. I later rebuilt the concept as a live component library and working booking flow.",
  },
];

const EXPERIENCE: ResumeRole[] = [
  {
    role: "Creative Strategy Assistant",
    org: "Universal Music Group, Island Records",
    dates: "Aug 2023 – Aug 2024",
    bullets: [
      "Owned music-video delivery across the Island Records roster: partnered with artist production teams pre-shoot to meet UMG’s ingestion and monetization specs, managed deadlines and vendor handoffs (Vevo, Apple), ran Vevo release events, and handled last-minute re-ingests through high-pressure releases like Sabrina Carpenter’s “Feather.”",
      "Coordinated a last-minute custom-merch rollout for charlieonnafriday on Tate McRae’s tour: sourced the vendor and managed production-to-venue logistics with the artist’s PM so custom jerseys hit each stop on show day.",
    ],
  },
  {
    role: "Creative Strategist Intern",
    org: "TikTok (ByteDance)",
    dates: "May – Aug 2022",
    bullets: [
      "Pitched the “rabbit hole” creative concept for TikTok World 2022: an infinite-scroll-inspired immersive theme the team ran with, realized as a funhouse-style portal entry with interactive activations. Wrote Shopping Ads launch copy later reused across TikTok for Business e-commerce.",
    ],
  },
  {
    role: "Creative Strategist Intern",
    org: "TikTok (ByteDance)",
    dates: "May – Aug 2021",
    bullets: [
      "Designed 3 of ~10 templates in TikTok’s Dynamic Showcase Ads launch batch. Light Academia shipped in the launch library. I later learned through Global Creative Lab that American Eagle selected it. The format debuted at TikTok World 2021 and was later folded into TikTok’s Video Shopping Ads.",
    ],
  },
];

const SKILLS: { label: string; items: string[] }[] = [
  {
    label: "Design",
    items: [
      "End-to-end product & UX design",
      "User research",
      "Design thinking",
      "IA",
      "Prototyping",
      "Interaction & visual design",
      "Design systems",
      "Typography",
      "Accessibility (WCAG)",
    ],
  },
  {
    label: "Tools & Build",
    items: [
      "Figma",
      "Adobe Creative Suite",
      "After Effects",
      "React Native",
      "TypeScript",
      "Expo",
      "HTML",
      "CSS",
      "Claude",
    ],
  },
];

export const metadata = createRouteMetadata({
  title: "Résumé",
  description: `Résumé and contact information for ${siteConfig.name}.`,
  path: "/resume",
});

export default function ResumePage() {
  return (
    <main className="page-shell project-page" id="main-content">
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/">
          <span aria-hidden="true">← </span>
          Home
        </Link>
      </nav>

      <header className="resume-layout" aria-labelledby="resume-title">
        <div className="resume-primary">
          <p className="resume-label">Résumé · updated {RESUME_UPDATED}</p>
          <h1 id="resume-title" className="resume-heading">
            {siteConfig.name}
          </h1>
          <h2 className="resume-summary-heading">Professional Summary</h2>
          <p className="resume-body">
            Product designer (MFA, Parsons) with a creative strategy
            background at TikTok and Universal Music Group. I&apos;ve taken
            projects from interviews and usability tests through
            visual systems and working React Native builds.
          </p>
          <a
            className="resume-note"
            href="/myles-ashitey-resume.pdf"
            download="myles-ashitey-resume.pdf"
          >
            Download résumé PDF
          </a>
        </div>

        <section className="resume-aside" aria-label="Quick details">
          <address className="resume-contact">
            <dl className="resume-details">
              <div className="resume-detail">
                <dt>Focus</dt>
                <dd>Product Design</dd>
              </div>
              <div className="resume-detail">
                <dt>Location</dt>
                <dd>New York, NY</dd>
              </div>
              <div className="resume-detail">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </dd>
              </div>
              <div className="resume-detail">
                <dt>LinkedIn</dt>
                <dd>
                  <a href="https://linkedin.com/in/myles-ashitey">LinkedIn</a>
                </dd>
              </div>
              <div className="resume-detail">
                <dt>Portfolio</dt>
                <dd>
                  <a href={siteConfig.siteUrl}>mylesdesignsthings.com</a>
                </dd>
              </div>
            </dl>
          </address>
        </section>
      </header>

      <section className="resume-experience" aria-labelledby="resume-independent-title">
        <h2 id="resume-independent-title" className="resume-section-heading">
          Independent Work
        </h2>
        <ol className="resume-role-list" role="list">
          {INDEPENDENT_WORK.map((project) => (
            <li key={project.name} className="resume-role">
              <div className="resume-role-head">
                <div>
                  <h3 className="resume-role-title">
                    <a href={project.href}>{project.name}</a>
                  </h3>
                  <p className="resume-role-org">{project.role}</p>
                </div>
                <p className="resume-role-dates">{project.dates}</p>
              </div>
              <p className="resume-role-summary">{project.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="resume-experience" aria-labelledby="resume-experience-title">
        <h2 id="resume-experience-title" className="resume-section-heading">
          Work Experience
        </h2>
        <ol className="resume-role-list" role="list">
          {EXPERIENCE.map((role) => (
            <li key={`${role.org}-${role.dates}`} className="resume-role">
              <div className="resume-role-head">
                <div>
                  <h3 className="resume-role-title">{role.role}</h3>
                  <p className="resume-role-org">{role.org}</p>
                </div>
                <p className="resume-role-dates">{role.dates}</p>
              </div>
              <ul className="resume-role-bullets">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="resume-experience" aria-labelledby="resume-education-title">
        <h2 id="resume-education-title" className="resume-section-heading">
          Education
        </h2>
        <ol className="resume-role-list" role="list">
          <li className="resume-role">
            <div className="resume-role-head">
              <div>
                <h3 className="resume-role-title">
                  MFA, Design &amp; Technology
                </h3>
                <p className="resume-role-org">Parsons School of Design</p>
              </div>
              <p className="resume-role-dates">Aug 2024 – May 2026</p>
            </div>
          </li>
          <li className="resume-role">
            <div className="resume-role-head">
              <div>
                <h3 className="resume-role-title">BA, Media Studies</h3>
                <p className="resume-role-org">Pomona College</p>
              </div>
              <p className="resume-role-dates">Aug 2018 – Dec 2022</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="resume-skills" aria-labelledby="resume-skills-title">
        <h2 id="resume-skills-title" className="resume-section-heading">
          Skills
        </h2>
        <dl className="resume-skill-list">
          {SKILLS.map((group) => (
            <div key={group.label} className="resume-skill-group">
              <dt>{group.label}</dt>
              <dd>{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <PortfolioEndcap context="resume" />

    </main>
  );
}
