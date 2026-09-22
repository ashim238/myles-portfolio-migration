# Now Playing Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a secure, paused-by-default Now Playing program with a curated rotation, optional live Spotify status, official album artwork, and automatic month/year labeling.

**Architecture:** Keep the curated catalog as typed local data. A server-only Spotify adapter exchanges the stored refresh token, requests current playback and its album tracks, and returns a sanitized display model through a no-store route. The client program owns focus-lock behavior and renders Spotify's native embed so playback cannot begin without visitor intent. Existing desktop and Pocket shells only gain the new program registration and render branch.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, existing Myles 98 CSS system, Spotify Web API, Spotify Embed.

---

### Task 1: Define the curated music model

**Files:**
- Create: `src/lib/now-playing/catalog.ts`
- Create: `src/lib/now-playing/__tests__/catalog.test.ts`

1. Write failing tests for the approved track order, Cannock Chase default, official Spotify artwork/links, complete album lists, and dynamic `MON YYYY` formatter.
2. Run the focused test and confirm it fails because the module is missing.
3. Implement the smallest typed catalog and date formatter.
4. Run the focused test and confirm it passes.

### Task 2: Build the secure Spotify server boundary

**Files:**
- Create: `src/lib/now-playing/spotify.ts`
- Create: `src/lib/now-playing/__tests__/spotify.test.ts`
- Create: `src/app/api/now-playing/route.ts`
- Create: `src/app/api/now-playing/__tests__/route.test.ts`

1. Write failing tests for missing-configuration fallback, refresh-token exchange, current-track sanitization, album-track sanitization, inactive-playback fallback, and error fallback.
2. Confirm the failures are caused by missing implementation.
3. Implement a `server-only` adapter with injected fetch support for tests and a short-lived access-token cache.
4. Implement a no-store route that returns only `{ liveTrack }`.
5. Run both test files and confirm green.

### Task 3: Build the paused-by-default program UI

**Files:**
- Create: `src/components/myles-97/now-playing-program.tsx`
- Create: `src/components/__tests__/now-playing-program.test.tsx`
- Create: `src/app/styles/myles-97-now-playing.css`
- Modify: `src/app/globals.css`

1. Write failing component tests for curated default, automatic month/year, focus-only cover selection, read-only/faded album rows, official artwork, paused embed source, live badge, and visitor-selection lock.
2. Confirm the component test fails because the component is missing.
3. Implement the client component with a 60-second live-status poll and visitor-selection lock.
4. Render the official Spotify iframe without autoplay parameters and expose a separate Spotify link.
5. Add responsive styles with proportional `object-fit: contain` artwork.
6. Run the component test and confirm green.

### Task 4: Register Now Playing in desktop and Pocket 98

**Files:**
- Modify: `src/lib/myles-97/programs.ts`
- Modify: `src/components/myles-97/start-menu.tsx`
- Modify: `src/components/myles-97/taskbar.tsx`
- Modify: `src/components/myles-97/workstation-desktop.tsx`
- Modify: `src/components/myles-97/pocket-97-shell.tsx`
- Modify: `src/lib/__tests__/myles-97-programs.test.ts`
- Modify: `src/components/__tests__/myles-97-shell.test.tsx`
- Modify: `src/components/__tests__/pocket-97-shell.test.tsx`

1. Extend tests to require the new system-program ID, Start actions, desktop program window, taskbar title, Pocket program, and absence from initial open programs.
2. Run the focused tests and confirm the new expectations fail.
3. Add `now-playing` to the system registry, authored geometry, Start surfaces, title maps, and desktop/Pocket render branches.
4. Use the existing generic application icon and update exact icon-count expectations.
5. Run the focused suite and confirm green.

### Task 5: Permit only the Spotify resources the UI needs

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/__tests__/security-headers.test.ts`

1. Extend the security test to require Spotify's embed frame and artwork hosts while keeping API/auth hosts out of browser `connect-src`.
2. Confirm the test fails against the existing policy.
3. Add `https://open.spotify.com` to `frame-src` and Spotify artwork hosts to `img-src`.
4. Run the security test and confirm green.

### Task 6: Document safe configuration

**Files:**
- Create: `docs/spotify-now-playing-setup.md`
- Modify: `README.md`

1. Document the three server-only variables, the one required scope, local/Vercel secret storage, token rotation, and the fallback behavior.
2. Link the setup note from the README without adding real credentials or tracked `.env` files.
3. Audit the repository for secret-like Spotify values and verify only variable names appear.

### Task 7: Full verification

**Files:**
- Verify all changed files.

1. Run the new and affected Vitest files.
2. Run the full test suite, lint, content validation, and production build.
3. Launch the isolated preview and verify desktop and Pocket layouts, no initial sound, focus-only cover switching, correct album-row emphasis, automatic date, Start discovery, and window focus/minimize/restore.
4. Inspect the final diff and confirm the original checkout remains unchanged.
