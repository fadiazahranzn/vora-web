# STORY-006: Write Analytics Dashboard Tests

**Epic:** EPIC-007 - Build Analytics & Insights Dashboard  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want comprehensive tests for the analytics dashboard,  
So that completion rates, charts, streaks, and heatmap computations are verified.

## Description
Write tests for all analytics API endpoints, aggregation logic, and frontend chart components. Test edge cases such as empty data, single-day data, and boundary conditions for streak calculation.

## Acceptance Criteria
```gherkin
GIVEN the analytics API tests run
WHEN all endpoints are tested
THEN completion rate, chart, stats, and heatmap return correct data

GIVEN edge case tests run
WHEN testing with no habits, no completions, or single-day data
THEN endpoints return sensible defaults (0%, empty arrays)

GIVEN the heatmap drill-down tests run
WHEN testing a specific date
THEN per-habit completion status is correct

GIVEN the frontend component tests run
WHEN rendering gauge, chart, stats cards, and heatmap
THEN components render correctly with mock data
```

## Technical Notes
- API tests: Jest with test data fixtures
- Streak edge cases: no history, 1 day, gap, today missing
- Chart test: verify data point count matches view (7, 30, 12)
- Component tests: React Testing Library with mocked API responses
- Heatmap: verify color coding boundaries (0, 39, 40, 79, 80, 100%)

## Traceability
- **FSD Reference:** FR-027–FR-030, BR-104–BR-121
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-005 (Analytics API)
- **Blocks:** None
- **External Dependencies:** Testing framework from EPIC-001

## Definition of Done
- [ ] All analytics API endpoint tests passing
- [ ] Edge case tests for empty and boundary data
- [ ] Streak calculation tests
- [ ] Frontend component tests for all analytics widgets
- [ ] All tests passing in CI
- [ ] Code merged to main branch
