# Now Playing Design

**Date:** 2026-09-21
**Status:** Approved for implementation

## Purpose

Add a small music application to Myles 98 that reveals personality without surprising visitors with sound. The app defaults to a deliberately curated rotation and promotes an active Spotify track only when Myles is currently listening.

## Discovery

- Add **Now Playing** to the desktop Start menu and Pocket 98 Start sheet.
- Keep it closed on initial load so it feels like an optional discovery rather than homepage content.
- Reuse the generic application icon for this first release. A purpose-built music icon can follow without blocking the feature.

## Window behavior

- Open in a focused Myles 98 program window.
- Other windows and taskbar buttons continue to follow the existing focus model.
- Do not add File, View, or Help menus because no actions have been defined for them.
- Close, minimize, move, focus, persistence, and Pocket 98 navigation use the existing shell behavior.

## Content states

### Current Rotation

The default state uses the heading **What's been on repeat.** and features four tracks in this order:

1. Cannock Chase, Labi Siffre, *Crying, Laughing, Loving, Lying*
2. Red Potion, Rema, *RAVAGE*
3. Hypotheticals, Lake Street Dive, *Obviously*
4. Troupeau bleu, Cortex, *Troupeau bleu*

Cannock Chase is the initial focused track. The date label is computed in the browser as `MON YYYY`, so it changes automatically with the visitor's current month and year.

### Spotify Live

- When the server reports an actively playing Spotify track, feature it and show the static badge `SPOTIFY · LIVE`.
- Never expose Spotify tokens, client secrets, refresh tokens, or raw API responses to the browser.
- If configuration, authorization, the API, or playback is unavailable, return the Current Rotation state without an error surface.
- Poll for live status at a restrained interval.
- Once a visitor selects a rotation cover, preserve that choice until the program closes. A live update must not interrupt it.

## Interaction

- A large focused album cover is accompanied by the remaining rotation covers.
- Clicking a supporting cover changes focus only. It never starts playback.
- The focused album's full track list is visible. The chosen song is highlighted. Other songs remain legible but faded and are not buttons or links.
- Playback is handled by Spotify's embedded player for the focused song. It loads paused and only starts after the visitor activates Spotify's play control.
- A separate Spotify link provides clear attribution and an escape hatch to the source.

## Artwork

- Use official Spotify-supplied album artwork URLs.
- Render artwork proportionally with `object-fit: contain` so each cover fits its own frame without cropping, stretching, overlays, or recoloring.
- Keep track names, badges, and controls outside the artwork.

## Responsive behavior

- Desktop uses the approved featured-cover layout within a 760 by 570 authored window.
- Pocket 98 renders the same program content in its single-app shell.
- At narrower widths, stack the focused record, track list, supporting covers, and embed without introducing horizontal page overflow.

## Accessibility

- Use native buttons for cover selection and expose the selected state with `aria-pressed`.
- Give artwork useful alt text.
- Keep faded, unavailable album tracks above minimum readable contrast in both default and high-contrast modes.
- The Spotify iframe has an explicit title.
- Respect the shell's reduced-motion setting and do not introduce essential motion.

## Spotify security boundary

- Read `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` only in a server-only module.
- Request only the `user-read-currently-playing` scope when generating the refresh token.
- Refresh access tokens through Spotify Accounts on the server, then call the currently-playing and album-track endpoints from the server.
- Return a narrow display model from `/api/now-playing` with `Cache-Control: private, no-store`.
- Keep every `.env*` file ignored. Document variable names without creating a tracked secret file.

## Acceptance criteria

- Now Playing is discoverable in both Start surfaces and is absent from the initial open-program list.
- The curated four-track state works without Spotify credentials.
- The month/year label is generated dynamically.
- Artwork is official, uncropped, and scales inside each frame.
- Cover selection changes the focused track and album list without playing audio.
- The embedded player never autoplays.
- Live data is sanitized server-side and gracefully falls back.
- Desktop and Pocket 98 render without overflow at their supported breakpoints.
- Focus, minimize, restore, and close behavior remain consistent with other programs.
