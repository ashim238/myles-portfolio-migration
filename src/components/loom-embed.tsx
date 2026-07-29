"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./loom-embed.module.css";

type LoomEmbedProps = {
  src: string;
  title: string;
};

type LoomTheme = "light" | "dark";

function isLoomTheme(value: unknown): value is LoomTheme {
  return value === "light" || value === "dark";
}

function getStoredTheme(): LoomTheme | undefined {
  try {
    const storedTheme = localStorage.getItem("theme");
    if (isLoomTheme(storedTheme)) {
      return storedTheme;
    }
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }

  return undefined;
}

function getActiveTheme(): LoomTheme {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  const documentTheme = document.documentElement.dataset.theme;
  if (isLoomTheme(documentTheme)) {
    return documentTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function LoomEmbed({ src, title }: LoomEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(320);

  const sendTheme = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "loom:theme", theme: getActiveTheme() },
      window.location.origin,
    );
  }, []);

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        !event.data ||
        typeof event.data !== "object"
      ) {
        return;
      }

      const message = event.data as { type?: unknown; height?: unknown };
      if (
        message.type !== "loom:resize" ||
        typeof message.height !== "number" ||
        !Number.isFinite(message.height) ||
        message.height <= 0
      ) {
        return;
      }

      setFrameHeight(Math.max(320, Math.ceil(message.height)));
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("theme-change", sendTheme);
    window.addEventListener("storage", sendTheme);
    const handleSystemTheme = (event: MediaQueryListEvent) => {
      const theme = getStoredTheme() ?? (event.matches ? "light" : "dark");
      frameRef.current?.contentWindow?.postMessage(
        { type: "loom:theme", theme },
        window.location.origin,
      );
    };
    systemTheme.addEventListener("change", handleSystemTheme);
    sendTheme();

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("theme-change", sendTheme);
      window.removeEventListener("storage", sendTheme);
      systemTheme.removeEventListener("change", handleSystemTheme);
    };
  }, [sendTheme]);

  return (
    <div className={styles.group}>
      <div className={styles.frameWrap}>
        <iframe
          ref={frameRef}
          className={styles.frame}
          src={src}
          title={`${title} interactive preview`}
          loading="lazy"
          scrolling="no"
          style={{ height: `${frameHeight}px` }}
          onLoad={sendTheme}
        />
      </div>
      <p className={styles.fallback}>
        <a href={src} target="_blank" rel="noopener noreferrer">
          Open {title} in a new tab
          <span aria-hidden="true"> ↗</span>
        </a>
      </p>
    </div>
  );
}
