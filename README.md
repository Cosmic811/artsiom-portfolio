# Artsiom Makarevich — Pocket portfolio

A single-device portfolio inspired by early-2000s portable electronics. Next.js App Router, React, strict TypeScript, original CSS materials and lightweight SVG icons. Every section, language setting and external action lives inside the LCD.

## Run

Node.js 24 recommended.

```sh
npm ci
npm run dev
```

`npm run build` generates `out/`. Deploy that directory to a static host, or connect the project directly to Vercel. No backend, database, runtime keys or external font service is required.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The test suite exercises wheel gestures, pointer cancellation and dead zones, navigation history, pagination, persistent preferences, legacy preference migration and reduced-motion startup policy. See [the QA report](docs/qa-report.md) for browser verification and its limits.

## Architecture

- `src/content/portfolio.ts`: repository-backed project data and typed optional contact configuration.
- `src/content/i18n.ts`: matching typed English/Russian dictionaries.
- `src/hooks/useNavigation.ts`: centralized view state and complete history snapshots, including selection, project, skill, page and scroll position.
- `src/lib/menu.ts`: typed menu registry and related-project associations.
- `src/lib/wheel.ts`: pointer-independent angular gesture engine, center-crossing rejection and click suppression.
- `src/hooks/useClickWheel.ts`: React Pointer Events adapter with capture after drag intent.
- `src/lib/preferences.ts`: versioned storage and graceful storage-failure handling.
- `src/components/Device.tsx`: physical shell, screen, focus restoration, controls and custom scroll indicator.
- `src/components/ScreenContent.tsx`: nested menus and short readable content views.
- `src/app/globals.css`: responsive geometry, studio lighting, material layers and reduced-motion styles.

The name uses self-hosted EB Garamond Medium. Arial provides the utilitarian device and supporting typography. The font's license is included in `src/assets/fonts/`.

## Controls

| Control                      | Behavior                                              |
| ---------------------------- | ----------------------------------------------------- |
| Rotate wheel                 | Navigate menus; scroll text views                     |
| MENU / Escape / Backspace    | Return and restore the previous selection             |
| LCD title with back arrow    | Return to the previous screen by click or keyboard    |
| Center / Enter / Space       | Select the highlighted item                           |
| Previous / Next              | Navigate; change About pages; scroll other text views |
| Printed HOME / keyboard Home | Return to the first item of the main menu             |
| Tab                          | Reach real menu buttons, links and physical controls  |

Up/Down navigate or scroll. Left/Right also change About pages. Keyboard handling is scoped to the device and excludes editable/native fields. The LCD remains directly clickable, touch-scrollable and scrollable with a mouse wheel. Its custom scrolling indicator replaces the browser scrollbar without replacing native scrolling behavior.

Small screens and coarse-pointer devices show wheel/tap instructions. Desktop pointers keep the keyboard shortcut guide. These hints do not change keyboard availability on any device.

## Internal hierarchy

- Projects → project opens its description, core stack and direct Demo / GitHub links immediately. Full Technologies and Highlights remain one step away inside the LCD.
- Skills → category → skill → related projects or supporting GitHub work.
- Settings → Language → English / Русский.
- About uses two short pages. Experience, Contact and Resume remain inside the device.

No external page sections, project grids, contact panels, modal case studies, playlists or audio are included.

## Startup and preferences

`am:intro:v1=seen` prevents startup from replaying on refresh or later visits. `am:language:v1` stores the selected language. Legacy keys are read during migration, so prior visitors are not forced through the intro again. Reduced motion skips startup; Skip is available during the approximately 1.9-second sequence. A pre-paint script prevents a first-visit menu flash without changing the initial React render. Storage denial never prevents navigation; persistence is naturally unavailable in that case.

## Resume and contact integration

The owner's original one-page English resume is included unchanged at `public/resume.pdf`, with `contact.resume=/resume.pdf`. The LCD offers one Download PDF action at `/artsiom-portfolio/resume.pdf` on GitHub Pages. The screen identifies the role, language, format and page count without repeating the download label.

Email (`gwentygame@mail.ru`) and Telegram are available first in Contact, followed by GitHub and LinkedIn. These values are checked against the supplied resume and configured in the same object. [Content evidence](docs/content-evidence.md) documents the public repository sources and project boundaries.

Experience presents the resume-backed Full Stack Developer (Frontend-focused) role, confidential employer, July 2025–August 2026 period, five main technologies and three responsibilities in English and Russian. It uses the existing LCD scrolling and does not add unsupported achievements.

The website retains **Artsiom Makarevich**; the supplied PDF retains **Artem Makarevich**. This transliteration difference is intentionally left for the owner to resolve; neither document has been silently renamed.

## Deployment

Source: [Cosmic811/artsiom-portfolio](https://github.com/Cosmic811/artsiom-portfolio).

Website: [cosmic811.github.io/artsiom-portfolio](https://cosmic811.github.io/artsiom-portfolio/).

`.github/workflows/pages.yml` checks, builds and publishes every push to `main` using GitHub Actions. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source. No hosting account, tokens or paid service is needed.

The workflow sets `NEXT_PUBLIC_BASE_PATH=/artsiom-portfolio` and `NEXT_PUBLIC_SITE_URL=https://cosmic811.github.io/artsiom-portfolio/`. These values are compiled into the export. If you rename the repository, update both values. For a custom domain or a host serving at the root, leave the base path empty and set the site URL to that domain. Canonical metadata, structured data, social images, the icon and optional resume links use this configuration. The favicon, licensed font and Open Graph preview are local assets.
