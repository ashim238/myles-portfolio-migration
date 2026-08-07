import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Metadata } from "next";

const getProjectBySlug = vi.fn();

vi.mock("@/lib/content", () => ({
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => Promise.resolve([]),
  playEntries: [],
}));

vi.mock("next/font/google", () => ({
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
  Instrument_Sans: () => ({ variable: "--font-instrument-sans" }),
  Instrument_Serif: () => ({ variable: "--font-instrument-serif" }),
  Jost: () => ({ variable: "--font-jost" }),
  Lato: () => ({ variable: "--font-lato" }),
}));

import { metadata as rootMetadata } from "@/app/layout";
import NotFound from "@/app/not-found";
import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as playMetadata } from "@/app/play/page";
import { metadata as resumeMetadata } from "@/app/resume/page";
import { metadata as freshGreensMetadata } from "@/app/work/fresh-greens/page";
import { metadata as naviMetadata } from "@/app/work/navi/page";
import { generateMetadata as generateTikTokMetadata } from "@/app/work/tiktok/page";
import { metadata as understandingFafsaMetadata } from "@/app/work/understandingfafsa/page";
import { metadata as naviMinisiteMetadata } from "@/app/work/navi/(minisite)/layout";

const ORIGIN = "https://www.mylesdesignsthings.com";

type RouteExpectation = {
  path: string;
  metadata: Metadata;
  title: string;
  description: string;
  image?: string;
};

function expectRouteMetadata({
  path,
  metadata,
  title,
  description,
  image,
}: RouteExpectation) {
  const canonical = `${ORIGIN}${path}`;

  expect(metadata.alternates?.canonical).toBe(canonical);
  expect(metadata.openGraph).toMatchObject({
    title,
    description,
    url: canonical,
  });
  expect(metadata.twitter).toMatchObject({
    card: image ? "summary_large_image" : "summary",
    title,
    description,
  });

  if (image) {
    expect(metadata.openGraph?.images).toEqual([{ url: image }]);
    expect(metadata.twitter?.images).toEqual([{ url: image }]);
  } else {
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  }
}

describe("public route metadata", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getProjectBySlug.mockResolvedValue({
      slug: "tiktok",
      status: "published",
    });
  });

  it("does not publish a root canonical from the shared layout", () => {
    expect(rootMetadata.alternates?.canonical).toBeUndefined();
  });

  it.each([
    {
      path: "/about",
      metadata: aboutMetadata,
      title: "About",
      description: "About Myles Ashitey: product designer based in Brooklyn.",
    },
    {
      path: "/play",
      metadata: playMetadata,
      title: "Loose Parts",
      description:
        "A running lab for interaction studies, material tests, and small builds.",
    },
    {
      path: "/resume",
      metadata: resumeMetadata,
      title: "Résumé",
      description: "Résumé and contact information for Myles Ashitey.",
    },
    {
      path: "/work/fresh-greens",
      metadata: freshGreensMetadata,
      title: "Fresh Greens",
      description:
        "A wayfinding app for Black drivers that brings community safety knowledge into route planning alongside public map data.",
      image: "/projects/fresh-greens/cover.png",
    },
    {
      path: "/work/navi",
      metadata: naviMetadata,
      title: "Navi",
      description:
        "A regenerative travel platform concept for NYC neighborhood experiences, developed in a graduate studio and rebuilt for this portfolio.",
      image: "/projects/navi/cover.png",
    },
    {
      path: "/work/understandingfafsa",
      metadata: understandingFafsaMetadata,
      title: "UnderstandingFAFSA",
      description:
        "Built a modular newsletter system for a site rebrand. The first redesigned send had an observed ~52.6% open rate with Mailchimp Privacy Protection excluded. This was not a controlled attribution test.",
      image: "/projects/understandingfafsa/cover.png",
    },
  ])("publishes route-aware social metadata for $path", (route) => {
    expectRouteMetadata(route);
  });

  it("publishes route-aware metadata for the public TikTok case", async () => {
    expectRouteMetadata({
      path: "/work/tiktok",
      metadata: await generateTikTokMetadata(),
      title: "TikTok Dynamic Showcase Ads",
      description:
        "Static catalog templates designed for TikTok's Dynamic Showcase Ads during a 2021 Global Creative Lab internship. Light Academia shipped in the launch library.",
      image: "/projects/tiktok/lofi-dopamine.png",
    });
  });

  it("preserves noindex metadata for unpublished and minisite routes", async () => {
    getProjectBySlug.mockResolvedValue({
      slug: "tiktok",
      status: "hidden",
    });

    expect((await generateTikTokMetadata()).robots).toEqual({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
    expect(naviMinisiteMetadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("gives unknown routes real Myles 98 recovery actions", () => {
    render(createElement(NotFound));

    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to Desktop" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Open Selected Work" })).toHaveAttribute(
      "href",
      "/#selected-work",
    );
  });
});