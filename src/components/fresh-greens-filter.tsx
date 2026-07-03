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

      <div className="fg-filter-body">
        <div className="fg-filter-stage" data-muted={muted}>
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
  const key = (id: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate(id);
    }
  };

  // One teardrop silhouette, one radius — every map marker is the same size.
  const pin = (cx: number, cy: number, r = 15) => {
    const tip = cy + r * 2.3;
    return `M ${cx - r} ${cy} C ${cx - r} ${cy - r * 1.35} ${cx + r} ${cy - r * 1.35} ${cx + r} ${cy} C ${cx + r} ${cy + r * 0.95} ${cx + r * 0.4} ${cy + r * 1.5} ${cx} ${tip} C ${cx - r * 0.4} ${cy + r * 1.5} ${cx - r} ${cy + r * 0.95} ${cx - r} ${cy} Z`;
  };

  const ROUTE = "M 40 648 C 118 612 150 528 182 472 C 216 412 250 356 300 300";

  return (
    <div className="fg-filter-frame">
      <svg
        viewBox="0 0 390 844"
        className="fg-filter-svg"
        role="img"
        aria-label="Fresh Greens /home screen mock: a full-screen map under a search bar and a bottom sheet of local recommendations. Four reserved-color elements are focusable: the daylight-graded route line, an orange community-report pin, a yellow hazard marker, and the orange alert button at bottom-right."
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fgm-daylight" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#f6a86b" />
            <stop offset="0.4" stopColor="#c87a8a" />
            <stop offset="0.72" stopColor="#7d6ba8" />
            <stop offset="1" stopColor="#4a4280" />
          </linearGradient>
        </defs>

        {/* ── Map canvas (full bleed) ─────────────────────── */}
        <rect x="0" y="0" width="390" height="844" fill="var(--fgm-map)" />

        {/* Park / green space */}
        <path
          d="M 150 520 Q 250 500 300 560 Q 320 640 220 660 Q 130 650 130 580 Z"
          fill="var(--fgm-brand)"
          opacity="0.12"
        />
        {/* Building footprints */}
        <g fill="var(--fgm-ink)" opacity="0.06">
          <rect x="44" y="300" width="78" height="58" rx="4" />
          <rect x="250" y="322" width="90" height="70" rx="4" />
          <rect x="60" y="150" width="70" height="52" rx="4" />
          <rect x="286" y="470" width="70" height="70" rx="4" />
        </g>
        {/* Road casings */}
        <g stroke="var(--fgm-street)" fill="none" strokeLinecap="round">
          <path d="M -10 250 C 120 235 260 275 400 250" strokeWidth="16" />
          <path d="M 200 -10 C 185 200 235 460 210 860" strokeWidth="15" />
          <path d="M -10 470 C 130 450 250 495 400 460" strokeWidth="13" />
        </g>
        {/* One avenue carries brand-green traffic (fades when muted) */}
        <path
          d="M -10 250 C 120 235 260 275 400 250"
          stroke="var(--fgm-brand)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* ▸▸ Reserved: daylight-graded route line ────────── */}
        <g
          className={`fg-filter-reserved fg-filter-route${activeId === "daylight-poly" ? " fg-filter-reserved--active" : ""}`}
          data-id="daylight-poly"
          role="button"
          tabIndex={0}
          aria-label="Daylight-graded route line"
          aria-pressed={activeId === "daylight-poly"}
          onClick={activate("daylight-poly")}
          onFocus={activate("daylight-poly")}
          onMouseEnter={activate("daylight-poly")}
          onKeyDown={key("daylight-poly")}
        >
          <path d={ROUTE} fill="none" stroke="transparent" strokeWidth="30" strokeLinecap="round" className="fg-filter-hit" />
          <path d={ROUTE} fill="none" stroke="var(--fg-accent)" strokeWidth="13" strokeLinecap="round" className="fg-route-glow" />
          <path d={ROUTE} fill="none" stroke="url(#fgm-daylight)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="40" cy="648" r="4.5" fill="#f6a86b" />
          <circle cx="300" cy="300" r="4.5" fill="#4a4280" />
        </g>

        {/* Green vehicle marker (brand — fades when muted) */}
        <g>
          <circle cx="196" cy="452" r="19" fill="var(--fgm-brand)" />
          <path
            d="M 187 454 h 18 v -5 q 0 -3 -3 -3 h -12 q -3 0 -3 3 Z"
            fill="var(--fgm-page)"
            opacity="0.92"
          />
          <circle cx="191" cy="456" r="2" fill="var(--fgm-brand)" />
          <circle cx="201" cy="456" r="2" fill="var(--fgm-brand)" />
        </g>

        {/* Current-location dot (neutral system UI — fades when muted) */}
        <circle cx="250" cy="502" r="12" fill="var(--fgm-brand)" opacity="0.18" />
        <circle cx="250" cy="502" r="5.5" fill="var(--fgm-ink)" opacity="0.75" />
        <circle cx="250" cy="502" r="5.5" fill="none" stroke="var(--fgm-page)" strokeWidth="1.5" />

        {/* ▸▸ Reserved: community eye-pin ─────────────────── */}
        <ReservedGroup
          id="orange-community"
          active={activeId === "orange-community"}
          onActivate={activate("orange-community")}
          label="Community-report pin"
          bbox={{ x: 305, y: 204, w: 34, h: 60 }}
        >
          <path d={pin(322, 226)} fill="#f08a4b" />
          <ellipse cx="322" cy="224" rx="9" ry="5.5" fill="#fff" />
          <circle cx="322" cy="224" r="2.6" fill="#f08a4b" />
        </ReservedGroup>

        {/* ▸▸ Reserved: yellow hazard marker (same size) ──── */}
        <ReservedGroup
          id="yellow-caution"
          active={activeId === "yellow-caution"}
          onActivate={activate("yellow-caution")}
          label="Hazard caution marker"
          bbox={{ x: 123, y: 358, w: 34, h: 60 }}
        >
          <path d={pin(140, 380)} fill="#e2b340" />
          <rect x="138" y="371" width="4" height="11" rx="1.5" fill="#3a2c05" />
          <circle cx="140" cy="388" r="2" fill="#3a2c05" />
        </ReservedGroup>

        {/* ── Search bar (over the map) ───────────────────── */}
        <g>
          <rect x="20" y="58" width="350" height="48" rx="24" fill="var(--fgm-surface)" />
          <rect x="20.5" y="58.5" width="349" height="47" rx="23.5" fill="none" stroke="var(--fgm-surface-line)" strokeWidth="1" />
          <circle cx="46" cy="82" r="6" fill="none" stroke="var(--fgm-muted)" strokeWidth="1.6" />
          <line x1="50.5" y1="86.5" x2="55" y2="91" stroke="var(--fgm-muted)" strokeWidth="1.6" strokeLinecap="round" />
          <text x="66" y="87" fill="var(--fgm-muted)" fontSize="14" fontFamily="var(--font-fg-body, system-ui)">
            Where are you headed?
          </text>
          {/* Mic icon */}
          <g stroke="var(--fgm-muted)" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <rect x="341" y="72" width="8" height="14" rx="4" fill="var(--fgm-muted)" stroke="none" />
            <path d="M 338 82 a 7 7 0 0 0 14 0" />
            <line x1="345" y1="89" x2="345" y2="94" />
          </g>
        </g>

        {/* Menu button (top-left) */}
        <g>
          <rect x="20" y="118" width="46" height="46" rx="14" fill="var(--fgm-surface)" />
          <rect x="20.5" y="118.5" width="45" height="45" rx="13.5" fill="none" stroke="var(--fgm-surface-line)" strokeWidth="1" />
          <g stroke="var(--fgm-ink)" strokeWidth="1.8" strokeLinecap="round">
            <line x1="32" y1="135" x2="54" y2="135" />
            <line x1="32" y1="141" x2="54" y2="141" />
            <line x1="32" y1="147" x2="48" y2="147" />
          </g>
        </g>

        {/* ▸▸ Reserved: alert button (over map, above sheet) ─ */}
        <ReservedGroup
          id="orange-fab"
          active={activeId === "orange-fab"}
          onActivate={activate("orange-fab")}
          label="Alert / report button"
          bbox={{ x: 307, y: 531, w: 50, h: 50 }}
        >
          <circle cx="332" cy="556" r="24" fill="var(--fgm-surface)" />
          <circle cx="332" cy="556" r="19" fill="#f08a4b" />
          <rect x="330" y="546" width="4" height="12" rx="2" fill="#fff" />
          <circle cx="332" cy="565" r="2.2" fill="#fff" />
        </ReservedGroup>

        {/* ── Bottom sheet ────────────────────────────────── */}
        <g>
          <rect x="0" y="598" width="390" height="246" rx="30" fill="var(--fgm-surface)" />
          <rect x="0.5" y="598.5" width="389" height="60" rx="29.5" fill="none" stroke="var(--fgm-surface-line)" strokeWidth="1" />
          <rect x="177" y="612" width="36" height="5" rx="2.5" fill="var(--fgm-muted)" opacity="0.6" />

          <text x="26" y="652" fill="var(--fgm-muted)" fontSize="12" fontFamily="var(--font-fg-body, system-ui)">
            Local recs
          </text>
          {/* Body font, not the serif — the app reserves DM Serif for six
              emotional beats, and a district heading isn't one of them. */}
          <text
            x="26"
            y="682"
            fill="var(--fgm-ink)"
            fontSize="18"
            fontWeight="600"
            fontFamily="var(--font-fg-body, system-ui)"
            letterSpacing="-0.01em"
          >
            East Historic District
          </text>

          {/* Weather chip */}
          <rect x="296" y="636" width="70" height="34" rx="12" fill="var(--fgm-page)" />
          <circle cx="313" cy="653" r="6" fill="none" stroke="var(--fgm-muted)" strokeWidth="1.4" />
          <text x="326" y="658" fill="var(--fgm-ink)" fontSize="13" fontFamily="var(--font-fg-body, system-ui)">
            66°
          </text>

          {/* Section row */}
          <text x="26" y="726" fill="var(--fgm-ink)" fontSize="13" fontWeight="500" fontFamily="var(--font-fg-body, system-ui)">
            Things to Do: Black Owned
          </text>
          <path d="M 350 728 l 6 -6 l 6 6" fill="none" stroke="var(--fgm-muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

          {/* Photo card hint */}
          <rect x="26" y="742" width="338" height="86" rx="14" fill="var(--fgm-map)" />
          <rect x="26" y="742" width="338" height="86" rx="14" fill="var(--fgm-ink)" opacity="0.04" />
          <circle cx="60" cy="812" r="3" fill="var(--fgm-muted)" opacity="0.5" />
          <rect x="74" y="806" width="120" height="6" rx="3" fill="var(--fgm-muted)" opacity="0.4" />
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
