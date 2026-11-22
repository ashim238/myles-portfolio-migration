import { useId, type CSSProperties } from "react";
import sheets from "@/lib/myles-97/teardown-sheets.json";
import type { FeaturedProjectId } from "@/lib/myles-97/programs";

type Layer = {
  label: string; revealGroup: number; offset: number[]; width: number; height: number; radius: number;
  image: string | null; fill?: string; inset?: number; contour: string; matrix: string;
  imprints?: { file: string; x: number; y: number; width: number; height: number }[];
};

export function layerDescription(project: FeaturedProjectId) {
  return sheets[project].layers.map(layer => layer.label).join(", ");
}

function PrintedPart({ layer, clipId }: { layer: Layer; clipId: string }) {
  const { width, height, radius, inset = 0 } = layer;
  return <g className="assembly-part" data-part={layer.label} style={{
    "--lift-x": layer.offset[0] + "px", "--lift-y": layer.offset[1] + "px", "--order": layer.revealGroup,
  } as CSSProperties}>
    <polygon points={layer.contour} className="material-edge" />
    <g transform={`matrix(${layer.matrix})`}>
      <defs><clipPath id={clipId}><rect width={width} height={height} rx={radius} /></clipPath></defs>
      <rect width={width} height={height} rx={radius} fill={layer.fill ?? "#fffdf7"} />
      <g clipPath={`url(#${clipId})`}>
        {layer.image && <image href={layer.image} x={inset} y={inset}
          width={width - 2 * inset} height={height - 2 * inset} preserveAspectRatio="xMidYMid slice" />}
        {layer.imprints?.map(mark => <image key={mark.file} href={mark.file} x={mark.x} y={mark.y}
          width={mark.width} height={mark.height} />)}
      </g>
      <rect className="material-rim" width={width} height={height} rx={radius} />
    </g>
  </g>;
}

export function TeardownDrawing({ project }: { project: FeaturedProjectId }) {
  const id = useId();
  const sheet = sheets[project];
  return <svg className="assembly-sheet" viewBox="0 0 640 360" aria-hidden="true" focusable="false"
    style={{ "--sheet-paper": sheet.paper, "--sheet-edge": sheet.edge, "--home-scale": sheet.homeScale } as CSSProperties}>
    <g className="assembly-spread">{sheet.layers.map((layer, index) =>
      <PrintedPart key={layer.label} layer={layer} clipId={id + "-" + index} />
    )}</g>
  </svg>;
}
