"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { arrivalLightSamples, projectSamples, type ArtSample } from "@/lib/myles-97/preview-originals";
import type { FeaturedProjectId } from "@/lib/myles-97/programs";
import { useLightbox } from "@/components/lightbox-provider";
import { ArtworkCrop } from "@/components/artwork-crop";
import { InspectableThumbnail } from "./product-thumbnail";
import { CommandIcon } from "./command-icon";

export function ProjectSampleViewer({ project, title, reduced }: { project: FeaturedProjectId; title: string; reduced: boolean }) {
  return <SampleBrowser project={project} samples={projectSamples[project]}
    layers={<InspectableThumbnail project={project} title={title} reduced={reduced} assemblyOnly />} />;
}

export function FreshGreensCaptureViewer() {
  return <SampleBrowser project="fresh-greens" samples={arrivalLightSamples} />;
}

function SampleBrowser({ project, samples, layers }: {
  project: FeaturedProjectId; samples: readonly ArtSample[]; layers?: ReactNode;
}) {
  const group = useId();
  const comparison = project === "understandingfafsa";
  const [index, setIndex] = useState<number | "layers">(project === "navi" ? 2 : 0);
  const [route, setRoute] = useState("weeksville");
  const [keyView, setKeyView] = useState("plan");
  const selected = samples[typeof index === "number" ? index : 0];
  const routeSample = route === "brixton" ? selected.evening : undefined;
  const keySample = keyView === "drive" ? selected.driving : undefined;
  const sample = keySample ?? routeSample ?? selected;
  const [x, y, w, h] = sample.crop;
  const { openLightbox } = useLightbox();
  const full = sample.full ?? sample;
  const ratio = sample.width / sample.height;
  return (
    <div className="sample-browser" data-project={project}>
      <fieldset className="sample-selector">
        <legend className="sr-only">Choose a work sample</legend>
        {samples.map((item, i) => comparison && i === 1 ? null : <label key={item.label}>
          <input className="sr-only" type="radio" checked={index === i} name={group} onChange={() => setIndex(i)} />
          {comparison && i === 0 ? "Compare sends" : item.label}
        </label>)}
        {layers && <label>
          <input className="sr-only" type="radio" checked={index === "layers"} name={group}
            onChange={() => setIndex("layers")} />
          Layers
        </label>}
      </fieldset>
      {index !== "layers" && selected.evening && <label className="sample-route-choice">
        Route
        <select value={route} onChange={event => setRoute(event.target.value)}>
          <option value="weeksville">Weeksville · daylight</option>
          <option value="brixton">Brixton · after dark</option>
        </select>
      </label>}
      {index !== "layers" && selected.driving && <label className="sample-route-choice">
        Map key view
        <select value={keyView} onChange={event => setKeyView(event.target.value)}>
          <option value="plan">Before Go</option>
          <option value="drive">During a drive</option>
        </select>
      </label>}
      {index === "layers" ? <div className="sample-assembly">
        {layers}
      </div> : comparison && index === 0 ? (
        <figure className="sample-proof sample-comparison" aria-label="Compare the earlier and redesigned newsletter openings">
          <div className="sample-comparison-spread">
            {[samples[1], samples[0]].map(send => (
              <button key={send.label} type="button"
                aria-label={`Enlarge ${send.label} original`}
                onClick={() => {
                  const original = send.full!;
                  openLightbox(original.src, send.alt, original.width, original.height,
                    { unoptimized: true, initialView: "read" });
                }}>
                <span className="sample-comparison-capture">
                  <Image src={send.src} width={send.width} height={send.height} alt=""
                    sizes="(max-width: 700px) 45vw, 220px" loading="eager" />
                </span>
                <span className="sample-comparison-label">{send.label}<CommandIcon name="enlarge" /></span>
              </button>
            ))}
          </div>
          <figcaption className="sample-status">Original newsletter openings</figcaption>
        </figure>
      ) : <figure className="sample-proof" aria-label={sample.alt}>
        <div className="sample-stage" style={{ "--sheet-ratio": ratio, "--detail-ratio": ratio * w / h } as CSSProperties}>
          <div className="sample-overview" aria-hidden="true">
            <span className="sample-page">
              <Image src={sample.src} alt="" width={sample.width} height={sample.height} sizes="(max-width: 700px) 32vw, 200px" loading={layers ? "eager" : "lazy"} />
              <span className="sample-crop" style={{left:x*100+"%",top:y*100+"%",width:w*100+"%",height:h*100+"%"}} />
            </span>
          </div>
          <div className="sample-detail">
            <ArtworkCrop src={sample.src} width={sample.width} height={sample.height} bounds={sample.crop}
              sizes="(max-width: 700px) 120vw, 820px" />
            <span className="sample-detail-label">{sample.detail}</span>
          </div>
        </div>
        <figcaption className="sample-status">
          <span aria-live="polite" aria-atomic="true">{sample.label} <span>·</span> {comparison ? 2 : index+1} of {comparison ? 2 : samples.length}</span>
          <button type="button" aria-label={`Enlarge ${sample.label} original`} onClick={() => openLightbox(full.src,sample.alt,full.width,full.height,
            {unoptimized: true, initialView: sample.full?.read ? "read" : undefined, initialCrop: sample.full ? undefined : sample.crop})}>
            <CommandIcon name="enlarge" /> Open original
          </button>
        </figcaption>
      </figure>}
    </div>
  );
}
