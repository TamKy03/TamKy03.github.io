# Tam Kok Yan — portfolio

Personal portfolio for **Tam Kok Yan**: NetSuite technical consultant at BlackOak Consulting, data
science graduate, and web developer. Built with Next.js, React and TypeScript, exported as static
files and hosted on GitHub Pages.

**Live:** https://tamky03.github.io/

## The site

The page is set as a record: a mono field id in the left rail, prose hanging right of it, figures
tabular in the right column. Two grounds only — paper for the day, near-black for the work that
runs unattended.

| Section | What it holds |
| --- | --- |
| Hero | Name, portrait, a statement table, and a reconciliation: what comes in against what goes out |
| The record | Work, study and campus history as record rows, filterable |
| Craft | Motion, interaction, data & AI, NetSuite and web — each one a record you open, on the night ground |
| Say hello | Copy-email button, LinkedIn, and a contact form that opens your mail app |

## Interaction, built from the platform

Nothing here is a JavaScript widget:

- **Reconciliation** — a radio group and `:checked` sibling selectors. Choosing an input re-weights
  the output it produces. No state, no handler.
- **The overnight batch counter** — `@property --tally` typed as an `<integer>`, animated on a
  `view()` timeline and printed with a CSS counter. The browser animates the number; nothing
  measures the page or increments anything in script.
- **Craft pieces** — native `<details>`, with `:has()` marking a record that has been opened.
- **Filtering the record** — the View Transitions API tweens the rows the browser already has.
- **Command palette** — `Ctrl`/`Cmd` + `K`, with full keyboard navigation.

Older addresses (`/standard/`, `/lite/`, `/versions/`, `/v1-lite/`, `/v2-standard/`,
`/v3-interactive/`, `/demo/hawker/…`) redirect to the home page so previously shared links keep
working.

## Animation: declared, not calculated

Motion is written in CSS and run by the browser's compositor. There is no scroll listener, no
`IntersectionObserver`, no `requestAnimationFrame` loop and no element measuring anywhere in the
page:

- `animation-timeline: scroll(root block)` drives the reading progress rule
- `animation-timeline: view()` with `animation-range` reveals rows as they enter the viewport
- `@property` types the custom properties that are animated, including the batch counter
- The View Transitions API animates the record list when a filter changes
  (`document.startViewTransition` + `flushSync`)
- `@supports not (animation-timeline: view())` hands older browsers the finished state
- `prefers-reduced-motion: reduce` turns the whole system off

## Editing content

Page code rarely needs touching. The content lives in three files:

- **`src/content/profile.ts`** — résumé: role, experience, education, skills, contact links
- **`src/content/craft.ts`** — the Craft section: copy and code samples
- **`src/content/site.ts`** — titles, descriptions and link-preview metadata

The preview image is `public/assets/og-image.png`; the portrait is `public/assets/photo.png`.

## Project structure

```
src/
  app/                 Routes and the root layout; every folder is a URL
  components/
    portfolio/         The page: PortfolioSite, CommandPalette, styles
    Redirect.tsx       Keeps old URLs working
    hooks.ts           Small hooks (reduced-motion preference)
  content/             Editable content
  lib/                 Helpers (class names, month maths)
public/                Static files: portrait, preview image, favicon
.github/workflows/     Build and deploy to GitHub Pages
```

## Running locally

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install        # first time only
npm run dev        # http://localhost:3000
```

```bash
npm run typecheck  # TypeScript
npm run build      # static site into ./out
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: type check, build (`output: "export"`), then
publish `./out` to GitHub Pages. The site updates about a minute after the push. Press **Ctrl+F5**
if a browser serves you a cached copy.

## Privacy

The résumé PDFs in `resource/` are git-ignored and never published — they contain a home address
and a reference's contact details.
