import "server-only";

import type {
  AlbumTrack,
  NowPlayingTrack,
} from "@/lib/now-playing/catalog";

type SpotifyEnvironment = Record<string, string | undefined>;

type GetCurrentlyPlayingOptions = {
  env?: SpotifyEnvironment;
  fetchImpl?: typeof fetch;
};

type CachedAccessToken = {
  value: string;
  expiresAt: number;
};

let cachedAccessToken: CachedAccessToken | null = null;

export function resetSpotifyTokenCacheForTests() {
  cachedAccessToken = null;
}

function serverCredentials(env: SpotifyEnvironment) {
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

async function accessToken(
  credentials: NonNullable<ReturnType<typeof serverCredentials>>,
  fetchImpl: typeof fetch,
) {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.value;
  }

  const authorization = Buffer.from(
    `${credentials.clientId}:${credentials.clientSecret}`,
  ).toString("base64");
  const response = await fetchImpl("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: credentials.refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as {
    access_token?: unknown;
    expires_in?: unknown;
  };
  if (typeof payload.access_token !== "string") return null;

  const expiresIn =
    typeof payload.expires_in === "number" ? payload.expires_in : 3600;
  cachedAccessToken = {
    value: payload.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return payload.access_token;
}

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function safeHttpsUrl(value: unknown) {
  const candidate = text(value);
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function albumTracks(payload: unknown): AlbumTrack[] {
  if (!payload || typeof payload !== "object" || !("items" in payload)) return [];
  const { items } = payload as { items?: unknown };
  if (!Array.isArray(items)) return [];

  return items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const track = item as Record<string, unknown>;
    const id = text(track.id);
    const title = text(track.name);
    const durationMs = track.duration_ms;
    if (!id || !title || typeof durationMs !== "number") return [];
    return [{ id, title, durationMs }];
  });
}

export async function getCurrentlyPlaying({
  env = process.env,
  fetchImpl = fetch,
}: GetCurrentlyPlayingOptions = {}): Promise<NowPlayingTrack | null> {
  const credentials = serverCredentials(env);
  if (!credentials) return null;

  try {
    const token = await accessToken(credentials, fetchImpl);
    if (!token) return null;
    const requestOptions = {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store" as const,
    };
    const playbackResponse = await fetchImpl(
      "https://api.spotify.com/v1/me/player/currently-playing",
      requestOptions,
    );
    if (playbackResponse.status === 204 || !playbackResponse.ok) return null;

    const playback = (await playbackResponse.json()) as Record<string, unknown>;
    if (playback.is_playing !== true || !playback.item || typeof playback.item !== "object") {
      return null;
    }

    const item = playback.item as Record<string, unknown>;
    if (item.type !== "track") return null;
    const id = text(item.id);
    const title = text(item.name);
    const artists = Array.isArray(item.artists) ? item.artists : [];
    const artist = artists
      .flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const name = text((entry as Record<string, unknown>).name);
        return name ? [name] : [];
      })
      .join(", ");
    const album = item.album && typeof item.album === "object"
      ? (item.album as Record<string, unknown>)
      : null;
    const albumId = text(album?.id);
    const albumTitle = text(album?.name);
    const images = Array.isArray(album?.images) ? album.images : [];
    const imageUrl = images.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const url = safeHttpsUrl((entry as Record<string, unknown>).url);
      return url ? [url] : [];
    })[0];
    const externalUrls =
      item.external_urls && typeof item.external_urls === "object"
        ? (item.external_urls as Record<string, unknown>)
        : null;
    const spotifyUrl = safeHttpsUrl(externalUrls?.spotify);

    if (!id || !title || !artist || !albumId || !albumTitle || !imageUrl || !spotifyUrl) {
      return null;
    }

    const tracksResponse = await fetchImpl(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
      requestOptions,
    );
    const tracks = tracksResponse.ok
      ? albumTracks(await tracksResponse.json())
      : [];
    const fallbackDuration =
      typeof item.duration_ms === "number" ? item.duration_ms : 0;

    return {
      id,
      title,
      artist,
      album: albumTitle,
      albumId,
      imageUrl,
      spotifyUrl,
      embedUrl: `https://open.spotify.com/embed/track/${id}`,
      albumTracks:
        tracks.length > 0
          ? tracks
          : [{ id, title, durationMs: fallbackDuration }],
    };
  } catch {
    return null;
  }
}
