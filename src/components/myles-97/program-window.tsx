"use client";

import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import type { ProgramId } from "@/lib/myles-97/programs";
import type { WindowGeometry } from "@/lib/myles-97/state";
import { Myles97Icon } from "@/components/myles-97/icons";
import { useWindowDrag } from "@/components/myles-97/use-window-drag";

type ProgramWindowProps = PropsWithChildren<{
  id: ProgramId;
  title: string;
  geometry: WindowGeometry;
  focused: boolean;
  stackIndex?: number;
  status?: ReactNode;
  onFocus: (id: ProgramId) => void;
  onMove: (id: ProgramId, geometry: WindowGeometry) => void;
  onMinimize: (id: ProgramId) => void;
  onClose: (id: ProgramId) => void;
  onMaximize?: (id: ProgramId) => void;
}>;

function caseStudyName(title: string): string {
  return title.replace(/\.(?:exe|app|studio)$/i, "");
}

export function ProgramWindow({
  id,
  title,
  geometry,
  focused,
  stackIndex,
  status,
  onFocus,
  onMove,
  onMinimize,
  onClose,
  onMaximize,
  children,
}: ProgramWindowProps) {
  const { dragHandleProps, dragging, previewTransform } = useWindowDrag({
    geometry,
    onCommit: (nextGeometry) => onMove(id, nextGeometry),
  });
  const titleId = `${id}-window-title`;
  const style: CSSProperties = {
    left: geometry.x,
    top: geometry.y,
    width: geometry.width,
    height: geometry.height,
    transform: previewTransform,
    zIndex: stackIndex,
  };

  return (
    <section
      className="myles97-window"
      role="region"
      aria-labelledby={titleId}
      data-focused={focused ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      data-m97-program-window={id}
      style={style}
      onPointerDown={() => onFocus(id)}
    >
      <header className="myles97-titlebar" {...dragHandleProps}>
        <span className="myles97-titlebar-icon" aria-hidden="true">
          <Myles97Icon name="app" size={16} />
        </span>
        <strong id={titleId} className="myles97-window-title">
          {title}
        </strong>
        <div className="myles97-window-controls" aria-label={`${title} window controls`}>
          <button
            type="button"
            className="myles97-hit-target"
            aria-label={`Minimize ${title}`}
            onClick={() => onMinimize(id)}
          >
            <span className="myles97-window-control" aria-hidden="true">
              –
            </span>
          </button>
          {onMaximize ? (
            <button
              type="button"
              className="myles97-hit-target"
              aria-label={`Open ${caseStudyName(title)} case study`}
              onClick={() => onMaximize(id)}
            >
              <span className="myles97-window-control" aria-hidden="true">
                □
              </span>
            </button>
          ) : null}
          <button
            type="button"
            className="myles97-hit-target"
            aria-label={`Close ${title}`}
            onClick={() => onClose(id)}
          >
            <span className="myles97-window-control" aria-hidden="true">
              ×
            </span>
          </button>
        </div>
      </header>
      <div className="myles97-window-content">{children}</div>
      {status ? <div className="myles97-window-status">{status}</div> : null}
    </section>
  );
}
