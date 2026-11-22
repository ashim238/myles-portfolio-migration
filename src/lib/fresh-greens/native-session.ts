export const localSimulator = "http://127.0.0.1:4397";
export const simulatorHost = "https://appetize.io";

export type NativeSession = { kind: "local" } | { kind: "hosted"; buildId: string };

export function freshGreensSession(env: NodeJS.ProcessEnv): NativeSession | null {
  const buildId = env.FRESH_GREENS_APPETIZE_BUILD_ID?.trim();
  if (buildId && /^[a-zA-Z0-9_-]+$/.test(buildId)) return { kind: "hosted", buildId };
  if (env.FRESH_GREENS_LOCAL_SIMULATOR === "1" && !env.VERCEL) return { kind: "local" };
  return null;
}

export function nativeFrameSource(session: NativeSession) {
  if (session.kind === "local") return localSimulator + "/";
  const url = new URL("/embed/" + session.buildId, simulatorHost);
  url.search = new URLSearchParams({
    scale: "auto", screenOnly: "true", autoplay: "true",
    location: "40.6708,-73.9305", timezone: "America/New_York",
  }).toString();
  return url.toString();
}
