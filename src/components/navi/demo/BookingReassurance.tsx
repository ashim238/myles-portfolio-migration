import Link from "next/link";
import { Avatar, Rating } from "@/components/navi/ui";

/**
 * Trust footer for the desktop booking sidebar. The sticky panel is short, so
 * on a wide screen the column trails off into empty space. This names who you're
 * booking with and their standing, so the column ends on a decision-relevant
 * note instead of dead air. It lives only in the desktop aside: the mobile sheet
 * renders the panel alone, and the aside itself is hidden on phones.
 */
export function BookingReassurance({
  host,
  rating,
  reviews,
}: {
  host: { name: string; slug: string };
  rating?: number;
  reviews?: number;
}) {
  return (
    <div className="nv-booking-reassure">
      <p className="nv-booking-reassure-host">
        <Avatar name={host.name} size="sm" />
        <span>
          Hosted by{" "}
          <Link
            href={`/work/navi/demo/host/${host.slug}`}
            className="nv-booking-reassure-link"
          >
            {host.name}
          </Link>
        </span>
      </p>
      {rating != null && <Rating value={rating} reviews={reviews} />}
    </div>
  );
}
