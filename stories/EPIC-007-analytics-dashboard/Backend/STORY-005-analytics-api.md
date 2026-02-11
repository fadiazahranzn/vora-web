# STORY-005: Implement Analytics API Endpoints

**Epic:** EPIC-007 - Build Analytics & Insights Dashboard  
**Role:** Backend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As a developer,  
I want analytics API endpoints that compute completion rates, chart data, stats, and heatmap data,  
So that the frontend can render the Analytics Dashboard with accurate, performant data.

## Description
Implement 5 analytics API endpoints with aggregation queries on HabitCompletion data. Each endpoint requires authentication, scopes to the user's data, and computes metrics from raw completion records. Queries use PostgreSQL date functions for efficient aggregation.

## Acceptance Criteria
```gherkin
GIVEN I call GET /api/analytics/completion-rate
WHEN today I have 3 of 5 habits complete
THEN it returns { rate: 60, completed: 3, scheduled: 5 }

GIVEN I call GET /api/analytics/chart?view=weekly
WHEN data exists for the last 7 days
THEN it returns an array of { date, rate } for each day

GIVEN I call GET /api/analytics/chart?view=monthly
WHEN the response processes
THEN it returns 30 data points (one per day for last 30 days)

GIVEN I call GET /api/analytics/chart?view=yearly
WHEN the response processes
THEN it returns 12 data points (one aggregated rate per month)

GIVEN I call GET /api/analytics/stats
WHEN computation runs
THEN it returns { currentStreak, longestStreak, perfectDays, activeDays }

GIVEN I call GET /api/analytics/heatmap?month=2026-02
WHEN data exists for February 2026
THEN it returns an array of { date, rate, completed, scheduled } for each day

GIVEN I call GET /api/analytics/heatmap/2026-02-11
WHEN drill-down data is requested
THEN it returns per-habit completion status for that date
```

## Business Rules
- **BR-104:** Completion rate = completed / scheduled × 100
- **BR-113:** Streak = consecutive days with ALL habits completed
- **BR-114:** Perfect days = 100% completion days
- **BR-115:** Active days = ≥1 completion days
- Analytics cached for 2 minutes (React Query frontend)

## Technical Notes
- Routes:
  - GET /api/analytics/completion-rate
  - GET /api/analytics/chart?view=weekly|monthly|yearly
  - GET /api/analytics/stats
  - GET /api/analytics/heatmap?month=YYYY-MM
  - GET /api/analytics/heatmap/:date
- Aggregation: Prisma `groupBy` + raw SQL for date_trunc, generate_series
- Streak computation: reuse streak service from EPIC-004 STORY-010 (global, not per-habit)
- Chart data: join Habit + HabitCompletion, compute daily rates using subqueries
- Heatmap: generate all days in month, LEFT JOIN with completion counts
- Performance: consider caching for stats computation (materialized view or in-memory)

## Traceability
- **FSD Reference:** FR-027–FR-030, BR-104–BR-121
- **TDD Reference:** §4.2 /api/analytics/*, §5.1 Analytics Service
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** EPIC-004 (HabitCompletion data), EPIC-004/STORY-010 (Streak Service)
- **Blocks:** STORY-001–004, STORY-006
- **External Dependencies:** None

## Definition of Done
- [ ] All 5 analytics endpoints implemented
- [ ] Completion rate computed correctly
- [ ] Chart data for weekly/monthly/yearly views
- [ ] Stats: streak, perfect days, active days
- [ ] Heatmap: per-day rates for month + per-day drill-down
- [ ] Row-level security enforced
- [ ] Performance acceptable (< 500ms response)
- [ ] Unit tests passing
- [ ] Code merged to main branch
