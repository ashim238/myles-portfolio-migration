"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { localSimulator, nativeFrameSource, type NativeSession } from "@/lib/fresh-greens/native-session";
import { CapturedRouteComparison, capturedRoutePoster } from "./captured-route-comparison";
import styles from "./early-product-walkthrough.module.css";

const media = "/projects/fresh-greens/daylight-key";
const recording = media + "/weeksville-drive.mp4";
const localOrigins = new Set(["http://127.0.0.1:4391", "http://127.0.0.1:4396"]);
const subscribeLocation = () => () => {};
const canReachLocalBridge = () => localOrigins.has(window.location.origin);
const localBuildPreview = () => true;

type View = "poster" | "starting" | "app" | "captures" | "offline";

export function EarlyProductWalkthrough({ session }: { session: NativeSession | null }) {
  const [view, setView] = useState<View>("poster");
  const [expanded, setExpanded] = useState(false);
  const request = useRef<AbortController | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const returnButton = useRef<HTMLButtonElement>(null);
  const localOrigin = useSyncExternalStore(subscribeLocation, canReachLocalBridge, localBuildPreview);
  const liveAvailable = !!session && (session.kind === "hosted" || localOrigin);
  const comparing = !liveAvailable || view === "captures" || view === "offline";
  const running = liveAvailable && view === "app";
  const pending = view === "starting";
  const heading = comparing ? "Compare two routes" : "Take Fresh Greens for a drive";

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
    if (!session || !liveAvailable || pending) return;
    if (session.kind === "hosted") {
      setView("app");
      return;
    }
    const check = new AbortController();
    request.current?.abort();
    request.current = check;
    const timeout = window.setTimeout(() => check.abort(), 6000);
    setView("starting");
    try {
      const response = await fetch(localSimulator + "/health", {
        signal: check.signal, cache: "no-store", credentials: "omit",
      });
      const ready = response.ok && (await response.json()).ready === true;
      if (request.current === check) setView(ready ? "app" : "offline");
    } catch {
      if (request.current === check) setView("offline");
    } finally {
      window.clearTimeout(timeout);
      if (request.current === check) request.current = null;
    }
  }

  function showCaptures() {
    request.current?.abort();
    request.current = null;
    setView("captures");
    requestAnimationFrame(() => dialog.current?.focus({ preventScroll: true }));
  }

  function closeApp() {
    setView("poster");
    requestAnimationFrame(() => launch.current?.focus({ preventScroll: true }));
  }

  function expand() {
    if (!dialog.current) return;
    dialog.current.close();
    flushSync(() => setExpanded(true));
    dialog.current.showModal();
    returnButton.current?.focus({ preventScroll: true });
  }

  function returnToArticle() {
    if (!dialog.current) return;
    dialog.current.close();
    dialog.current.show();
    setExpanded(false);
    requestAnimationFrame(() => expandButton.current?.focus({ preventScroll: true }));
  }

  const modeControls = liveAvailable && (
    <>
      {running && <button type="button" className={styles.control} onClick={closeApp}>Close simulator</button>}
      {comparing
        ? <button type="button" className={styles.control} onClick={openApp}>{view === "offline" ? "Retry simulator" : "Open the iOS app"}</button>
        : <button type="button" className={styles.textAction} onClick={showCaptures}>Compare captured routes</button>}
    </>
  );

  return (
    <section id="fg-app-walkthrough" tabIndex={-1} className={`${styles.walkthrough} project-proof-target`} aria-labelledby="fg-route-screen-title">
      <header className={styles.header}>
        <p className={styles.kicker}>{comparing ? "iOS screen captures" : "Interactive iOS app"}</p>
        <h3 id="fg-route-screen-title">{heading}</h3>
        <p>{comparing
          ? "Use the route arrows on the phone to compare two options captured in the iOS app."
          : "Search for a place in Brooklyn, compare the arrival time and daylight on each route, then tap Go."}</p>
        {view === "offline" && !expanded && <p role="status">The simulator is unavailable. You can still compare the captured routes.</p>}
        <div className={styles.actions}>
          <button type="button" ref={expandButton} className={styles.control} onClick={expand} aria-haspopup="dialog">Expand demo</button>
          {!expanded && modeControls}
        </div>
        <noscript><a href={recording}>Watch the iOS recording</a></noscript>
      </header>
      <div className={`${styles.stage} project-proof-target`} id="fg-native-simulator">
        <dialog open ref={dialog} tabIndex={-1} className={styles.viewer} role={expanded ? "dialog" : "region"} aria-label={heading}
          onCancel={event => { event.preventDefault(); returnToArticle(); }}>
          {expanded && (
            <div className={styles.modalControls}>
              <button type="button" ref={returnButton} className={styles.control} onClick={returnToArticle}>Return to case study</button>
              {modeControls}
              {view === "offline" && <span role="status">The simulator is unavailable.</span>}
            </div>
          )}
          {comparing ? (
            <div className={styles.capture}><CapturedRouteComparison /></div>
          ) : running && session ? (
            <div className={styles.device}>
              <iframe ref={frame} title="Fresh Greens running on an iPhone simulator" src={nativeFrameSource(session)}
                onError={() => setView("offline")} onLoad={() => frame.current?.focus({ preventScroll: true })}
                referrerPolicy="strict-origin" />
            </div>
          ) : (
            <button type="button" ref={launch} className={styles.poster} onClick={openApp} disabled={pending}>
              <span className={styles.device}>
                <Image src={capturedRoutePoster} width={1290} height={2796} sizes="(max-width: 680px) 86vw, 400px" alt="" />
              </span>
              <span className={styles.launchMark}>{pending ? "Opening the app" : "Open the iOS app"}</span>
            </button>
          )}
        </dialog>
      </div>
    </section>
  );
}
