import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  ArchitectureDiagram,
  DaylightLegend,
  FeatureCard,
  HeroRouteIllustration,
  PhoneFrame,
  ProcessGraph,
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

function PreferredStationsIllustration() {
  return (
    <div className="fg-screen-stub">
      <span className="fg-screen-band fg-screen-band--header" />
      <p className="fg-screen-section-label">Gas on your route</p>
      <div className="fg-screen-station fg-screen-station--trusted">
        <span className="fg-screen-star" aria-hidden="true">★</span>
        <div className="fg-screen-station-text">
          <span className="fg-screen-line fg-screen-line--80" />
          <span className="fg-screen-trusted-badge">Trusted by you</span>
        </div>
      </div>
      <div className="fg-screen-station">
        <span className="fg-screen-star fg-screen-star--empty" aria-hidden="true">★</span>
        <span className="fg-screen-line fg-screen-line--60" />
      </div>
      <div className="fg-screen-station">
        <span className="fg-screen-star fg-screen-star--empty" aria-hidden="true">★</span>
        <span className="fg-screen-line fg-screen-line--60" />
      </div>
      <div className="fg-screen-station">
        <span className="fg-screen-star fg-screen-star--empty" aria-hidden="true">★</span>
        <span className="fg-screen-line fg-screen-line--40" />
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
    copy: "OpenStreetMap, OSRM, SunCalc, and community reports score the candidate route, then the preview surfaces hazard chips alongside an all-clear chip — a briefing, not an alarm. The preview is also a selector: swipe the ETA or tap a gray alternate line to switch routes. The recommended route reads “Safest route”; alternates read “Alternate route · X min faster/longer,” never relabeled. Tapping any hazard chip pans the map to that zone and opens the matching detail surface — the chip is a navigation control, not just a label.",
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
      "The order signals the priority. Community-vetted places appear first because respondents named community knowledge as the authority worth trusting.",
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
    copy: "Ambient audio recording, trusted-contact wiring, ACLU firearm-guidance specific to the state you're driving in — firearm laws differ state by state, sometimes drastically. A state machine that defaults to composure.",
    thesis:
      "The most charged moment of the product gets the calmest surface in the design.",
    illustration: <PulledOverIllustration />,
  },
  {
    number: "06",
    title: "iOS grouped settings register",
    copy: "Six settings pages use iOS's native grouped-list register: real toggles, real labels, no custom controls dressed up to look native. Settings that aren't fully wired yet are labeled as such, not hidden.",
    thesis:
      "The UI state reflects real capability. Nothing pretends to do what it doesn't.",
    illustration: <SettingsIllustration />,
  },
  {
    number: "07",
    title: "Connect-Calendar · one-tap safe routing",
    copy: "Read-only access to upcoming located events. A pick-sheet turns any of them into a safe-routed destination without leaving the flow.",
    thesis:
      "Your day's destinations are usually already on your calendar. This routes you to them safely without making you type them again.",
    illustration: <CalendarIllustration />,
  },
  {
    number: "08",
    title: "Preferred stations · trusted gas, on your route",
    copy: "Favorite the gas and charging stations you trust from the on-route fuel list or a Gas search. Trusted stations sort to the top with a “Trusted by you” badge, and a management list lives in settings. On the route preview, a quiet line appears when one falls near the chosen route: “A station you trust is on this route.” A read-only feature that works through reassurance.",
    thesis:
      "The Green Book opened with a list of safe service stations for Black travelers. This is that, personal: the digital descendant of a community-trusted-establishments list, kept by the driver themselves.",
    illustration: <PreferredStationsIllustration />,
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
          A wayfinding app for Black travelers in America. Routes that limit
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

      <ProjectToc
        sections={[
          { title: "The lineage", id: "fg-problem" },
          { title: "The research", id: "fg-research" },
          { title: "The architecture", id: "fg-approach" },
          { title: "What ships", id: "fg-features-heading" },
          { title: "Reserved color", id: "fg-craft" },
          { title: "Process", id: "fg-process" },
          { title: "Honest scope", id: "fg-scope" },
        ]}
      />

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
            the lit corridor? Which stretches are over-policed? Which block did
            someone mark unsafe last week that the city's data hasn't caught?
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

      {/* ── Research / Insights ──────────────────────── */}
      <section className="project-section fg-section" aria-labelledby="fg-research">
        <h2 id="fg-research">Six interviews. Four markers. Four features.</h2>
        <div className="project-section-body">
          <p>
            A wayfinding tool for Black drivers can&apos;t be designed without
            that community at the table. The research that grounds Fresh
            Greens is six semi-structured interviews with Black drivers raised
            in — or still living across — the Southern US. All of them
            long-time users of Google Maps, Waze, or Apple Maps.
            Broad-to-narrow questions, with the road itself as the prompt.
          </p>
          <p>
            What surfaced was expertise, not vulnerability. Participants
            described autonomy and belonging alongside the trepidation — the
            anticipation of a familiar turn toward family, landmarks tied to
            memory, the gas stations that stop being a reprieve. They had a
            working taxonomy, one that could be translated to something
            tangible if done correctly.
          </p>
          <p>
            The four things the app scores routes against are the four markers
            that recurred across the conversations.
          </p>
          <ul>
            <li>
              <strong>Light:</strong> drivers plan around sunrise and sunset
              and lean toward well-lit roads in unfamiliar areas — SunCalc
              daylight gradient, low-light zone flag.
            </li>
            <li>
              <strong>Police:</strong> recurring, inherited caution around
              confrontation — police-presence zone.
            </li>
            <li>
              <strong>Wildlife:</strong> deep wariness of dense tree cover and
              deer, a habit forged by where you were raised — wildlife-crossing
              zone (OpenStreetMap data).
            </li>
            <li>
              <strong>Road conditions:</strong> flooding and chronic
              underfunding in New Orleans and some areas of Texas, unfinished
              dirt roads still common outside metros — road-condition zone.
            </li>
          </ul>
          <p className="fg-research-landing">
            The categories the app flags are the categories drivers told me
            they already watch for.
          </p>
        </div>

        <figure className="fg-pullquote">
          <blockquote>
            Moments of joy and fear have a lasting effect on how Black drivers
            interpret the spaces they inhabit. They stick.
          </blockquote>
          <figcaption>From the thesis research · Fresh Greens, 2025</figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            The reframe matters: this isn&apos;t a safety app studying a
            vulnerable population. It&apos;s a routing system built from the
            expertise of the people who&apos;ve been doing the routing all
            along. Safety is the outcome. The premise is whose knowledge
            counts when the route is drawn.
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
            The scoring layer is the load-bearing one. It's deterministic:
            same inputs of street data, daylight calculations, and community
            reports always produce the same routing decision.
            That means a user can ask <em>why this route</em> and the answer
            is reconstructible from the data the system already exposes.
            Reproducibility is the ethical commitment, not a side effect.
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
          Eight shipped surfaces, each captioned with what it does and why it
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
            The brand greens carry every CTA, link, and secondary action.
            Red, orange, yellow, and navy are reserved for safety: each tied
            to one specific meaning, never used as chrome or decoration.
            That&apos;s what lets a red dot or an orange chip actually mean
            something when it shows up. Documented carve-outs exist — the
            yellow favorite-star reads as &quot;saved,&quot; not
            &quot;warning&quot;. Acknowledged not hidden.
          </p>
        </div>

        <SignalSwatches />

        <div className="fg-craft-split">
          <div className="fg-craft-half">
            <h3 className="fg-h3">Daylight as a documented exception</h3>
            <p>
              The route polyline shifts color as the remaining daylight
              changes along your projected arrival. It&apos;s an exception to
              the reserved-color system: not a signal, just the literal color
              of daylight at each segment. A dash pattern carries the same
              information — solid for day, dashed for twilight, dotted for
              night — so the cue still reads when the hue doesn&apos;t. WCAG
              1.4.1, in the place that matters.
            </p>
            <DaylightLegend />
          </div>
          <div className="fg-craft-half">
            <h3 className="fg-h3">The charged moment gets composure</h3>
            <p>
              The /pulled-over surface is where the design&apos;s whole
              approach gets tested. At the most charged moment, most safety
              products reach for red and urgency. Fresh Greens reaches for
              muted greens, generous space, and ACLU-sourced guidance. The
              thinking is that composure is the protective stance — not alarm.
            </p>
          </div>
        </div>
      </section>

      {/* ── Process / tooling ────────────────────────── */}
      <section
        className="project-section fg-section fg-section--wide"
        aria-labelledby="fg-process"
      >
        <h2 id="fg-process">Process built the same way the product was.</h2>
        <div className="project-section-body">
          <p>
            Three months, solo, design and engineering. To hold the thread, I
            built a custom knowledge graph (graphify) that merged the codebase,
            the design-decision conversations, and the thesis document into one
            queryable memory. At any point in the build I could reconstruct why
            navy is reserved for the safety shield, which shipped surface
            answers which thesis claim, or what was tried before the chip row
            landed. The workflow was AI-augmented; the judgment was mine. The
            graph is infrastructure I built to manage scope, not a tool I
            prompted. The product&apos;s ethic is that every safety decision
            traces to public, auditable data. The process held itself to the
            same standard.
          </p>
        </div>

        <ProcessGraph />
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
              <li>Zone-aware routing across OSM, OSRM, SunCalc, and community reports</li>
              <li>Daylight-graded route + WCAG dash pattern</li>
              <li>Multi-row community browse + side-button safety column</li>
              <li>/pulled-over five-phase state machine with audio capture</li>
              <li>Connect-Calendar with verified read-only event hookup</li>
              <li>iOS grouped-settings register across six pages</li>
              <li>Real-time weather, scheduled-departure & refuel reminders</li>
              <li>Preferred Stations with favorite-star pinning + on-route trust line</li>
              <li>Optional Supabase cloud sync for community reports</li>
            </ul>
          </div>
          <div className="fg-scope-col">
            <p className="fg-scope-label">Scaffolded · v2</p>
            <ul className="fg-scope-list" role="list">
              <li>
                Community reports score routes locally; an optional Supabase
                cloud sync now exists — what&apos;s v2 is making it the
                default and scaling the backend
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
