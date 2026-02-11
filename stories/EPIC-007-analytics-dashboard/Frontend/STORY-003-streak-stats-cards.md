# STORY-003: Build Streak & Statistics Cards

**Epic:** EPIC-007 - Build Analytics & Insights Dashboard  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see my streak, perfect days, and active days stats,  
So that I can celebrate my consistency and stay motivated.

## Description
Build a stats section with 4 cards: **Current Streak** (🔥), **Longest Streak** (🏆), **Perfect Days** (⭐), and **Active Days** (📅). Each card displays a count with an icon and label. Stats are computed server-side from HabitCompletion data.

## Acceptance Criteria
```gherkin
GIVEN I view the Analytics page
WHEN the stats cards load
THEN I see 4 cards: Current Streak, Longest Streak, Perfect Days, Active Days

GIVEN I have completed all habits for 7 consecutive days
WHEN the stats load
THEN Current Streak shows "7 🔥"

GIVEN my longest streak ever was 15 days
WHEN the stats load
THEN Longest Streak shows "15 🏆"

GIVEN I have 20 days with 100% completion
WHEN the stats load
THEN Perfect Days shows "20 ⭐"

GIVEN I have 45 days with at least 1 completion
WHEN the stats load
THEN Active Days shows "45 📅"

GIVEN I have no completion history
WHEN the stats load
THEN all cards show 0
```

## Business Rules
- **BR-113:** Streak = consecutive days with ALL scheduled habits completed. Resets on missed day.
- **BR-114:** Perfect Days = total days with 100% completion (all time)
- **BR-115:** Active Days = total days with ≥1 habit completed (all time)

## Technical Notes
- Component: 4 cards in a 2×2 grid (mobile) or 4-column row (desktop)
- Data: GET /api/analytics/stats
- Each card: large number, icon, and label
- Subtle animation: count-up from 0 on page load
- React Query cache with 2-minute stale time

## Traceability
- **FSD Reference:** FR-029 (Streak & Statistics), BR-113–BR-115
- **Wireframe Reference:** Screen 6 — Analytics View
- **Design System:** StatsCards §4
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-005 (Analytics API)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] 4 stats cards render with correct values
- [ ] Current streak and longest streak computed correctly
- [ ] Perfect days and active days computed correctly
- [ ] Count-up animation on load
- [ ] Empty state (all zeros) handled
- [ ] Responsive 2×2 / 4-column layout
- [ ] Code merged to main branch
