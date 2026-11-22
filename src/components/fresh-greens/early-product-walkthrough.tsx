"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { localSimulator, nativeFrameSource, type NativeSession } from "@/lib/fresh-greens/native-session";
import styles from "./early-product-walkthrough.module.css";

const media = "/projects/fresh-greens/daylight-key";
const recording = media + "/weeksville-drive.mp4";
const poster = media + "/01-weeksville-daylight-preview.png";

export function EarlyProductWalkthrough({ session }: { session: NativeSession | null }) {
  const [view, setView] = useState<"poster" | "starting" | "app" | "recording" | "offline">("poster");
  const request = useRef<AbortController | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const watching = !session || view === "recording";
  const running = !!session && view === "app";
  const pending = view === "starting";

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, []);

  useEffect(() => {
    if (!running || session?.kind !== "local") return;
    function handleFrame(event: MessageEvent) {
      if (event.origin !== localSimulator || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "fresh-greens-unavailable") setView("offline");
    }
    window.addEventListener("message", handleFrame);
    return () => window.removeEventListener("message", handleFrame);
  }, [running, session?.kind]);

  async function openApp() {
    if (!session || pending) return;
    if (session.kind === "hosted") {
      setView("app");
      return;
    }
    if (window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost") {
      setView("offline");
      return;
    }
    request.current?.abort();
    const check = new AbortController();
    request.current = check;
    const timeout = window.setTimeout(() => check.abort(), 6000);
    setView("starting");
    try {
      const response = await fetch(localSimulator + "/health", { signal: check.signal, cache: "no-store", credentials: "omit" });
      const ready = response.ok && (await response.json()).ready === true;
      if (request.current === check) setView(ready ? "app" : "offline");
    } catch {
      if (request.current === check) setView("offline");
    } finally {
      window.clearTimeout(timeout);
      if (request.current === check) request.current = null;
    }
  }

  function exitApp() {
    request.current?.abort();
    request.current = null;
    setView("poster");
    requestAnimationFrame(() => launch.current?.focus({ preventScroll: true }));
  }

  function watchRecording() {
    request.current?.abort();
    request.current = null;
    setView("recording");
  }

  return (
    <section id="fg-app-walkthrough" className={`${styles.walkthrough} project-proof-target`} aria-labelledby="fg-walkthrough-title">
      <header className={styles.header}>
        <p className={styles.kicker}>{watching ? "iOS recording" : "iOS simulator"}</p>
        <h3 id="fg-walkthrough-title">{watching ? "A drive to Weeksville" : "Take Fresh Greens for a drive"}</h3>
        <p>{watching ? "Follow the trip to Weeksville Heritage Center in the original iPhone app." : "Tap “Where are you headed?” and search for a place in Brooklyn. Choose a route, then tap Go to see the driving view."}</p>
        {view === "offline" && <p role="status">The simulator is unavailable. Try again or watch the recorded drive.</p>}
        {session && (
          <div className={styles.actions}>
            {running && <button type="button" className="reader-control" onClick={exitApp}>Close simulator</button>}
            {watching && <button type="button" className="reader-control" onClick={openApp}>Open the iOS app</button>}
            {!watching && <button type="button" className={styles.textAction} onClick={watchRecording}>Watch a recorded drive</button>}
          </div>
        )}
        <noscript><a href={recording}>Watch the iOS recording</a></noscript>
      </header>
      <div className={styles.stage}>
        <div className={styles.device}>
          {running ? (
            <iframe ref={frame} title="Fresh Greens running on an iPhone simulator"
              src={nativeFrameSource(session)} onError={() => setView("offline")}
              onLoad={() => frame.current?.focus({ preventScroll: true })}
              referrerPolicy="strict-origin" />
          ) : watching ? (
            <video controls playsInline preload="none" poster={media + "/weeksville-drive.webp"} aria-label="Recorded Weeksville drive in the Fresh Greens iOS app" src={recording} />
          ) : (
            <button type="button" ref={launch} className={styles.poster} onClick={openApp} disabled={pending}>
              <Image src={poster} width={1290} height={2796} sizes="(max-width: 400px) 75vw, 328px" alt="" />
              <span className={styles.launchMark}><i aria-hidden="true">▶</i> {pending ? "Connecting…" : view === "offline" ? "Retry simulator" : "Open the iOS app"}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
