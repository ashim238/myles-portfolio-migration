"use client";

import { notFound } from "next/navigation";
import { use, useState } from "react";
import Link from "next/link";
import { Tabs, Accordion, Avatar, Rating, ImpactSignal } from "@/components/navi/ui";
import { Gallery } from "@/components/navi/demo/Gallery";
import { BookingCard } from "@/components/navi/demo/BookingCard";
import { TransitOptions } from "@/components/navi/demo/TransitOptions";
import { Map } from "@/components/navi/demo/Map";
import { getExperienceBySlug, type Experience } from "@/lib/navi/demo-data";

// Page bridge: Next 16 passes params as a Promise; React.use() unwraps it,
// then we delegate to a pure inner component so the view is straightforward
// to test without a Suspense wrapper.
export default function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const e = getExperienceBySlug(slug);
  if (!e) notFound();
  return <ExperienceView experience={e} />;
}

export function ExperienceView({ experience: e }: { experience: Experience }) {
  const [tab, setTab] = useState("learn");

  const tabItems = [
    {
      id: "learn",
      label: "Learn",
      content: (
        <div className="nv-detail-section">
          <p className="nv-detail-host">
            <Avatar name={e.host.name} size="sm" /> Hosted by {e.host.name}
          </p>
          <p className="nv-detail-prose">{e.learn}</p>
          <Rating value={e.rating} reviews={e.reviews} />
          <ImpactSignal as="div">{e.impactStatement}</ImpactSignal>
        </div>
      ),
    },
    {
      id: "plan",
      label: "Plan",
      content: (
        <Accordion
          items={[
            { id: "bring", title: "What to bring", content: e.plan.bring },
            { id: "commitments", title: "Pre-arrival commitments", content: e.plan.commitments },
            { id: "impact", title: "Impact initiative", content: e.plan.impactDetail },
          ]}
        />
      ),
    },
    {
      id: "go",
      label: "Go",
      content: (
        <div className="nv-detail-section">
          <p className="nv-detail-where-heading">Where?</p>
          <p>{e.go.addressLine1}</p>
          <p>{e.go.addressLine2}</p>
          <div className="nv-detail-where-map">
            <Map
              center={[e.lat, e.lng]}
              zoom={15}
              markers={[{ id: e.slug, lat: e.lat, lng: e.lng, label: "" }]}
            />
          </div>
          <h2 className="nv-detail-go-heading">How to get there</h2>
          <TransitOptions options={e.go.transit} />
        </div>
      ),
    },
  ];

  return (
    <article className="nv-detail">
      <p className="nv-detail-back">
        <Link href="/work/navi/demo/search">← Back to results</Link>
      </p>
      <Gallery photos={e.photos} />
      <header className="nv-detail-head">
        <h1>{e.title}</h1>
      </header>
      <div className="nv-detail-body">
        <div className="nv-detail-main">
          <Tabs items={tabItems} value={tab} onChange={setTab} />
        </div>
        <BookingCard
          priceFrom={e.price}
          dates={e.dates}
          onReserve={() => {
            /* demo: state lives inside BookingCard */
          }}
        />
      </div>
    </article>
  );
}
