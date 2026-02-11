# STORY-003: Build Offline Fallback Page

**Epic:** EPIC-009 - Enable PWA & Offline Support  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see a friendly offline page when I lose connectivity,  
So that I understand the situation and know my data will sync when I'm back online.

## Description
Build an offline fallback page that the service worker serves when a navigation request fails and no cached version is available. The page shows the mascot, an "You're offline" message, a brief explanation, and a "Retry" button. It also displays any pending sync items count. The page is pre-cached during service worker install.

## Acceptance Criteria
```gherkin
GIVEN I navigate to a page while offline
WHEN the cache has no version of that page
THEN I see the offline fallback page with mascot

GIVEN the offline page loads
WHEN I view the content
THEN I see "You're offline" heading, an emoji/mascot, and "Don't worry, your progress is saved!"

GIVEN I click "Retry"
WHEN the network is available
THEN the page reloads and shows the intended content

GIVEN I click "Retry"
WHEN the network is still offline
THEN I remain on the offline page

GIVEN I have 3 pending sync items
WHEN the offline page loads
THEN I see "3 actions pending sync" indicator

GIVEN the offline fallback page
WHEN the service worker installs
THEN the page is included in the pre-cache list
```

## Business Rules
- Offline page pre-cached during SW install (always available)
- Mascot shows "concerned" expression
- Pending sync count from IndexedDB or service worker messages
- Retry button uses `window.location.reload()`

## Technical Notes
- File: `public/offline.html` (static, pre-cached)
- Or: `src/app/offline/page.tsx` (pre-rendered and cached)
- Service worker fallback: in `fetch` handler → `catch` → respond with offline page for navigation requests
- Pending sync count: `navigator.serviceWorker.controller.postMessage({ type: 'GET_PENDING_COUNT' })`
- Online detection: `navigator.onLine` + `window.addEventListener('online', reload)`
- Auto-reload on reconnection: when `online` event fires, automatically try to reload

## Traceability
- **FSD Reference:** FR-036 (Offline Fallback), BR-142
- **Wireframe Reference:** Screen 10 — Offline Page
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-002 (Service Worker)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Offline fallback page renders when offline
- [ ] Mascot with concerned expression shown
- [ ] "You're offline" message and explanation displayed
- [ ] Retry button reloads the page
- [ ] Pending sync count displayed
- [ ] Page pre-cached by service worker
- [ ] Auto-reload on reconnection
- [ ] Code merged to main branch
