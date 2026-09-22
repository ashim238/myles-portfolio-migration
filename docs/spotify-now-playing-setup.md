# Spotify Now Playing setup

The portfolio works without Spotify credentials. When configuration is absent or Spotify is unavailable, the Now Playing program shows the curated Current Rotation.

## Security model

The connection uses three server-only environment variables:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

The client secret and refresh token are read only by `src/lib/now-playing/spotify.ts`, which is marked as server-only. The browser calls `/api/now-playing` and receives a reduced display model containing the track, artist, album, artwork, Spotify URL, and album track list. Access tokens and refresh tokens are never included.

## Create the Spotify application

1. Create an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add the temporary loopback redirect URI `http://127.0.0.1:3002/callback` for the one-time authorization flow.
3. Request only `user-read-currently-playing`.
4. Complete Spotify's [Authorization Code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) locally and exchange the returned code for a refresh token.
5. Remove unused redirect URIs after the refresh token has been generated.

Do not add a public login page to the portfolio. Visitors do not need to connect their own Spotify accounts.

### Generate the refresh token locally

1. Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to the ignored `.env.local` file. Do not paste the secret into chat or commit it.
2. Make sure the Spotify app allows the exact redirect URI `http://127.0.0.1:3002/callback`.
3. Run `npm run spotify:authorize` from this worktree.
4. Approve the single requested permission in the Spotify page that opens.

The helper listens only on `127.0.0.1`, verifies the callback state, exchanges the one-time code server-side, and writes `SPOTIFY_REFRESH_TOKEN` directly to `.env.local`. It never prints the client secret or either token. The helper closes after one callback or after five minutes.

## Store the secrets

For local development, save the variables in `.env.local`. The repository ignores every `.env*` file.

For Vercel, add the same variables in Project Settings under Environment Variables. Apply them only to the environments that should display live activity. Redeploy after adding or rotating a value.

Never place the client secret, refresh token, or an access token in source files, browser-visible variables, screenshots, build logs, or a variable prefixed with `NEXT_PUBLIC_`.

## Runtime behavior

- The server exchanges the refresh token for a short-lived access token.
- The browser never calls Spotify's API or Accounts service directly.
- `/api/now-playing` is marked private and no-store.
- The UI checks live status once per minute.
- Errors and inactive playback return the curated rotation without exposing account details.
- Playback uses Spotify's embedded player. It loads paused and requires a visitor action.

## Rotation updates

The curated tracks, album lists, Spotify links, and official artwork URLs live in `src/lib/now-playing/catalog.ts`. Verify replacements against Spotify before updating that file.
