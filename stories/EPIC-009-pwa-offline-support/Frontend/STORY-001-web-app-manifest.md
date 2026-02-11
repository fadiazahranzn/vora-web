# STORY-001: Configure Web App Manifest

**Epic:** EPIC-009 - Enable PWA & Offline Support  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to install Vora as a standalone app on my device,  
So that it appears on my home screen with a native-like experience.

## Description
Create the `manifest.json` (or `manifest.webmanifest`) file with all required PWA fields: name, short_name, theme_color, background_color, display mode, start_url, icons, and scope. Link the manifest in the HTML `<head>`. Generate icons in all required sizes (192px, 512px, maskable). Set display mode to `standalone` for a native-like experience.

## Acceptance Criteria
```gherkin
GIVEN I visit the Vora web app
WHEN I inspect the HTML head
THEN I see <link rel="manifest" href="/manifest.json">

GIVEN I inspect the manifest
WHEN I check required fields
THEN name="Vora", short_name="Vora", display="standalone", start_url="/", theme_color and background_color are set

GIVEN I inspect the manifest icons
WHEN I check the array
THEN icons include 192x192 (purpose: any), 512x512 (purpose: any), and 512x512 (purpose: maskable)

GIVEN I access the app on Chrome Android
WHEN the manifest is valid
THEN the "Add to Home Screen" banner can appear (STORY-005)

GIVEN I install the app to my home screen
WHEN I launch it
THEN it opens in standalone mode without browser URL bar
```

## Business Rules
- **BR-133:** Manifest must include name, short_name, icons, start_url, display, theme_color, background_color
- **BR-134:** Display mode: standalone
- **BR-135:** Icons: at least 192px and 512px, plus maskable
- **BR-136:** Theme color matches brand primary (#7C5CFC)

## Technical Notes
- File: `public/manifest.json` (or `public/manifest.webmanifest`)
- Link in `src/app/layout.tsx` head: `<link rel="manifest" href="/manifest.json">`
- Icons: generate from master SVG using PWA asset generator
- Also include `<meta name="theme-color" content="#7C5CFC">` in head
- Apple touch icon: `<link rel="apple-touch-icon" href="/icons/icon-192x192.png">`
- Scope: `/`

## Traceability
- **FSD Reference:** FR-035 (PWA — Web App Manifest), BR-133–BR-136
- **TDD Reference:** §5.3 PWA Implementation
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** EPIC-001 (Next.js project setup)
- **Blocks:** STORY-002, STORY-005
- **External Dependencies:** None

## Definition of Done
- [ ] manifest.json created with all required fields
- [ ] Linked in HTML head
- [ ] Icons in 192px, 512px, and maskable format
- [ ] Theme color and background color set
- [ ] Display mode is standalone
- [ ] PWA audit passes in Chrome DevTools
- [ ] Apple touch icon configured
- [ ] Code merged to main branch
