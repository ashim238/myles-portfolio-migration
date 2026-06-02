import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  ArchitectureDiagram,
  DaylightLegend,
  FeatureCard,
  HeroRouteIllustration,
  PhoneFrame,
  SignalSwatches,
} from "@/components/fresh-greens";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fresh Greens",
  description:
    "A graduate thesis: a wayfinding app inspired by the Green Book lineage that treats community safety observations as a first-class routing signal.",
  openGraph: {
    title: "Fresh Greens",
    description:
      "A graduate thesis: a wayfinding app inspired by the Green Book lineage that treats community safety observations as a first-class routing signal.",
    type: "article",
  },
};

/* ──────────────────────────────────────────────────────────────
   Feature illustrations
   Each one hints at the screen's composition with CSS rectangles
   in the project's neutral palette. Differentiated by layout, not color.
   Replace any of these with a real <img src="/projects/fresh-greens/..." />
   inside <PhoneFrame> when the screenshot exists.
   ────────────────────────────────────────────────────────────── */

function RoutePreviewIllustration() {
  return (
    <div className="fg-screen-stub">
      <span className="fg-screen-band fg-screen-band--header" />
      <div className="fg-screen-map">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
            <line x1="0" y1="60" x2="200" y2="60" />
            <line x1="0" y1="130" x2="200" y2="130" />
            <line x1="80" y1="0" x2="80" y2="200" />
          </g>
          <path
            d="M30 170 L30 130 L80 130 L80 80"
            stroke="#f6a86b"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M80 80 L130 80 L130 40 L170 40"
            stroke="#7d6ba8"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        </svg>
      </div>
      <div className="fg-screen-card">
        <span className="fg-screen-line fg-screen-line--80" />
        <span className="fg-screen-chip-row">
          <span className="fg-screen-chip fg-screen-chip--ok" />
          <span className="fg-screen-chip fg-screen-chip--hazard" />
          <span className="fg-screen-chip fg-screen-chip--info" />
        </span>
        <span className="fg-screen-cta" />
      </div>
    </div>
  );
}

