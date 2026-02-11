# STORY-003: Implement Responsive Layout Shell

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want a consistent, responsive layout with persistent navigation,  
So that I can easily navigate between Dashboard, Tasks, Analytics, and Profile across all devices.

## Description
Build the authenticated layout shell (`(app)/layout.tsx`) with a collapsible sidebar on desktop (≥1024px) and a fixed bottom navigation bar on mobile (<1024px). The sidebar contains nav items (Dashboard, Tasks, Analytics, Profile), the category sidebar (EPIC-003), and the theme toggle. The bottom nav shows 4 icon+label items with an active indicator. The layout provides the content area with proper padding and scrolling.

## Acceptance Criteria
```gherkin
GIVEN I am on desktop (≥1024px)
WHEN the layout renders
THEN I see a left sidebar (240px) with nav items and content area fills remaining space

GIVEN I am on mobile (<1024px)
WHEN the layout renders
THEN I see content full-width with a fixed bottom navigation bar

GIVEN I tap "Tasks" in the bottom nav
WHEN navigation occurs
THEN the Tasks page loads and the "Tasks" icon has an active indicator

GIVEN I am on desktop
WHEN I click the collapse button
THEN the sidebar collapses to icon-only mode (64px) and content expands

GIVEN the sidebar is expanded
WHEN I see the nav items
THEN each item shows an icon and label: 🏠 Dashboard, ✅ Tasks, 📊 Analytics, 👤 Profile

GIVEN I resize from desktop to mobile
WHEN the viewport crosses 1024px
THEN the sidebar disappears and the bottom nav appears (no layout jump)
```

## Business Rules
- **BR-122:** Desktop: persistent left sidebar (240px, collapsible to 64px)
- **BR-123:** Mobile: fixed bottom navigation bar (56px height)
- **BR-124:** Nav items: Dashboard, Tasks, Analytics, Profile
- **BR-125:** Active state: accent-colored icon + label with indicator
- **BR-126:** Breakpoint: 1024px (sidebar ↔ bottom nav transition)
- **BR-127:** Sidebar collapsed state persisted in localStorage

## Technical Notes
- Layout file: `src/app/(app)/layout.tsx`
- Sidebar: `src/components/layout/Sidebar.tsx`
- BottomNav: `src/components/layout/BottomNav.tsx`
- Active route detection: `usePathname()` from Next.js
- Collapse toggle: localStorage key `sidebar-collapsed`
- CSS: flexbox layout, `@media (min-width: 1024px)` for sidebar
- Bottom nav: `position: fixed; bottom: 0;` with safe-area-inset for notched phones
- Content area: `overflow-y: auto` with scrollbar styling

## Traceability
- **FSD Reference:** FR-033 (Responsive Layout), BR-122–BR-127
- **Wireframe Reference:** Screen 1 — Layout Shell
- **Design System:** Layout Shell §3
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-001 (Design Tokens)
- **Blocks:** None
- **External Dependencies:** EPIC-002 (auth, authenticated layout gate)

## Definition of Done
- [ ] Desktop sidebar renders with nav items (240px)
- [ ] Sidebar collapses to 64px icon-only mode
- [ ] Collapse state persists in localStorage
- [ ] Mobile bottom nav renders with 4 items
- [ ] Active route indicator works correctly
- [ ] Responsive breakpoint transition at 1024px
- [ ] Safe-area-inset for notched phones
- [ ] Keyboard navigable (Tab through nav items)
- [ ] Code merged to main branch
