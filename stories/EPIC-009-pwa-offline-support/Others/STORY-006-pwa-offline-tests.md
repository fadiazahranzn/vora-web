# STORY-006: Write PWA & Offline Tests

**Epic:** EPIC-009 - Enable PWA & Offline Support  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want tests for PWA features including manifest, service worker, offline fallback, and sync queue,  
So that PWA functionality is verified and regressions are caught.

## Description
Write tests covering manifest validation, service worker registration and cache behavior, offline fallback rendering, and background sync queue operations. Include both unit tests and integration/E2E tests using simulated offline conditions.

## Acceptance Criteria
```gherkin
GIVEN the manifest test runs
WHEN validating manifest.json
THEN all required fields are present and valid

GIVEN the service worker tests run
WHEN testing cache strategies
THEN Cache First, Network First, and Stale While Revalidate behave correctly

GIVEN the offline tests run
WHEN simulating network failure
THEN the fallback page renders correctly

GIVEN the sync queue tests run
WHEN queueing and replaying actions
THEN FIFO order, retry logic, and conflict resolution work correctly
```

## Technical Notes
- Manifest: JSON schema validation test
- Service worker: Workbox testing utilities or custom mock
- Offline: use `page.setOfflineMode(true)` in Playwright/Puppeteer
- Sync queue: unit test IndexedDB operations with fake-indexeddb
- E2E: Playwright for full offline flow testing

## Traceability
- **FSD Reference:** FR-035, FR-036, BR-133–BR-144
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-002 (Service Worker)
- **Blocks:** None
- **External Dependencies:** Testing framework, fake-indexeddb

## Definition of Done
- [ ] Manifest validation test passing
- [ ] Service worker caching strategy tests passing
- [ ] Offline fallback rendering test passing
- [ ] Sync queue unit tests passing
- [ ] E2E offline flow test passing
- [ ] All tests in CI
- [ ] Code merged to main branch
