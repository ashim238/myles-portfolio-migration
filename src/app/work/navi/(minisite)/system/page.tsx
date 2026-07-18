"use client";

import { useState } from "react";
import Link from "next/link";
import { Specimen } from "@/components/navi/system/Specimen";
import { PropPlayground } from "@/components/navi/system/PropPlayground";
import { Chapter } from "@/components/navi/system/Chapter";
import { Hero } from "@/components/navi/system/Hero";
import {
  NaviColorSpecimen,
  NaviTypeSpecimen,
  NaviSpacingSpecimen,
} from "@/components/navi/system/Foundations";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { CategoryIcon } from "@/components/navi/demo/CategoryIcon";
import { DateTimeModal } from "@/components/navi/demo/DateTimeModal";
import { EXPERIENCES, CATEGORIES } from "@/lib/navi/demo-data";
import {
  Button,
  IconButton,
  Tag,
  Rating,
  ImpactSignal,
  Avatar,
  MapPin,
  Tabs,
  Accordion,
  Tooltip,
  SearchInput,
  CarouselArrow,
  PaginationDots,
  Label,
  PillRow,
  Calendar,
} from "@/components/navi/ui";

function SearchInputDemo() {
  const [q, setQ] = useState("");
  return (
    <SearchInput
      label="Search experiences"
      value={q}
      onChange={setQ}
      placeholder="e.g. pottery class"
    />
  );
}

function PillRowDemo() {
  const [active, setActive] = useState("plan");
  return (
    <PillRow
      items={[
        { id: "learn", label: "Learn" },
        { id: "plan", label: "Plan" },
        { id: "go", label: "Go" },
      ]}
      activeId={active}
      onSelect={setActive}
    />
  );
}

function StickySectionNavDemo() {
  const [active] = useState("plan");
  return (
    <PillRow
      role="navigation"
      ariaLabel="Sections (demo)"
      items={[
        { id: "learn", label: "Learn" },
        { id: "plan", label: "Plan" },
        { id: "go", label: "Go" },
      ]}
      activeId={active}
      onSelect={() => {}}
      extraAttrs={(_, isActive) => ({
        "aria-current": isActive ? "true" : undefined,
      })}
    />
  );
}

function CategoryRailDemo() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="nv-feed-catwrap">
      <section className="nv-feed-categories" aria-label="Categories (demo)">
        <button
          type="button"
          className={`nv-feed-cat${active === null ? " nv-feed-cat--active" : ""}`}
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          <CategoryIcon name="All" />
          <span>All</span>
        </button>
        {CATEGORIES.slice(0, 6).map((c) => (
          <button
            key={c}
            type="button"
            className={`nv-feed-cat${active === c ? " nv-feed-cat--active" : ""}`}
            aria-pressed={active === c}
            onClick={() => setActive(c)}
          >
            <CategoryIcon name={c} />
            <span>{c}</span>
          </button>
        ))}
      </section>
    </div>
  );
}

function CalendarDemo() {
  const [day, setDay] = useState<Date | null>(null);
  return (
    <div style={{ maxWidth: 340 }}>
      <Calendar value={day} onChange={setDay} />
    </div>
  );
}

