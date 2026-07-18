import { Avatar } from "@/components/navi/ui";

type Review = { author: string; date: string; rating: number; quote: string };

export function Reviews({
  rating,
  count,
  reviews,
}: {
  rating: number;
  count: number;
  reviews: Review[];
}) {
  if (!reviews?.length) return null;
  return (
    <section className="nv-reviews" aria-label="Guest reviews">
      <header className="nv-reviews-head">
        <h2>What guests say</h2>
        <p className="nv-reviews-summary">
          <span className="nv-reviews-score" aria-hidden="true">
            {rating.toFixed(1)}
          </span>
          <span className="nv-reviews-count" aria-hidden="true">
            {count} reviews
          </span>
          <span className="nv-sr-only">
            {rating.toFixed(1)} out of 5 from {count} reviews
          </span>
        </p>
      </header>
      <p className="nv-reviews-note">Sample reviews for this portfolio demo.</p>
      <ul className="nv-reviews-list">
        {reviews.map((r) => (
          <li key={`${r.author}-${r.date}`} className="nv-review">
            <div className="nv-review-head">
              <Avatar name={r.author} size="sm" />
              <div>
                <p className="nv-review-author">{r.author}</p>
                <p className="nv-review-date">{r.date}</p>
              </div>
              <span className="nv-review-rating" aria-label={`Rated ${r.rating} out of 5`}>
                <span aria-hidden="true">★ {r.rating.toFixed(1)}</span>
              </span>
            </div>
            <p className="nv-review-quote">{r.quote}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
