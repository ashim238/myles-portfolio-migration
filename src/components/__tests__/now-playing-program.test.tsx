import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NowPlayingTrack } from "@/lib/now-playing/catalog";
import type {
  SpotifyEmbedController,
  SpotifyEmbedEvent,
} from "@/lib/now-playing/spotify-embed";

const embedMocks = vi.hoisted(() => ({
  listeners: new Map<string, (event?: SpotifyEmbedEvent) => void>(),
  togglePlay: vi.fn(),
  loadEntity: vi.fn(),
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

function emit(event: string, payload?: SpotifyEmbedEvent) {
  act(() => embedMocks.listeners.get(event)?.(payload));
}

describe("Now Playing program", () => {
  beforeEach(() => {
    embedMocks.listeners.clear();
    embedMocks.togglePlay.mockReset();
    embedMocks.loadEntity.mockReset();
    embedMocks.destroy.mockReset();
    embedMocks.createController.mockReset();
    embedMocks.loadSpotifyIframeApi.mockReset();

    const controller = {
      addListener: vi.fn((
        event: "ready" | "playback_update",
        callback: (payload?: SpotifyEmbedEvent) => void,
      ) => {
        embedMocks.listeners.set(event, callback);
      }),
      togglePlay: embedMocks.togglePlay,
      loadEntity: embedMocks.loadEntity,
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

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

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

  it("shows an immediate embedded-playback shell while Spotify loads", () => {
    const { container } = render(<NowPlayingProgram />);

    expect(screen.getByText("Embedded playback")).toBeInTheDocument();
    expect(screen.getByText("Loading player…")).toBeInTheDocument();
    expect(container.querySelector(".now-playing-player-indicator")).toHaveAttribute(
      "data-state",
      "loading",
    );
  });

  it("shows a working Play/Pause control after Spotify is ready", async () => {
    const { container } = render(<NowPlayingProgram />);
    const equalizer = container.querySelector(".now-playing-equalizer");

    expect(equalizer).toHaveAttribute("data-playing", "false");

    await waitFor(() => expect(embedMocks.createController).toHaveBeenCalledOnce());
    emit("ready");

    const playButton = screen.getByRole("button", { name: "Play Cannock Chase" });
    expect(playButton).toBeEnabled();
    fireEvent.click(playButton);
    expect(embedMocks.togglePlay).toHaveBeenCalledOnce();

    emit("playback_update", { data: { isPaused: false } });
    expect(screen.getByRole("button", { name: "Pause Cannock Chase" })).toBeEnabled();
    expect(equalizer).toHaveAttribute("data-playing", "true");

    emit("playback_update", { data: { isPaused: true } });
    expect(equalizer).toHaveAttribute("data-playing", "false");
  });

  it("keeps Spotify's replaceable mount inside a React-owned host", async () => {
    render(<NowPlayingProgram />);

    await waitFor(() => expect(embedMocks.createController).toHaveBeenCalledOnce());
    const controllerMount = embedMocks.createController.mock.calls[0][0] as HTMLElement;

    expect(controllerMount.parentElement).toHaveClass("now-playing-embed-host");
  });

  it("falls back to Spotify's standard embedded player when the controller is blocked", async () => {
    embedMocks.loadSpotifyIframeApi.mockRejectedValueOnce(
      new Error("blocked by browser"),
    );
    render(<NowPlayingProgram />);

    const fallback = await screen.findByTitle(
      "Spotify player for Cannock Chase by Labi Siffre",
    );
    expect(fallback).toHaveAttribute(
      "src",
      expect.stringContaining("open.spotify.com/embed/track/"),
    );
    expect(fallback).toHaveAttribute(
      "allow",
      expect.stringContaining("encrypted-media"),
    );
    expect(screen.queryByRole("button", { name: "Play Cannock Chase" })).toBeNull();
    expect(screen.queryByText("Player unavailable")).toBeNull();
    expect(screen.getByText("Spotify player")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open in Spotify" })).toHaveAttribute(
      "href",
      expect.stringContaining("open.spotify.com/track/"),
    );
  });

  it("falls back to Spotify's standard player after a five-second readiness budget", async () => {
    vi.useFakeTimers();
    render(<NowPlayingProgram />);

    await act(async () => {
      await Promise.resolve();
    });
    expect(embedMocks.createController).toHaveBeenCalledOnce();

    await act(async () => {
      vi.advanceTimersByTime(4_999);
      await Promise.resolve();
    });

    expect(screen.getByText("Loading player…")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
      await Promise.resolve();
    });

    expect(
      screen.getByTitle("Spotify player for Cannock Chase by Labi Siffre"),
    ).toBeInTheDocument();
    expect(screen.getByText("Spotify player")).toBeInTheDocument();
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
    await waitFor(() => expect(embedMocks.loadEntity).toHaveBeenCalledWith(
      "spotify:track:6THzboswz9kc4gfkmTTePN",
    ));
    expect(embedMocks.createController).toHaveBeenCalledOnce();
    expect(embedMocks.destroy).not.toHaveBeenCalled();
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
