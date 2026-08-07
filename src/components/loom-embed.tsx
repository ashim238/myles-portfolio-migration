"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getThemeSnapshot, subscribeTheme, type Theme } from "@/lib/myles-97/theme";
import styles from "./loom-embed.module.css";

type LoomEmbedProps = {
  src: string;
  title: string;
};

export function LoomEmbed({ src, title }: LoomEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(320);

  const sendTheme = useCallback((theme: Theme = getThemeSnapshot()) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "loom:theme", theme },
      window.location.origin,
    );
  }, []);

  useEffect(() => {
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
    const unsubscribeTheme = subscribeTheme(sendTheme);
    sendTheme();

    return () => {
      window.removeEventListener("message", handleMessage);
      unsubscribeTheme();
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
          onLoad={() => sendTheme()}
        />
      </div>
      <p className={styles.fallback}>
        <a href={src} target="_blank" rel="noopener noreferrer">
          Open {title} in a new tab
          <span aria-hidden="true">↗</span>
        </a>
      </p>
    </div>
  );
}
