"use client";

import { useEffect, useRef } from "react";
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
};

export function StartMenu({
  open,
  onClose,
  onOpenProgram,
  onRequestReset,
}: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    focusFirstAvailable(menuRef.current);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const openThenClose = (id: ProgramId) => {
    onOpenProgram(id);
  };

  return (
    <div
      ref={menuRef}
      className="myles97-start-menu"
      id="myles97-start-menu"
      role="group"
      aria-label="Start menu"
      onKeyDown={(event) => containTabFocus(event, menuRef.current)}
    >
      <div className="myles97-start-menu-brand" aria-hidden="true">
        <span>Myles</span>
        <strong>98</strong>
      </div>
      <div className="myles97-start-menu-items">
        <button type="button" onClick={() => openThenClose("selected-work")}>
          <Myles97Icon name="folder" size={24} variant="color" aria-hidden="true" />
          <span>Selected Work</span>
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
      </div>
    </div>
  );
}