function DaylightMapIllustration() {
  return (
    <div className="fg-screen-stub fg-screen-stub--map">
      <span className="fg-screen-band fg-screen-band--header" />
      <div className="fg-screen-map fg-screen-map--full">
        <svg viewBox="0 0 200 320" aria-hidden="true">
          <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
            <line x1="0" y1="80" x2="200" y2="80" />
            <line x1="0" y1="160" x2="200" y2="160" />
            <line x1="0" y1="240" x2="200" y2="240" />
            <line x1="60" y1="0" x2="60" y2="320" />
            <line x1="140" y1="0" x2="140" y2="320" />
          </g>
          <path
            d="M20 290 L20 240 L60 240 L60 200"
            stroke="#f6a86b"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60 200 L120 200 L120 160"
            stroke="#c87a8a"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8 5"
          />
          <path
            d="M120 160 L180 160 L180 80"
            stroke="#7d6ba8"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <path
            d="M180 80 L180 20"
            stroke="#4a4280"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
          <circle cx="20" cy="290" r="5" fill="#f4f4f4" />
          <circle cx="180" cy="20" r="5" fill="#4a4280" stroke="#f4f4f4" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

function CommunityBrowseIllustration() {
  return (
    <div className="fg-screen-stub">
      <span className="fg-screen-band fg-screen-band--header" />
      <div className="fg-screen-search" />
      <div className="fg-screen-row">
        <p className="fg-screen-row-label">Trusted by your community</p>
        <div className="fg-screen-row-scroll">
          <span className="fg-screen-tile" />
          <span className="fg-screen-tile" />
          <span className="fg-screen-tile" />
        </div>
      </div>
      <div className="fg-screen-row">
        <p className="fg-screen-row-label">Family-owned · grocery</p>
        <div className="fg-screen-row-scroll">
          <span className="fg-screen-tile" />
          <span className="fg-screen-tile" />
          <span className="fg-screen-tile" />
        </div>
      </div>
    </div>
  );
}

function NavigationIllustration() {
  return (
    <div className="fg-screen-stub fg-screen-stub--nav">
      <div className="fg-screen-nav-instr">
        <span className="fg-screen-line fg-screen-line--60" />
        <span className="fg-screen-line fg-screen-line--40" />
      </div>
      <div className="fg-screen-map fg-screen-map--full">
        <svg viewBox="0 0 200 240" aria-hidden="true">
          <path
            d="M40 220 L40 160 L120 160 L120 80 L170 80"
            stroke="#f6a86b"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="120" cy="160" r="7" fill="none" stroke="#f4f4f4" strokeWidth="1.5" />
        </svg>
      </div>
      <span className="fg-screen-side-column" aria-hidden="true">
        <span className="fg-screen-side-btn" />
        <span className="fg-screen-side-btn" />
        <span className="fg-screen-side-btn fg-screen-side-btn--sos" />
      </span>
    </div>
  );
}

function PulledOverIllustration() {
  return (
    <div className="fg-screen-stub fg-screen-stub--still">
      <span className="fg-screen-band fg-screen-band--header" />
      <div className="fg-screen-pulled">
        <span className="fg-screen-pulled-rec">●  REC</span>
        <p className="fg-screen-pulled-title">Stay still.</p>
        <p className="fg-screen-pulled-sub">
          Recording for protection. Hands visible.
        </p>
        <span className="fg-screen-pulled-actions">
          <span className="fg-screen-pulled-btn" />
          <span className="fg-screen-pulled-btn" />
        </span>
      </div>
    </div>
  );
}

function SettingsIllustration() {
  return (
    <div className="fg-screen-stub fg-screen-stub--ios">
      <span className="fg-screen-band fg-screen-band--header" />
      <div className="fg-screen-ios-group">
        <span className="fg-screen-ios-row" />
        <span className="fg-screen-ios-row" />
        <span className="fg-screen-ios-row" />
      </div>
      <div className="fg-screen-ios-group">
        <span className="fg-screen-ios-row" />
        <span className="fg-screen-ios-row" />
      </div>
      <div className="fg-screen-ios-group">
        <span className="fg-screen-ios-row" />
        <span className="fg-screen-ios-row" />
        <span className="fg-screen-ios-row" />
      </div>
    </div>
  );
}

function CalendarIllustration() {
  return (
    <div className="fg-screen-stub">
      <span className="fg-screen-band fg-screen-band--header" />
      <p className="fg-screen-section-label">Upcoming</p>
      <div className="fg-screen-cal-row">
        <span className="fg-screen-cal-dot" />
        <span className="fg-screen-line fg-screen-line--80" />
      </div>
      <div className="fg-screen-cal-row">
        <span className="fg-screen-cal-dot" />
        <span className="fg-screen-line fg-screen-line--60" />
      </div>
      <div className="fg-screen-cal-row">
        <span className="fg-screen-cal-dot" />
        <span className="fg-screen-line fg-screen-line--40" />
      </div>
      <div className="fg-screen-cal-sheet">
        <span className="fg-screen-line fg-screen-line--60" />
        <span className="fg-screen-line fg-screen-line--40" />
        <span className="fg-screen-cta" />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    number: "01",
    title: "Route preview that shows its work",
    copy: "Three public data sources score the candidate route, then the preview surfaces hazard chips alongside an all-clear chip — a briefing, not an alarm.",
    thesis:
      "Trust scales when the system narrates its reasoning. The chips are the audit log made legible.",
    illustration: <RoutePreviewIllustration />,
  },
  {
    number: "02",
    title: "Daylight-aware route, color-graded",
    copy: "The polyline shifts orange → mauve → indigo across segments as the sun sets along your projected arrival; paired with a dash pattern so the cue isn't color-only.",
    thesis:
      "Solar geometry is a literal safety input. Color carries the meaning; the dash pattern keeps it WCAG-readable.",
    illustration: <DaylightMapIllustration />,
  },
  {
    number: "03",
    title: "Multi-row community browse",
    copy: "Google-Maps-style stacked discovery rows, led by 'Trusted by your community' — surfaced before any sponsored or algorithmic row.",
    thesis:
      "The order signals the priority. Community-vetted places appear first because the thesis is they should.",
    illustration: <CommunityBrowseIllustration />,
  },
  {
    number: "04",
    title: "En-route safety column",
    copy: "A persistent side-button column during navigation: safety menu, fast report, SOS. Reachable from the driving thumb position.",
    thesis:
      "Safety controls earn screen space when you need them most. They don't hide in a settings tray.",
    illustration: <NavigationIllustration />,
  },
  {
    number: "05",
    title: "/pulled-over · five-phase safety surface",
    copy: "Ambient audio recording, trusted-contact wiring, firearm-guidance copy from the ACLU. A state machine that defaults to composure.",
    thesis:
      "The most charged moment of the product gets the calmest surface in the design.",
    illustration: <PulledOverIllustration />,
  },
  {
    number: "06",
    title: "iOS grouped settings register",
    copy: "Six settings pages share one register: native-feeling grouped lists, real labels, no plastic toggles. Disclosure is honest — scaffolded surfaces are named, not hidden.",
    thesis:
      "Honesty of disclosure: UI state reflects real capability. Nothing pretends to do what it doesn't.",
    illustration: <SettingsIllustration />,
  },
  {
    number: "07",
    title: "Connect-Calendar · one-tap safe routing",
    copy: "Read-only access to upcoming located events. A pick-sheet turns any of them into a safe-routed destination without leaving the flow.",
    thesis:
      "Wayfinding meets the day you already planned. Less typing, less friction, the same safety pipeline.",
    illustration: <CalendarIllustration />,
  },
];

export default async function FreshGreensPage() {
  const allProjects = await getAllProjects();

  return (
    <main className="page-shell project-page fg-page" id="main-content">
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero project-hero fg-hero" aria-labelledby="fg-title">
        <p className="fg-eyebrow">Graduate thesis · 2025</p>
        <h1 id="fg-title" className="project-hero-title fg-title">
          Fresh Greens
        </h1>
        <p className="project-hero-lede fg-lede">
          A wayfinding app for Black travel in America. Routes that limit
          exposure to hazards and maximize daylight, with community safety
          observations weighted alongside public data.
        </p>
        <div className="fg-hero-device">
          <PhoneFrame>
            <HeroRouteIllustration />
          </PhoneFrame>
        </div>
      </section>

      {/* ── Project meta ─────────────────────────────── */}
      <dl className="project-meta fg-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>Solo · design + engineering</dd>
        </div>
        <div className="project-meta-field">
          <dt>Stack</dt>
          <dd>React Native · Expo · TypeScript</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>~3 months · 2025</dd>
        </div>
      </dl>

      {/* ── The problem / why ────────────────────────── */}
      <section className="project-section fg-section" aria-labelledby="fg-problem">
        <h2 id="fg-problem">A lineage older than the app store.</h2>
        <div className="project-section-body">
          <p>
            The Green Book guided Black travelers across mid-century America by
            cataloguing the homes, restaurants, and stops where they could be
            received in safety. It was a wayfinding system built on community
            knowledge because no institutional one existed.
          </p>
          <p>
            That lineage hasn't ended; the questions have only updated. Where is
            the lit corridor? Which stretches are over-policed? Who got home
            after dark last week, and what route did they take?
          </p>
          <p>
            Fresh Greens treats those questions as a routing problem. The thesis
            argument is narrower and sharper than &quot;an app for safety&quot;:{" "}
            <em>
              whose safety knowledge counts when the route is computed?
            </em>{" "}
            Public data and community observation flow through the same
            scoring pipeline, weighted with the same audit trail.
          </p>
        </div>
      </section>

      {/* ── The approach ─────────────────────────────── */}
      <section className="project-section fg-section fg-section--wide" aria-labelledby="fg-approach">
        <h2 id="fg-approach">Three layers. Each does one job.</h2>
        <div className="project-section-body">
          <p>
            Every safety decision in the app traces to a public, auditable data
            source — never to a black-box model. The architecture exists so that
            stance survives implementation.
          </p>
        </div>

        <ArchitectureDiagram />

        <div className="project-section-body">
          <p>
            The scoring layer is the load-bearing one. It's a pure function:
            same inputs always produce the same routing decision. That means a
            user can ask <em>why this route</em> and the answer is reconstructible
            from the data the system already exposes. Reproducibility is the
            ethical commitment, not a side effect.
          </p>
          <p>
            Community reports flow through the same pipeline as OpenStreetMap.
            They aren't a separate &quot;social layer&quot; bolted on. The
            thesis is that they shouldn't be.
          </p>
        </div>
      </section>

      {/* ── Feature showcase ─────────────────────────── */}
      <section
        className="fg-features"
        aria-labelledby="fg-features-heading"
      >
        <h2 id="fg-features-heading" className="fg-features-heading">
          What ships.
        </h2>
        <p className="fg-features-lede">
          Seven shipped surfaces, each captioned with what it does and why it
          serves the thesis.
        </p>

        <div className="fg-features-grid">
          {FEATURES.map((f) => (
            <FeatureCard
              key={f.number}
              number={f.number}
              title={f.title}
              copy={f.copy}
              thesis={f.thesis}
              illustration={f.illustration}
            />
          ))}
        </div>
      </section>

      {/* ── Craft / design system ────────────────────── */}
      <section className="project-section fg-section fg-craft" aria-labelledby="fg-craft">
        <h2 id="fg-craft">Reserved color. Calm, not alarm.</h2>

        <div className="project-section-body">
          <p>
            Red, orange, yellow, and navy are UI signals with specific safety
            meanings here — never decoration. The discipline is what lets a red
            dot or an orange chip mean something when it appears. Forward
            actions stay in a calibrated green; nothing in the chrome competes.
          </p>
        </div>

        <SignalSwatches />

        <div className="fg-craft-split">
          <div className="fg-craft-half">
            <h3 className="fg-h3">Daylight as a non-color cue</h3>
            <p>
              The route polyline color-shifts with how much daylight remains
              when you reach each segment. A solid → dashed → dotted pattern
              carries the same information for users who can't read the hue —
              WCAG 1.4.1 in the place that matters most.
            </p>
            <DaylightLegend />
          </div>
          <div className="fg-craft-half">
            <h3 className="fg-h3">The charged moment gets composure</h3>
            <p>
              The /pulled-over surface is the design's central proof. It's the
              moment where any safety product reflexively reaches for red and
              urgency. Fresh Greens reaches for muted greens, generous space,
              and copy written with the ACLU's guidance — composure as the
              protective stance.
            </p>
          </div>
        </div>
      </section>

      {/* ── Honest scope ─────────────────────────────── */}
      <section className="project-section fg-section fg-scope" aria-labelledby="fg-scope">
        <h2 id="fg-scope">Shipped, and what v2 finishes.</h2>
        <div className="project-section-body">
          <p>
            Naming what isn't done is part of the thesis stance: honesty of
            disclosure applies to the case study, not only the product.
          </p>
        </div>

        <div className="fg-scope-grid">
          <div className="fg-scope-col">
            <p className="fg-scope-label">Shipped</p>
            <ul className="fg-scope-list" role="list">
              <li>Zone-aware routing across OSM, OSRM, SunCalc</li>
              <li>Daylight-graded route + WCAG dash pattern</li>
              <li>Multi-row community browse + side-button safety column</li>
              <li>/pulled-over five-phase state machine with audio capture</li>
              <li>Connect-Calendar with verified read-only event hookup</li>
              <li>iOS grouped-settings register across six pages</li>
              <li>Real-time weather, scheduled-departure & refuel reminders</li>
            </ul>
          </div>
          <div className="fg-scope-col">
            <p className="fg-scope-label">Scaffolded · v2</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Community reports are device-local with a mock user ID — schema
                is real, the backend is the next step
              </li>
              <li>
                Turn-by-turn narration is placeholder copy — OSRM returns
                geometry, the voice layer is next
              </li>
              <li>/report photo capture is stubbed pending the backend</li>
              <li>
                Broader on-device test matrix is light; the iPhone path is the
                shipped path
              </li>
            </ul>
          </div>
        </div>
      </section>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
    </main>
  );
}
