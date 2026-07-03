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

  // Runs the full height of the map, from the start dot near the bottom to
  // the destination pin up top — no stopping short mid-canvas.
  const ROUTE = "M 72 690 C 128 636 150 548 190 476 C 232 398 246 300 262 196";

  // The app's real map-pin silhouette (assets/mapmarker-pin-report.svg,
  // viewBox 30x39), inlined so the community and hazard markers use the
  // exact teardrop the app renders instead of an approximation.
  const PIN =
    "M15 0C11.0218 0 7.20644 1.58035 4.3934 4.3934C1.58035 7.20644 0 11.0218 0 15C0 28.5 15 39 15 39C15 39 30 28.5 30 15C30 11.0218 28.4196 7.20644 25.6066 4.3934C22.7936 1.58035 18.9782 0 15 0Z";

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
          {/* Real daylight anchors from theme/colors.ts: dawn, dusk, night. */}
          <linearGradient id="fgm-daylight" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#FFB347" />
            <stop offset="0.5" stopColor="#C4785A" />
            <stop offset="1" stopColor="#2D1B69" />
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
          <path d={ROUTE} fill="none" stroke="url(#fgm-daylight)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="72" cy="690" r="4.5" fill="#FFB347" />
        </g>

        {/* Destination pin at the route end (neutral — fades when muted) */}
        <g>
          <path d={pin(262, 190, 12)} fill="var(--fgm-ink)" opacity="0.85" />
          <circle cx="262" cy="189" r="4" fill="var(--fgm-page)" />
        </g>

        {/* Current-location dot — the app's iOS systemBlue. Not a reserved
            color, so it correctly greys with everything else when muted:
            proof the rule survives even the platform's own accent. */}
        <circle cx="234" cy="536" r="13" fill="var(--fgm-location)" opacity="0.18" />
        <circle cx="234" cy="536" r="6" fill="var(--fgm-location)" />
        <circle cx="234" cy="536" r="6" fill="none" stroke="var(--fgm-page)" strokeWidth="2" />

        {/* Green vehicle marker on the route — the app's real edge-marker car
            glyph (assets/edge-marker-glyph-car.svg, Figma 1133:13250), recolored
            to tokens so it fades with the surface when muted. */}
        <g>
          <circle cx="190" cy="476" r="18" fill="var(--fgm-brand)" />
          <g transform="translate(180 469.2) scale(0.903)">
            <path d="M22.14 10.3576V10.884C22.14 11.0293 22.0221 11.1472 21.8768 11.1472H20.8693C20.9738 10.884 21.0314 10.5971 21.0314 10.2968C21.0314 10.2287 21.0285 10.161 21.0227 10.0944H21.8768C22.0221 10.0944 22.14 10.2121 22.14 10.3576Z" fill="var(--fgm-page)" />
            <path d="M15.3876 9.7696C13.934 9.7696 12.7557 10.9471 12.7557 12.3998C12.7557 12.4666 12.758 12.5326 12.763 12.5981H18.0123C18.0173 12.5326 18.0196 12.4666 18.0196 12.3998C18.0196 10.9471 16.8413 9.7696 15.3876 9.7696ZM5.21212 9.7696C3.75848 9.7696 2.58014 10.9471 2.58014 12.3998C2.58014 12.4666 2.5825 12.5326 2.58751 12.5981H7.83674C7.84174 12.5326 7.84411 12.4666 7.84411 12.3998C7.84411 10.9471 6.66577 9.7696 5.21212 9.7696Z" fill="var(--fgm-page)" />
            <path d="M21.0227 10.0944C20.9382 9.12521 20.2529 8.32826 19.3409 8.0776V6.90427H19.3472C19.3472 6.61205 19.3264 6.32405 19.2859 6.0413C18.9948 3.99869 17.683 2.2333 15.8111 1.14729C15.6377 1.04656 15.4598 0.951868 15.2771 0.863231C15.1902 0.821148 15.1026 0.78038 15.0139 0.741453C14.5001 0.513678 13.9543 0.333772 13.3834 0.208312C12.7651 0.0723304 12.1179 0 11.4512 0C7.09031 0 3.55529 3.09127 3.55529 6.90427H3.54897V7.99528H2.30299C1.6671 7.99528 1.09122 8.25277 0.674578 8.66939C0.257935 9.08575 0 9.66124 0 10.2967C0 11.5676 1.03121 12.5981 2.30299 12.5981L2.58751 12.5981C2.5825 12.5326 2.58014 12.4666 2.58014 12.3998C2.58014 10.9471 3.75848 9.7696 5.21212 9.7696C6.66577 9.7696 7.84411 10.9471 7.84411 12.3998C7.84411 12.4666 7.84174 12.5326 7.83674 12.5981H12.763C12.758 12.5326 12.7557 12.4666 12.7557 12.3998C12.7557 10.9471 13.934 9.7696 15.3876 9.7696C16.8413 9.7696 18.0196 10.9471 18.0196 12.3998C18.0196 12.4666 18.0173 12.5326 18.0123 12.5981L18.7284 12.5981C19.3643 12.5981 19.9399 12.3404 20.3568 11.924C20.5769 11.7044 20.7524 11.441 20.8693 11.1472C20.9738 10.884 21.0314 10.5971 21.0314 10.2968C21.0314 10.2287 21.0285 10.161 21.0227 10.0944ZM8.13099 4.9545C7.89069 5.33167 7.67461 5.69543 7.48089 6.0413H5.52928C5.4848 5.76355 5.46269 5.50474 5.45769 5.2646C5.45637 5.20437 5.45637 5.14546 5.45716 5.08785C5.45795 5.03157 5.45953 4.97633 5.46242 4.92215C5.46532 4.86139 5.46927 4.80195 5.47453 4.74382C5.55086 3.86008 5.85617 3.30221 6.00514 3.06287C7.10505 1.29353 9.58806 0.945556 10.809 0.878486C11.1186 0.86139 11.347 0.862442 11.4512 0.862968C11.4673 0.862968 11.4805 0.863231 11.4897 0.863231C11.1096 1.22725 10.7101 1.63572 10.3021 2.09153C10.2929 2.10205 10.2834 2.11257 10.274 2.1231L10.2721 2.12546C10.2447 2.15571 10.2179 2.18622 10.1908 2.21699C10.1126 2.30563 10.0342 2.39611 9.95549 2.48843C9.76098 2.71647 9.56543 2.95529 9.36987 3.2049C8.89795 3.80721 8.48763 4.39532 8.13099 4.9545ZM15.3587 4.11942C15.3584 4.15966 15.3579 4.19937 15.3574 4.23909C15.3566 4.29064 15.3555 4.34193 15.3542 4.39269C15.3537 4.41452 15.3532 4.43609 15.3524 4.45766C15.3484 4.59574 15.3426 4.73094 15.3353 4.86376C15.3121 5.28407 15.2734 5.67754 15.2258 6.0413H9.39356C9.39356 6.02552 9.39356 6.00948 9.39408 5.99369C9.39856 5.53525 9.4712 5.09101 9.60385 4.6686C9.60596 4.66203 9.60806 4.65545 9.61017 4.64887C9.7773 4.12362 10.0368 3.63257 10.3727 3.18885C10.4129 3.1352 10.4542 3.08233 10.4969 3.03051C10.6172 2.88375 10.7456 2.74277 10.8822 2.6081L10.8856 2.60468C10.8877 2.60258 10.8898 2.60048 10.8922 2.59837C11.1278 2.36691 11.3868 2.15413 11.666 1.96318C11.6842 1.95082 11.7023 1.93846 11.7208 1.92609C12.0276 1.72041 12.3582 1.54077 12.7083 1.39085C12.9262 1.29695 13.1515 1.21489 13.3834 1.14492C13.9751 1.32352 14.5241 1.58154 15.0139 1.90479C15.0905 1.95529 15.1658 2.00737 15.2392 2.06102C15.2676 2.28959 15.2924 2.52946 15.3118 2.77986C15.3411 3.15519 15.3587 3.55445 15.3592 3.97475C15.3592 4.02341 15.3592 4.07155 15.3587 4.11942ZM15.813 6.0413C15.7856 5.64782 15.7648 5.2383 15.7532 4.81326C15.7516 4.75671 15.7501 4.70016 15.749 4.64309C15.748 4.60179 15.7472 4.56024 15.7464 4.51842C15.7459 4.48896 15.7453 4.45924 15.7448 4.42952C15.7443 4.37981 15.7437 4.32983 15.7432 4.27959C15.7422 4.1786 15.7419 4.07707 15.7419 3.97475C15.7419 3.8272 15.7432 3.68149 15.7456 3.53709C15.7469 3.44503 15.7488 3.35403 15.7511 3.26381C15.7543 3.12836 15.7588 2.99448 15.7638 2.86218C15.7685 2.74277 15.7738 2.62467 15.7798 2.50763C15.7903 2.51736 15.8009 2.52709 15.8111 2.53709C15.8232 2.54866 15.8351 2.55997 15.8472 2.57154C15.9327 2.6544 16.0154 2.73988 16.0949 2.82746C16.1538 2.89243 16.2109 2.95871 16.2662 3.02631C16.3033 3.07128 16.3394 3.11678 16.3746 3.16281C16.4102 3.2091 16.4449 3.25618 16.4789 3.30353C17.0458 4.09785 17.3732 5.03604 17.3732 6.0413H15.813Z" fill="var(--fgm-page)" />
            <path d="M7.84411 12.3998C7.84411 12.4666 7.84174 12.5326 7.83674 12.5981C7.73541 13.9582 6.59918 15.03 5.21212 15.03C3.82506 15.03 2.68884 13.9582 2.58751 12.5981C2.5825 12.5326 2.58014 12.4666 2.58014 12.3998C2.58014 10.9471 3.75848 9.7696 5.21212 9.7696C6.66577 9.7696 7.84411 10.9471 7.84411 12.3998Z" fill="var(--fgm-ink)" />
            <path d="M5.21212 14.0437C6.12062 14.0437 6.85711 13.3077 6.85711 12.3998C6.85711 11.4919 6.12062 10.7559 5.21212 10.7559C4.30362 10.7559 3.56713 11.4919 3.56713 12.3998C3.56713 13.3077 4.30362 14.0437 5.21212 14.0437Z" fill="var(--fgm-muted)" />
            <path d="M18.0196 12.3998C18.0196 12.4666 18.0173 12.5326 18.0123 12.5981C17.9109 13.9582 16.7747 15.03 15.3876 15.03C14.0006 15.03 12.8644 13.9582 12.763 12.5981C12.758 12.5326 12.7557 12.4666 12.7557 12.3998C12.7557 10.9471 13.934 9.7696 15.3876 9.7696C16.8413 9.7696 18.0196 10.9471 18.0196 12.3998Z" fill="var(--fgm-ink)" />
            <path d="M15.3874 14.0437C16.2959 14.0437 17.0324 13.3077 17.0324 12.3998C17.0324 11.4919 16.2959 10.7559 15.3874 10.7559C14.4789 10.7559 13.7424 11.4919 13.7424 12.3998C13.7424 13.3077 14.4789 14.0437 15.3874 14.0437Z" fill="var(--fgm-muted)" />
          </g>
        </g>

        {/* ▸▸ Reserved: community eye-pin — real pin silhouette, orange,
            with the eye that /home marks community reports with. ──────── */}
        <ReservedGroup
          id="orange-community"
          active={activeId === "orange-community"}
          onActivate={activate("orange-community")}
          label="Community-report pin"
          bbox={{ x: 301, y: 211, w: 42, h: 52 }}
        >
          <g transform="translate(303.25 213.25) scale(1.25)">
            <path d={PIN} fill="#FF9500" />
          </g>
          <ellipse cx="322" cy="231" rx="6" ry="3.7" fill="#fff" />
          <circle cx="322" cy="231" r="2.5" fill="#FF9500" />
        </ReservedGroup>

        {/* ▸▸ Reserved: yellow hazard marker — same real silhouette. ──── */}
        <ReservedGroup
          id="yellow-caution"
          active={activeId === "yellow-caution"}
          onActivate={activate("yellow-caution")}
          label="Hazard caution marker"
          bbox={{ x: 119, y: 365, w: 42, h: 52 }}
        >
          <g transform="translate(121.25 367.25) scale(1.25)">
            <path d={PIN} fill="#FFCC00" />
          </g>
          <rect x="138" y="379" width="4" height="9.5" rx="1.5" fill="#3a2c05" />
          <circle cx="140" cy="392.5" r="2" fill="#3a2c05" />
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
          <g stroke="var(--fgm-muted)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <rect x="341.5" y="72" width="7" height="12" rx="3.5" fill="var(--fgm-muted)" stroke="none" />
            <path d="M 338 81 v 1 a 7 7 0 0 0 14 0 v -1" />
            <line x1="345" y1="89" x2="345" y2="92.5" />
            <line x1="341.5" y1="93" x2="348.5" y2="93" />
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
          <circle cx="332" cy="556" r="19" fill="#FF9500" />
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
          <g stroke="var(--fgm-muted)" strokeWidth="1.3" strokeLinecap="round">
            <circle cx="313" cy="653" r="4" fill="none" />
            <line x1="313" y1="645.5" x2="313" y2="647" />
            <line x1="313" y1="659" x2="313" y2="660.5" />
            <line x1="305.5" y1="653" x2="307" y2="653" />
            <line x1="319" y1="653" x2="320.5" y2="653" />
            <line x1="307.7" y1="647.7" x2="308.7" y2="648.7" />
            <line x1="317.3" y1="657.3" x2="318.3" y2="658.3" />
          </g>
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
