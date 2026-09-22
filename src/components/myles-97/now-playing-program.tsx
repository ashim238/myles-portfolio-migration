"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CURRENT_ROTATION,
  formatRotationMonth,
  type NowPlayingTrack,
} from "@/lib/now-playing/catalog";
import {
  loadSpotifyIframeApi,
  type SpotifyEmbedController,
} from "@/lib/now-playing/spotify-embed";

const POLL_INTERVAL_MS = 30_000;
const PLAYER_READINESS_TIMEOUT_MS = 15_000;

type NowPlayingProgramProps = {
  now?: Date;
};

function durationLabel(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function NowPlayingProgram({ now }: NowPlayingProgramProps) {
  const [selectedTrack, setSelectedTrack] = useState<NowPlayingTrack>(
    CURRENT_ROTATION[0],
  );
  const [liveTrack, setLiveTrack] = useState<NowPlayingTrack | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerPaused, setPlayerPaused] = useState(true);
  const [playerFailed, setPlayerFailed] = useState(false);
  const visitorLocked = useRef(false);
  const embedHostRef = useRef<HTMLDivElement>(null);
  const embedControllerRef = useRef<SpotifyEmbedController | null>(null);
  const selectedTrackIdRef = useRef(selectedTrack.id);
  const loadedTrackIdRef = useRef<string | null>(null);

  const refreshLiveTrack = useCallback(async () => {
    try {
      const response = await fetch("/api/now-playing", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const payload = (await response.json()) as {
        liveTrack?: NowPlayingTrack | null;
      };
      const nextLiveTrack = payload.liveTrack ?? null;
      setLiveTrack(nextLiveTrack);
      if (!visitorLocked.current) {
        setSelectedTrack(nextLiveTrack ?? CURRENT_ROTATION[0]);
      }
    } catch {
      // The curated rotation is the complete offline and API-error state.
    }
  }, []);

  useEffect(() => {
    const initialRequest = window.setTimeout(refreshLiveTrack, 0);
    const timer = window.setInterval(refreshLiveTrack, POLL_INTERVAL_MS);
    const refreshOnFocus = () => {
      void refreshLiveTrack();
    };
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      window.clearTimeout(initialRequest);
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [refreshLiveTrack]);

  useEffect(() => {
    const host = embedHostRef.current;
    if (!host) return;

    const initialTrackId = selectedTrackIdRef.current;
    const controllerMount = document.createElement("div");
    host.replaceChildren(controllerMount);
    let active = true;
    let abandoned = false;
    setPlayerReady(false);
    setPlayerPaused(true);
    setPlayerFailed(false);
    const readinessTimeout = window.setTimeout(() => {
      if (active) {
        abandoned = true;
        embedControllerRef.current?.destroy();
        embedControllerRef.current = null;
        loadedTrackIdRef.current = null;
        setPlayerFailed(true);
      }
    }, PLAYER_READINESS_TIMEOUT_MS);

    void loadSpotifyIframeApi()
      .then((api) => {
        if (!active) return;
        api.createController(
          controllerMount,
          {
            uri: `spotify:track:${initialTrackId}`,
            width: "100%",
            height: 80,
          },
          (controller) => {
            if (!active || abandoned) {
              controller.destroy();
              return;
            }

            embedControllerRef.current = controller;
            loadedTrackIdRef.current = initialTrackId;
            if (selectedTrackIdRef.current !== initialTrackId) {
              controller.loadEntity(`spotify:track:${selectedTrackIdRef.current}`);
              loadedTrackIdRef.current = selectedTrackIdRef.current;
            }
            controller.addListener("ready", () => {
              if (active && !abandoned) {
                window.clearTimeout(readinessTimeout);
                setPlayerReady(true);
              }
            });
            controller.addListener("playback_update", (event) => {
              if (active && typeof event?.data?.isPaused === "boolean") {
                setPlayerPaused(event.data.isPaused);
              }
            });
          },
        );
      })
      .catch(() => {
        window.clearTimeout(readinessTimeout);
        if (active) setPlayerFailed(true);
      });

    return () => {
      active = false;
      window.clearTimeout(readinessTimeout);
      embedControllerRef.current?.destroy();
      embedControllerRef.current = null;
      loadedTrackIdRef.current = null;
      host.replaceChildren();
    };
  }, []);

  useEffect(() => {
    selectedTrackIdRef.current = selectedTrack.id;
    const controller = embedControllerRef.current;
    if (!controller || loadedTrackIdRef.current === selectedTrack.id) return;

    controller.loadEntity(`spotify:track:${selectedTrack.id}`);
    loadedTrackIdRef.current = selectedTrack.id;
    setPlayerPaused(true);
  }, [selectedTrack.id]);

  const selectedIsLive = liveTrack?.id === selectedTrack.id;
  const status = selectedIsLive
    ? "SPOTIFY · LIVE"
    : `CURRENT ROTATION · ${formatRotationMonth(now)}`;
  const playerState = playerFailed
    ? "fallback"
    : !playerReady
      ? "loading"
      : playerPaused
        ? "ready"
        : "playing";
  const playerSurface = {
    backgroundColor: selectedTrack.embedBackground,
  };

  return (
    <article className="now-playing-program">
      <header className="now-playing-heading">
        <div>
          <p className="now-playing-status">{status}</p>
          <h2>What&apos;s been on repeat.</h2>
        </div>
        <span
          className="now-playing-equalizer"
          data-playing={String(playerReady && !playerPaused)}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
          <i />
        </span>
      </header>

      <div className="now-playing-main">
        <section className="now-playing-feature" aria-live="polite">
          <div className="now-playing-artwork-frame">
            {/* Spotify supplies this artwork URL through its catalog or Web API. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="now-playing-artwork-image"
              src={selectedTrack.imageUrl}
              alt={`${selectedTrack.album} cover`}
            />
          </div>
          <div className="now-playing-feature-copy">
            <h3>{selectedTrack.title}</h3>
            <p>{selectedTrack.artist}</p>
            <span>{selectedTrack.album}</span>
          </div>
        </section>

        <section className="now-playing-album" aria-labelledby="now-playing-album-title">
          <div className="now-playing-album-heading">
            <div>
              <span>Album</span>
              <h3 id="now-playing-album-title">{selectedTrack.album}</h3>
            </div>
            <span>{selectedTrack.albumTracks.length} tracks</span>
          </div>
          <ol
            className="now-playing-track-list"
            aria-label={`${selectedTrack.album} track list`}
          >
            {selectedTrack.albumTracks.map((track, index) => {
              const isSelected = track.id === selectedTrack.id;
              return (
                <li
                  key={track.id}
                  data-selected={String(isSelected)}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <span className="now-playing-track-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{track.title}</strong>
                  <time>{durationLabel(track.durationMs)}</time>
                </li>
              );
            })}
          </ol>
          <div className="now-playing-embed" data-player-state={playerState}>
            <div className="now-playing-player-header">
              <span>Embedded playback</span>
              <span
                className="now-playing-player-indicator"
                data-state={playerState}
                aria-hidden="true"
              />
            </div>
            <div className="now-playing-player-well" style={playerSurface}>
              {playerFailed ? (
                <iframe
                  className="now-playing-embed-fallback"
                  title={`Spotify player for ${selectedTrack.title} by ${selectedTrack.artist}`}
                  src={selectedTrack.embedUrl}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              ) : (
                <div
                  ref={embedHostRef}
                  className="now-playing-embed-host"
                  style={playerSurface}
                  aria-label={`Spotify player for ${selectedTrack.title} by ${selectedTrack.artist}`}
                />
              )}
            </div>
            <div className="now-playing-player-controls">
              {!playerFailed ? (
                <button
                  type="button"
                  className="now-playing-play-toggle"
                  aria-label={`${playerPaused ? "Play" : "Pause"} ${selectedTrack.title}`}
                  disabled={!playerReady}
                  onClick={() => embedControllerRef.current?.togglePlay()}
                >
                  <span
                    className={playerPaused ? "now-playing-play-icon" : "now-playing-pause-icon"}
                    aria-hidden="true"
                  />
                  <span>{playerPaused ? "Play" : "Pause"}</span>
                </button>
              ) : null}
              <span className="now-playing-player-state" aria-live="polite">
                {playerFailed
                  ? "Spotify player"
                  : playerReady
                    ? playerPaused
                      ? "Ready"
                      : "Playing"
                    : "Loading player…"}
              </span>
              <a
                href={selectedTrack.spotifyUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in Spotify
              </a>
            </div>
          </div>
        </section>
      </div>

      <section className="now-playing-rotation" aria-label="Current rotation">
        {CURRENT_ROTATION.map((track) => {
          const selected = track.id === selectedTrack.id;
          return (
            <button
              key={track.id}
              type="button"
              aria-label={`Focus ${track.title} by ${track.artist}`}
              aria-pressed={selected}
              onClick={() => {
                visitorLocked.current = true;
                setSelectedTrack(track);
              }}
            >
              <span className="now-playing-rotation-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={track.imageUrl} alt="" />
              </span>
              <span>
                <strong>{track.title}</strong>
                <small>{track.artist}</small>
              </span>
            </button>
          );
        })}
      </section>
    </article>
  );
}
