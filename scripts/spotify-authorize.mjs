#!/usr/bin/env node

import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { chmod, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const HOST = "127.0.0.1";
const PORT = 3002;
const REDIRECT_URI = `http://${HOST}:${PORT}/callback`;
const SCOPE = "user-read-currently-playing";
const TIMEOUT_MS = 5 * 60 * 1000;

export function parseEnvFile(source) {
  const values = {};

  for (const line of source.split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/,
    );
    if (!match) continue;

    let value = match[2];
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }

  return values;
}

function serializeEnvValue(value) {
  return /^[A-Za-z0-9._~-]+$/.test(value) ? value : JSON.stringify(value);
}

export function upsertEnvValue(source, key, value) {
  const replacement = `${key}=${serializeEnvValue(value)}`;
  const lines = source.split(/\r?\n/);
  const keyPattern = new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`);
  let written = false;
  const nextLines = [];

  for (const line of lines) {
    if (!keyPattern.test(line)) {
      nextLines.push(line);
      continue;
    }
    if (!written) {
      nextLines.push(replacement);
      written = true;
    }
  }

  if (!written) {
    while (nextLines.at(-1) === "") nextLines.pop();
    nextLines.push(replacement);
  }

  return `${nextLines.join("\n")}\n`;
}

export function buildAuthorizationUrl({ clientId, state }) {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
  }).toString();
  return url.toString();
}

export function readCallback(url, expectedState) {
  const spotifyError = url.searchParams.get("error");
  if (spotifyError) {
    throw new Error(`Spotify authorization was declined: ${spotifyError}`);
  }
  if (url.searchParams.get("state") !== expectedState) {
    throw new Error("Spotify callback state did not match. Please try again.");
  }

  const code = url.searchParams.get("code");
  if (!code) throw new Error("Spotify did not return an authorization code.");
  return { code };
}

async function exchangeCode({ clientId, clientSecret, code, fetchImpl }) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const response = await fetchImpl("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Spotify rejected the code exchange with status ${response.status}.`,
    );
  }

  const payload = await response.json();
  if (typeof payload.refresh_token !== "string" || !payload.refresh_token) {
    throw new Error("Spotify did not return a refresh token.");
  }
  return payload.refresh_token;
}

function htmlPage(title, message) {
  const escape = (value) =>
    value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(title)}</title></head>
  <body style="font:16px system-ui;max-width:42rem;margin:4rem auto;padding:0 1.25rem;line-height:1.5">
    <h1>${escape(title)}</h1>
    <p>${escape(message)}</p>
  </body>
</html>`;
}

async function openAuthorizationPage(url) {
  await execFileAsync("open", [url]);
}

export async function runSpotifyAuthorization({
  cwd = process.cwd(),
  fetchImpl = fetch,
  openBrowser = openAuthorizationPage,
} = {}) {
  const envPath = join(cwd, ".env.local");
  const envSource = await readFile(envPath, "utf8").catch(() => "");
  const env = parseEnvFile(envSource);
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local, then run this command again.",
    );
  }

  const state = randomBytes(24).toString("hex");
  const authorizationUrl = buildAuthorizationUrl({ clientId, state });

  await new Promise((resolve, reject) => {
    let timer;
    const server = createServer(async (request, response) => {
      const requestUrl = new URL(request.url ?? "/", REDIRECT_URI);
      if (requestUrl.pathname !== "/callback") {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      try {
        const { code } = readCallback(requestUrl, state);
        const refreshToken = await exchangeCode({
          clientId,
          clientSecret,
          code,
          fetchImpl,
        });
        const updatedEnv = upsertEnvValue(
          envSource,
          "SPOTIFY_REFRESH_TOKEN",
          refreshToken,
        );
        await writeFile(envPath, updatedEnv, { mode: 0o600 });
        await chmod(envPath, 0o600);

        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(
          htmlPage(
            "Spotify connected",
            "The refresh token was saved to the ignored .env.local file. You can close this tab.",
          ),
          () => server.close(),
        );
        console.log("Spotify refresh token saved securely to .env.local.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Authorization failed.";
        response.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        response.end(htmlPage("Spotify connection failed", message), () => {
          process.exitCode = 1;
          server.close();
        });
        console.error(message);
      }
    });

    server.once("error", reject);
    server.once("close", () => {
      if (timer) clearTimeout(timer);
      resolve();
    });
    server.listen(PORT, HOST, async () => {
      console.log(`Waiting for Spotify at ${REDIRECT_URI}`);
      try {
        await openBrowser(authorizationUrl);
        console.log("Opened Spotify authorization in your browser.");
      } catch {
        console.log("Open this URL in your browser:");
        console.log(authorizationUrl);
      }
      timer = setTimeout(() => {
        console.error("Spotify authorization timed out. Run the command to try again.");
        process.exitCode = 1;
        server.close();
      }, TIMEOUT_MS);
    });
  });
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  runSpotifyAuthorization().catch((error) => {
    const message = error instanceof Error ? error.message : "Authorization failed.";
    console.error(message);
    process.exitCode = 1;
  });
}
