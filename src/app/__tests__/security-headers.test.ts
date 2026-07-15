import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("release security headers", () => {
  it("removes framework disclosure and applies baseline headers globally", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.headers).toBeTypeOf("function");

    const rules = await nextConfig.headers!();
    const globalRule = rules.find((rule) => rule.source === "/(.*)");
    expect(globalRule).toBeDefined();

    const headers = Object.fromEntries(
      globalRule!.headers.map(({ key, value }) => [key, value]),
    );

    const contentSecurityPolicy = headers["Content-Security-Policy"];

    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain(
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    );
    expect(contentSecurityPolicy).toContain("style-src 'self' 'unsafe-inline'");
    expect(contentSecurityPolicy).toContain("img-src 'self' data: blob:");
    expect(contentSecurityPolicy).toContain("https://*.basemaps.cartocdn.com");
    expect(contentSecurityPolicy).toContain("media-src 'self' blob:");
    expect(contentSecurityPolicy).toContain("worker-src 'self' blob:");
    expect(contentSecurityPolicy).toContain("frame-src 'self'");
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain("frame-ancestors 'self'");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
  });
});
