import type { NextConfig } from "next";

const developmentEvalSource =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const impeccableLiveDevSource =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${developmentEvalSource}${impeccableLiveDevSource} https://cdnjs.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.prod.website-files.com https://placehold.co https://*.basemaps.cartocdn.com",
  "font-src 'self' data:",
  `connect-src 'self'${impeccableLiveDevSource}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The local preview is commonly opened through the numeric loopback host.
  // Next otherwise blocks its dev-only HMR endpoint, which prevents React
  // hydration and leaves the workstation controls non-interactive.
  allowedDevOrigins: ["127.0.0.1"],
  // The default bottom-left Next indicator overlaps this app's fixed Start
  // button during local review. Errors still surface in the development UI.
  devIndicators: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
