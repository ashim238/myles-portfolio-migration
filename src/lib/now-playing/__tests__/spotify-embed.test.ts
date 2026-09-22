import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Spotify iframe loader", () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.replaceChildren();
    delete window.spotifyIframeApi;
    delete window.onSpotifyIframeApiReady;
  });

  it("warms the Spotify origin before requesting the iframe API", async () => {
    const { loadSpotifyIframeApi } = await import("@/lib/now-playing/spotify-embed");

    void loadSpotifyIframeApi();

    const preconnect = document.head.querySelector<HTMLLinkElement>(
      'link[rel="preconnect"][href="https://open.spotify.com"]',
    );
    const script = document.head.querySelector<HTMLScriptElement>("#spotify-iframe-api");

    expect(preconnect).toBeInTheDocument();
    expect(script).toBeInTheDocument();
    expect(
      Array.from(document.head.children).indexOf(preconnect!),
    ).toBeLessThan(Array.from(document.head.children).indexOf(script!));
  });
});
