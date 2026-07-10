import { COLOR_TOKENS, SPACING_TOKENS } from "@/lib/fresh-greens/design-tokens";

/**
 * A native design-token exhibit rendered from the real app repo values,
 * not a Figma screenshot: color roles and the 4pt spacing ramp.
 */
export function TokenExhibit() {
  const maxPx = Math.max(...SPACING_TOKENS.map((s) => s.px));

  return (
    <div className="fg-tokens" aria-label="Fresh Greens design tokens">
      <div className="fg-tokens-lane">
        <p className="fg-tokens-lane-label">Color, and the job each one holds</p>
        <ul className="fg-tokens-colors" role="list">
          {COLOR_TOKENS.map((c) => (
            <li key={c.name} className="fg-token-color">
              <span
                className="fg-token-chip"
                style={{ background: c.hex }}
                aria-hidden="true"
              />
              <span className="fg-token-name">{c.name}</span>
              <span className="fg-token-hex">{c.hex}</span>
              <span className="fg-token-role">{c.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="fg-tokens-lane">
        <p className="fg-tokens-lane-label">Spacing, a 4pt ramp</p>
        <ul className="fg-tokens-spacing" role="list">
          {SPACING_TOKENS.map((s) => (
            <li key={s.name} className="fg-token-space">
              <span className="fg-token-space-name">{s.name}</span>
              <span
                className="fg-token-space-bar"
                style={{ width: `${Math.round((s.px / maxPx) * 100)}%` }}
                aria-hidden="true"
              />
              <span className="fg-token-space-px">{s.px}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
