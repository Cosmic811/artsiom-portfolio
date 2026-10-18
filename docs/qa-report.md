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

The owner-supplied email and Telegram are connected. The actual resume PDF has not been supplied; its integration point is documented in the README and no download links to a missing file are shown.

## Recruiter-flow refinement — 18 October 2026

- Preserved the established composition, typefaces, body materials and palette. Updated the primary role to Fullstack Developer in both languages, page metadata, structured data and visual previews. Historical job titles and project names retain their original meaning.
- All five project summaries opened at scroll position zero, with the core stack and direct links available immediately. Projects without a verified live demo show GitHub only. Back restored the selected detail action and its scroll position.
- Verified the LCD heading as a real Back button: Language → Settings by click, then Settings → main by Enter, restoring the selected Settings item. MENU remains available.
- Contact exposes `mailto:wentygame@mail.ru` and `https://t.me/g1stav` before the profile links. Inspected link destinations without sending a message.
- Checked responsive layouts at 360×780, 390×844, 768×900, 1024×600 and 1440×900. Mobile widths show wheel/tap instructions, desktop widths show keyboard instructions, and neither language produced horizontal overflow. Coarse-pointer devices use the same touch hints through CSS.
- Instructions use 13px primary and 11.5px secondary text with darker green colors. The project summary and its core stack remain readable within the existing screen geometry.
- Production export and lint passed; the existing 21 interaction checks passed. No browser warnings or errors were observed in the local production export. Physical phone testing remains outstanding; viewport checks do not replace real hardware verification.

## Visual previews

[Desktop](previews/desktop.jpg) · [Mobile](previews/mobile.jpg)
