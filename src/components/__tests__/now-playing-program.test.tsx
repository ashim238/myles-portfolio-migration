import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NowPlayingTrack } from "@/lib/now-playing/catalog";
import type { SpotifyEmbedController } from "@/lib/now-playing/spotify-embed";

const embedMocks = vi.hoisted(() => ({
  listeners: new Map<string, (event?: unknown) => void>(),
  togglePlay: vi.fn(),
  destroy: vi.fn(),
  createController: vi.fn(),
  loadSpotifyIframeApi: vi.fn(),
}));

vi.mock("@/lib/now-playing/spotify-embed", () => ({
  loadSpotifyIframeApi: embedMocks.loadSpotifyIframeApi,
}));

import { NowPlayingProgram } from "@/components/myles-97/now-playing-program";

const liveTrack: NowPlayingTrack = {
  id: "live-track",
  title: "Live Song",
  artist: "Live Artist",
  album: "Live Album",
  albumId: "live-album",
  imageUrl: "https://i.scdn.co/image/live-cover",
  spotifyUrl: "https://open.spotify.com/track/live-track",
  embedUrl: "https://open.spotify.com/embed/track/live-track",
  albumTracks: [
    { id: "live-track", title: "Live Song", durationMs: 210_000 },
    { id: "live-b-side", title: "Live B-side", durationMs: 180_000 },
  ],
};

function apiResponse(track: NowPlayingTrack | null) {
  return Promise.resolve(
    new Response(JSON.stringify({ liveTrack: track }), {
      headers: { "Content-Type": "application/json" },
    }),
  );
}

function emit(event: string, payload?: unknown) {
  act(() => embedMocks.listeners.get(event)?.(payload));
}

describe("Now Playing program", () => {
  beforeEach(() => {
    embedMocks.listeners.clear();
    embedMocks.togglePlay.mockReset();
    embedMocks.destroy.mockReset();
    embedMocks.createController.mockReset();
    embedMocks.loadSpotifyIframeApi.mockReset();

    const controller = {
      addListener: vi.fn((event: string, callback: (payload?: unknown) => void) => {
        embedMocks.listeners.set(event, callback);
      }),
      togglePlay: embedMocks.togglePlay,
      destroy: embedMocks.destroy,
    } satisfies SpotifyEmbedController;

    embedMocks.createController.mockImplementation(
      (_element, _options, callback: (controller: SpotifyEmbedController) => void) => {
        callback(controller);
      },
    );
    embedMocks.loadSpotifyIframeApi.mockResolvedValue({
      createController: embedMocks.createController,
    });
    vi.stubGlobal("fetch", vi.fn(() => apiResponse(null)));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("opens on the curated Cannock Chase state with a dynamic month and no autoplay", async () => {
    render(<NowPlayingProgram now={new Date(2027, 1, 14, 12)} />);

    expect(
      screen.getByRole("heading", { name: "What's been on repeat." }),
    ).toBeInTheDocument();
    expect(screen.getByText("CURRENT ROTATION · FEB 2027")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cannock Chase" })).toBeInTheDocument();
    expect(screen.getAllByText("Labi Siffre").length).toBeGreaterThan(0);

    const artwork = screen.getByRole("img", {
      name: "Crying, Laughing, Loving, Lying cover",
    });
    expect(artwork).toHaveAttribute(
      "src",
      expect.stringContaining("spotifycdn.com/image/"),
    );
    expect(artwork).toHaveClass("now-playing-artwork-image");

    await waitFor(() => expect(embedMocks.createController).toHaveBeenCalledOnce());
    expect(embedMocks.createController).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        uri: expect.stringContaining("spotify:track:"),
        height: 80,
      }),
      expect.any(Function),
    );
    expect(embedMocks.togglePlay).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Play Cannock Chase" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "Open in Spotify" })).toHaveAttribute(
      "href",
      expect.stringContaining("open.spotify.com/track/"),
    );
  });

  it("shows a working Play/Pause control after Spotify is ready", async () => {
    render(<NowPlayingProgram />);

    await waitFor(() => expect(embedMocks.createController).toHaveBeenCalledOnce());
    emit("ready");

    const playButton = screen.getByRole("button", { name: "Play Cannock Chase" });
    expect(playButton).toBeEnabled();
    fireEvent.click(playButton);
    expect(embedMocks.togglePlay).toHaveBeenCalledOnce();

    emit("playback_update", { data: { isPaused: false } });
    expect(screen.getByRole("button", { name: "Pause Cannock Chase" })).toBeEnabled();
  });

  it("falls back to a working Spotify link when the embedded player is blocked", async () => {
    embedMocks.loadSpotifyIframeApi.mockRejectedValueOnce(
      new Error("blocked by browser"),
    );
    render(<NowPlayingProgram />);

    const fallback = await screen.findByRole("link", {
      name: "Play Cannock Chase in Spotify",
    });
    expect(fallback).toHaveAttribute(
      "href",
      expect.stringContaining("open.spotify.com/track/"),
    );
    expect(screen.queryByRole("button", { name: "Play Cannock Chase" })).toBeNull();
    expect(screen.getByText("Player unavailable")).toBeInTheDocument();
  });

  it("changes focus without making the read-only album rows interactive", async () => {
    render(<NowPlayingProgram />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    fireEvent.click(
      screen.getByRole("button", { name: "Focus Red Potion by Rema" }),
    );

    expect(screen.getByRole("heading", { name: "Red Potion" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Focus Red Potion by Rema" }),
    ).toHaveAttribute("aria-pressed", "true");
    const albumList = screen.getByRole("list", { name: "RAVAGE track list" });
    const chosenRow = within(albumList).getByText("Red Potion").closest("li");
    const otherRow = within(albumList).getByText("Trouble Maker").closest("li");

    expect(chosenRow).toHaveAttribute("aria-current", "true");
    expect(otherRow).toHaveAttribute("data-selected", "false");
    expect(otherRow?.querySelector("button, a")).toBeNull();
    await waitFor(() => expect(embedMocks.createController).toHaveBeenCalledTimes(2));
    expect(embedMocks.destroy).toHaveBeenCalledOnce();
  });

  it("features an active Spotify track but lets a visitor lock a rotation choice", async () => {
    vi.stubGlobal("fetch", vi.fn(() => apiResponse(liveTrack)));
    render(<NowPlayingProgram />);

    await waitFor(() => {
      expect(screen.getByText("SPOTIFY · LIVE")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Live Song" })).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Focus Red Potion by Rema" }),
    );

    expect(screen.queryByText("SPOTIFY · LIVE")).toBeNull();
    expect(screen.getByRole("heading", { name: "Red Potion" })).toBeInTheDocument();
    expect(screen.getByText(/CURRENT ROTATION/)).toBeInTheDocument();
  });
});
