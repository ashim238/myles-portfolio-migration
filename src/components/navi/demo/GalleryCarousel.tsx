"use client";

import { useCallback, useState } from "react";
import { CarouselArrow, PaginationDots } from "@/components/navi/ui";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";

type Photo = { src: string; alt: string };

export function GalleryCarousel({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      const wrapped = ((i % count) + count) % count;
      setIndex(wrapped);
    },
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  if (count === 0) return null;
  const hero = photos[index];

  return (
    <figure className="nv-gallery-carousel" aria-label="Experience photos">
      <div
        className="nv-gallery-carousel-hero"
        role="region"
        aria-label="Experience photos"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <DemoPhoto
          key={hero.src}
          src={hero.src}
          alt={hero.alt}
          dataTestId="gallery-hero-img"
          sizes="(max-width: 720px) 100vw, min(70vw, 960px)"
          preload
        />
        {count > 1 && (
          <>
            <div className="nv-gallery-carousel-arrows">
              <CarouselArrow
                direction="prev"
                label="Previous photo"
                onClick={() => goTo(index - 1)}
              />
              <CarouselArrow
                direction="next"
                label="Next photo"
                onClick={() => goTo(index + 1)}
              />
            </div>
            <div className="nv-gallery-carousel-dots">
              <PaginationDots
                count={count}
                activeIndex={index}
                onSelect={(i) => goTo(i)}
                label="photo"
              />
            </div>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="nv-gallery-carousel-thumbs">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                data-testid="gallery-thumb"
                aria-label={`Show photo ${i + 1}: ${p.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={`nv-gallery-carousel-thumb${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                <DemoPhoto
                  src={p.src}
                  alt={p.alt}
                  sizes="(max-width: 720px) 22vw, 220px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
