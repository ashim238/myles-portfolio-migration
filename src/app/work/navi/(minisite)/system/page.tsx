"use client";

import { useState } from "react";
import { Specimen } from "@/components/navi/system/Specimen";
import { PropPlayground } from "@/components/navi/system/PropPlayground";
import { Chapter } from "@/components/navi/system/Chapter";
import { Hero } from "@/components/navi/system/Hero";
import {
  NaviColorSpecimen,
  NaviTypeSpecimen,
  NaviSpacingSpecimen,
} from "@/components/navi/system/Foundations";
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
  Card,
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

export default function SystemPage() {
  return (
    <div className="nv-system">
      <header className="nv-system-head">
        <h1>Navi design system</h1>
        <p>
          The Navi component library, rebuilt as live React. The source system used bright orange
          (#F3722C) for emphasis; it failed WCAG AA on every button, so this build documents the
          accessible derivation (#C4541A, 4.54:1) and applies it system-wide.
        </p>
      </header>

      <Hero title="Live" lede="Pick a variant. Watch it update.">
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

      <Chapter title="Foundations" intro="The canvas. Tokens, type, and spacing.">
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
          <IconButton label="Save to wishlist" icon={<span>♥</span>} variant="outline" />
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

        <Specimen title="Card">
          <Card padded>A padded surface, the base container for experience cards.</Card>
        </Specimen>
      </Chapter>

      <Chapter title="Navigation" intro="Move between views and surface context.">
        <Specimen title="Tabs">
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
        <a className="nv-btn nv-btn--primary nv-btn--md" href="/work/navi/demo">Open the demo</a>
      </section>
    </div>
  );
}
