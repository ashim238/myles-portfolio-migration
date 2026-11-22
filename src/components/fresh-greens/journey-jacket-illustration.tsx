import type { PointerEvent } from "react";

const drawing = "/projects/fresh-greens/process/onboarding/driver-location-journey.svg";

function replayGreeting(event: PointerEvent<SVGSVGElement>) {
  if (event.pointerType === "touch" || !window.matchMedia("(any-hover: hover)").matches) return;
  const animations = event.currentTarget.getAnimations?.({ subtree: true }) ?? [];
  if (animations.some(animation => animation.playState !== "finished")) return;
  for (const animation of animations) {
    animation.currentTime = 0;
    animation.play();
  }
}

// Use the original drawing's coordinate system so the palm turns at the wrist
// and the clouds keep their authored positions around the location pin.
export function JourneyJacketIllustration() {
  return (
    <svg className="atlas-illustration" viewBox="33 48 335 369"
      preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" onPointerEnter={replayGreeting}>
      <use href={drawing + "#journey-sky"} />
      <use href={drawing + "#journey-driver"} />
      <g transform="translate(104 146)">
        <g className="atlas-wave"><use href={drawing + "#journey-raised-hand"} x="-104" y="-146" /></g>
      </g>
      <use href={drawing + "#hand"} />
      <use href={drawing + "#journey-hill"} />
      <use className="atlas-cloud" href={drawing + "#journey-near-cloud"} />
      <use href={drawing + "#journey-sky-details"} />
      <use href={drawing + "#journey-sun"} />
    </svg>
  );
}
