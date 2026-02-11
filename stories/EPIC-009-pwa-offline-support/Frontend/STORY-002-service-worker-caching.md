# STORY-002: Implement Service Worker & Caching Strategy

**Epic:** EPIC-009 - Enable PWA & Offline Support  
**Role:** Frontend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a service worker with a comprehensive caching strategy,  
So that the app loads instantly and works offline with cached assets and data.

## Description
Implement a custom service worker (or use `next-pwa` / Workbox) with the following caching strategies: **Cache First** for static assets (JS, CSS, images, fonts), **Network First** for API responses (with fallback to cache), and **Stale While Revalidate** for HTML pages. Pre-cache the app shell (index, critical CSS, key routes). Implement cache versioning and automatic cleanup of stale caches.

## Acceptance Criteria
```gherkin
GIVEN the app loads for the first time
WHEN the service worker installs
THEN critical assets (app shell, CSS, fonts) are pre-cached

GIVEN I visit a page and the network is available
WHEN the page loads
THEN static assets are served from cache (Cache First)

GIVEN I visit a page while offline
WHEN the service worker intercepts the request
THEN previously cached pages and API data are served

GIVEN I make an API request while online
WHEN the response is received
THEN the response is cached and the fresh data is shown (Network First)

GIVEN a new version of the app is deployed
WHEN the service worker updates
THEN old caches are cleaned up and new assets are cached

GIVEN the user is on a slow connection
WHEN loading static assets
THEN cached versions are served instantly (Cache First)
```

## Business Rules
- **BR-137:** Cache First: static assets (JS, CSS, images, fonts)
- **BR-138:** Network First: API responses (fallback to cached data)
- **BR-139:** Stale While Revalidate: HTML pages
- **BR-140:** Pre-cache app shell on install
- **BR-141:** Cache versioning with automatic stale cache cleanup

## Technical Notes
- Tooling: `next-pwa` (Workbox-based) or custom service worker at `public/sw.js`
- Pre-cache: `/_next/static/*`, `/fonts/*`, `/icons/*`, key route HTML
- Runtime caching rules:
  - `/api/*` → NetworkFirst with 30-second timeout, 24-hour cache max age
  - `/_next/static/*` → CacheFirst with 30-day max age
  - `.(png|jpg|svg|ico)$` → CacheFirst with 7-day max age
  - Navigation requests → StaleWhileRevalidate
- Cache versioning: `cache-v{version}` naming, `activate` event cleans old caches
- Max cache entries: 100 API responses, 200 static assets
- Registration: `navigator.serviceWorker.register('/sw.js')` in `src/app/layout.tsx`

## Traceability
- **FSD Reference:** FR-035 (Service Worker & Caching), BR-137–BR-141
- **TDD Reference:** §5.3 PWA Implementation
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-001 (Web App Manifest)
- **Blocks:** STORY-003, STORY-004, STORY-006
- **External Dependencies:** next-pwa or Workbox

## Definition of Done
- [ ] Service worker registered and activates
- [ ] Static assets cached with Cache First
- [ ] API responses cached with Network First
- [ ] App shell pre-cached on install
- [ ] Offline navigation works for cached pages
- [ ] Cache versioning and stale cleanup on update
- [ ] Cache size limits enforced
- [ ] Works in production build
- [ ] Code merged to main branch
