export type SpotifyEmbedEvent = {
  data?: {
    isPaused?: boolean;
  };
};

export type SpotifyEmbedController = {
  addListener: (
    event: "ready" | "playback_update",
    listener: (event?: SpotifyEmbedEvent) => void,
  ) => void;
  togglePlay: () => void;
  destroy: () => void;
};

export type SpotifyIFrameApi = {
  createController: (
    element: HTMLElement,
    options: {
      uri: string;
      width: string | number;
      height: string | number;
    },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
    spotifyIframeApi?: SpotifyIFrameApi;
  }
}

const SCRIPT_ID = "spotify-iframe-api";
const SCRIPT_SRC = "https://open.spotify.com/embed/iframe-api/v1";

let apiPromise: Promise<SpotifyIFrameApi> | null = null;

export function loadSpotifyIframeApi(): Promise<SpotifyIFrameApi> {
  if (window.spotifyIframeApi) return Promise.resolve(window.spotifyIframeApi);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<SpotifyIFrameApi>((resolve, reject) => {
    window.onSpotifyIframeApiReady = (api) => {
      window.spotifyIframeApi = api;
      resolve(api);
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("error", () => {
      apiPromise = null;
      script.remove();
      reject(new Error("Spotify player failed to load"));
    }, { once: true });
    document.head.append(script);
  });

  return apiPromise;
}
