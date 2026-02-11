# STORY-011: Write Habit Tracking Integration Tests

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Others  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want comprehensive tests for the habit tracking system,  
So that I can ensure habit CRUD, completion, streak calculation, and frequency filtering work correctly.

## Description
Write integration and unit tests covering the habit lifecycle: creation with all frequency types, listing with frequency-based filtering, completion and uncomplete flows, streak calculation edge cases, and the full UI flow from dashboard to habit detail. Tests should cover business rules, error cases, and accessibility.

## Acceptance Criteria
```gherkin
GIVEN the habit API test suite runs
WHEN all tests execute
THEN CRUD endpoints pass for daily, weekly, and monthly habits

GIVEN the frequency filter tests run
WHEN testing with various dates and frequency configurations
THEN habits appear only on their scheduled dates

GIVEN the completion API tests run
WHEN testing duplicate completion, past date, and uncomplete flows
THEN correct status codes and behavior are verified

GIVEN the streak calculation tests run
WHEN testing consecutive completions, gaps, and frequency-aware streaks
THEN correct streak values are returned

GIVEN the frontend component tests run
WHEN rendering HabitCard, CreateWizard, and Dashboard
THEN all UI interactions and states work correctly
```

## Business Rules
- Tests verify the 50-habit limit
- Tests verify frequency type change is rejected
- Tests verify soft-delete preserves analytics data
- Tests verify row-level security

## Technical Notes
- API tests: Jest with mocked/test Prisma database
- Component tests: React Testing Library
- Streak edge cases: empty history, single day, gap in middle, today missing
- Frequency filter edge cases: end of month (31st for monthly habits), leap year
- Test files: `__tests__/api/habits/`, `__tests__/services/streak.ts`, `__tests__/components/habit/`

## Traceability
- **FSD Reference:** FR-006–FR-011, BR-013–BR-040
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-007 (CRUD API), STORY-008 (Completion API)
- **Blocks:** None
- **External Dependencies:** Testing framework from EPIC-001

## Definition of Done
- [ ] API tests for CRUD operations per frequency type
- [ ] Frequency filter tests with date edge cases
- [ ] Completion/uncomplete flow tests
- [ ] Streak calculation tests with all edge cases
- [ ] Frontend component tests for key UI interactions
- [ ] All tests passing in CI
- [ ] Code merged to main branch
