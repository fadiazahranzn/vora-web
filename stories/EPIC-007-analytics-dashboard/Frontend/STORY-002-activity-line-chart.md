# STORY-002: Build Activity Line Chart with View Toggle

**Epic:** EPIC-007 - Build Analytics & Insights Dashboard  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see a line chart of my habit completion trends over time,  
So that I can visualize my consistency and identify patterns.

## Description
Build a line chart component using Recharts that displays daily completion rates over a selectable time period. The chart includes a toggle for weekly (7 days), monthly (30 days), and yearly (12 months) views. Interactive tooltips show exact date and percentage on hover/tap. The Recharts library is lazy-loaded to optimize initial page load.

## Acceptance Criteria
```gherkin
GIVEN I view the Analytics page
WHEN the chart loads
THEN I see a line chart defaulting to the Weekly view (last 7 days)

GIVEN I click the "Monthly" toggle
WHEN the chart updates
THEN it shows the last 30 days of completion rates

GIVEN I click the "Yearly" toggle
WHEN the chart updates
THEN it shows aggregated monthly completion rates for the last 12 months

GIVEN I hover over a data point
WHEN the tooltip appears
THEN it shows the date and exact percentage (e.g., "Feb 11, 2026 — 80%")

GIVEN I tap a data point on mobile
WHEN the tooltip appears
THEN it shows the same information with tap-friendly sizing

GIVEN no completion data exists
WHEN the chart loads
THEN it shows a flat line at 0% with an empty state message
```

## Business Rules
- **BR-108:** X-axis: time periods, Y-axis: completion rate (0–100%)
- **BR-109:** Toggle views: Weekly (7 days), Monthly (30 days), Yearly (12 months)
- **BR-110:** Default view: Weekly
- **BR-111:** Interactive tooltips with date and percentage
- **BR-112:** Chart lazy-loaded

## Technical Notes
- Library: Recharts `<LineChart>` with `<Line>`, `<Tooltip>`, `<XAxis>`, `<YAxis>`
- Lazy loading: `React.lazy(() => import('recharts'))` with Suspense
- Data: GET /api/analytics/chart?view=weekly|monthly|yearly
- Toggle: 3 segmented buttons (Weekly | Monthly | Yearly)
- Chart styling: brand accent color for line, subtle grid, responsive width
- Y-axis: 0–100% fixed range
- React Query cache per view

## Traceability
- **FSD Reference:** FR-028 (Activity Line Chart), BR-108–BR-112
- **Wireframe Reference:** Screen 6 — Analytics View
- **Design System:** LineChart §4
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-005 (Analytics API)
- **Blocks:** None
- **External Dependencies:** Recharts library (~50KB gzipped)

## Definition of Done
- [ ] Line chart renders with weekly default view
- [ ] View toggle works: weekly, monthly, yearly
- [ ] Tooltips show date and percentage
- [ ] Recharts lazy-loaded (not in initial bundle)
- [ ] Responsive on mobile and desktop
- [ ] Empty state handled
- [ ] Accessible chart with aria-labels
- [ ] Code merged to main branch
