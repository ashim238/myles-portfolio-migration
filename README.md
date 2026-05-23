# Myles Portfolio Migration

Lean Next.js portfolio with file-based CMS editing.

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

- `/` home + selected work
- `/play` unserious work page
- `/work/[slug]` case study page

## Site settings

Update central settings in `src/lib/site-config.ts`:

- nav labels and links
- resume URL
- email address
- header kicker text

## Keep code clean

- Reuse `SiteNav` and shared styles in `globals.css`.
- Keep content in markdown, not hardcoded JSX blocks.
- Add one utility before adding one-off logic.
