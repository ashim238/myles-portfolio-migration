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
  ProcessGraph,
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

/* ──────────────────────────────────────────────────────────────
   Feature illustrations
   Each one hints at the screen's composition with CSS rectangles
   in the project's neutral palette. Differentiated by layout, not color.
   Replace any of these with a real <img src="/projects/fresh-greens/..." />
   inside <PhoneFrame> when the screenshot exists.
   ────────────────────────────────────────────────────────────── */

function RoutePreviewIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-01-route-preview.png"
      alt="Route preview screen: Newark Liberty International Airport, 49 min arriving 7:34 PM, 16.7 mi via Pulaski Skyway, with an orange-to-purple daylight-graded polyline, 3 road conditions chip, and route pagination showing 1 of 2"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function DaylightMapIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-02-daylight-route.png"
      alt="Daylight-graded route preview: 129-mile Vineland Flea Market trip via New Jersey Turnpike arriving 9:22 PM, dotted purple polyline with sun-to-moon slider near dusk and an All clear chip"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function CommunityBrowseIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-03-community-browse.png"
      alt="Community browse screen: Trusted by your community leads with a Sisters Community pick card, community note, filter chips for Black-Owned, Women-Owned, and LGBTQ+ Welcoming, and Kings County local recs header"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function NavigationIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-04-en-route.png"
      alt="En-route navigation screen: Head out on Spencer Street instruction header, 3D map with highlighted route, and a right-side column with SOS, safety menu, and reporting buttons reachable from the driving thumb"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function PulledOverIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-05-pulled-over.png"
      alt="/pulled-over screen: ACLU-sourced guidance bullets, ambient audio recording active with waveform and timer, Read aloud affordance, Saved to your phone privacy note, and Continue button"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function SettingsIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-06-settings.png"
      alt="Settings index screen: iOS grouped-list with Refuel reminders, Zone Preferences, Safety, Saved places, and Map guide, plus a Connect your calendar CTA and Privacy & Terms"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function PreferredStationsIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-08-preferred-stations.png"
      alt="Gas on your route sheet: 10 stations within about 1 mi, 1 trusted by you, with Shell Oil at the top showing a green Trusted by you badge and filled gold star"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function CalendarIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-07-calendar.png"
      alt="Search screen showing an upcoming calendar reservation for HAAM Caribbean Plant Cuisine with address and time-until, plus a fuel refuel reminder and recent destinations, all without opening a separate view"
      width={1290}
      height={2796}
      sizes="(max-width: 768px) 70vw, 280px"
      className="fg-feature-shot"
    />
  );
}

