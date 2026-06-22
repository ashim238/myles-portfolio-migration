"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Accordion, Avatar, Rating, ImpactSignal, PillRow } from "@/components/navi/ui";
import { GalleryCarousel } from "@/components/navi/demo/GalleryCarousel";
import { BookingCard } from "@/components/navi/demo/BookingCard";
import { TransitOptions } from "@/components/navi/demo/TransitOptions";
import { Reviews } from "@/components/navi/demo/Reviews";
import { Map } from "@/components/navi/demo/Map";
import { type Experience, type BookingDate } from "@/lib/navi/demo-data";
import { neighborhoodSlug } from "@/lib/navi/neighborhoods";

const SECTIONS = [
  { id: "learn", label: "Learn" },
  { id: "plan", label: "Plan" },
  { id: "go", label: "Go" },
] as const;

// Pure view: booking `dates` and `reviewDates` are computed from today by the
// server page and handed in, so this component never touches the clock and
// server/client renders always agree.
export function ExperienceView({
  experience: e,
  dates,
  reviewDates,
}: {
  experience: Experience;
  dates: BookingDate[];
  reviewDates: string[];
}) {
  // Highlighted section is the last one whose top has scrolled past the
  // sticky nav. A scroll handler beats IntersectionObserver here because the
  // sections are short enough that an "activation band" can sit between two
  // headings and never fire a callback.
  const [active, setActive] = useState<string>("learn");
  useEffect(() => {
    const offset = 90; // sticky nav height plus a few pixels of breathing room
    const onScroll = () => {
      let current: string = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= offset) current = s.id;
      }
      setActive(current);
    };
    if (window.scrollY > 0) onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [e.slug]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reviews = e.reviewsList.map((r, i) => ({
    author: r.author,
    date: reviewDates[i],
    rating: r.rating,
    quote: r.quote,
  }));

  return (
    <article className="nv-detail">
      <p className="nv-detail-back">
        <Link href="/work/navi/demo/search">← Back to results</Link>
      </p>
      <GalleryCarousel photos={e.photos} />
      <header className="nv-detail-head">
        <h1>{e.title}</h1>
        <ul className="nv-detail-facts" aria-label="At a glance">
          <li>{e.duration}</li>
          <li>{e.groupSize}</li>
          <li>{e.language}</li>
        </ul>
      </header>
      <div className="nv-detail-body">
        <div className="nv-detail-main">
          <PillRow
            ariaLabel="Sections"
            role="navigation"
            className="nv-pill-row--sticky-section-nav"
            items={SECTIONS.map((s) => ({ id: s.id, label: s.label }))}
            activeId={active}
            onSelect={goTo}
            extraAttrs={(_, isActive) => ({
              "aria-current": isActive ? "true" : undefined,
            })}
          />

          <section id="learn" aria-labelledby="learn-heading" className="nv-detail-section">
            <h2 id="learn-heading" className="nv-detail-section-heading">Learn</h2>
            <p className="nv-detail-host">
              <Avatar name={e.host.name} size="sm" /> Hosted by{" "}
              <Link href={`/work/navi/demo/host/${e.host.slug}`} className="nv-detail-host-link">
                {e.host.name}
              </Link>
            </p>
            <p className="nv-detail-prose">{e.learn}</p>
            <Rating value={e.rating} reviews={e.reviews} />
            <ImpactSignal as="div" href={`/work/navi/demo/impact#${e.impactTheme}`}>
              {e.impactStatement}
            </ImpactSignal>
            <div className="nv-included">
              <h3 className="nv-included-heading">What&apos;s included</h3>
              <ul>
                {e.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="plan" aria-labelledby="plan-heading" className="nv-detail-section">
            <h2 id="plan-heading" className="nv-detail-section-heading">Plan</h2>
            <Accordion
              items={[
                { id: "bring", title: "What to bring", content: e.plan.bring },
                { id: "commitments", title: "Pre-arrival commitments", content: e.plan.commitments },
                { id: "impact", title: "Impact initiative", content: e.plan.impactDetail },
              ]}
            />
          </section>

          <section id="go" aria-labelledby="go-heading" className="nv-detail-section">
            <h2 id="go-heading" className="nv-detail-section-heading">Go</h2>
            <h3 className="nv-detail-where-heading">Where?</h3>
            <p>{e.go.addressLine1}</p>
            <p>{e.go.addressLine2}</p>
            <p className="nv-detail-where-nb">
              <Link
                href={`/work/navi/demo/neighborhood/${neighborhoodSlug(e.neighborhood)}`}
                className="nv-detail-nb-link"
              >
                Explore {e.neighborhood}, {e.borough}
              </Link>
            </p>
            <div className="nv-detail-where-map">
              <Map
                center={[e.lat, e.lng]}
                zoom={15}
                markers={[{ id: e.slug, lat: e.lat, lng: e.lng, label: "" }]}
              />
            </div>
            <h3 className="nv-detail-go-heading">How to get there</h3>
            <TransitOptions options={e.go.transit} />
          </section>
        </div>
        <BookingCard
          priceFrom={e.price}
          dates={dates}
          impact={e.impactPhrase}
          impactHref={`/work/navi/demo/impact#${e.impactTheme}`}
          spotsLeft={e.spotsLeft}
          onReserve={() => {
            /* demo: state lives inside BookingCard */
          }}
        />
      </div>
      <Reviews rating={e.rating} count={e.reviews} reviews={reviews} />
    </article>
  );
}
