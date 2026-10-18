# QA report

Verified on 17 October 2026 against the final static production export.

## Automated checks

- Strict TypeScript check: passed.
- ESLint: passed with no errors or warnings.
- Node interaction tests: 21 passed.
- Optimized Next.js production build and static export: passed.
- Production dependency audit: no reported vulnerabilities. Dependency inputs were unchanged during the visual refinement.

The interaction suite covers clockwise/counterclockwise angle wrapping, accumulated movement, mouse-button exclusion, touch-style pointer sequences, extra-finger rejection, cancellation, ordinary button clicks, sampled and unsampled center crossings, root behavior, menu wrapping, complete history restoration, About pagination, versioned/legacy persistence, blocked storage and reduced-motion startup policy.

## Browser verification

The static export was served separately from the development server and inspected in the app browser.

- All main sections and all five project entries opened.
- Each project opens its description, core stack and Demo/GitHub actions immediately. Technologies and Highlights remain nested inside the LCD.
- Skills and related-project links preserved their complete Back history.
- MENU, Previous, Next, Center and HOME controls worked.
- Clockwise and counterclockwise mouse drags moved selection in the expected directions.
- Keyboard navigation, Enter selection, Escape, focus restoration and internal detail scrolling worked.
- Startup appeared on a fresh local origin, Skip exposed the menu, and refresh did not replay startup.
- Russian language selection persisted across refresh. Both Latin and Cyrillic serif rendering were visually inspected.
- Initial navigation started at About Me with zero screen scroll.
- Native LCD scrollbar was suppressed; the custom indicator was visible for overflowing menus and its thumb followed actual scroll position. The menu remained natively scrollable.
- No interactive page navigation or portfolio sections existed outside the device.
- No production browser errors or hydration errors were observed.

## Responsive layout

Inspected at 360×780, 390×844, 768×900, 1024×768, 1280×800, 1440×900, 1024×600 and 844×390 landscape.

No horizontal overflow or identity/device overlap was found. Desktop layouts fit one viewport at the tested normal and 600px heights. The short landscape layout scrolls vertically. Physical buttons retain at least 44px hit areas, and all menu actions remain reachable through scrolling, wheel navigation and keyboard input.

## External destinations

The three supplied live demos and the GitHub profile returned HTTP 200. Repository/README access was verified through the connected GitHub tools. LinkedIn rejects automated HTTP requests with status 999; the owner-supplied URL is retained, so public profile availability could not be independently confirmed.

## Verification limits

Touch-like pointer sequences were executed against the gesture engine; physical touchscreen hardware, pen hardware and a dedicated screen reader were not available. Reduced-motion policy was tested in code and the CSS/media-query paths were inspected; browser-level media emulation was not available. Browser restart persistence relies on localStorage, with reconstruction covered by tests rather than a forced restart of the user's browser.

The original one-page resume is now included unchanged. Email has been corrected to the resume's `gwentygame@mail.ru`; Telegram, GitHub and LinkedIn match the supplied document. Physical touchscreen and dedicated screen-reader checks remain unavailable.

## Recruiter-flow refinement — 18 October 2026

- Preserved the established composition, typefaces, body materials and palette. Updated the primary role to Fullstack Developer in both languages, page metadata, structured data and visual previews. Historical job titles and project names retain their original meaning.
- All five project summaries opened at scroll position zero, with the core stack and direct links available immediately. Projects without a verified live demo show GitHub only. Back restored the selected detail action and its scroll position.
- Verified the LCD heading as a real Back button: Language → Settings by click, then Settings → main by Enter, restoring the selected Settings item. MENU remains available.
- Contact exposes `mailto:wentygame@mail.ru` and `https://t.me/g1stav` before the profile links. Inspected link destinations without sending a message.
- Checked responsive layouts at 360×780, 390×844, 768×900, 1024×600 and 1440×900. Mobile widths show wheel/tap instructions, desktop widths show keyboard instructions, and neither language produced horizontal overflow. Coarse-pointer devices use the same touch hints through CSS.
- Instructions use 13px primary and 11.5px secondary text with darker green colors. The project summary and its core stack remain readable within the existing screen geometry.
- Production export and lint passed; the existing 21 interaction checks passed. No browser warnings or errors were observed in the local production export. Physical phone testing remains outstanding; viewport checks do not replace real hardware verification.

## Experience, resume and contact finalization — 18 October 2026

- Read and visually inspected the owner's original English PDF: one page, 59,330 bytes. The original file, `public/resume.pdf`, exported `out/resume.pdf` and the PDF downloaded through the LCD action share SHA-256 `48e128c62c332898b86fd75afe6742206c836a1eaf9ca72946db84c40dd9b08b`.
- Experience now contains the requested role, confidential employer, employment dates, five technologies and three responsibilities in both languages. No metrics or confidential employer details were added. Only the Experience/Resume content and scoped Experience styles changed; wheel/navigation/startup logic and project descriptions remain unchanged.
- Executed browser checks against the production export at the GitHub Pages base path. Read both language versions and inspected desktop and 390×844 mobile layouts. Russian Experience overflow measured 452px of content in a 188px LCD; native End scrolling reached its 264px maximum and the existing custom indicator remained visible.
- Executed keyboard ArrowDown scrolling (0→55px) and a real pointer drag on the physical Click Wheel (55→136px) in Experience. Both moved the internal LCD. Physical touchscreen testing remains unavailable; existing native overflow and touch behavior were preserved.
- Resume shows the role and `English · PDF · 1 page` (localized in Russian), with exactly one download link at `/artsiom-portfolio/resume.pdf`. Clicked Download PDF and hashed the file saved by the browser. No missing-document message remains.
- Inspected all four Contact anchors: corrected `mailto:gwentygame@mail.ru`, Telegram, GitHub and LinkedIn. Telegram opened the `@g1stav` contact page, LinkedIn opened the owner's Artsiom Makarevich profile in the authenticated browser, and the GitHub profile was reachable. No email or message was sent. Anonymous LinkedIn access can still depend on LinkedIn's own access policies.
- Passed `tsc --noEmit`, `eslint .`, `node --experimental-strip-types --test --test-isolation=none tests/interaction.test.mjs` (21/21) and the production `next build` with the Pages base path. Checked 12 distinct local script/style/font/icon assets referenced by exported HTML: none missing. No browser errors or warnings were recorded.
- The website retains Artsiom Makarevich and the unchanged PDF retains Artem Makarevich. The transliteration decision remains with the owner.

## Visual previews

[Desktop](previews/desktop.jpg) · [Mobile](previews/mobile.jpg)
