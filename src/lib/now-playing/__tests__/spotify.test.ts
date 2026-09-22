import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getCurrentlyPlaying,
  resetSpotifyTokenCacheForTests,
} from "@/lib/now-playing/spotify";

const configuredEnv = {
  SPOTIFY_CLIENT_ID: "client-id",
  SPOTIFY_CLIENT_SECRET: "client-secret",
  SPOTIFY_REFRESH_TOKEN: "refresh-token",
};

function response(body: unknown, status = 200) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function htmlResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html" },
  });
}

describe("Spotify now-playing server adapter", () => {
  beforeEach(() => resetSpotifyTokenCacheForTests());

  it("falls back without making a request when server secrets are missing", async () => {
    const fetchImpl = vi.fn();

    await expect(getCurrentlyPlaying({ env: {}, fetchImpl })).resolves.toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("refreshes on the server and returns only a sanitized active track", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(response({ access_token: "short-lived", expires_in: 3600 }))
      .mockResolvedValueOnce(
        response({
          is_playing: true,
          item: {
            type: "track",
            id: "live-track",
            name: "Live Song",
            duration_ms: 222_000,
            external_urls: { spotify: "https://open.spotify.com/track/live-track" },
            artists: [{ name: "Live Artist" }],
            album: {
              id: "live-album",
              name: "Live Album",
              images: [{ url: "https://i.scdn.co/image/live-cover" }],
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        response({
          items: [
            { id: "live-track", name: "Live Song", duration_ms: 222_000 },
            { id: "other-track", name: "Other Song", duration_ms: 180_000 },
          ],
        }),
      )
      .mockResolvedValueOnce(
        htmlResponse(
          '<main style="--dynamic-background-base:rgba(156, 25, 11, 255)"></main>',
        ),
      );

    const result = await getCurrentlyPlaying({ env: configuredEnv, fetchImpl });

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      "https://accounts.spotify.com/api/token",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toMatch(/^Basic /);
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      "https://api.spotify.com/v1/me/player/currently-playing",
      expect.objectContaining({ cache: "no-store" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      3,
      "https://api.spotify.com/v1/albums/live-album/tracks?limit=50",
      expect.objectContaining({ cache: "no-store" }),
    );
    expect(fetchImpl).toHaveBeenNthCalledWith(
      4,
      "https://open.spotify.com/embed/track/live-track",
      expect.not.objectContaining({ headers: expect.anything() }),
    );
    expect(result).toEqual({
      id: "live-track",
      title: "Live Song",
      artist: "Live Artist",
      album: "Live Album",
      albumId: "live-album",
      imageUrl: "https://i.scdn.co/image/live-cover",
      spotifyUrl: "https://open.spotify.com/track/live-track",
      embedUrl: "https://open.spotify.com/embed/track/live-track",
      embedBackground: "#9c190b",
      albumTracks: [
        { id: "live-track", title: "Live Song", durationMs: 222_000 },
        { id: "other-track", title: "Other Song", durationMs: 180_000 },
      ],
    });
    expect(JSON.stringify(result)).not.toContain("short-lived");
    expect(JSON.stringify(result)).not.toContain("refresh-token");
  });

  it("returns the curated fallback signal for inactive or failed requests", async () => {
    const inactiveFetch = vi
      .fn()
      .mockResolvedValueOnce(response({ access_token: "token", expires_in: 3600 }))
      .mockResolvedValueOnce(response(null, 204));

    await expect(
      getCurrentlyPlaying({ env: configuredEnv, fetchImpl: inactiveFetch }),
    ).resolves.toBeNull();

    resetSpotifyTokenCacheForTests();
    const failedFetch = vi.fn().mockRejectedValue(new Error("network unavailable"));
    await expect(
      getCurrentlyPlaying({ env: configuredEnv, fetchImpl: failedFetch }),
    ).resolves.toBeNull();
  });
});
