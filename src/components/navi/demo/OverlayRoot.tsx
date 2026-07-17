import { type ReactNode } from "react";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";

/**
 * Token scope for body-portaled Navi overlays.
 *
 * These overlays portal to document.body so they escape the sticky booking
 * container's stacking context and the .nv-ui inert background. But that also
 * lands them outside .nv-ui, the element that carries every --nv-* design token
 * and the Jost/Lato font variables. Rendered there raw they lose their surface,
 * border, text colors, radii, and fonts — a transparent, mis-fonted dialog.
 *
 * Wrapping the portal payload here re-establishes that scope: .nv-overlay-root
 * mirrors the .nv-ui token block in CSS, and the font-variable classNames bring
 * the minisite typefaces back. It deliberately is NOT .nv-ui, so overlay-lock's
 * inert (which targets .nv-ui) never reaches the live overlay.
 */
export function OverlayRoot({ children }: { children: ReactNode }) {
  return (
    <div className={`nv-overlay-root ${naviDisplay.variable} ${naviBody.variable}`}>
      {children}
    </div>
  );
}
