import { describe, expect, it } from "vitest";
import {
  CURRENT_ROTATION,
  DEFAULT_ROTATION_TRACK_ID,
  formatRotationMonth,
} from "@/lib/now-playing/catalog";

describe("Now Playing catalog", () => {
  it("keeps the approved rotation and Cannock Chase default", () => {
    expect(CURRENT_ROTATION.map(({ title, artist }) => ({ title, artist }))).toEqual([
      { title: "Cannock Chase", artist: "Labi Siffre" },
      { title: "Red Potion", artist: "Rema" },
      { title: "Hypotheticals", artist: "Lake Street Dive" },
      { title: "Troupeau bleu", artist: "Cortex" },
    ]);
    expect(DEFAULT_ROTATION_TRACK_ID).toBe(CURRENT_ROTATION[0].id);
  });

  it("uses official Spotify sources and complete album tracklists", () => {
    expect(CURRENT_ROTATION.map((track) => track.albumTracks.length)).toEqual([
      18,
      5,
      12,
      13,
    ]);

    for (const track of CURRENT_ROTATION) {
      expect(track.imageUrl).toMatch(
        /^https:\/\/image-cdn-(?:ak|fa)\.spotifycdn\.com\/image\//,
      );
      expect(track.spotifyUrl).toBe(`https://open.spotify.com/track/${track.id}`);
      expect(track.embedUrl).toBe(`https://open.spotify.com/embed/track/${track.id}`);
      expect(track.albumTracks.some(({ id }) => id === track.id)).toBe(true);
    }
  });

  it("matches each curated player shell to Spotify's rendered embed surface", () => {
    expect(CURRENT_ROTATION.map((track) => track.embedBackground)).toEqual([
      "#485650",
      "#9c190b",
      "#90312a",
      "#504f76",
    ]);
  });

  it("formats the visitor's month and year instead of storing a fixed label", () => {
    expect(formatRotationMonth(new Date(2027, 1, 14, 12))).toBe("FEB 2027");
  });
});
