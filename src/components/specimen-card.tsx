"use client";

import Image from "next/image";
import { useLightbox } from "@/components/lightbox-provider";

type SpecimenImage = {
  src: string;
  alt: string;
  label?: string;
};

type SpecimenCardProps = {
  designation: string;
  classification: string;
  material: string;
  status: string;
  images: SpecimenImage[];
  priority?: boolean;
};

export function SpecimenCard({
  designation,
  classification,
  material,
  status,
  images,
  priority = false,
}: SpecimenCardProps) {
  const { openLightbox } = useLightbox();

  return (
    <div className="specimen-card">
      <div className="specimen-header">
        <span className="specimen-label">SPECIMEN CATALOG</span>
        <span className="specimen-id">NO. 001</span>
      </div>

      <div className="specimen-gallery">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className="specimen-image-btn"
            onClick={() => openLightbox(img.src, img.alt, 1200, 1600)}
            aria-label={`Expand image: ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={1200}
              height={1600}
              className="specimen-image"
              sizes="(max-width: 480px) 92vw, (max-width: 900px) 46vw, 36rem"
              priority={priority && i === 0}
              loading={priority && i === 0 ? "eager" : "lazy"}
            />
            {img.label ? (
              <span className="specimen-image-label">{img.label}</span>
            ) : null}
            <span className="specimen-fig">
              Fig. {String.fromCharCode(65 + i)}
            </span>
          </button>
        ))}
      </div>

      <div className="specimen-meta">
        <div className="specimen-row">
          <span className="specimen-key">Designation</span>
          <span className="specimen-val">{designation}</span>
        </div>
        <div className="specimen-row">
          <span className="specimen-key">Class</span>
          <span className="specimen-val">{classification}</span>
        </div>
        <div className="specimen-row">
          <span className="specimen-key">Material</span>
          <span className="specimen-val">{material}</span>
        </div>
        <div className="specimen-row specimen-row--status">
          <span className="specimen-key">Status</span>
          <span className="specimen-status">{status}</span>
        </div>
      </div>
    </div>
  );
}
