import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Host an event · Navi",
};

export default function HostPage() {
  return (
    <section className="nv-host-empty">
      <h1>Hosting opens soon</h1>
      <p>
        Navi is onboarding neighborhood hosts in stages. Local businesses and
        long-time residents will be able to list an experience, set its impact
        initiative, and manage bookings from here.
      </p>
      <p>While that&apos;s being built, take a look at what guests see.</p>
      <Link className="nv-btn nv-btn--primary nv-btn--md" href="/work/navi/demo">
        Explore experiences
      </Link>
    </section>
  );
}
