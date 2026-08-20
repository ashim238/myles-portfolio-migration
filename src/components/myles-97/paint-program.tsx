"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const COLORS = [
  { name: "Black", value: "#111111" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#e43d30" },
  { name: "Yellow", value: "#ffde2e" },
  { name: "Blue", value: "#1879d6" },
  { name: "Teal", value: "#087f86" },
  { name: "Purple", value: "#6d4bb8" },
];
const CANVAS_WIDTH = 304;
const CANVAS_HEIGHT = 208;

type Tool = "pencil" | "eraser";

export function PaintProgram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState(COLORS[0].value);
  const [cursor, setCursor] = useState({ x: 152, y: 104 });
  const [canUndo, setCanUndo] = useState(false);
  const [actionStatus, setActionStatus] = useState("Ready to draw.");
  const boundsRef = useRef<DOMRect | null>(null);
  const undoRef = useRef<ImageData | null>(null);

  const getContext = useCallback(() => canvasRef.current?.getContext("2d") ?? null, []);

  const resetCanvas = useCallback(() => {
    const context = getContext();
    if (!context) return;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [getContext]);

  const captureUndo = useCallback(() => {
    const context = getContext();
    if (!context) return;
    undoRef.current = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setCanUndo(true);
  }, [getContext]);

  const undo = useCallback(() => {
    const context = getContext();
    if (!context || !undoRef.current) return;
    context.putImageData(undoRef.current, 0, 0);
    undoRef.current = null;
    setCanUndo(false);
    setActionStatus("Last change undone.");
  }, [getContext]);

  useEffect(() => {
    resetCanvas();
  }, [resetCanvas]);

  const pointFor = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = boundsRef.current ?? event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * (CANVAS_WIDTH / bounds.width),
      y: (event.clientY - bounds.top) * (CANVAS_HEIGHT / bounds.height),
    };
  };

  const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const context = getContext();
    if (!context) return;
    context.strokeStyle = tool === "eraser" ? "#fff" : color;
    context.lineWidth = tool === "eraser" ? 12 : 3;
    context.lineCap = "square";
    context.lineJoin = "miter";
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  };

  return (
    <section className="myles97-paint" aria-label="MDT Paint">
      <div className="myles97-paint-toolbar" role="toolbar" aria-label="Paint tools">
        <button
          type="button"
          className="myles97-paint-tool"
          data-selected={tool === "pencil"}
          aria-pressed={tool === "pencil"}
          onClick={() => {
            setTool("pencil");
            setActionStatus("Pencil selected.");
          }}
        >
          Pencil
        </button>
        <button
          type="button"
          className="myles97-paint-tool"
          data-selected={tool === "eraser"}
          aria-pressed={tool === "eraser"}
          onClick={() => {
            setTool("eraser");
            setActionStatus("Eraser selected.");
          }}
        >
          Eraser
        </button>
        <button
          type="button"
          className="myles97-paint-tool"
          onClick={() => {
            captureUndo();
            resetCanvas();
            setActionStatus("Canvas cleared. Undo is available.");
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="myles97-paint-tool"
          disabled={!canUndo}
          onClick={undo}
        >
          Undo
        </button>
      </div>
      <div className="myles97-paint-workspace">
        <div className="myles97-paint-canvas-wrap">
          <canvas
          ref={canvasRef}
          className="myles97-paint-canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-label="Paint canvas"
          aria-describedby="myles97-paint-help"
          tabIndex={0}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            boundsRef.current = event.currentTarget.getBoundingClientRect();
            const point = pointFor(event);
            setCursor(point);
            captureUndo();
            drawingRef.current = true;
            lastPointRef.current = point;
            drawLine(point, point);
          }}
          onPointerMove={(event) => {
            if (!drawingRef.current || !lastPointRef.current) return;
            const point = pointFor(event);
            drawLine(lastPointRef.current, point);
            lastPointRef.current = point;
          }}
          onPointerUp={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
            boundsRef.current = null;
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
            boundsRef.current = null;
          }}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 16 : 4;
            const delta = {
              ArrowLeft: { x: -step, y: 0 },
              ArrowRight: { x: step, y: 0 },
              ArrowUp: { x: 0, y: -step },
              ArrowDown: { x: 0, y: step },
            }[event.key];
            if (delta) {
              event.preventDefault();
              setCursor((current) => ({
                x: Math.min(CANVAS_WIDTH, Math.max(0, current.x + delta.x)),
                y: Math.min(CANVAS_HEIGHT, Math.max(0, current.y + delta.y)),
              }));
              return;
            }
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              captureUndo();
              drawLine(cursor, cursor);
            }
          }}
          />
          <span
            className="myles97-paint-keyboard-cursor"
            aria-hidden="true"
            style={{
              "--m97-paint-cursor-x": `${(cursor.x / CANVAS_WIDTH) * 100}%`,
              "--m97-paint-cursor-y": `${(cursor.y / CANVAS_HEIGHT) * 100}%`,
            } as CSSProperties}
          />
        </div>
        <div className="myles97-paint-colors" role="group" aria-label="Paint colors">
          {COLORS.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              aria-label={`Use ${swatch.name} paint`}
              aria-pressed={color === swatch.value && tool === "pencil"}
              className="myles97-paint-swatch"
              data-selected={color === swatch.value && tool === "pencil"}
              data-swatch={swatch.name.slice(0, 1)}
              style={{ "--m97-paint-swatch": swatch.value } as CSSProperties}
              onClick={() => {
                setTool("pencil");
                setColor(swatch.value);
                setActionStatus(`${swatch.name} pencil selected.`);
              }}
            />
          ))}
        </div>
      </div>
      <p id="myles97-paint-help" className="myles97-paint-help">
        Draw with pointer input, or use arrow keys and Space. Nothing is saved.
      </p>
      <p className="myles97-paint-status" aria-live="off">
        {tool === "eraser" ? "Eraser" : COLORS.find((swatch) => swatch.value === color)?.name} · {Math.round(cursor.x)}, {Math.round(cursor.y)}
      </p>
      <p className="myles97-paint-action" aria-live="polite">
        {actionStatus}
      </p>
    </section>
  );
}
