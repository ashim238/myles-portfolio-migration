import { describe, expect, it } from "vitest";

import {
  buildAuthorizationUrl,
  parseEnvFile,
  readCallback,
  upsertEnvValue,
} from "../spotify-authorize.mjs";

describe("Spotify authorization helper", () => {
  it("requests only the approved playback scope with an exact loopback callback", () => {
    const url = new URL(
      buildAuthorizationUrl({ clientId: "client-id", state: "safe-state" }),
    );

    expect(url.origin + url.pathname).toBe(
      "https://accounts.spotify.com/authorize",
    );
    expect(Object.fromEntries(url.searchParams)).toEqual({
      client_id: "client-id",
      response_type: "code",
      redirect_uri: "http://127.0.0.1:3002/callback",
      scope: "user-read-currently-playing",
      state: "safe-state",
    });
  });

  it("accepts only a matching callback state and authorization code", () => {
    expect(
      readCallback(
        new URL("http://127.0.0.1:3000/callback?code=one-time&state=safe"),
        "safe",
      ),
    ).toEqual({ code: "one-time" });

    expect(() =>
      readCallback(
        new URL("http://127.0.0.1:3000/callback?code=one-time&state=wrong"),
        "safe",
      ),
    ).toThrow("state did not match");
  });

  it("reads quoted local values and replaces a token without duplicating it", () => {
    const source = [
      "SPOTIFY_CLIENT_ID=client-id",
      'SPOTIFY_CLIENT_SECRET="client-secret"',
      "SPOTIFY_REFRESH_TOKEN=old-token",
      "",
    ].join("\n");

    expect(parseEnvFile(source)).toMatchObject({
      SPOTIFY_CLIENT_ID: "client-id",
      SPOTIFY_CLIENT_SECRET: "client-secret",
    });

    const updated = upsertEnvValue(
      source,
      "SPOTIFY_REFRESH_TOKEN",
      "new-token",
    );
    expect(updated.match(/^SPOTIFY_REFRESH_TOKEN=/gm)).toHaveLength(1);
    expect(updated).toContain("SPOTIFY_REFRESH_TOKEN=new-token");
    expect(updated).not.toContain("old-token");
  });
});
