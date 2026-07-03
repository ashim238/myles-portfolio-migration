"use client";

import { useState, useId, useEffect, useRef } from "react";

type Family = "red" | "orange" | "yellow" | "navy" | "gradient";

type CarveOut = {
  id: string;
  family: Family;
  tag: string;
  where: string;
  why: string;
};

const CARVE_OUTS: CarveOut[] = [
  {
    id: "red-recording",
    family: "red",
    tag: "Live audio-capture indicator",
    where: "/pulled-over",
    why: "A pulsing red dot is exactly what the reserved-color rule commits red to: a live, active state that the user needs to see at a glance. The recording indicator earns the red because it names an ongoing action, not a static warning.",
  },
  {
    id: "red-destructive",
    family: "red",
    tag: "Destructive-action labels",
    where: "Confirm-delete surfaces",
    why: "Remove, unpublish, and sign-out labels carry red because destructive actions are the one place where the user should feel the color before they read the word.",
  },
  {
    id: "red-body-light",
    family: "red",
    tag: "Error body copy on light",
    where: "Form validation, light theme",
    why: "The iOS default #FF3B30 lands at about 3.5:1 on white and fails AA for body copy. Fresh Greens swaps in severityCritical, a darker error red at about 5.6:1, so the error is legible before the semantic even lands.",
  },
  {
    id: "red-body-dark",
    family: "red",
    tag: "iOS red on dark auth",
    where: "Sign-in, sign-up",
    why: "On the dark auth surfaces the contrast math inverts and the default iOS red passes AA. The split is annotated in the theme file so the carve-out doesn't drift.",
  },
  {
    id: "orange-community",
    family: "orange",
    tag: "Community-report pin",
    where: "/home map, /explore",
    why: "Community-generated observations get orange to distinguish them from the institutional data feeds without an explanatory legend. The color is doing the work the legend would have.",
  },
  {
    id: "orange-fab",
    family: "orange",
    tag: "Report FAB",
    where: "/home, /route",
    why: "The report affordance carries the same orange as the community pin because both belong to the same action family: this is where the driver contributes back.",
  },
  {
    id: "orange-route-chips",
    family: "orange",
    tag: "Route-preview hazard chips",
    where: "/route preview strip",
    why: "Police-presence and low-light-segment chips inherit hazard-orange. One color, one meaning, across every route preview.",
  },
  {
    id: "yellow-caution",
    family: "yellow",
    tag: "General caution teardrops",
    where: "Map hazard pins",
    why: "Yellow carries the lower-severity caution role across the map system. Weather advisories and non-urgent obstacles all speak the same yellow.",
  },
  {
    id: "yellow-star",
    family: "yellow",
    tag: "Trusted-station gold star",
    where: "Gas-station cards",
    why: "A documented carve-out from the caution role. Trusted-vendor marks earn gold because the interview participants named the visual habit of looking for a familiar mark before pulling in.",
  },
  {
    id: "navy-shield",
    family: "navy",
    tag: "En-route Shield glyph",
    where: "/en-route",
    why: "Safety mode itself gets navy so it can't be confused with data state, sync status, or a passive information mark. The shield IS the safety promise.",
  },
  {
    id: "navy-sos",
    family: "navy",
    tag: "/emergency SOS disc",
    where: "/emergency",
    why: "The SOS disc uses navy to keep it distinct from the destructive-action red on the surrounding controls. Emergency is not deletion.",
  },
  {
    id: "daylight-poly",
    family: "gradient",
    tag: "Daylight polyline",
    where: "Route preview, /home",
    why: "The polyline uses a sunrise-to-night gradient because the color IS the data (per-segment daylight score). WCAG 1.4.1 says color can't be the only channel, so a dash pattern rides alongside: solid, dashed, dotted.",
  },
];

const MOCK_RESERVED_IDS = ["daylight-poly", "orange-community", "yellow-caution", "orange-fab"] as const;

const FAMILY_LABEL: Record<Family, string> = {
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  navy: "Navy",
  gradient: "Gradient",
};