function DateTimePickerDemo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<{ date: Date; time: string } | null>(null);
  return (
    <div className="nv-booking-pick" style={{ maxWidth: 280 }}>
      <span className="nv-booking-pick-label" aria-hidden="true">
        Date and time
      </span>
      <button
        type="button"
        className={`nv-booking-pick-trigger${picked ? " is-set" : ""}`}
        aria-haspopup="dialog"
        aria-label="Pick a date and time (demo)"
        onClick={() => setOpen(true)}
      >
        <span className="nv-booking-pick-value">
          {picked
            ? `${picked.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })} at ${picked.time}`
            : "Choose a date and time"}
        </span>
        <span className="nv-booking-pick-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      </button>
      <DateTimeModal
        open={open}
        times={["10:00 AM", "1:00 PM", "4:30 PM"]}
        initialDate={picked?.date ?? null}
        initialTime={picked?.time ?? null}
        onConfirm={(sel) => setPicked(sel)}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export default function SystemPage() {
  return (
    <div className="nv-system">
      <header className="nv-system-head">
        <h1>Navi design system</h1>
        <p className="nv-system-context">
          Navi is a regenerative travel platform for New York City. This is its component library.
        </p>
        <p>
          The Navi component library, rebuilt as live React. The source system used bright orange
          (#F3722C) for emphasis, but it failed WCAG AA on every button, so this build documents the
          accessible derivation (#C4541A, 4.54:1) and applies it system-wide.
        </p>
      </header>

      <Hero title="Live" lede="Try a variant and watch the component update.">
        <PropPlayground
          component="Button"
          controls={[
            { name: "variant", options: ["primary", "transparent", "outline"] },
            { name: "size", options: ["sm", "md", "lg"] },
          ]}
          initial={{ variant: "primary", size: "md" }}
          render={(p) => (
            <Button variant={p.variant as "primary"} size={p.size as "md"}>
              Reserve now
            </Button>
          )}
        />
      </Hero>

      <Chapter title="Foundations" intro="Tokens, type, and spacing.">
        <Specimen
          title="Color"
          note="Brand primitives → semantic aliases. Components reference semantic tokens, never raw hex."
        >
          <NaviColorSpecimen />
        </Specimen>

        <Specimen
          title="Type"
          note="Jost for display, Lato for body. Two families on a contrast axis (geometric + humanist)."
        >
          <NaviTypeSpecimen />
        </Specimen>

        <Specimen
          title="Spacing"
          note="A 4px base scale. Every component padding and gap is one of these tokens."
        >
          <NaviSpacingSpecimen />
        </Specimen>
      </Chapter>

      <Chapter
        title="Actions"
        intro="Trigger something. Both variants use the contrast-corrected --nv-action token."
      >
        <Specimen title="Button" note="Interactive surfaces use --nv-action (contrast-corrected).">
          <Button variant="primary">Primary</Button>
          <Button variant="transparent">Transparent</Button>
          <Button variant="outline">Outline</Button>
          <Button disabled>Disabled</Button>
        </Specimen>

        <Specimen title="Icon button">
          <IconButton
            label="Save to wishlist"
            variant="outline"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            }
          />
        </Specimen>
      </Chapter>

      <Chapter
        title="Forms"
        intro="Fields and search. Required and help affordances use semantic --nv-error and --nv-info."
      >
        <Specimen
          title="Label"
          note="Form-field label. Required uses --nv-error, help uses --nv-info, replacing the source's off-palette red and purple."
        >
          <Label htmlFor="demo-email" required>Email</Label>
          <Label htmlFor="demo-phone" optional>Phone</Label>
          <Label htmlFor="demo-org" help="Only used to confirm your booking.">Organization</Label>
        </Specimen>

        <Specimen title="Search input">
          <SearchInputDemo />
        </Specimen>

        <Specimen
          title="Calendar"
          note="Month picker from the source Figma (node 553-6053). The selected day uses the contrast-corrected --nv-action, not the source's #F3722C; past days are disabled when a min date is set."
        >
          <CalendarDemo />
        </Specimen>

        <Specimen
          title="Date + time picker"
          note="The Calendar plus a start-time selector in a modal (Figma node 553-6399). It's the booking flow's 'pick another date' control: focus-trapped, scroll-locked, returns focus to the trigger on close."
        >
          <DateTimePickerDemo />
        </Specimen>
      </Chapter>

      <Chapter title="Content" intro="What an experience card is made of.">
        <Specimen
          title="Tag"
          note="Category chips. Green here is distinct from the rating badge to fix the source's green overload."
        >
          <Tag tone="neutral">Cooking</Tag>
          <Tag tone="popular">Popular</Tag>
          <Tag tone="local">Locally-owned</Tag>
        </Specimen>

        <Specimen
          title="Rating"
          note="Replaced the source traffic-light scale with a single brand badge and numeral, colorblind-safe and AA-compliant."
        >
          <Rating value={4.9} reviews={213} />
          <Rating value={5} />
        </Specimen>

        <Specimen title="Avatar">
          <Avatar name="Janice Doeherty" size="sm" />
          <Avatar name="Janice Doeherty" size="md" />
          <Avatar name="Janice Doeherty" size="lg" />
        </Specimen>

        <Specimen
          title="Impact signal"
          note="New component (not in the source Figma). Surfaces an experience's regenerative impact in the card scan."
        >
          <ImpactSignal>Funds Prospect Park tree care</ImpactSignal>
        </Specimen>

        <Specimen
          title="Card (composed)"
          note="A real experience card, assembled from Tag, Rating, Avatar, and ImpactSignal. The system showing up in the product."
        >
          <div style={{ maxWidth: 320 }}>
            <ExperienceCard
              experience={EXPERIENCES[0]}
              href="/work/navi/demo/experience/prospect-park-carriage"
            />
          </div>
        </Specimen>

        <Specimen
          title="Category chip rail"
          note="Horizontal scrolling rail with edge fades and chevron buttons that only appear when there's overflow to scroll to. Used at the top of the feed."
        >
          <CategoryRailDemo />
        </Specimen>
      </Chapter>

      <Chapter title="Navigation" intro="Move between views and surface context.">
        <Specimen
          title="PillRow"
          note="Shared visual primitive. Tabs and the sticky section nav both consume it."
        >
          <PillRowDemo />
        </Specimen>

        <Specimen
          title="Tabs"
          note="Tablist composition: one panel visible at a time. Use for settings, billing, anywhere you want N panels under one selector. For stacked, scroll-jump sections, use the Sticky section nav specimen below instead."
        >
          <Tabs
            items={[
              { id: "learn", label: "Learn" },
              { id: "plan", label: "Plan" },
              { id: "go", label: "Go" },
            ]}
            value="learn"
            onChange={() => {}}
          />
        </Specimen>

        <Specimen
          title="Sticky section nav"
          note="Anchor composition: all sections are visible and stacked. The nav jumps you to a section and tracks active state by scroll position. Used on the experience detail page."
        >
          <StickySectionNavDemo />
        </Specimen>

        <Specimen title="Accordion">
          <Accordion
            items={[
              { id: "bring", title: "What to bring", content: "Comfortable shoes." },
              { id: "impact", title: "Impact initiative", content: "Funds park tree care." },
            ]}
          />
        </Specimen>

        <Specimen title="Tooltip">
          <Tooltip content="Why this pick">
            <button type="button" className="nv-btn nv-btn--outline nv-btn--sm">
              info
            </button>
          </Tooltip>
        </Specimen>

        <Specimen
          title="Map pin"
          note="One pin system. Orange place pins (darken when selected, white halo for legibility over imagery) plus a green current-location pin."
        >
          <MapPin kind="place" value="$48" />
          <MapPin kind="place" value="$48" filled={false} />
          <MapPin kind="place" value="$48" selected />
          <MapPin kind="location" />
        </Specimen>

        <Specimen title="Carousel controls">
          <CarouselArrow direction="prev" label="Previous photo" />
          <CarouselArrow direction="next" label="Next photo" />
          <PaginationDots count={4} active={1} onSelect={() => {}} />
        </Specimen>
      </Chapter>

      <section className="nv-system-cta">
        <h2>See it in the product</h2>
        <p>The same components, assembled into a working booking flow.</p>
        <Link className="nv-btn nv-btn--primary nv-btn--md" href="/work/navi/demo">Open the demo</Link>
      </section>
    </div>
  );
}
