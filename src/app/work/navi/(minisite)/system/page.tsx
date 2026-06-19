"use client";

import { Specimen } from "@/components/navi/system/Specimen";
import { PropPlayground } from "@/components/navi/system/PropPlayground";
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
} from "@/components/navi/ui";

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

      <Specimen title="Button" note="Interactive surfaces use --nv-action (contrast-corrected).">
        <Button variant="primary">Primary</Button>
        <Button variant="transparent">Transparent</Button>
        <Button variant="outline">Outline</Button>
        <Button disabled>Disabled</Button>
      </Specimen>

      <Specimen title="Live playground" note="Flip props and watch the component + JSX update.">
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
      </Specimen>

      <Specimen
        title="Rating"
        note="Replaced the source traffic-light scale with a single brand badge + numeral — colorblind-safe and AA-compliant."
      >
        <Rating value={4.9} reviews={213} />
        <Rating value={5} />
      </Specimen>

      <Specimen
        title="Impact signal"
        note="New component (not in the source Figma): surfaces an experience's regenerative impact in the card scan."
      >
        <ImpactSignal>Funds Prospect Park tree care</ImpactSignal>
      </Specimen>

      <Specimen
        title="Tag"
        note="Category chips. Green here is distinct from the rating badge to fix the source's green overload."
      >
        <Tag tone="neutral">Cooking</Tag>
        <Tag tone="popular">Popular</Tag>
        <Tag tone="local">Locally-owned</Tag>
      </Specimen>

      <Specimen title="Avatar">
        <Avatar name="Janice Doeherty" size="sm" />
        <Avatar name="Janice Doeherty" size="md" />
        <Avatar name="Janice Doeherty" size="lg" />
      </Specimen>

      <Specimen
        title="Map pin"
        note="One pin system: orange place pins (darken when selected, white halo for legibility over imagery) + green current-location pin."
      >
        <MapPin kind="place" value="$48" />
        <MapPin kind="place" value="$48" selected />
        <MapPin kind="location" />
      </Specimen>

      <Specimen title="Icon button">
        <IconButton label="Save to wishlist" icon={<span>♥</span>} variant="outline" />
      </Specimen>

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

      <Specimen title="Search input">
        <SearchInput label="Search experiences" value="" onChange={() => {}} placeholder="e.g. pottery class" />
      </Specimen>

      <Specimen title="Carousel controls">
        <CarouselArrow direction="prev" label="Previous photo" />
        <CarouselArrow direction="next" label="Next photo" />
        <PaginationDots count={4} active={1} onSelect={() => {}} />
      </Specimen>
    </div>
  );
}