export function ReservedColorFilter() {
  const [muted, setMuted] = useState(false);
  const [activeId, setActiveId] = useState<string>("daylight-poly");
  const active = CARVE_OUTS.find((c) => c.id === activeId) ?? CARVE_OUTS[0];
  const toggleId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const userTouchedRef = useRef(false);

  /* Reveal the argument motion-first: the demo enters unmuted so the reader
     sees the app in colour, then dims to grey once the exhibit is in view.
     Respect reduced-motion by shipping the muted default the argument needs. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (userTouchedRef.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMuted(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || userTouchedRef.current) return;
        io.disconnect();
        timer = setTimeout(() => {
          if (!userTouchedRef.current) setMuted(true);
        }, 900);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleToggle = (next: boolean) => {
    userTouchedRef.current = true;
    setMuted(next);
  };
  const handleActivate = (id: string) => {
    userTouchedRef.current = true;
    setActiveId(id);
  };

  return (
    <div ref={rootRef} className="fg-filter" role="group" aria-label="Reserved-color filter interactive">
      <div className="fg-filter-body">
        <div className="fg-filter-stage" data-muted={muted}>
          <div className="fg-filter-toolbar">
            <label className="fg-filter-toggle" htmlFor={toggleId}>
              <input
                id={toggleId}
                type="checkbox"
                checked={muted}
                onChange={(e) => handleToggle(e.target.checked)}
              />
              <span className="fg-filter-toggle-track" aria-hidden="true">
                <span className="fg-filter-toggle-thumb" />
              </span>
              <span className="fg-filter-toggle-label">Show reserved colors only</span>
            </label>
            <p className="fg-filter-count">
              {muted ? "4 of 4 reserved elements visible" : "The rest of the surface reads brand-green"}
            </p>
          </div>

          <MockHome
            activeId={activeId}
            onActivate={handleActivate}
          />
        </div>

        <aside className="fg-filter-panel" aria-live="polite">
          <div className="fg-filter-focus">
            <p className="fg-filter-focus-eyebrow">
              <span
                className={`fg-filter-swatch fg-filter-swatch--${active.family}`}
                aria-hidden="true"
              />
              {FAMILY_LABEL[active.family]} · {active.where}
            </p>
            <h3 className="fg-filter-focus-tag">{active.tag}</h3>
            <p className="fg-filter-focus-why">{active.why}</p>
          </div>

          <div className="fg-filter-list-wrap">
            <p className="fg-filter-list-label">Every carve-out, named.</p>
            <ol className="fg-filter-list" role="list">
              {CARVE_OUTS.map((c) => {
                const isActive = c.id === active.id;
                const inMock = MOCK_RESERVED_IDS.includes(c.id as (typeof MOCK_RESERVED_IDS)[number]);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`fg-filter-list-item${isActive ? " fg-filter-list-item--active" : ""}`}
                      onClick={() => handleActivate(c.id)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={`fg-filter-swatch fg-filter-swatch--${c.family}`}
                        aria-hidden="true"
                      />
                      <span className="fg-filter-list-tag">{c.tag}</span>
                      {inMock ? (
                        <span className="fg-filter-list-badge" aria-label="Demonstrated in mock">
                          on mock
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── The mock: a stylized /home screen ─────────────────
   viewBox is a real iPhone (390 × 844). Displayed small.
   Non-reserved geometry reads var(--fgm-*) tokens that
   flip when [data-muted=true]. Reserved geometry uses
   hard fills so it survives the flip.
   ────────────────────────────────────────────────────── */

function MockHome({
  activeId,
  onActivate,
}: {
  activeId: string;
  onActivate: (id: string) => void;
}) {
  const activate = (id: string) => () => onActivate(id);

  return (
    <div className="fg-filter-frame">
      <svg
        viewBox="0 0 390 844"
        className="fg-filter-svg"
        role="img"
        aria-label="Fresh Greens /home screen mock. Four reserved-color elements are focusable: the daylight polyline strip at top, an orange community-report pin on the map, a yellow hazard teardrop on the map, and an orange report action button at bottom-right."
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Page background */}
        <rect x="0" y="0" width="390" height="844" fill="var(--fgm-page)" />

        {/* Status bar */}
        <g fill="var(--fgm-ink)" fontFamily="var(--font-mono, ui-monospace)" fontSize="14" fontWeight="600">
          <text x="26" y="34">9:41</text>
        </g>
        <g fill="var(--fgm-ink)" opacity="0.9">
          <rect x="316" y="22" width="22" height="12" rx="2" />
          <circle cx="348" cy="28" r="3" />
          <rect x="356" y="20" width="16" height="16" rx="3" />
        </g>

        {/* Wordmark */}
        <text
          x="26"
          y="82"
          fill="var(--fgm-ink)"
          fontFamily="var(--font-fg-display, Georgia, serif)"
          fontSize="26"
          fontWeight="500"
          letterSpacing="-0.02em"
        >
          fresh greens
        </text>
        <text
          x="26"
          y="106"
          fill="var(--fgm-muted)"
          fontFamily="var(--font-fg-body, system-ui)"
          fontSize="12"
        >
          good morning, myles.
        </text>

        {/* Search pill */}
        <g>
          <rect
            x="26"
            y="126"
            width="338"
            height="48"
            rx="24"
            fill="var(--fgm-surface)"
            stroke="var(--fgm-surface-line)"
            strokeWidth="1"
          />
          <circle cx="50" cy="150" r="6" fill="none" stroke="var(--fgm-muted)" strokeWidth="1.4" />
          <line x1="55" y1="155" x2="60" y2="160" stroke="var(--fgm-muted)" strokeWidth="1.4" strokeLinecap="round" />
          <text x="72" y="155" fill="var(--fgm-muted)" fontSize="14" fontFamily="var(--font-fg-body, system-ui)">
            where to?
          </text>
        </g>

        {/* Route card containing the daylight polyline strip */}
        <g>
          <rect
            x="26"
            y="192"
            width="338"
            height="98"
            rx="18"
            fill="var(--fgm-surface)"
            stroke="var(--fgm-surface-line)"
            strokeWidth="1"
          />
          <text x="42" y="220" fill="var(--fgm-ink)" fontFamily="var(--font-fg-body, system-ui)" fontSize="13" fontWeight="500">
            Continue to Vineland Flea Market
          </text>
          <text x="42" y="238" fill="var(--fgm-muted)" fontFamily="var(--font-fg-body, system-ui)" fontSize="11">
            2h 18m · leaves in 22 min
          </text>

          {/* ▸▸ Reserved element: daylight polyline strip ─── */}
          <ReservedGroup
            id="daylight-poly"
            active={activeId === "daylight-poly"}
            onActivate={activate("daylight-poly")}
            label="Daylight polyline strip"
            bbox={{ x: 40, y: 254, w: 310, h: 22 }}
          >
            {/* Sunrise-to-night gradient in four segments, each with its dash cadence */}
            <g strokeWidth="6" strokeLinecap="round" fill="none">
              <line x1="46" y1="266" x2="120" y2="266" stroke="#f6a86b" />
              <line x1="128" y1="266" x2="200" y2="266" stroke="#c87a8a" strokeDasharray="10 6" />
              <line x1="208" y1="266" x2="272" y2="266" stroke="#7d6ba8" strokeDasharray="3 6" />
              <line x1="280" y1="266" x2="346" y2="266" stroke="#4a4280" strokeDasharray="3 6" />
            </g>
            {/* Start / end dots */}
            <circle cx="46" cy="266" r="4" fill="#f6a86b" />
            <circle cx="346" cy="266" r="4" fill="#4a4280" />
          </ReservedGroup>
        </g>

        {/* Map card */}
        <g>
          <rect
            x="26"
            y="306"
            width="338"
            height="360"
            rx="20"
            fill="var(--fgm-map)"
            stroke="var(--fgm-surface-line)"
            strokeWidth="1"
          />
          {/* Street grid */}
          <g stroke="var(--fgm-street)" strokeWidth="1" opacity="0.6">
            <line x1="26" y1="360" x2="364" y2="360" />
            <line x1="26" y1="420" x2="364" y2="420" />
            <line x1="26" y1="480" x2="364" y2="480" />
            <line x1="26" y1="540" x2="364" y2="540" />
            <line x1="26" y1="600" x2="364" y2="600" />
            <line x1="90" y1="306" x2="90" y2="666" />
            <line x1="170" y1="306" x2="170" y2="666" />
            <line x1="250" y1="306" x2="250" y2="666" />
            <line x1="310" y1="306" x2="310" y2="666" />
          </g>

          {/* A brand-green route trace across the map */}
          <path
            d="M 60 620 Q 130 580 160 500 T 240 400 T 320 340"
            fill="none"
            stroke="var(--fgm-brand)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Trip start pin */}
          <circle cx="60" cy="620" r="8" fill="var(--fgm-ink)" />
          <circle cx="60" cy="620" r="3" fill="var(--fgm-page)" />
          {/* Trip end pin */}
          <circle cx="320" cy="340" r="8" fill="var(--fgm-brand)" />
          <circle cx="320" cy="340" r="3" fill="var(--fgm-page)" />

          {/* ▸▸ Reserved element: community eye pin ────────── */}
          <ReservedGroup
            id="orange-community"
            active={activeId === "orange-community"}
            onActivate={activate("orange-community")}
            label="Community-report pin"
            bbox={{ x: 130, y: 400, w: 44, h: 44 }}
          >
            <path
              d="M 152 402 C 168 402 178 414 178 428 C 178 440 152 460 152 460 C 152 460 126 440 126 428 C 126 414 136 402 152 402 Z"
              fill="#f08a4b"
            />
            {/* Eye glyph inside */}
            <ellipse cx="152" cy="426" rx="10" ry="6" fill="#fff" />
            <circle cx="152" cy="426" r="3" fill="#f08a4b" />
          </ReservedGroup>

          {/* ▸▸ Reserved element: yellow hazard teardrop ────── */}
          <ReservedGroup
            id="yellow-caution"
            active={activeId === "yellow-caution"}
            onActivate={activate("yellow-caution")}
            label="Hazard caution teardrop"
            bbox={{ x: 254, y: 452, w: 40, h: 44 }}
          >
            <path
              d="M 274 456 C 288 456 296 466 296 478 C 296 490 274 508 274 508 C 274 508 252 490 252 478 C 252 466 260 456 274 456 Z"
              fill="#e2b340"
            />
            <rect x="272" y="470" width="4" height="12" fill="#3a2c05" rx="1" />
            <circle cx="274" cy="488" r="2" fill="#3a2c05" />
          </ReservedGroup>

          {/* Neutral non-reserved map pins for context (mock-ink) */}
          <circle cx="100" cy="380" r="4" fill="var(--fgm-ink)" opacity="0.55" />
          <circle cx="220" cy="560" r="4" fill="var(--fgm-ink)" opacity="0.55" />
          <circle cx="290" cy="500" r="4" fill="var(--fgm-ink)" opacity="0.55" />

          {/* ▸▸ Reserved element: report FAB ──────────────── */}
          <ReservedGroup
            id="orange-fab"
            active={activeId === "orange-fab"}
            onActivate={activate("orange-fab")}
            label="Report action button"
            bbox={{ x: 296, y: 588, w: 56, h: 56 }}
          >
            <circle cx="324" cy="616" r="26" fill="#f08a4b" />
            <line x1="324" y1="606" x2="324" y2="626" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <line x1="314" y1="616" x2="334" y2="616" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </ReservedGroup>
        </g>

        {/* Bottom nav */}
        <g>
          <rect
            x="26"
            y="686"
            width="338"
            height="112"
            rx="24"
            fill="var(--fgm-surface)"
            stroke="var(--fgm-surface-line)"
            strokeWidth="1"
          />
          <NavItem cx={72} label="home" active />
          <NavItem cx={142} label="route" />
          <NavItem cx={212} label="explore" />
          <NavItem cx={282} label="safety" />
          <NavItem cx={342} label="me" />
        </g>
      </svg>
    </div>
  );
}

