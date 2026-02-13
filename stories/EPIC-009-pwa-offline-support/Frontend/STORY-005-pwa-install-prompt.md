# STORY-005: Implement PWA Install Prompt

**Epic:** EPIC-009 - Enable PWA & Offline Support  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want to be prompted to install Vora as an app on my device,  
So that I can access it quickly from my home screen without remembering the URL.

## Description
Implement a custom PWA install prompt that appears after the user has used the app for 2+ sessions. The prompt intercepts the `beforeinstallprompt` event and shows a custom UI instead of the browser default. The user can accept, dismiss, or "don't show again" (stored in localStorage). After install, a success toast confirms the installation.

## Acceptance Criteria
```gherkin
GIVEN I have visited the app 2+ times
WHEN the beforeinstallprompt event fires
THEN I see a custom install banner with "Install Vora" CTA

GIVEN the install banner appears
WHEN I click "Install"
THEN the browser's native install dialog appears

GIVEN I complete the install
WHEN the app is installed
THEN a success toast says "Vora installed! Access it from your home screen."

GIVEN the install banner appears
WHEN I click "Not now"
THEN the banner dismisses and won't appear again for 7 days

GIVEN I click "Don't show again"
WHEN the preference is stored
THEN the banner never appears again (localStorage flag)

GIVEN the app is already installed
WHEN I visit the web version
THEN the install prompt does not appear
```

## Business Rules
- Prompt after 2+ sessions (stored in localStorage)
- "Not now" delays 7 days
- "Don't show again" permanent dismiss
- Banner doesn't show if already installed

## Technical Notes
- Event: `beforeinstallprompt` → store event, show custom UI
- Custom banner: bottom sheet or floating card with app icon + CTA
- Session count: increment in localStorage on each visit
- Install detection: `window.matchMedia('(display-mode: standalone)')` or `navigator.standalone`
- 7-day delay: store dismiss timestamp in localStorage, compare on next visit
- iOS: `beforeinstallprompt` not supported — show manual instruction banner

## Traceability
- **FSD Reference:** FR-035 (PWA Install)
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-001 (Manifest — required for install prompt)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [x] Custom install banner appears after 2+ sessions
- [x] "Install" triggers native dialog
- [x] Success toast on install
- [x] "Not now" delays 7 days
- [x] "Don't show again" permanently dismisses
- [x] Banner doesn't show if already installed
- [x] iOS fallback instructions displayed
- [x] Code merged to main branch
