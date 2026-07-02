"use client";

import Image from "next/image";

export function NaviClosingParallax() {
  return (
    <div className="nv-closing" aria-hidden="true">
      <div className="nv-closing-bg" />
      <div className="nv-closing-layer nv-closing-layer--back">
        <Image
          src="/projects/navi/desktop-screens.png"
          alt=""
          width={2275}
          height={1517}
          sizes="(max-width: 768px) 88vw, 72vw"
          className="nv-closing-screen nv-closing-screen--main"
        />
      </div>
      <div className="nv-closing-layer nv-closing-layer--mid">
        <Image
          src="/projects/navi/interface-composition.png"
          alt=""
          width={1900}
          height={1267}
          sizes="(max-width: 768px) 56vw, 38vw"
          className="nv-closing-screen nv-closing-screen--detail"
        />
      </div>
      <div className="nv-closing-layer nv-closing-layer--front">
        <span className="nv-closing-accent nv-closing-accent--1" />
        <span className="nv-closing-accent nv-closing-accent--2" />
        <span className="nv-closing-accent nv-closing-accent--3" />
      </div>
    </div>
  );
}
