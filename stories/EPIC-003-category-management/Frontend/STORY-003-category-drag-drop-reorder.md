# STORY-003: Implement Drag-and-Drop Category Reorder

**Epic:** EPIC-003 - Build Category Management  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want to drag and drop categories in the sidebar to reorder them,  
So that I can prioritize the categories I use most frequently at the top.

## Description
Implement drag-and-drop reordering of categories in the sidebar using a lightweight DnD library (e.g., `@dnd-kit/core`). The reorder uses optimistic UI — the new order is reflected immediately while a PATCH request updates `sort_order` values on the server. If the API call fails, the UI rolls back to the previous order with an error toast.

## Acceptance Criteria
```gherkin
GIVEN I see my categories in the sidebar
WHEN I drag "Work" from position 3 to position 1
THEN the categories visually reorder immediately (optimistic update)

GIVEN I have reordered categories
WHEN the PATCH API call succeeds
THEN the new order persists across page reloads

GIVEN I have reordered categories
WHEN the PATCH API call fails
THEN the categories revert to their previous order and I see an error toast

GIVEN I am using keyboard navigation
WHEN I focus a category and use arrow keys
THEN I can reorder the category using keyboard shortcuts (Alt+Up/Down)

GIVEN I am on mobile
WHEN I long-press and drag a category
THEN the category can be reordered with touch gestures
```

## Business Rules
- Sort order is stored as an integer field (`sort_order`) on each category
- Reorder updates all affected `sort_order` values in a single API call
- Default categories maintain their sort_order unless explicitly reordered

## Technical Notes
- Library: `@dnd-kit/core` + `@dnd-kit/sortable` (lightweight, accessible)
- PATCH /api/categories/reorder with body: `{ orderedIds: [uuid1, uuid2, ...] }`
- Optimistic update pattern: update React Query cache → API call → rollback on error
- Drag handle icon (⠿) for visual affordance
- Touch support: long-press delay of 200ms before drag activates

## Traceability
- **FSD Reference:** FR-012 — Drag-and-drop reorder
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-002 (Category CRUD Modal UI)
- **Blocks:** None
- **External Dependencies:** `@dnd-kit/core` library

## Definition of Done
- [ ] Drag-and-drop reorder works on desktop
- [ ] Touch-based reorder works on mobile
- [ ] Keyboard reorder works with Alt+arrow keys
- [ ] Optimistic UI with rollback on failure
- [ ] Sort order persists across page reloads
- [ ] Accessible drag handle with aria-label
- [ ] Code merged to main branch
