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

type IndependentProject = {
  name: string;
  role: string;
  dates: string;
  summary: string;
};

const INDEPENDENT_WORK: IndependentProject[] = [
  {
    name: "Fresh Greens",
    role: "Solo Designer & Engineer",
    dates: "2025 – 2026",
    summary:
      "Wayfinding app for Black travel in America, designed and shipped solo in React Native. Built on a three-layer architecture so every routing decision stays auditable, with a reserved-color signaling system and accessibility built in from the start: WCAG dash-pattern encoding, dynamic type, and VoiceOver support.",
  },
  {
    name: "UnderstandingFAFSA",
    role: "Product Designer",
    dates: "Feb 2025 – Present",
    summary:
      "Newsletter redesign for a nonprofit navigating financial aid. Built modular Figma to Mailchimp templates with locked-vs-swappable rules so a non-designer founder could ship on-brand without a designer in the loop. Ran a competitive audit of 120+ newsletters to ground the redesign. Open rates went from about 30% to 52.6%.",
  },
  {
    name: "Navi",
    role: "UI/UX Designer",
    dates: "Jan – Jun 2025",
    summary:
      "Regenerative-travel platform for NYC neighborhood experiences. Resident-led research, three personas, and concept testing before visual execution: 78% preferred neighborhood-led recommendations over generic top-ten lists. Defined IA, the Learn/Plan/Go framework, and the visual system.",
  },
];

const EXPERIENCE: ResumeRole[] = [
  {
    role: "Creative Strategy Assistant",
    org: "Universal Music Group, Island Records",
    dates: "Aug 2023 – Aug 2024",
    summary:
      "Owned music-video delivery across the Island Records roster: partnered with artist production teams pre-shoot to meet UMG’s ingestion and monetization specs, managed deadlines and vendor handoffs (Vevo, Apple), ran Vevo release events, and handled last-minute re-ingests through high-pressure releases like Sabrina Carpenter’s “Feather.”",
  },
  {
    role: "Creative Strategist Intern",
    org: "TikTok (ByteDance)",
    dates: "May – Aug 2022",
    summary:
      "Pitched the “rabbit hole” creative concept for TikTok World 2022 (global product summit, 400+ agencies): an infinite-scroll-inspired immersive theme the team ran with, realized as a funhouse-style portal entry with interactive activations. Wrote Shopping Ads launch copy later reused across TikTok for Business e-commerce.",
  },
  {
    role: "Creative Strategist Intern",
    org: "TikTok (ByteDance)",
    dates: "May – Aug 2021",
    summary:
      "Designed 3 of ~10 templates in TikTok’s Dynamic Showcase Ads launch batch. One shipped and was adopted by American Eagle. The format debuted at TikTok World 2021 and was later folded into TikTok’s Video Shopping Ads.",
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
      "Claude Code",
    ],
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
            Product designer (MFA, Parsons) with a creative strategy
            background at TikTok and Universal Music Group. I&apos;ve taken
            projects from resident interviews and usability tests through
            visual systems and working React Native builds.
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

      <section className="resume-experience" aria-labelledby="resume-independent-title">
        <h2 id="resume-independent-title" className="resume-section-heading">
          Independent Work
        </h2>
        <ol className="resume-role-list" role="list">
          {INDEPENDENT_WORK.map((project) => (
            <li key={project.name} className="resume-role">
              <div className="resume-role-head">
                <div>
                  <p className="resume-role-title">{project.name}</p>
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

      <section className="resume-experience" aria-labelledby="resume-education-title">
        <h2 id="resume-education-title" className="resume-section-heading">
          Education
        </h2>
        <ol className="resume-role-list" role="list">
          <li className="resume-role">
            <div className="resume-role-head">
              <div>
                <p className="resume-role-title">
                  MFA, Design &amp; Technology
                </p>
                <p className="resume-role-org">Parsons School of Design</p>
              </div>
              <p className="resume-role-dates">Aug 2024 – May 2026</p>
            </div>
          </li>
          <li className="resume-role">
            <div className="resume-role-head">
              <div>
                <p className="resume-role-title">BA, Media Studies</p>
                <p className="resume-role-org">Pomona College</p>
              </div>
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

      <p className="resume-footnote">
        The PDF has the full detail. This page is the 30-second read.
      </p>
    </main>
  );
}
