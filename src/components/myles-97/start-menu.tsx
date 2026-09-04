"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import {
  containTabFocus,
  focusFirstAvailable,
} from "@/components/myles-97/focus-management";
import { Myles97Icon } from "@/components/myles-97/icons";
import type { ProgramId } from "@/lib/myles-97/programs";
import { siteConfig } from "@/lib/site-config";

export type StartMenuProps = {
  open: boolean;
  onClose: () => void;
  onOpenProgram: (id: ProgramId) => void;
  onRequestReset: () => void;
  reduceMotion?: boolean;
};

type AnimatedStartMenuProps = {
  menuRef: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  children: ReactNode;
};

function AnimatedStartMenu({
  menuRef,
  reduceMotion,
  children,
}: AnimatedStartMenuProps) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      ref={menuRef}
      className="myles97-start-menu"
      id="myles97-start-menu"
      role={isPresent ? "dialog" : undefined}
      aria-modal={isPresent ? "true" : undefined}
      aria-label={isPresent ? "Start" : undefined}
      aria-hidden={isPresent ? undefined : true}
      inert={isPresent ? undefined : true}
      tabIndex={isPresent ? -1 : undefined}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.985 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformOrigin: "bottom left" }}
      onKeyDown={(event) => containTabFocus(event, menuRef.current)}
    >
      {children}
    </motion.div>
  );
}

export function StartMenu({
  open,
  onClose,
  onOpenProgram,
  onRequestReset,
  reduceMotion = false,
}: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    focusFirstAvailable(menuRef.current);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || menuRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest(".myles97-start-button")) return;
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose, open]);

  const openThenClose = (id: ProgramId) => {
    onOpenProgram(id);
  };

  return (
    <AnimatePresence>
      {open ? (
        <AnimatedStartMenu menuRef={menuRef} reduceMotion={reduceMotion}>
      <div className="myles97-start-menu-brand" aria-hidden="true">
        <span>Myles</span>
        <strong>98</strong>
      </div>
      <div className="myles97-start-menu-items">
        <button type="button" onClick={() => openThenClose("selected-work")}>
          <Myles97Icon name="folder" size={24} variant="color" aria-hidden="true" />
          <span>Work Stuff</span>
        </button>
        <button type="button" onClick={() => openThenClose("about")}>
          <Myles97Icon name="profile" size={24} variant="color" aria-hidden="true" />
          <span>About Myles</span>
        </button>
        <button type="button" onClick={() => openThenClose("loose-parts")}>
          <Myles97Icon name="loose-parts" size={24} variant="color" aria-hidden="true" />
          <span>Loose Parts</span>
        </button>
        <button type="button" onClick={() => openThenClose("resume")}>
          <Myles97Icon name="resume" size={24} variant="color" aria-hidden="true" />
          <span>Résumé</span>
        </button>
        <a href={`mailto:${siteConfig.email}`} onClick={onClose}>
          <Myles97Icon name="mail" size={24} variant="color" aria-hidden="true" />
          <span>E-mail</span>
        </a>
        <button type="button" onClick={() => openThenClose("display-properties")}>
          <Myles97Icon name="display" size={24} variant="color" aria-hidden="true" />
          <span>Display Properties</span>
        </button>
        <button type="button" onClick={() => openThenClose("paint")}>
          <Myles97Icon name="paintbrush" size={24} variant="color" aria-hidden="true" />
          <span>MDT Paint</span>
        </button>
        <div className="myles97-start-menu-separator" aria-hidden="true" />
        <button
          type="button"
          onClick={() => {
            onRequestReset();
          }}
        >
          <Myles97Icon name="reset-desktop" size={24} variant="color" aria-hidden="true" />
          <span>Reset Desktop…</span>
        </button>
        <div className="myles97-start-menu-separator" aria-hidden="true" />
        <button type="button" onClick={onClose} aria-label="Close Start">
          <span aria-hidden="true">×</span>
          <span>Close</span>
        </button>
      </div>
        </AnimatedStartMenu>
      ) : null}
    </AnimatePresence>
  );
}
