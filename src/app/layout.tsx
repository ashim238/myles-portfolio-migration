import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { ConsoleGreeting } from "@/components/console-greeting";
import { DotCursor } from "@/components/dot-cursor";
import { LightboxProvider } from "@/components/lightbox-provider";
import { MobileNav } from "@/components/mobile-nav";
import { ProjectEnterTransition } from "@/components/project-enter-transition";
import { ScrollRevealFallback } from "@/components/scroll-reveal-fallback";

const sans = Instrument_Sans({
  variable: "--font-family-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif, paired with Instrument Sans by design lineage.
// Reserved for case-study pull-quotes (the one designed pause).
const serif = Instrument_Serif({
  variable: "--font-quote",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var v=t==="dark"||t==="light"?t:matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",v)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LightboxProvider>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          <ConsoleGreeting />
          <ProjectEnterTransition>{children}</ProjectEnterTransition>
          <DotCursor />
          <MobileNav />
          <ScrollRevealFallback />
        </LightboxProvider>
      </body>
    </html>
  );
}
