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
- Overview, Technologies and Highlights were read for every project.
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

The actual resume PDF, email and Telegram details have not been supplied. Their explicit integration points are documented in the README.

## Visual previews

[Desktop](previews/desktop.jpg) · [Mobile](previews/mobile.jpg)
