import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";

export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [hero, ...rest] = photos;
  const thumbs = rest.slice(0, 4);

  // Most experiences ship with one hero + one thumb; a fixed 2x2 grid would
  // leave empty cells. Size the thumb grid to the count so it never has holes.
  const cols = thumbs.length >= 3 ? 2 : 1;
  const rows = Math.ceil(thumbs.length / cols) || 1;

  return (
    <figure
      className={`nv-gallery${thumbs.length === 0 ? " nv-gallery--solo" : ""}`}
      aria-label="Experience photos"
    >
      <div className="nv-gallery-hero">
        <DemoPhoto src={hero.src} alt={hero.alt} />
      </div>
      {thumbs.length > 0 && (
        <div
          className="nv-gallery-thumbs"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {thumbs.map((p) => (
            <div key={p.src} className="nv-gallery-thumb">
              <DemoPhoto src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}
