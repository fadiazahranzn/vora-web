# EPIC-007: Build Analytics & Insights Dashboard

## Business Value Statement

Provide users with visual insights into their habit consistency through completion rates, streak counters, trend charts, and calendar heatmaps — reinforcing positive behavior patterns and motivating continued engagement through data-driven self-awareness.

## Description

This EPIC delivers the Analytics page with four key visualization components: a circular progress donut showing today's completion rate, a line chart with weekly/monthly/yearly toggle for trend analysis, a stats section displaying current streak / longest streak / perfect days / active days, and a calendar heatmap with per-day drill-down showing individual habit completion status.

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-027             | Completion rate calculation    |
| FSD       | FR-028             | Activity chart (line chart)    |
| FSD       | FR-029             | Streak & statistics            |
| FSD       | FR-030             | Calendar heatmap               |
| FSD       | BR-104 to BR-121   | Analytics business rules       |
| TDD       | Analytics Service  | §5.1 Backend Services          |
| TDD       | API routes         | §4.2 /api/analytics/*          |
| TDD       | Caching Strategy   | §3.3 React Query caching       |
| Wireframe | Analytics View     | Screen 6                       |
| Design Sys| CircularProgress, LineChart, StatsCards, HeatmapCalendar | §4 Components |

## Scope Definition

| In Scope                                               | Out of Scope                         |
| ------------------------------------------------------ | ------------------------------------ |
| Circular progress donut (today's completion %)           | Mood trend analytics                 |
| Line chart with weekly/monthly/yearly toggle              | Task completion analytics            |
| Stats cards: current streak, longest streak, perfect days, active days | Exportable reports (PDF/CSV)  |
| Calendar heatmap (month view, color-coded cells)           | Predictive analytics / AI insights  |
| Heatmap cell drill-down (bottom sheet with per-habit list)  | Comparison with other users         |
| Heatmap color coding: green (80–100%), yellow (40–79%), red (0–39%), gray (no habits) | Goal setting / coaching |
| API: GET /api/analytics/completion-rate                      | —                                  |
| API: GET /api/analytics/chart?view=weekly|monthly|yearly      | —                                  |
| API: GET /api/analytics/stats                                  | —                                  |
| API: GET /api/analytics/heatmap?month=YYYY-MM                  | —                                  |
| API: GET /api/analytics/heatmap/:date                           | —                                  |

## High-Level Acceptance Criteria

- [ ] Circular progress shows completion rate: `(completed / scheduled) × 100%`
- [ ] Progress donut animates from 0 to current value on load (500ms)
- [ ] Line chart displays daily completion rates aggregated by selected view
- [ ] View toggle switches between weekly (7 days), monthly (30 days), yearly (12 months)
- [ ] Stats cards show: Current Streak, Longest Streak, Perfect Days, Active Days
- [ ] Streak counts consecutive days with ≥1 habit completed (BR-113)
- [ ] Perfect day = all scheduled habits completed on that day (BR-115)
- [ ] Calendar heatmap shows current month with color-coded cells
- [ ] Month navigation (← →) loads heatmap for adjacent months
- [ ] Tapping a heatmap cell opens a bottom sheet listing each habit's completion status
- [ ] Empty state shows mascot with "Complete some habits to see your stats!"
- [ ] Analytics data cached for 2 minutes (React Query)

## Dependencies

- **Prerequisite EPICs:** EPIC-004 (habit completion data required)
- **External Dependencies:** Recharts library for line chart
- **Technical Prerequisites:** HabitCompletion data populated; analytics API endpoints

## Complexity Assessment

- **Size:** L
- **Technical Complexity:** High (aggregation queries, chart rendering)
- **Integration Complexity:** Medium
- **Estimated Story Count:** 8–11

## Risks & Assumptions

**Assumptions:**
- Streak is computed on-read from HabitCompletion records (not a stored counter)
- Chart data aggregation uses PostgreSQL date functions (date_trunc, generate_series)
- Heatmap shows only the current month by default with navigation
- Analytics page is a Server Component with client-side chart components

**Risks:**
- Large completion datasets may cause slow aggregation queries — consider materialized views or daily cron aggregation
- Recharts bundle size (~50KB gzipped) may impact initial load — lazy-load the chart component
- Streak calculation edge cases: skipped days where no habits were scheduled should not break the streak

## Related EPICs

- **Depends On:** EPIC-004
- **Blocks:** None
- **Related:** EPIC-005 (mood data could be added to analytics in future iteration)
