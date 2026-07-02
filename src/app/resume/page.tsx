import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site-config";

const RESUME_PATH = "/myles-ashitey-cv.pdf";
const RESUME_UPDATED = "June 2026";

type ResumeRole = {
  role: string;
  org: string;
  dates: string;
  summary: string;
};

const EXPERIENCE: ResumeRole[] = [
  {
    role: "MFA candidate, Design and Technology",
    org: "Parsons School of Design",
    dates: "2024 – Present",
    summary:
      "Thesis: Navi, a solo-built React Native wayfinding app for Black travelers with VoiceOver labels, dynamic type, and a WCAG daylight cue built in from the start.",
  },
  {
    role: "Creative strategy",
    org: "TikTok",
    dates: "2022 – 2024",
    summary:
      "Brand and product-adjacent creative direction across campaigns and cross-functional launches.",
  },
  {
    role: "Creative strategy",
    org: "Universal Music Group",
    dates: "2020 – 2022",
    summary:
      "Learned how brands talk to people. Realized I wanted to build rather than just shape.",
  },
  {
    role: "Product design (contract)",
    org: "UnderstandingFAFSA",
    dates: "2025",
    summary:
      "Rebuilt the newsletter system as modular templates a non-designer could run without breaking the brand. Open rates went from 30% to 52.6%.",
  },
];

const SKILLS: { label: string; items: string[] }[] = [
  {
    label: "Design",
    items: [
      "Product design",
      "Interaction design",
      "Design systems",
      "Prototyping",
      "Accessibility (WCAG 2.2 AA)",
    ],
  },
  {
    label: "Build",
    items: ["React Native", "TypeScript", "Next.js", "CSS / Tailwind"],
  },
  {
    label: "Tools",
    items: ["Figma", "Adobe Suite", "Framer", "Cursor"],
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
              <dd>Brooklyn, NY</dd>
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
