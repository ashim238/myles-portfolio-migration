import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Host an event · Navi",
};

export default function HostPage() {
  return (
    <section className="nv-host-empty">
      <h1>Host tools are not part of this demo yet</h1>
      <p>
        A future flow could let local businesses and long-time residents list
        an experience, set its impact initiative, and manage bookings here.
      </p>
      <p>For now, take a look at what guests see.</p>
      <Link className="nv-btn nv-btn--primary nv-btn--md" href="/work/navi/demo">
        Explore experiences
      </Link>
    </section>
  );
}
