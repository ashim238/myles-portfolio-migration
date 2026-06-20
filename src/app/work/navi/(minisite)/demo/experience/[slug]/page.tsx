"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { Tabs, Accordion, Avatar, Rating, ImpactSignal } from "@/components/navi/ui";
import { Gallery } from "@/components/navi/demo/Gallery";
import { BookingCard } from "@/components/navi/demo/BookingCard";
import { TransitOptions } from "@/components/navi/demo/TransitOptions";
import { Map } from "@/components/navi/demo/Map";
import { getExperienceBySlug } from "@/lib/navi/demo-data";

// Client page: Next 16 keeps params synchronous for "use client" pages
// (Promise<Params> is the server-page shape). Do not add await.
export default function ExperiencePage({ params }: { params: { slug: string } }) {
  const e = getExperienceBySlug(params.slug);
  if (!e) notFound();
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
