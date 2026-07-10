import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { ConsoleGreeting } from "@/components/console-greeting";
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

const BASE_URL = "https://mylesdesignsthings.com";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: BASE_URL,
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
      className={`${sans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
        <script
          id="home-intro-guard"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=="/"&&p!=="")return;var b=sessionStorage.getItem("home-browser-intro-seen")==="1";var e=sessionStorage.getItem("home-intro-seen")==="1";var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r&&(!b||!e)){document.documentElement.classList.add("home-intro-wait");setTimeout(function(){document.documentElement.classList.remove("home-intro-wait")},2600)}}catch(err){}})();`,
          }}
        />
        <noscript>
          <style>{`.home-intro-wait .home-page, .home-intro-wait .home-page * { opacity: 1 !important; }`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <ConsoleGreeting />
        <LightboxProvider>
          <ProjectEnterTransition>{children}</ProjectEnterTransition>
        </LightboxProvider>
        <MobileNav />
        <ScrollRevealFallback />
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
