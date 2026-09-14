# Tam Kok Yan — personal site

Personal résumé site for **Tam Kok Yan**, NetSuite Technical Consultant at BlackOak Consulting, plus demo pages for client work. Built with Next.js, React and TypeScript, and hosted on GitHub Pages.

**Live site:** https://tamky03.github.io/

## Pages

| Page | Link | Source |
| --- | --- | --- |
| Main site (interactive) | https://tamky03.github.io/ | `src/app/page.tsx` |
| Standard portfolio | https://tamky03.github.io/standard/ | `src/app/standard/page.tsx` |
| Lite résumé (print-ready) | https://tamky03.github.io/lite/ | `src/app/lite/page.tsx` |
| Compare all versions | https://tamky03.github.io/versions/ | `src/app/versions/page.tsx` |
| Hawker demo — Advanced (order builder) | https://tamky03.github.io/demo/hawker/ | `src/app/demo/hawker/page.tsx` |
| Hawker demo — Intermediate | https://tamky03.github.io/demo/hawker/intermediate/ | `src/app/demo/hawker/intermediate/page.tsx` |
| Hawker demo — Simple (link in bio) | https://tamky03.github.io/demo/hawker/simple/ | `src/app/demo/hawker/simple/page.tsx` |

Each folder under `src/app/` becomes a web address: `src/app/demo/hawker/page.tsx` is served at `/demo/hawker/`.

The old addresses `/v1-lite/`, `/v2-standard/` and `/v3-interactive/` redirect to the new pages.

## Editing content

You rarely need to touch the page code. The content lives in two files:

- **`src/content/profile.ts`** — the résumé: job title, experience, education, skills and contact links. All three résumé versions read from it.
- **`src/content/hawker.ts`** — the hawker demo: stall name, menu, hours, address, GrabFood link and WhatsApp number.

Link previews (title, description, image) are set in `src/content/site.ts`. The preview image is `public/assets/og-image.png`.

## Hawker demo: GrabFood and WhatsApp buttons

The demo shows how an F&B stall can send customers straight to ordering. Like the résumé, it comes in three versions that share one content file:

| Version | Best for | Features |
| --- | --- | --- |
| **Simple** | Instagram / TikTok bio, QR sticker at the stall | One card: GrabFood, WhatsApp and directions buttons, short price list |
| **Intermediate** | A basic website for the stall | Hero, menu highlights, drinks, Find us, order bar on phones |
| **Advanced** | Stalls that take WhatsApp orders | Order builder (+ / − per item, running total, pick-up or delivery, notes) that sends an itemised WhatsApp message; live "Open now" status in Malaysia time; EN / 中文; menu filters; share button |

The Advanced order builder keeps the customer's order and language in their browser, so a reload doesn't lose it. The open/closed status uses `openingHours` in `src/content/hawker.ts`.

All versions use these buttons:

- **Order on GrabFood** uses the stall's GrabFood share link (`https://r.grab.com/g/...`). On phones it opens the Grab app at the stall; on desktop it opens the GrabFood web menu. Get it from the Grab app: open the store, then tap **Share**.
- **WhatsApp us** opens a chat with a pre-filled message. Enter the number in any Malaysian format (`011-2800 1201`, `+60 11-2800 1201`); it is converted to the `wa.me` format automatically. If the number is empty, the button shows "Number not set yet" instead of a broken link.
- On phones, both buttons also sit in a bar fixed to the bottom of the screen.

To make a page for another stall, copy `src/content/hawker.ts` and change the values. The buttons are reusable components in `src/components/order/OrderButtons.tsx`.

The demo uses a real stall's public GrabFood listing as sample content. It carries a "demo page" banner and is hidden from search engines. Get the owner's permission before presenting it as client work.

## Project structure

```
src/
  app/                 Routes (one folder per page) and the root layout
  components/
    interactive/       Main site (animated hero, command palette, timeline)
    standard/          Standard portfolio
    lite/              Lite résumé
    hawker/            Hawker demo: Simple, Intermediate and advanced/ versions
    order/             Reusable GrabFood / WhatsApp buttons
    VersionBar.tsx     Version switcher shown on the résumé and demo pages
  content/             Editable content (profile, hawker, site metadata)
  lib/                 Helpers: WhatsApp links, order messages, opening hours
public/                Static files: photo, preview image, favicon
.github/workflows/     Build and deploy to GitHub Pages
```

Styles are CSS Modules (`*.module.css`) next to each component, so each version keeps its own design without clashing.

## Running locally

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install        # first time only
npm run dev        # start the dev server at http://localhost:3000
```

Other commands:

```bash
npm run typecheck  # check TypeScript types
npm run build      # build the static site into ./out
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which type-checks, builds the static site (`next build` with `output: "export"`), and publishes `./out` to GitHub Pages. The site updates about a minute after the push; progress is in the repo's **Actions** tab.

Browsers may cache the old version for a few minutes. Press **Ctrl+F5** to force a refresh.

## Privacy

The original résumé PDFs in `resource/` are git-ignored and never published, because they contain a home address and a reference's contact details.
