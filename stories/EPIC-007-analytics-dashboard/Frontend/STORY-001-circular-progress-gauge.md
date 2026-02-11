# STORY-001: Build Circular Progress Completion Gauge

**Epic:** EPIC-007 - Build Analytics & Insights Dashboard  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see today's habit completion rate as a circular progress gauge,  
So that I can quickly understand my daily progress at a glance.

## Description
Build a circular donut-style progress indicator that displays today's completion rate as a percentage. The gauge animates from 0 to the current value on page load (500ms). It updates in real-time when habits are completed or uncompleted without requiring a page reload.

## Acceptance Criteria
```gherkin
GIVEN I navigate to the Analytics page
WHEN the page loads
THEN I see a circular progress gauge showing today's completion percentage

GIVEN I have completed 3 of 5 scheduled habits
WHEN the gauge renders
THEN it shows 60% with the donut filled accordingly

GIVEN the page loads
WHEN the gauge animates
THEN it fills from 0% to the current value over 500ms

GIVEN I complete a habit (on the dashboard) and return to Analytics
WHEN the page loads
THEN the gauge reflects the updated percentage

GIVEN no habits are scheduled today
WHEN the gauge renders
THEN it shows 0% with the message "No habits scheduled today"

GIVEN all habits are completed
WHEN the gauge renders
THEN it shows 100% with a celebratory accent color
```

## Business Rules
- **BR-104:** Formula: `(completed / scheduled) × 100`
- **BR-105:** Displayed as circular progress with percentage center
- **BR-106:** Updates in real-time on completion/uncomplete
- **BR-107:** If no habits scheduled, show 0% with message

## Technical Notes
- Component: SVG-based circular progress or Recharts PieChart
- Animation: CSS `stroke-dashoffset` transition or Framer Motion
- Data: GET /api/analytics/completion-rate
- React Query with 2-minute stale time
- Color: brand accent when < 100%, success green at 100%
- Center text: percentage in large font, "Today" label below

## Traceability
- **FSD Reference:** FR-027 (Completion Rate Gauge), BR-104–BR-107
- **Wireframe Reference:** Screen 6 — Analytics View
- **Design System:** CircularProgress §4
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-005 (Analytics API)
- **Blocks:** None
- **External Dependencies:** None (SVG-based, no external library needed)

## Definition of Done
- [ ] Circular gauge renders with correct percentage
- [ ] Animation from 0 to current value (500ms)
- [ ] Handles 0%, partial%, and 100% states
- [ ] Empty state shows "No habits scheduled today"
- [ ] Data refreshes correctly
- [ ] Accessible (gauge has aria-label with percentage)
- [ ] Code merged to main branch
