# STORY-004: Implement Background Sync Queue

**Epic:** EPIC-009 - Enable PWA & Offline Support  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want my actions (habit completions, task updates) to queue when offline and sync automatically when I reconnect,  
So that I never lose progress even without an internet connection.

## Description
Implement a background sync queue using the Background Sync API (with IndexedDB fallback). When the user performs a mutation while offline (e.g., completing a habit), the action is stored in IndexedDB. When connectivity returns, the service worker replays queued actions in order. Conflicts use a "last write wins" resolution strategy.

## Acceptance Criteria
```gherkin
GIVEN I complete a habit while offline
WHEN the API call fails
THEN the completion is queued in IndexedDB and an optimistic UI update shows

GIVEN I reconnect to the network
WHEN the sync event fires
THEN all queued actions are replayed to the server in order

GIVEN two offline completions queue and one fails during sync
WHEN the sync processes
THEN the failed action retries (up to 3 times) and the successful one persists

GIVEN a conflict occurs (same habit completed on another device)
WHEN the sync replays
THEN "last write wins" — the most recent timestamp takes precedence

GIVEN the queue has 5 pending items
WHEN I view the offline indicator
THEN I see "5 pending syncs" badge

GIVEN all queued items sync successfully
WHEN the sync completes
THEN the pending count resets to 0 and a success toast appears
```

## Business Rules
- **BR-143:** Offline mutations queued in IndexedDB
- **BR-144:** Conflict resolution: last-write-wins (timestamp comparison)
- Queued actions replayed in FIFO order
- Max retry: 3 attempts per action, then logged as failed

## Technical Notes
- Background Sync API: `self.registration.sync.register('sync-mutations')` in service worker
- IndexedDB store: `vora-sync-queue` with schema: `{ id, url, method, body, timestamp, retryCount }`
- Replay: fetch each queued request in order, delete from IndexedDB on success
- Fallback: if Background Sync API not supported, use `navigator.onLine` + `online` event
- Optimistic UI: use React Query's `onMutate` for immediate UI feedback
- Conflict resolution: server-side — if server has a newer `updatedAt`, return 409; client discards
- Pending count: broadcast from service worker via `postMessage`

## Traceability
- **FSD Reference:** FR-036 (Background Sync), BR-143–BR-144
- **TDD Reference:** §5.3 PWA Implementation, §5.4 Conflict Resolution
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-002 (Service Worker)
- **Blocks:** None
- **External Dependencies:** IndexedDB (browser API)

## Definition of Done
- [ ] Offline mutations queued in IndexedDB
- [ ] Background Sync replays queue on reconnection
- [ ] FIFO order maintained
- [ ] Retry logic (3 attempts) works
- [ ] Last-write-wins conflict resolution
- [ ] Pending sync count displayed
- [ ] Success toast on complete sync
- [ ] Fallback for browsers without Background Sync API
- [ ] Code merged to main branch
