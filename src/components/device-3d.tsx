"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ExpandableImage } from "@/components/expandable-image";

const Device3DScene = dynamic(() => import("@/components/device-3d-scene"), {
  ssr: false,
});

type Device3DProps = {
  screen: string;
  alt: string;
};

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * A real WebGL phone showing the shipped app screen, draggable to rotate.
 * Progressive: server-renders and falls back to the flat (lightboxable) image
 * for reduced-motion, no-WebGL, or no-JS. The Three.js bundle is code-split and
 * only mounts once the block scrolls near the viewport.
 */
export function Device3D({ screen, alt }: Device3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsWebGL()) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow3D(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="device-3d" data-mode={show3D ? "3d" : "flat"}>
      {show3D ? (
        <div className="device-3d-stage" role="img" aria-label={alt}>
          <Device3DScene screen={screen} />
          <p className="device-3d-hint" aria-hidden="true">
            Drag to rotate
          </p>
        </div>
      ) : (
        <div className="device-3d-flat">
          <ExpandableImage
            src={screen}
            alt={alt}
            width={1290}
            height={2796}
            sizes="(max-width: 768px) 70vw, 320px"
            className="device-3d-flat-img"
          />
        </div>
      )}
    </div>
  );
}
