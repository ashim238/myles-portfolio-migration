# Myles Portfolio Migration

Lean Next.js portfolio with file-based CMS editing.

The current portfolio experience is **Myles 98** on desktop and **Pocket 98** on mobile, with shared **Reader Mode** case studies. See [`docs/MYLES_98_NAMING.md`](docs/MYLES_98_NAMING.md) for the canonical product language and the reason legacy `myles-97` code identifiers remain stable.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content editing (CMS-like workflow)

Project content lives in:

- `content/projects/navi.md`
- `content/projects/understandingfafsa.md`

Each file uses frontmatter + markdown body.

### Frontmatter fields

- `slug`: URL slug (`/work/[slug]`)
- `title`: project title
- `summary`: one-line preview for homepage
- `role`, `timeframe`
- `status`: `published` or `draft`
- `order`: sort order on homepage
- `tags`: optional labels
- `coverImage`: optional image URL for homepage card
- `sections`: optional structured blocks for case-study layout
- `highlightQuote`: optional pull-quote on project page
- `outcomeMetricLabel` + `outcomeMetricValue`: optional outcome callout

Use `status: draft` while writing. Switch to `published` when ready to show on the homepage.

`sections` example:

```yaml
sections:
  - title: Context
    body: Brief context paragraph.
    image: https://example.com/mockup.png
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

## Keep code clean

- Reuse shared navigation and styles instead of duplicating route logic.
- Keep content in markdown or structured source data where practical.
- Add one utility before adding one-off logic.
