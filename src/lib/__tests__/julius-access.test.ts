// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hasJuliusAccess, unlockJulius } from "../julius-access";
import { NextRequest } from "next/server";
import { proxy } from "../../proxy";

describe("Julius access protection", () => {
  it("rejects absent, malformed and forged session cookies", () => {
    for (const token of [undefined, "", "unlocked", "0".repeat(64), "35836e59d12152d2d2f7f1c48ff68fbb4749119c20334dc365e709acf04dc388"]) {
      expect(hasJuliusAccess(token)).toBe(false);
    }
  });

  it("rejects empty, incorrect and oversized passwords", async () => {
    for (const password of ["", "incorrect-password", "x".repeat(257)]) {
      expect(await unlockJulius(password)).toBeNull();
    }
  });

  it("redirects direct and RSC requests before returning private content", () => {
    for (const suffix of ["", "?_rsc=abc"]) {
      const response = proxy(new NextRequest(`https://example.com/work/julius-design-system${suffix}`));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("https://example.com/work/julius-unlock");
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    }
  });

  it("blocks direct assets and embedded demos", () => {
    for (const asset of ["dialog-center.webp", "docs-preview/index.html"]) {
      const response = proxy(new NextRequest(`https://example.com/projects/julius-design-system/${asset}`));
      expect(response.status).toBe(401);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    }
  });

  it("blocks private image optimization while allowing public covers", () => {
    for (const source of ["/projects/julius-design-system/dialog-center.webp", "https://example.com/projects/julius-design-system/dialog-center.webp"]) {
      expect(proxy(new NextRequest(`https://example.com/_next/image?url=${encodeURIComponent(source)}&w=640&q=75`)).status).toBe(403);
    }
    expect(proxy(new NextRequest("https://example.com/_next/image?url=%2Fprojects%2Fpreview-art%2Fjulius%2Fsystem-cover.webp&w=640&q=75")).status).toBe(200);
  });
});
