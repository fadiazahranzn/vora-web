# STORY-004: Build Calendar Heatmap with Drill-Down

**Epic:** EPIC-007 - Build Analytics & Insights Dashboard  
**Role:** Frontend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see a calendar heatmap showing my daily completion rates with drill-down,  
So that I can visually identify my most and least consistent periods.

## Description
Build a monthly calendar heatmap where each cell (day) is color-coded by completion rate: green (80–100%), yellow (40–79%), red (1–39%), gray (0% or no data). The heatmap supports month navigation (← →). Clicking a day opens a bottom sheet/panel showing each habit's completion status for that day. Hovering shows a tooltip with date, percentage, and counts.

## Acceptance Criteria
```gherkin
GIVEN I view the Analytics page
WHEN the heatmap loads
THEN I see the current month's calendar with color-coded cells

GIVEN a day has 90% completion rate
WHEN I view that cell
THEN it shows green color

GIVEN a day has 50% completion rate
WHEN I view that cell
THEN it shows yellow color

GIVEN a day has 20% completion rate
WHEN I view that cell
THEN it shows red color

GIVEN I click the ← arrow
WHEN the month changes to the previous month
THEN the heatmap updates with that month's data

GIVEN I click on a green day (e.g., Feb 5)
WHEN the drill-down opens
THEN I see a list of each habit with ✅ or ❌ status for that day

GIVEN I hover over a day cell
WHEN the tooltip appears
THEN it shows: "Feb 5, 2026 — 80% (4/5 habits completed)"

GIVEN a day has no scheduled habits
WHEN I view that cell
THEN it shows gray with no interaction
```

## Business Rules
- **BR-116:** Monthly grid layout, each cell = one day
- **BR-117:** Color coding: green (80–100%), yellow (40–79%), red (1–39%), gray (0%)
- **BR-118:** Non-color accessible indicator (pattern or icon for colorblind users)
- **BR-119:** Click drill-down shows per-habit completion status
- **BR-120:** Tooltips: date, percentage, completed/scheduled counts
- **BR-121:** Month navigation (← →) supported

## Technical Notes
- Component: CSS Grid 7-column layout (Mon–Sun headers)
- Day cells: colored div/button with accessible pattern overlay
- Bottom sheet: reuse Modal/BottomSheet from EPIC-008 (sheet on mobile, panel on desktop)
- Data: GET /api/analytics/heatmap?month=YYYY-MM (returns per-day completion rates)
- Drill-down: GET /api/analytics/heatmap/:date (returns per-habit details)
- Month navigation: update query param, fetch new data
- React Query cache per month
- Accessibility: each cell has aria-label "Feb 5: 80% completion"

## Traceability
- **FSD Reference:** FR-030 (Calendar Heatmap), BR-116–BR-121
- **Wireframe Reference:** Screen 6 — Analytics View
- **Design System:** HeatmapCalendar §4
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-005 (Analytics API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (BottomSheet/Modal for drill-down)

## Definition of Done
- [ ] Monthly heatmap renders with color-coded cells
- [ ] Color coding correct for all percentage ranges
- [ ] Accessible non-color indicators for colorblind users
- [ ] Month navigation works
- [ ] Click drill-down shows per-habit status
- [ ] Tooltips show date, percentage, and counts
- [ ] Gray cells for no-data days
- [ ] Responsive layout
- [ ] Code merged to main branch
