import type { Metadata } from "next";
import { ExpandableImage } from "@/components/expandable-image";
import { ProjectCover } from "@/components/project-cover";
import { TransitionLink } from "@/components/transition-link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import {
  ArchitectureDiagram,
  DaylightLegend,
  FeatureCard,
  PhoneFrame,
  SignalSwatches,
} from "@/components/fresh-greens";
import { Device3D } from "@/components/device-3d";
import { getPublishedProjects } from "@/lib/content";

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

function Shot({ name, alt }: { name: string; alt: string }) {
  return (
    <ExpandableImage
      src={`/projects/fresh-greens/v2/${name}.png`}
      alt={alt}
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

const FEATURES = [
  {
    number: "01",
    title: "Discovery starts with the community",
    copy: "Home opens on a map with weather and driving conditions, then community recommendations filtered by Browse, Black-Owned, and Women-Owned. Before anything algorithmic runs, the first sort is who the community trusts.",
    thesis:
      "The order is the argument. Community-vetted places lead because the drivers I interviewed named community knowledge as the authority worth trusting.",
    illustration: <Shot name="home-collapsed" alt="Fresh Greens home screen: a map centered on Kings County with weather, driving conditions, and Browse, Black-Owned, and Women-Owned filter chips" />,
  },
  {
    number: "02",
    title: "Reporting is a first-class safety signal",
    copy: "Six report categories: Incident, Felt unsafe, Lighting, Hazard, Felt welcome, and Black-owned. Reporting something good is as easy as reporting something wrong. Both are data the next driver can use.",
    thesis:
      "Whose safety knowledge counts gets answered every time someone files a report. The six categories are the taxonomy drivers described, turned into taps.",
    illustration: <Shot name="report-picker" alt="Report category picker with six options: Incident, Felt unsafe, Lighting, Hazard, Felt welcome, and Black-owned" />,
  },
  {
    number: "03",
    title: "Your day, already located",
    copy: "Search leads with quick-tool tiles, a fuel reminder, and recent destinations. The calendar tile only appears when there's an actual event to route to, so the screen never invents one.",
    thesis:
      "An empty state that tells the truth beats a fake one. The calendar tile earns its place by having something to show, or it stays away.",
    illustration: <Shot name="search" alt="Search screen with quick-tool tiles for Saved, Food, and Gas, a fuel reminder, and recent destinations including Sisters in Brooklyn and Vineland Flea Market" />,
  },
  {
    number: "04",
    title: "Settings in the iOS register",
    copy: "Settings follows the iOS grouped-list pattern across six pages, including the moderator queue. Real rows, real labels. Nothing is dressed up to look native that it isn’t.",
    thesis:
      "The UI state reflects real capability. A setting that isn’t fully wired says so instead of pretending.",
    illustration: <Shot name="menu" alt="Settings screen showing Myles's profile, grouped rows for Refuel reminders, Zone Preferences, Safety, Saved places, Map guide, and Moderation" />,
  },
];

const SAFETY_SURFACES = [
  {
    route: "/pulled-over",
    title: "Pulled over",
    copy: "Opens with \"Ok. Got it. Are you armed?\" then moves to ACLU-sourced rights in plain language, a Read-aloud option, and a live recording saved to the phone only.",
  },
  {
    route: "/roadside",
    title: "Roadside assistance",
    copy: "A problem picker, a reverse-geocoded location pill, and an in-app tow-pick with Mapbox ranking. No handoff to Apple Maps.",
  },
  {
    route: "/unfamiliar",
    title: "Unfamiliar area",
    copy: "\"Ok. You're somewhere unfamiliar. What's going on?\" with three honest options: I'm lost, I feel unsafe, I'm being followed.",
  },
  {
    route: "/share-location",
    title: "Share my location",
    copy: "A reason picker starts a session and opens Messages with a pre-filled check-in. The active state switches to \"Already on it.\"",
  },
  {
    route: "/emergency",
    title: "Emergency",
    copy: "Set a trusted contact or call 911. Every call gives you three seconds to cancel, not one.",
  },
];

export default async function FreshGreensPage() {
  const allProjects = await getPublishedProjects();

  return (
    <main
      className="page-shell project-page fg-page"
      id="main-content"
      data-project-slug="fresh-greens"
    >
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <TransitionLink href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </TransitionLink>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero project-hero fg-hero" aria-labelledby="fg-title">
        <p className="fg-eyebrow">Graduate thesis · 2026</p>
        <h1 id="fg-title" className="project-hero-title fg-title">
          Fresh Greens
        </h1>
        <p className="project-hero-lede fg-lede">
          A wayfinding app for Black travelers in America. Routes that
          limit exposure to hazards and maximize daylight, with community
          safety observations weighted alongside public data. Built solo
          over three months as a graduate thesis in design and engineering.
        </p>
      </section>

      <ProjectCover
        src="/projects/fresh-greens/cover.png"
        alt="Fresh Greens cover: a route preview map showing a daylight-graded path from Brooklyn to southern New Jersey"
        priority
      />

      {/* ── Project meta ─────────────────────────────── */}
      <dl className="project-meta fg-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>Solo · design + engineering</dd>
        </div>
        <div className="project-meta-field">
          <dt>Stack</dt>
          <dd>React Native · Expo · TypeScript · Supabase</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>Sep 2025 – Jun 2026</dd>
        </div>
      </dl>

      <ProjectToc
        sections={[
          { title: "The lineage", id: "fg-problem" },
          { title: "What ships", id: "fg-features-heading" },
          { title: "In your hand", id: "fg-device" },
          { title: "Safety surfaces", id: "fg-safety" },
          { title: "The voice", id: "fg-voice" },
          { title: "How it's built", id: "fg-approach" },
          { title: "Reserved color", id: "fg-craft" },
          { title: "Honest scope", id: "fg-scope" },
        ]}
      />

      {/* ── The problem / why ────────────────────────── */}
      <section className="project-section fg-section" aria-labelledby="fg-problem">
        <h2 id="fg-problem">A lineage older than the app store.</h2>
        <div className="project-section-body">
          <p>
            The Green Book guided Black travelers across mid-century America
            by cataloguing the homes, restaurants, and stops where they could
            be received in safety. It was a wayfinding system built on
            community knowledge because no institutional one existed.
          </p>
          <p>
            Fresh Greens treats those questions as a routing problem. The
            thesis argument is narrower than &quot;an app for safety&quot;:{" "}
            <em>
              whose safety knowledge counts when the route is computed?
            </em>{" "}
            Public data and community observation flow through the same
            scoring pipeline, weighted with the same audit trail.
          </p>
        </div>
      </section>

      {/* ── Feature showcase (MOVED UP) ──────────────── */}
      <section
        className="fg-features"
        aria-labelledby="fg-features-heading"
      >
        <h2 id="fg-features-heading" className="fg-features-heading">
          What ships.
        </h2>
        <p className="fg-features-lede">
          Four of the shipped surfaces, each captioned with what it does and
          why it serves the thesis.
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

      {/* ── In your hand · 3D device ─────────────────── */}
      <section
        className="project-section fg-section fg-device-section"
        aria-labelledby="fg-device"
      >
        <h2 id="fg-device">In your hand.</h2>
        <div className="project-section-body">
          <p>
            The en-route screen is where the whole system shows up at once:
            a turn card with the maneuver and any hazard glyph, a 3D map,
            and the safety column down the right edge. All inside thumb
            reach. Drag to turn it.
          </p>
        </div>
        <Device3D
          screen="/projects/fresh-greens/v2/en-route.png"
          alt="Fresh Greens en-route screen running on an iPhone: a turn card reading 'Head out on Spencer Street,' a 3D map, and a side column for Guide, SOS, Safety, Report, and Recenter."
        />
      </section>

      {/* ── Safety surfaces ──────────────────────────── */}
      <section
        className="project-section fg-section fg-safety"
        aria-labelledby="fg-safety"
      >
        <h2 id="fg-safety">Six safety surfaces, one toolkit.</h2>
        <div className="project-section-body">
          <p>
            The toolkit is the hub. <code>/safety</code> lays out a 2x2 of
            Pulled-over, Roadside, Unfamiliar area, and Share location, with
            Emergency on its own footer row. Each is a first-class route
            with its own state machine. None depend on a live network
            connection.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="safety-toolkit"
              alt="The /safety toolkit picker: a 2x2 grid of Pulled-over, Roadside assistance, Unfamiliar area, and Share location, with an Emergency row"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            <code>/safety</code>, the toolkit picker. Four in-the-moment
            surfaces in a 2x2, with Emergency held apart.
          </figcaption>
        </figure>

        <div className="fg-safety-grid">
          {SAFETY_SURFACES.slice(0, 2).map((s) => (
            <article key={s.route} className="fg-safety-card" aria-labelledby={`safety-${s.route.slice(1)}`}>
              <p className="fg-safety-route">{s.route}</p>
              <h3 className="fg-h3" id={`safety-${s.route.slice(1)}`}>{s.title}</h3>
              <p>{s.copy}</p>
            </article>
          ))}
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="pulled-over-armed"
              alt="The /pulled-over opener reading 'Ok. Got it. Are you armed?' with Yes, No, and Prefer-not-to-answer rows"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The most charged moment gets a companion&apos;s question in muted
            greens, not a red banner.
          </figcaption>
        </figure>

        <div className="fg-safety-grid">
          {SAFETY_SURFACES.slice(2).map((s) => (
            <article key={s.route} className="fg-safety-card" aria-labelledby={`safety-${s.route.slice(1)}`}>
              <p className="fg-safety-route">{s.route}</p>
              <h3 className="fg-h3" id={`safety-${s.route.slice(1)}`}>{s.title}</h3>
              <p>{s.copy}</p>
            </article>
          ))}
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="pulled-over-contact"
              alt="The closing phase of /pulled-over: 'You're not alone,' a trusted contact avatar for Brianna Agyemang, and Call and Text buttons"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The closing phase: &quot;You&apos;re not alone.&quot; A trusted
            contact, reachable in one tap.
          </figcaption>
        </figure>
      </section>

      {/* ── Voice: calm companion + honesty ──────────── */}
      <section
        className="project-section fg-section fg-voice-section"
        aria-labelledby="fg-voice"
      >
        <h2 id="fg-voice">Companion, not alarm. And it tells the truth.</h2>
        <div className="project-section-body">
          <p>
            Two principles got named during the build and ended up
            load-bearing across every safety surface.
          </p>
        </div>

        <div className="fg-craft-split">
          <div className="fg-craft-half">
            <h3 className="fg-h3">The calm companion</h3>
            <p>
              The voice is a companion, not an alarm.{" "}
              <code>/pulled-over</code>{" "}opens with &quot;Ok. Got it. Are
              you armed?&quot;, not a red banner.{" "}
              <code>/emergency</code>{" "}reads &quot;Need help? You choose who
              responds.&quot; Every call and text is yours to send. The SOS
              countdown gives three seconds to cancel, not one, because a
              safety control that fires too fast is its own hazard.
            </p>
          </div>
          <div className="fg-craft-half">
            <h3 className="fg-h3">Honesty of disclosure</h3>
            <p>
              No loading state collapses into &quot;no results,&quot; and no
              error hides behind a generic message.{" "}
              <code>/roadside</code>{" "}falls back to &quot;Location needed to
              post this&quot; after an eight-second timeout instead of
              hanging. <code>/share-location</code>{" "}keeps the picker
              register (&quot;You choose. We&apos;ll tell them.&quot;)
              distinct from the active one (&quot;Already on it.&quot;).
              Every state tells the truth about what the system knows.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it's built (merged research + arch + moderation) ── */}
      <section className="project-section fg-section fg-section--wide" aria-labelledby="fg-approach">
        <h2 id="fg-approach">Six interviews. Three layers. One pipeline.</h2>
        <div className="project-section-body">
          <p>
            The research that grounds Fresh Greens is six semi-structured
            interviews with Black drivers across the Southern US. What
            surfaced was expertise, not vulnerability. The four things the
            app scores routes against are the four markers that recurred
            across the conversations: light (SunCalc daylight gradient),
            police presence, wildlife crossings (OpenStreetMap), and road
            conditions. These aren&apos;t invented categories. They&apos;re the
            taxonomy drivers described, turned into taps.
          </p>
        </div>

        <figure className="fg-pullquote">
          <blockquote>
            Moments of joy and fear have a lasting effect on how Black drivers
            interpret the spaces they inhabit. They stick.
          </blockquote>
          <figcaption>Thesis · Fresh Greens, 2026</figcaption>
        </figure>

        <ArchitectureDiagram />

        <div className="project-section-body">
          <p>
            Every safety decision traces to a public, auditable data source.
            Community reports flow through the same adapter, scoring, and
            screen pipeline as OpenStreetMap. They&apos;re authenticated with
            an anonymous device UUID in expo-secure-store, held in Postgres
            under row-level security, and moderated through a role-gated
            queue with bulk actions and per-report investigation panels.
          </p>
        </div>
      </section>

      {/* ── Craft / design system ────────────────────── */}
      <section className="project-section fg-section fg-craft" aria-labelledby="fg-craft">
        <h2 id="fg-craft">Reserved color. Calm, not alarm.</h2>

        <div className="project-section-body">
          <p>
            The brand greens carry every CTA, link, and secondary action.
            Red, orange, yellow, and navy are reserved for safety, each tied
            to one specific meaning. That&apos;s what lets a red dot or an
            orange chip actually mean something when it shows up.
          </p>
        </div>

        <SignalSwatches />

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="report-detail"
              alt="A report detail card showing severity chips for Threatened, Followed, Harassed, Uncomfortable, and Uneasy vibe, pairing a filled warning-diamond glyph with color"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            On <code>/report</code>, severity rides two channels at once: a
            filled WarningDiamond glyph next to the color, so the cue
            survives for anyone who can&apos;t lean on hue alone (WCAG 1.4.1).
          </figcaption>
        </figure>

        <DaylightLegend />
      </section>

      {/* ── Honest scope ─────────────────────────────── */}
      <section className="project-section fg-section fg-scope" aria-labelledby="fg-scope">
        <h2 id="fg-scope">Shipped, and what v2 finishes.</h2>
        <div className="project-section-body">
          <p>
            Naming what isn&apos;t done is part of the thesis stance: honesty of
            disclosure applies to the case study, not only the product.
          </p>
        </div>

        <div className="fg-scope-grid">
          <div className="fg-scope-col">
            <p className="fg-scope-label">Shipped</p>
            <ul className="fg-scope-list" role="list">
              <li>Zone-aware routing across OSM, OSRM, SunCalc, and community reports</li>
              <li>Daylight-graded route polyline with a WCAG dash pattern</li>
              <li>Community-first discovery and the six-surface safety toolkit</li>
              <li>/pulled-over with ACLU guidance and on-device audio capture</li>
              <li>Mapbox Directions turn-by-turn with an OSRM offline fallback</li>
              <li>
                Community cloud on Supabase: anonymous device-UUID auth,
                Postgres with row-level security, and a /moderation queue
              </li>
            </ul>
          </div>
          <div className="fg-scope-col">
            <p className="fg-scope-label">Next, v2</p>
            <ul className="fg-scope-list" role="list">
              <li>Moderator-role bootstrap automation</li>
              <li>Push notifications for new moderator-queue items</li>
              <li>A public transparency page for moderation activity</li>
              <li>Broader on-device test matrix beyond iPhone</li>
            </ul>
          </div>
        </div>

        <div className="project-section-body" style={{ marginTop: "2.4rem" }}>
          <p className="fg-research-landing">
            The thesis question was whose safety knowledge counts when the
            route is computed. The answer is in the pipeline: community
            reports and public data flow through the same scoring layer,
            weighted the same way, auditable the same way. The design&apos;s
            job was to earn the trust that makes those reports worth
            submitting.
          </p>
        </div>
      </section>

      <ProjectWorkJump currentSlug="fresh-greens" projects={allProjects} />
    </main>
  );
}
