# EPIC-009: Enable PWA & Offline Support

## Business Value Statement

Make Vora installable on any device and functional without internet connectivity, so users can check off their habits and view their dashboard even in low-connectivity situations — critical for daily morning routines when the user may not have signal.

## Description

This EPIC transforms the Next.js app into a Progressive Web Application. It includes: a web app manifest for install prompts, a service worker (via Workbox/`next-pwa`) for caching static assets and API responses, offline fallback pages, background sync for queued mutations, and a data sync resolution strategy (last-write-wins with server timestamps).

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-037             | PWA install capability         |
| FSD       | FR-038             | Offline habit viewing           |
| TDD       | Service Worker     | §2.2 Component Architecture    |
| TDD       | Caching Strategy   | §3.3 Service Worker cache      |
| TDD       | Offline sync       | §10 Risks — sync conflicts     |

## Scope Definition

| In Scope                                               | Out of Scope                         |
| ------------------------------------------------------ | ------------------------------------ |
| Web app manifest (name, icons, theme_color, start_url)   | Push notifications                   |
| Service worker via `next-pwa` or Workbox                  | Background sync for mood check-ins   |
| Static asset caching (CSS, JS, fonts, images)              | Full offline task creation           |
| API response caching (network-first for API calls)          | Offline analytics computation        |
| Offline fallback page with mascot                            | Cross-device data sync              |
| Cache versioning and update strategy                          | —                                   |
| "Add to Home Screen" install prompt                            | —                                   |
| Cached habits list viewable offline                             | —                                   |
| Background sync for queued habit completions                     | —                                   |
| Lighthouse PWA audit ≥ 90                                         | —                                   |

## High-Level Acceptance Criteria

- [ ] `manifest.json` includes app name, short_name, icons (192×192, 512×512), theme_color (#ED9DFF), background_color (#FFFFFF)
- [ ] App is installable from Chrome/Edge "Add to Home Screen" prompt
- [ ] Service worker caches all static assets on first load
- [ ] Returning to app offline shows cached Home Dashboard with last-known habits
- [ ] Habit completions made offline are queued and synced when back online
- [ ] Sync conflicts resolved via last-write-wins (server timestamp)
- [ ] Cache is invalidated on new deployment (versioned cache keys)
- [ ] Offline fallback page shows mascot with "You're offline — we'll sync when you're back!"
- [ ] Lighthouse PWA score ≥ 90
- [ ] Service worker updates prompt user to refresh

## Dependencies

- **Prerequisite EPICs:** EPIC-001 (project setup), EPIC-008 (theme colors for manifest)
- **External Dependencies:** `next-pwa` or `@serwist/next` library
- **Technical Prerequisites:** App shell functional with at least Home Dashboard

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Medium (service worker + API caching)
- **Estimated Story Count:** 5–7

## Risks & Assumptions

**Assumptions:**
- Offline support is limited to viewing cached data and queuing completions
- Background sync uses the Background Sync API (Chrome only; graceful degradation elsewhere)
- Last-write-wins is acceptable for single-user, single-device primary use case
- PWA install prompt is handled by the browser natively

**Risks:**
- Service worker caching can cause stale data issues — versioned cache keys mitigate
- Background sync is not supported in Safari/Firefox — need fallback (sync on app focus)
- `next-pwa` may have compatibility issues with App Router — alternative: `@serwist/next`

## Related EPICs

- **Depends On:** EPIC-001, EPIC-008
- **Blocks:** None
- **Related:** EPIC-004 (habits are the primary offline-viewable data)
