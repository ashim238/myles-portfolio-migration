"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { PlayImage } from "@/lib/content";
import { useLightbox } from "./lightbox-provider";
import { CommandIcon } from "./myles-97/command-icon";
import styles from "./play-artwork-gallery.module.css";

export function PlayArtworkGallery({ title, images }: { title: string; images: readonly PlayImage[] }) {
  const group = useId();
  const [index, setIndex] = useState(0);
  const { openLightbox } = useLightbox();
  const selected = images[index];

  return (
    <div className={styles.gallery}>
      <figure className={styles.proof}>
        <button
          type="button"
          className={styles.enlarge}
          aria-label={`Enlarge ${selected.label}`}
          onClick={() => openLightbox(selected.src, selected.alt, selected.width, selected.height, { unoptimized: true })}
        >
          <span className={styles.stage}>
            <Image src={selected.src} alt={selected.alt} fill sizes="(max-width: 719px) 94vw, 800px" />
          </span>
          <span className={styles.caption}>
            <strong>{selected.label}</strong>
            <span><CommandIcon name="enlarge" /> Enlarge</span>
          </span>
        </button>
      </figure>
      <fieldset className={styles.selector}>
        <legend className="sr-only">Choose {title} artwork</legend>
        {images.map((image, i) => (
          <label key={image.src} className={styles.choice}>
            <input type="radio" className="sr-only" name={group} checked={index === i} onChange={() => setIndex(i)} />
            <Image src={image.src} alt="" width={image.width} height={image.height} sizes="80px" />
            <span>{image.label}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
