# Myles Portfolio Migration

Lean Next.js portfolio with file-based CMS editing.

The current portfolio experience is **Myles 98** on desktop and **Pocket 98** on mobile, with shared **Reader Mode** case studies. See [`docs/MYLES_98_NAMING.md`](docs/MYLES_98_NAMING.md) for the canonical product language and the reason legacy `myles-97` code identifiers remain stable.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Fresh Greens route comparison

The opening chapter lets readers use the route arrows to compare two iOS captures from a trip to Weeksville Heritage Center. Both images ship with the portfolio, so the comparison works with the standard local setup and production build. The Validate chapter includes a recording of the drive.

## Content editing (CMS-like workflow)

Each file in `content/projects/` holds the project metadata, chapters and artwork. Start with the [case-study authoring guide in DESIGN.md](DESIGN.md#publish-another-case-study). The shared template supplies the Projects listing, preview window and Reader layout.

### Frontmatter fields

- `slug`: URL slug (`/work/[slug]`)
- `title`: project title
- `summary`: one-line preview for homepage
- `role`, `timeframe`
- `status`: `published` or `draft`
- `order`: sort order on homepage
- `tags`: optional labels
- `coverImage`: optional original for the folder cover and Reader opening
- `coverAlt`: description of the visible work
- `sections`: optional structured blocks for case-study layout
- `highlightQuote`: optional pull-quote on project page
- `outcomeMetricLabel` + `outcomeMetricValue`: optional outcome callout

Use `status: draft` while writing. Switch to `published` when ready to show on the homepage.

`sections` example:

```yaml
sections:
  - title: Context
    body: Brief context paragraph.
    image: /projects/project-slug/mockup.webp
    imageAlt: Mockup description
```

### Create a new project quickly

```bash
npm run new:project -- --title="Case Study Name" --status=draft
```

Optional flags:

- `--summary="One-line summary"`
- `--role="Product Designer"`
- `--timeframe="Month YYYY - Month YYYY"`

### Validate content

```bash
npm run validate:content
```

This catches missing required frontmatter and malformed `sections`.

## Routes

- `/` Myles 98 / Pocket 98 home + selected work
- `/play` Loose Parts source page
- `/work/[slug]` Reader Mode case study page

## Site settings

Update central settings in `src/lib/site-config.ts`:

- nav labels and links
- resume URL
- email address
- header kicker text

## Spotify Now Playing

The Now Playing program uses a curated rotation by default and can feature an active Spotify track when server credentials are configured. Playback remains paused until a visitor uses Spotify's embedded control.

See [`docs/spotify-now-playing-setup.md`](docs/spotify-now-playing-setup.md) for the server-only environment variables, minimum scope, and safe setup process.

## Keep code clean

- Reuse shared navigation and styles instead of duplicating route logic.
- Keep content in markdown or structured source data where practical.
- Add one utility before adding one-off logic.

### Julius case-study access

`/work/julius-design-system` requires a password via `/work/julius-unlock`. The server verifies a salted scrypt-derived token and stores it in an HttpOnly, SameSite session cookie (Secure in production). Only the token hash is committed; it cannot be replayed as a cookie. Changing the salt and verifier in `src/lib/julius-access.ts` also revokes existing sessions.

The proxy protects the page, React Server Component requests, and `/projects/julius-design-system/` assets and demos. These responses are private/no-store. Private images bypass the shared Next image optimizer, which rejects requests for them. Public portfolio previews remain visible. The case study is excluded from the sitemap and marked noindex.

This protects the deployed website, not copies in the public GitHub repository or its history.
