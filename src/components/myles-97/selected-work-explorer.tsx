"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FocusEvent, type MouseEvent } from "react";
import { useAnimate, type AnimationSequence } from "motion/react";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import type {
  ProgramDefinition,
  ProjectProgramId,
} from "@/lib/myles-97/programs";
import {
  dispatchProjectEnterRequest,
  saveProjectReturnSnapshot,
  type ProjectCoverVisual,
} from "@/lib/project-enter";

export type SelectedWorkExplorerProps = {
  programs: readonly ProgramDefinition[];
  onOpen: (id: ProjectProgramId) => void;
  reduceMotion?: boolean;
};

type FreshGreensRevealMode = "idle" | "pointer" | "focus";

const FRESH_GREENS_ROUTE =
  // Native 1000 × 760 map coordinates: 16th Street → South Van Ness →
  // 14th Street → the northbound block. The SVG and raster share this crop.
  "M88 655 L220 648 L382 636 L535 625 L648 616 L641 500 L635 364 L760 352 L902 340 L899 264";
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

function FreshGreensFocusReveal({
  mode,
  reduceMotion,
  coverSrc,
}: {
  mode: FreshGreensRevealMode;
  reduceMotion: boolean;
  coverSrc: string;
}) {
  const visible = mode !== "idle";
  const animated = visible && !reduceMotion;
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const resolvedTransform = "scale(1) translate3d(0, 0, 0)";
    const sequence: AnimationSequence = !visible
      ? [
          [
            ".fg-focus-card",
            { opacity: 0, transform: "translate3d(0, 12px, 0) scale(0.96)" },
            { duration: 0.14, at: 0, ease: EASE_OUT },
          ],
          [".fg-focus-destination", { opacity: 0 }, { duration: 0.1, at: 0 }],
          [
            ".fg-focus-route",
            { "--fg-route-offset": 1 },
            { duration: 0.18, at: 0.02, ease: EASE_OUT },
          ],
          [".fg-focus-origin", { opacity: 0 }, { duration: 0.1, at: 0.08 }],
          [
            ".fg-focus-map-stage",
            {
              opacity: 0,
              transform: "scale(1.08) translate3d(0, 1%, 0)",
            },
            { duration: 0.18, at: 0.08, ease: EASE_OUT },
          ],
          [
            ".fg-focus-cover-stage",
            { opacity: 1, transform: resolvedTransform },
            { duration: 0.22, at: 0.08, ease: EASE_OUT },
          ],
        ]
      : !animated
        ? [
            [
              ".fg-focus-cover-stage",
              { opacity: 0, transform: resolvedTransform },
              { duration: 0.16, at: 0, ease: EASE_OUT },
            ],
            [
              ".fg-focus-map-stage",
              { opacity: 1, transform: resolvedTransform },
              { duration: 0.16, at: 0, ease: EASE_OUT },
            ],
            [".fg-focus-route", { "--fg-route-offset": 0 }, { duration: 0, at: 0 }],
            [".fg-focus-origin", { opacity: 1 }, { duration: 0, at: 0 }],
            [".fg-focus-destination", { opacity: 1 }, { duration: 0, at: 0 }],
            [
              ".fg-focus-card",
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
              { duration: 0.16, at: 0, ease: EASE_OUT },
            ],
          ]
        : [
            [
              ".fg-focus-cover-stage",
              { transform: "scale(5.2) translate3d(0, 1.5%, 0)" },
              { duration: 0.72, at: 0, ease: EASE_IN_OUT },
            ],
            [
              ".fg-focus-cover-stage",
              { opacity: 0 },
              { duration: 0.3, at: 0.3, ease: EASE_OUT },
            ],
            [
              ".fg-focus-map-stage",
              { opacity: 1, transform: resolvedTransform },
              { duration: 0.38, at: 0.3, ease: EASE_OUT },
            ],
            [".fg-focus-origin", { opacity: 1 }, { duration: 0.2, at: 0.42 }],
            [
              ".fg-focus-route",
              { "--fg-route-offset": 0 },
              { duration: 1.35, at: 0.52, ease: EASE_IN_OUT },
            ],
            [".fg-focus-destination", { opacity: 1 }, { duration: 0.26, at: 1.76 }],
            [
              ".fg-focus-card",
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
              { duration: 0.34, at: 1.9, ease: EASE_OUT },
            ],
          ];

    const controls = animate(sequence);
    return () => {
      controls.stop();
    };
  }, [animate, animated, scope, visible]);

  return (
    <span
      ref={scope}
      className="fg-focus-reveal"
      data-reveal-mode={mode}
      data-reduce-motion={reduceMotion ? "true" : "false"}
    >
      <span
        className="fg-focus-cover-stage"
      >
        <Image
          src={coverSrc}
          alt=""
          width={640}
          height={360}
          sizes="(max-width: 900px) 80vw, 420px"
          preload
        />
      </span>
      <span
        className="fg-focus-map-stage"
      >
        <Image
          className="fg-focus-map-image"
          src="/projects/fresh-greens/v2/map-texture.png"
          alt=""
          width={1000}
          height={760}
          sizes="(max-width: 900px) 80vw, 420px"
        />
        <span className="fg-focus-map-grade" />
        <svg
          className="fg-focus-route"
          viewBox="0 0 1000 760"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <linearGradient id="fg-daylight-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f07a00" />
              <stop offset="55%" stopColor="#d34850" />
              <stop offset="100%" stopColor="#321463" />
            </linearGradient>
          </defs>
          <path
            className="fg-focus-route-casing fg-focus-route-draw"
            d={FRESH_GREENS_ROUTE}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <path
            className="fg-focus-route-line fg-focus-route-draw"
            d={FRESH_GREENS_ROUTE}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <g
            className="fg-focus-origin"
          >
            <circle cx="88" cy="655" r="18" />
            <circle cx="88" cy="655" r="10" />
          </g>
          <g
            className="fg-focus-destination"
          >
            <circle cx="899" cy="264" r="18" />
            <circle cx="899" cy="264" r="10" />
          </g>
        </svg>
        <span
          className="fg-focus-card"
        >
          <span className="fg-focus-card-kicker">Active route</span>
          <span className="fg-focus-card-summary">
            <strong>8 min</strong>
            <small>0.4 mi remaining</small>
          </span>
          <span className="fg-focus-card-context">
            <em><span aria-hidden="true">✓</span> All clear</em>
            <span className="fg-focus-daylight" aria-label="Route transitions from daylight to night">
              <i />
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

function usesNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function coverVisual(program: ProgramDefinition): ProjectCoverVisual {
  if (program.id === "tiktok") return { type: "tiktok" };
  return { type: "image", src: program.coverImage ?? "/logomark.svg" };
}

function rememberReturnTarget(
  event: MouseEvent<HTMLAnchorElement>,
  program: ProgramDefinition,
  reduceMotion: boolean,
) {
  if (usesNativeNavigation(event)) return;

  const card = event.currentTarget.closest<HTMLElement>(".myles97-program-card");
  if (!card) return;
  const bounds = card.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;
  const rect = {
    top: bounds.top,
    left: bounds.left,
    width: bounds.width,
    height: bounds.height,
  };
  const borderRadius = getComputedStyle(card).borderRadius || "0px";
  const visual: ProjectCoverVisual = coverVisual(program);

  saveProjectReturnSnapshot({
    version: 1,
    slug: program.id,
    returnTarget: "selected-work",
    reduceMotion,
    animate: false,
    rect,
    borderRadius,
    visual: {
      type: "program",
      programId: program.id,
      appName: program.appName,
      title: program.title,
      cover: visual,
    },
  });

  const handled = dispatchProjectEnterRequest({
    slug: program.id,
    href: program.href,
    rect,
    visual,
    borderRadius,
    reduceMotion,
    animate: false,
  });
  if (handled) event.preventDefault();
}

export function SelectedWorkExplorer({
  programs,
  onOpen,
  reduceMotion = false,
}: SelectedWorkExplorerProps) {
  const [freshGreensMode, setFreshGreensMode] =
    useState<FreshGreensRevealMode>("idle");
  const endFreshGreensFocus = (event: FocusEvent<HTMLLIElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setFreshGreensMode("idle");
  };

  return (
    <div className="myles97-explorer">
      <div className="myles97-explorer-toolbar" aria-hidden="true">
        <span>Portfolio projects</span>
        <span>{programs.length} projects</span>
      </div>
      <p id="selected-work-guide" className="myles97-explorer-guide">
        Read the full design story, or explore the interactive preview.
      </p>
      <ul
        className="myles97-selected-work-list"
        role="list"
        aria-label="Portfolio projects"
        aria-describedby="selected-work-guide"
      >
        {programs.map((program) => (
          <li
            key={program.id}
            className="myles97-program-card"
            data-m97-selected-work-project={program.id}
            aria-label={program.title}
            onPointerEnter={(event) => {
              if (program.id === "fresh-greens" && event.pointerType === "mouse") {
                setFreshGreensMode("pointer");
              }
            }}
            onPointerLeave={() => {
              if (program.id === "fresh-greens") setFreshGreensMode("idle");
            }}
            onFocusCapture={() => {
              if (program.id === "fresh-greens") setFreshGreensMode("focus");
            }}
            onBlurCapture={(event) => {
              if (program.id === "fresh-greens") endFreshGreensFocus(event);
            }}
          >
            <div className="myles97-program-summary">
              <span
                className={`myles97-program-cover${
                  program.id === "fresh-greens" ? " myles97-program-cover--animated" : ""
                }`}
                aria-hidden="true"
              >
                {program.coverImage ? (
                  program.id === "fresh-greens" ? (
                    <FreshGreensFocusReveal
                      mode={freshGreensMode}
                      reduceMotion={reduceMotion}
                      coverSrc={program.coverImage}
                    />
                  ) : (
                    <Image
                      src={program.coverImage}
                      alt=""
                      width={640}
                      height={360}
                      sizes="(max-width: 900px) 80vw, 320px"
                    />
                  )
                ) : (
                  <Myles97Icon name={iconForProgram(program.id)} size={40} />
                )}
              </span>
              <span className="myles97-program-card-copy">
                <strong>{program.title}</strong>
                <span>{program.applicationType}</span>
                <span>{program.appName}</span>
              </span>
            </div>
            <div className="myles97-program-actions">
              <Link
                className="myles97-case-study-link"
                href={program.href}
                aria-label={`Read ${program.title} case study`}
                onClick={(event) =>
                  rememberReturnTarget(event, program, reduceMotion)
                }
              >
                Read case study <span aria-hidden="true">↗</span>
              </Link>
              <button
                type="button"
                className="myles97-program-launch"
                aria-label={`Explore ${program.appName} interactive preview`}
                onClick={() => onOpen(program.id)}
              >
                Explore preview
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