function SafetyMenuIllustration() {
  return (
    <ExpandableImage
      src="/projects/fresh-greens/feature-09-safety-menu.png"
      alt="Safety menu sheet opened from the en-route column: Pulled-over, Roadside assistance, Unfamiliar area, and Share location tiles, plus an Emergency row for trusted contact or 911"
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
    title: "Route preview that shows its work",
    copy: "OpenStreetMap, OSRM, SunCalc, and community reports score the candidate route, then the preview surfaces hazard chips alongside an all-clear chip, a briefing, not an alarm. The preview is also a selector: swipe the ETA or tap a gray alternate line to switch routes. The recommended route reads “Safest route”; alternates read “Alternate route · X min faster/longer,” never relabeled. Tapping any hazard chip pans the map to that zone and opens the matching detail surface. The chip is a navigation control, not just a label.",
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
    copy: "Discovery rows sorted by what the community trusts. 'Trusted by your community' leads, before anything algorithmic. The featured card surfaces a real community pick with the note whoever marked it left behind. Filter chips for Black-Owned, Women-Owned, LGBTQ+ Welcoming sit above the rows. The order is an editorial decision, not a default.",
    thesis:
      "The order signals the priority. Community-vetted places appear first because respondents named community knowledge as the authority worth trusting.",
    illustration: <CommunityBrowseIllustration />,
  },
  {
    number: "04",
    title: "En-route safety column",
    copy: "Three controls, fixed to the right edge while navigation runs: SOS, safety menu, and reporting. All reachable from the driving thumb. Road condition warnings surface in the instruction header itself, the same bar that tells you where to turn.",
    thesis:
      "Safety controls earn screen space when you need them most. They don't hide in a settings tray.",
    illustration: <NavigationIllustration />,
  },
  {
    number: "05",
    title: "/pulled-over · five-phase safety surface",
    copy: "The sheet opens already recording, waveform live, timer counting. ACLU guidance lays out your rights in plain language: what you're not required to say, what you don't have to consent to. A 'Read aloud' option for when your hands stay on the wheel. Audio saves to the phone only. Nothing leaves the device. Trusted contact is one Continue tap forward.",
    thesis:
      "The most charged moment of the product gets the calmest surface in the design.",
    illustration: <PulledOverIllustration />,
  },
  {
    number: "06",
    title: "iOS grouped settings register",
    copy: "The settings index (Refuel reminders, Zone Preferences, Safety, Saved places) in iOS's native grouped-list register. Real rows, real labels. Each sub-page uses the same pattern: no custom controls dressed up to look native. Settings that aren't fully wired are labeled as such, not hidden.",
    thesis:
      "The UI state reflects real capability. Nothing pretends to do what it doesn't.",
    illustration: <SettingsIllustration />,
  },
  {
    number: "07",
    title: "Connect-Calendar · one-tap safe routing",
    copy: "Upcoming located events surface in the search screen, address and time-until already there. Tap any of them to route safely without retyping the destination. The refuel reminder lives in the same view: the next scheduled date, not buried in settings.",
    thesis:
      "Your day's destinations are usually already on your calendar. This routes you to them safely without making you type them again.",
    illustration: <CalendarIllustration />,
  },
  {
    number: "08",
    title: "Preferred stations · trusted gas, on your route",
    copy: "Star any station from the on-route fuel sheet and it floats to the top on every future trip, a Trusted by you badge, filled star, sorted by distance. The subtitle says it plainly: 1 trusted by you. On the route preview, a quiet note appears when one falls near your chosen route. Personal, not algorithmic.",
    thesis:
      "The Green Book opened with a list of safe service stations for Black travelers. This is that, personal: the digital descendant of a community-trusted-establishments list, kept by the driver themselves.",
    illustration: <PreferredStationsIllustration />,
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
          A wayfinding app for Black travelers in America. Routes that limit
          exposure to hazards and maximize daylight, with community safety
          observations weighted alongside public data.
        </p>
      </section>

      <ProjectCover
        src="/projects/fresh-greens/cover.png"
        alt="Fresh Greens cover"
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
          <dd>React Native · Expo · TypeScript</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>Sep 2025 – Jun 2026</dd>
        </div>
      </dl>

      <ProjectToc
        sections={[
          { title: "The lineage", id: "fg-problem" },
          { title: "The research", id: "fg-research" },
          { title: "The architecture", id: "fg-approach" },
          { title: "What ships", id: "fg-features-heading" },
          { title: "In your hand", id: "fg-device" },
          { title: "Safety flows", id: "fg-safety" },
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
            in, or still living across, the Southern US. All of them
            long-time users of Google Maps, Waze, or Apple Maps.
            Broad-to-narrow questions, with the road itself as the prompt.
          </p>
          <p>
            What surfaced was expertise, not vulnerability. Participants
            described autonomy and belonging alongside the trepidation: the
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
              and lean toward well-lit roads in unfamiliar areas: SunCalc
              daylight gradient, low-light zone flag.
            </li>
            <li>
              <strong>Police:</strong> recurring, inherited caution around
              confrontation: police-presence zone.
            </li>
            <li>
              <strong>Wildlife:</strong> deep wariness of dense tree cover and
              deer, a habit forged by where you were raised: wildlife-crossing
              zone (OpenStreetMap data).
            </li>
            <li>
              <strong>Road conditions:</strong> flooding and chronic
              underfunding in New Orleans and some areas of Texas, unfinished
              dirt roads still common outside metros: road-condition zone.
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
          <figcaption>Thesis · Fresh Greens, 2026</figcaption>
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
            source, never to a black-box model. The architecture exists so that
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

      {/* ── In your hand · 3D device ─────────────────── */}
      <section
        className="project-section fg-section fg-device-section"
        aria-labelledby="fg-device"
      >
        <h2 id="fg-device">In your hand.</h2>
        <div className="project-section-body">
          <p>
            The route preview is the load-bearing surface — it&apos;s where the
            scoring layer shows its work. Here it is on the device it was
            designed for. Drag to turn it.
          </p>
        </div>
        <Device3D
          screen="/projects/fresh-greens/feature-01-route-preview.png"
          alt="Fresh Greens route preview running on an iPhone: a daylight-graded polyline with hazard chips and route pagination."
        />
      </section>

      {/* ── En-route safety flows ────────────────────── */}
      <section
        className="project-section fg-section fg-safety"
        aria-labelledby="fg-safety"
      >
        <h2 id="fg-safety">Four flows behind the safety column.</h2>
        <div className="project-section-body">
          <p>
            The three controls on the en-route side column open four full
            flows. Each one assumes a different real-world state (emergency,
            breakdown, unfamiliar destination, proactive check-in) and
            resolves to action with the shortest tap chain the flow allows.
            None of them depend on a live network connection. Every flow
            degrades cleanly to an SMS draft the trusted contact can act on.
          </p>
        </div>

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <SafetyMenuIllustration />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The safety menu opened from the en-route column — four flows plus
            emergency, one tap away.
          </figcaption>
        </figure>

        <div className="fg-safety-grid">
          <article className="fg-safety-card">
            <p className="fg-safety-route">/emergency</p>
            <h3 className="fg-h3">Emergency</h3>
            <p>
              Activated by holding the SOS button on the safety column. An
              800ms hold-to-confirm gate with an animated red ring opens onto
              a countdown disc with a haptic ramp. Dispatches to 911 or the
              trusted contact. VoiceOver users get a single-tap bypass per
              the safety-critical interaction convention.
            </p>
          </article>
          <article className="fg-safety-card">
            <p className="fg-safety-route">/roadside · /roadside-setup</p>
            <h3 className="fg-h3">Roadside assistance</h3>
            <p>
              Four-step state machine. Problem picker (flat tire, dead
              battery, out of fuel, locked out, other), then location
              confirmation with a wrong-spot correction, then a live status
              card (&quot;what they know&quot;: problem type, GPS location,
              trusted contact name), then a call or text to the trusted
              contact. The setup screen stores insurance number and vehicle
              description. The flow works without a network connection.
              Everything the contact needs is already in the SMS draft.
            </p>
          </article>
          <article className="fg-safety-card">
            <p className="fg-safety-route">/unfamiliar</p>
            <h3 className="fg-h3">Unfamiliar area</h3>
            <p>
              Safety destination flow for driving somewhere new. The user
              picks a destination type (home, hotel, friend&apos;s, other).
              The app starts a location-share session and opens a Messages
              draft to the trusted contact. A lifeline modal names the model
              honestly: the contact already has a text draft in Messages, a
              real SMS rather than a live push.
            </p>
          </article>
          <article className="fg-safety-card">
            <p className="fg-safety-route">/share-location</p>
            <h3 className="fg-h3">Share my location</h3>
            <p>
              Proactive sharing with a reason picker (heading somewhere new,
              driving late, I feel uneasy, just in case). Choosing a reason
              starts the session and opens Messages with a pre-filled
              check-in draft. An active session shows the &quot;Already
              sharing&quot; state with an End button and a re-send
              affordance for when the contact missed the first message.
            </p>
          </article>
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
            something when it shows up. Documented carve-outs exist: the
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
              information (solid for day, dashed for twilight, dotted for
              night) so the cue still reads when the hue doesn&apos;t. WCAG
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
              thinking is that composure is the protective stance, not alarm.
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
              <li>
                Mapbox Directions turn-by-turn narration (real
                banner_instructions with live GPS distance), OSRM fallback for
                offline or no-key routes
              </li>
              <li>
                /report photo capture via expo-image-picker, cached out of the
                picker so attachments survive iOS storage purges
              </li>
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
                cloud sync now exists. What&apos;s v2 is making it the
                default and scaling the backend
              </li>
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
