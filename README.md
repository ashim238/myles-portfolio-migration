# Myles Portfolio Migration

Lean Next.js portfolio with file-based CMS editing.

The current portfolio experience is **Myles 98** on desktop and **Pocket 98** on mobile, with shared **Reader Mode** case studies. See [`docs/MYLES_98_NAMING.md`](docs/MYLES_98_NAMING.md) for the canonical product language and the reason legacy `myles-97` code identifiers remain stable.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Fresh Greens on iOS

The Fresh Greens case study opens with an interactive mobile route screen. Search for Weeksville, switch between two saved routes, or expand the demo to view it at phone size. It works without a simulator or API keys. For an interview or a local review, the Validate chapter can also launch a native simulator session. Start the [dedicated iPhone simulator bridge](scripts/fresh-greens-simulator/README.md), then serve the portfolio on its allowed loopback address.

```sh
FRESH_GREENS_LOCAL_SIMULATOR=1 npm run dev -- --hostname 127.0.0.1 --port 4391
```

To package the account-free visitor edition on a Mac with Xcode, run the following from the portfolio checkout. Use a prepared Fresh Greens checkout with its native dependencies, CocoaPods and public Mapbox client token available. The output directory must be empty.

```sh
python3 scripts/fresh-greens-visitor/build.py /path/to/fresh-greens /path/to/visitor-output --revision 23ffdd0
```

The output includes a simulator `.app` and its compressed archive. For a hosted session, configure `FRESH_GREENS_APPETIZE_BUILD_ID` with the visitor build’s public Appetize ID when building the site. The website only needs the identifier. The recorded iOS drive is available in the Validate chapter in every configuration.

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
