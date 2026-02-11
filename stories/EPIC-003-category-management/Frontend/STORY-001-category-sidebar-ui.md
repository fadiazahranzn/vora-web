# STORY-001: Build Category Sidebar & Mobile Selector UI

**Epic:** EPIC-003 - Build Category Management  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see my categories displayed in a sidebar on desktop and as a selector modal on mobile,  
So that I can quickly filter my habits by category and see how my habits are organized.

## Description
Implement the category sidebar component that persists on the left side for desktop viewports (≥1024px) and renders as a slide-out drawer on mobile (<1024px). Each category row displays the icon emoji, name, and active habit count. An "All" option is the default filter showing all habits. Selecting a category filters the habit list to that category. The component consumes the GET /api/categories endpoint.

## Acceptance Criteria
```gherkin
GIVEN I am on the Home Dashboard on desktop (≥1024px)
WHEN the page loads
THEN I see a persistent sidebar listing all my categories with icon, name, and habit count

GIVEN I am on the Home Dashboard on mobile (<1024px)
WHEN I tap the category filter button
THEN a slide-out drawer appears from the left listing all my categories

GIVEN the category list is displayed
WHEN I click/tap "All"
THEN all habits for the selected date are shown (default behavior)

GIVEN the category list is displayed
WHEN I click/tap a specific category (e.g., "Health")
THEN only habits assigned to "Health" are shown in the habit list

GIVEN I have 3 habits in "Health" and 2 in "Work"
WHEN I view the sidebar
THEN "Health" shows count (3) and "Work" shows count (2)

GIVEN I am on mobile and the drawer is open
WHEN I click the overlay or press Escape
THEN the drawer closes
```

## Business Rules
- **BR-041:** Sidebar lists all predefined categories plus user-created categories
- **BR-042:** Each category displays a count of active (non-deleted) habits
- **BR-043:** "All" option is the default, showing all habits
- **BR-044:** On mobile (<768px), sidebar renders as a slide-out drawer
- **BR-045:** On desktop (≥1024px), sidebar is persistently visible

## Technical Notes
- Desktop sidebar is part of the layout shell (EPIC-008)
- Mobile drawer uses the Modal/BottomSheet component from design system
- Category data fetched via React Query: `useQuery(['categories'])`
- Filter state managed via URL search params or React context
- Accessibility: drawer uses `role="dialog"`, focus trapping, `aria-label`

## Traceability
- **FSD Reference:** FR-012 (Category Sidebar/Drawer), BR-041–BR-045
- **Wireframe Reference:** Screen 8 — Category Sidebar
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-004 (Category CRUD API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Layout shell, Modal component)

## Definition of Done
- [ ] Sidebar renders on desktop with all categories
- [ ] Drawer renders on mobile with all categories
- [ ] Category filter updates habit list correctly
- [ ] Habit counts are accurate per category
- [ ] "All" is default and shows all habits
- [ ] Keyboard and screen reader accessible
- [ ] Code merged to main branch
