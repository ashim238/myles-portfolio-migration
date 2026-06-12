// Co-located components for the TikTok DSA case study.
// One file, one page — these aren't meant to be reused elsewhere.

/* ──────────────────────────────────────────
   Animated TikTok logo
   Cyan/magenta channel separation drift.
   prefers-reduced-motion: static glyph.
   ────────────────────────────────────────── */

const TIKTOK_PATH =
  "M22.5 6.8c-1.6-0.9-2.6-2.5-2.9-4.3h-3.7v15.1c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c0.4 0 0.7 0.1 1 0.2v-3.8c-0.3-0.04-0.7-0.06-1-0.06-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2v-7.7c1.4 1 3.2 1.6 5.1 1.6v-3.7c-0.9 0-1.8-0.3-2.2-0.6z";

export function TikTokLogo() {
  return (
    <span className="tt-logo" aria-hidden="true">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g className="tt-logo-cyan">
          <path d={TIKTOK_PATH} />
        </g>
        <g className="tt-logo-magenta">
          <path d={TIKTOK_PATH} />
        </g>
        <g className="tt-logo-ink">
          <path d={TIKTOK_PATH} />
        </g>
      </svg>
    </span>
  );
}
