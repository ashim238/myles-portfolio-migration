"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./docs-trial.module.css";

const trials = {
  fields: {
    heading: "The same field, before and after the fix",
    title: "Compare the original and revised Julius disabled field",
    path: "/projects/julius-design-system/fields-preview/index.html",
    channel: "julius-fields-preview",
    caption: "The example opens after the fix. I gave the disabled field a pale Slate fill. Switch to “Before the fill” to see how similar the two fields looked when they both had a white background.",
  },
  "disabled-buttons": {
    heading: "Disabled buttons on light and dark surfaces",
    title: "Try enabled and disabled Julius buttons on two surfaces",
    path: "/projects/julius-design-system/disabled-buttons-preview/index.html",
    channel: "julius-disabled-buttons-preview",
    caption: "Turn off “Disable buttons” to try the four actions. Turn it back on and look at the secondary button. It keeps its outline on both backgrounds.",
  },
  sidebar: {
    heading: "Sidebar alignment",
    title: "Julius sidebar with keylines and row density controls",
    path: "/projects/julius-design-system/sidebar-preview/index.html",
    channel: "julius-sidebar-preview",
    caption: "I made compact spacing an option for data-heavy desktop views. Switch row sizes and follow the left keyline from the title down to the copyright.",
  },
  color: {
    heading: "Primary and secondary buttons",
    title: "Julius buttons with Slate and Indigo fills",
    path: "/projects/julius-design-system/color-preview/index.html",
    channel: "julius-color-preview",
    caption: "Switch “Save search” between Slate and Indigo. The outline on “Cancel” keeps it visible as the secondary action.",
  },
  "docs-site": {
    heading: "Inside the Julius docs site",
    title: "Julius docs homepage with a working job search and component guides",
    path: "/projects/julius-design-system/docs-preview/index.html",
    channel: "julius-docs-preview",
    caption: "I used a switch for “Email me new postings” because it changes the alert setting right away. I’d use a checkbox for “I agree to the terms.” You can review that choice before you submit the form.",
  },
};

const stills = {
  fields: {
    src: "field-states.webp", phone: "field-states-phone.webp",
    alt: "After the fix, the editable name field is white and the disabled field has a pale Slate fill.",
  },
  "disabled-buttons": {
    src: "disabled-buttons.webp", phone: undefined,
    alt: "Four disabled button variants on light and dark surfaces.",
  },
  sidebar: {
    src: "sidebar-guides.webp", phone: undefined,
    alt: "The sidebar with three keylines marking the icons, labels, and right controls.",
  },
  color: {
    src: "color-preview/buttons.png", phone: undefined,
    alt: "Save this search with a filled Indigo Save search button and an outlined Cancel button.",
  },
};
const assetRoot = "/projects/julius-design-system/";

export function ComponentTrial({ kind }: { kind: keyof typeof trials }) {
  const titleId = useId();
  const frame = useRef<HTMLIFrameElement>(null);
  const trial = trials[kind];
  const still = kind === "docs-site" ? undefined : stills[kind];

  useEffect(() => {
    function receive(event: MessageEvent) {
      const node = frame.current;
      if (!node || event.source !== node.contentWindow || event.origin !== "null") return;
      const data = event.data;
      if (!data || data.channel !== trial.channel) return;
      if (data.type === "resize" && Number.isFinite(data.height) && data.height > 0 && data.height < 4000) {
        node.style.height = data.height + "px";
      } else if (data.type === "navigate" && node.getBoundingClientRect().top < 0) {
        node.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    window.addEventListener("message", receive);
    frame.current?.contentWindow?.postMessage({ channel: trial.channel, type: "measure" }, "*");
    return () => window.removeEventListener("message", receive);
  }, [trial]);

  return (
    <figure className={`julius-exhibit ${styles.figure}`} aria-labelledby={titleId} data-trial={kind}>
      <div className={`julius-exhibit-heading ${styles.toolbar}`}>
        <h3 id={titleId}>{trial.heading}</h3>
        <a href={trial.path} target="_blank" rel="noopener noreferrer">Open in new tab <span aria-hidden="true">↗</span></a>
      </div>
      <div className={styles.mat}>
        <iframe ref={frame} loading="lazy" sandbox="allow-scripts" title={trial.title} src={trial.path} />
        {still && <noscript>
          <style>{`[data-trial="${kind}"] iframe {display:none}`}</style>
          <picture>
            {still.phone && <source media="(max-width: 600px)" srcSet={assetRoot + still.phone} />}
            {/* Native image also works when the reader disables scripts. */}
            <img className={styles.still} src={assetRoot + still.src} alt={still.alt} />
          </picture>
        </noscript>}
      </div>
      <figcaption>{trial.caption}</figcaption>
    </figure>
  );
}