/* ── Reserved-element wrapper ──────────────────────────
   Focusable button-role group with a ring that hardens
   when active. Ring color follows the family via CSS.
   ────────────────────────────────────────────────────── */

function ReservedGroup({
  id,
  active,
  onActivate,
  label,
  bbox,
  children,
}: {
  id: string;
  active: boolean;
  onActivate: () => void;
  label: string;
  bbox: { x: number; y: number; w: number; h: number };
  children: React.ReactNode;
}) {
  return (
    <g
      className={`fg-filter-reserved${active ? " fg-filter-reserved--active" : ""}`}
      data-id={id}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      onClick={onActivate}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      {/* Invisible hit target — larger than the glyph so tap targets clear WCAG */}
      <rect
        x={bbox.x - 4}
        y={bbox.y - 4}
        width={bbox.w + 8}
        height={bbox.h + 8}
        rx="10"
        fill="transparent"
        className="fg-filter-hit"
      />
      {/* Ring — active only */}
      <rect
        x={bbox.x - 6}
        y={bbox.y - 6}
        width={bbox.w + 12}
        height={bbox.h + 12}
        rx="12"
        fill="none"
        className="fg-filter-ring"
      />
      {children}
    </g>
  );
}

function NavItem({ cx, label, active = false }: { cx: number; label: string; active?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={720} r="10" fill={active ? "var(--fgm-brand)" : "var(--fgm-muted)"} opacity={active ? 1 : 0.55} />
      <text
        x={cx}
        y={752}
        textAnchor="middle"
        fill={active ? "var(--fgm-brand)" : "var(--fgm-muted)"}
        fontSize="10"
        fontFamily="var(--font-fg-body, system-ui)"
      >
        {label}
      </text>
    </g>
  );
}
