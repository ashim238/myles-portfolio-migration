import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site-config";

const RESUME_PATH = "/myles-ashitey-cv.pdf";
const RESUME_UPDATED = "July 2026";

type ResumeRole = {
  role: string;
  org: string;
  dates: string;
  summary: string;
};

const EXPERIENCE: ResumeRole[] = [
  {
    role: "MFA, Design and Technology",
    org: "Parsons School of Design",
    dates: "Aug 2024 – May 2026",
    summary:
      "Thesis: Fresh Greens, a solo-built React Native wayfinding app for Black travel in America with WCAG dash-pattern encoding, dynamic type, and VoiceOver support built in from the start.",
  },
  {
    role: "Creative Strategy Assistant",
    org: "Universal Music Group, Island Records",
    dates: "Aug 2023 – Aug 2024",
    summary:
      "Led tour promotion end to end and coordinated on-time music video delivery for global artists across Vevo, Facebook, and Apple, working across vendors, stakeholders, and fixed client timelines.",
  },
  {
    role: "Creative Strategist Intern",
    org: "TikTok (ByteDance)",
    dates: "May – Aug 2022",
    summary:
      "Designed the TikTok World summit visual experience and wrote Shopping Ads launch copy later reused across TikTok for Business e-commerce offerings.",
  },
  {
    role: "Creative Strategist Intern",
    org: "TikTok (ByteDance)",
    dates: "May – Aug 2021",
    summary:
      "Designed the first batch of Dynamic Showcase Ad templates for SMB merchants. One template was adopted by American Eagle Outfitters, enabling cost-effective campaigns without an in-house creative team.",
  },
];

const SKILLS: { label: string; items: string[] }[] = [
  {
    label: "Design",
    items: [
      "End-to-end product design",
      "UX research and testing",
      "Interaction and visual design",
      "Design systems",
      "Accessibility (WCAG)",
    ],
  },
  {
    label: "Build",
    items: ["React Native", "TypeScript", "Expo", "HTML", "CSS"],
  },
  {
    label: "Tools",
    items: ["Figma", "Adobe Creative Suite", "After Effects", "Claude Code"],
  },
];

export const metadata = {
  title: "Résumé",
  description: `Résumé and contact information for ${siteConfig.name}.`,
};

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

      <section className="resume-layout" aria-labelledby="resume-title">
        <div className="resume-primary">
          <p className="resume-label">Résumé · updated {RESUME_UPDATED}</p>
          <h1 id="resume-title" className="resume-heading">
            {siteConfig.name}
          </h1>
          <p className="resume-body">
            Product designer focused on strategy, interaction detail, and
            clear storytelling through digital products.
          </p>
          <div className="resume-actions">
            <a
              href={RESUME_PATH}
              download="Myles-Ashitey-Resume.pdf"
              className="resume-cta"
            >
              Download PDF
              <span aria-hidden="true"> ↓</span>
            </a>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener"
              className="about-action"
            >
              View in browser
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <aside className="resume-aside" aria-label="Quick details">
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
              <dt>Contact</dt>
              <dd>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="resume-experience" aria-labelledby="resume-experience-title">
        <h2 id="resume-experience-title" className="resume-section-heading">
          Experience
        </h2>
        <ol className="resume-role-list" role="list">
          {EXPERIENCE.map((role) => (
            <li key={`${role.org}-${role.dates}`} className="resume-role">
              <div className="resume-role-head">
                <div>
                  <p className="resume-role-title">{role.role}</p>
                  <p className="resume-role-org">{role.org}</p>
                </div>
                <p className="resume-role-dates">{role.dates}</p>
              </div>
              <p className="resume-role-summary">{role.summary}</p>
            </li>
          ))}
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

      <p className="resume-footnote">
        The PDF has the full detail. This page is the 30-second read.
      </p>
    </main>
  );
}
