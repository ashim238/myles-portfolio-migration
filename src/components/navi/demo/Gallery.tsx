"use client";

export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [hero, ...rest] = photos;
  const thumbs = rest.slice(0, 4);
  return (
    <figure className="nv-gallery">
      <div className="nv-gallery-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.src} alt={hero.alt} />
        <button type="button" className="nv-gallery-see">See gallery</button>
      </div>
      <div className="nv-gallery-thumbs">
        {thumbs.map((p) => (
          <div key={p.src} className="nv-gallery-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} />
          </div>
        ))}
      </div>
    </figure>
  );
}
