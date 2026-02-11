# STORY-009: Implement Habits-by-Date Query with Frequency Logic

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want an API endpoint that returns habits scheduled for a specific date based on their frequency rules,  
So that the dashboard can show the correct habits for any selected date.

## Description
Implement the habits-by-date query logic that filters habits based on their frequency configuration and the requested date. Daily habits appear every day. Weekly habits appear only on their selected days of the week. Monthly habits appear only on their selected dates of the month. The response includes completion status for the requested date.

## Acceptance Criteria
```gherkin
GIVEN I call GET /api/habits?date=2026-02-11 (a Wednesday)
WHEN I have a daily habit
THEN it appears in the response

GIVEN I call GET /api/habits?date=2026-02-11 (a Wednesday)
WHEN I have a weekly habit set for Monday and Friday only
THEN it does NOT appear in the response

GIVEN I call GET /api/habits?date=2026-02-11
WHEN I have a weekly habit set for Wednesday
THEN it appears in the response

GIVEN I call GET /api/habits?date=2026-02-15
WHEN I have a monthly habit set for dates [1, 15, 28]
THEN it appears in the response

GIVEN I call GET /api/habits?date=2026-02-11
WHEN I have completed 2 of 5 scheduled habits that day
THEN each habit includes an `isCompleted` boolean field

GIVEN I call GET /api/habits without a date parameter
WHEN the request processes
THEN it defaults to today's date

GIVEN I call GET /api/habits?date=2026-02-11
WHEN the results are returned
THEN habits are grouped by category with category name and icon included
```

## Business Rules
- **BR-021:** Filter habits by the requested date based on frequency
- **BR-022:** Daily habits appear every day
- **BR-023:** Weekly habits appear on selected days only (0=Mon, 6=Sun)
- **BR-024:** Monthly habits appear on selected dates only (1–31)
- **BR-025:** Results grouped by category

## Technical Notes
- Route: GET /api/habits?date=YYYY-MM-DD
- Frequency filtering logic:
  - Daily: always include
  - Weekly: check `weeklyDays` array includes `dayOfWeek(date)`
  - Monthly: check `monthlyDates` array includes `date.getDate()`
- Join with HabitCompletion to include `isCompleted` per habit for the date
- Join with Category for category name and icon
- Prisma query with computed WHERE clause per frequency type
- Performance: consider filtering post-query if Prisma doesn't support array contains with variable

## Traceability
- **FSD Reference:** FR-007 (Read/View Habits), BR-021–BR-026
- **TDD Reference:** §5.1 Habits Service
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-007 (Habit CRUD API)
- **Blocks:** STORY-001 (Home Dashboard), STORY-005 (Date Picker)
- **External Dependencies:** None

## Definition of Done
- [ ] Daily habits returned for every date
- [ ] Weekly habits returned only on selected days
- [ ] Monthly habits returned only on selected dates
- [ ] Completion status included per habit
- [ ] Results grouped by category
- [ ] Default to today when no date parameter
- [ ] Unit tests for each frequency type
- [ ] Code merged to main branch
