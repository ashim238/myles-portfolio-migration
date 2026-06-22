export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  const label =
    reviews != null
      ? `Rated ${value} out of 5, ${reviews} reviews`
      : `Rated ${value} out of 5`;
  return (
    <span className="nv-rating" aria-label={label}>
      <span className="nv-rating-badge" aria-hidden="true">
        {value}
      </span>
      {reviews != null && (
        <span className="nv-rating-reviews" aria-hidden="true">
          {reviews} reviews
        </span>
      )}
    </span>
  );
}
