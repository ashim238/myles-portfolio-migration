import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { LightboxProvider } from "@/components/lightbox-provider";
import { ProjectEnterTransition } from "@/components/project-enter-transition";

const sans = Instrument_Sans({
  variable: "--font-family-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    url: BASE_URL,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
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
      className={`${sans.variable} ${geistMono.variable} h-full antialiased`}
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
      </head>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <LightboxProvider>
          <ProjectEnterTransition>{children}</ProjectEnterTransition>
        </LightboxProvider>
      </body>
    </html>
  );
}
