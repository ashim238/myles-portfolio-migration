"use client";

import Link from "next/link";
import { useEffect } from "react";
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
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="myles97-start-menu" id="myles97-start-menu" role="group" aria-label="Start menu">
      <div className="myles97-start-menu-brand" aria-hidden="true">
        <span>Myles</span>
        <strong>97</strong>
      </div>
      <div className="myles97-start-menu-items">
        <button
          type="button"
          onClick={() => {
            onOpenProgram("selected-work");
            onClose();
          }}
        >
          <Myles97Icon name="folder" size={20} aria-hidden="true" />
          <span>Selected Work</span>
        </button>
        <Link href="/about" onClick={onClose}>
          <Myles97Icon name="document" size={20} aria-hidden="true" />
          <span>About Myles</span>
        </Link>
        <Link href="/play" onClick={onClose}>
          <Myles97Icon name="loose-parts" size={20} aria-hidden="true" />
          <span>Loose Parts</span>
        </Link>
        <Link href="/resume" onClick={onClose}>
          <Myles97Icon name="document" size={20} aria-hidden="true" />
          <span>Résumé</span>
        </Link>
        <a href={`mailto:${siteConfig.email}`} onClick={onClose}>
          <Myles97Icon name="mail" size={20} aria-hidden="true" />
          <span>E-mail</span>
        </a>
        <button
          type="button"
          onClick={() => {
            onOpenProgram("display-properties");
            onClose();
          }}
        >
          <Myles97Icon name="display" size={20} aria-hidden="true" />
          <span>Display Properties</span>
        </button>
        <div className="myles97-start-menu-separator" aria-hidden="true" />
        <button
          type="button"
          onClick={() => {
            onRequestReset();
            onClose();
          }}
        >
          <Myles97Icon name="display" size={20} aria-hidden="true" />
          <span>Reset Desktop…</span>
        </button>
      </div>
    </div>
  );
}
