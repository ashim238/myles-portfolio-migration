import type { Metadata } from "next";

export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "Myles Ashitey",
  title: "Product Designer Portfolio",
  siteUrl: "https://www.mylesdesignsthings.com",
  description:
    "Portfolio of Myles Ashitey featuring product design case studies, process notes, and playful experiments.",
  headerKicker: "Myles · product designer",
  email: "mylesashitey@gmail.com",
  resumeUrl: "/resume",
};

type RouteMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}`;
  image?: `/${string}`;
  type?: "article" | "website";
};

export function createRouteMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: RouteMetadataOptions): Metadata {
  const canonical = new URL(path, siteConfig.siteUrl).toString();
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

export const navItems: NavItem[] = [
  { label: "01. Work", href: "/#work" },
  { label: "02. About", href: "/about" },
  { label: "03. Play", href: "/play" },
  { label: "04. Resume", href: siteConfig.resumeUrl },
  { label: "05. E-mail", href: `mailto:${siteConfig.email}` },
];
