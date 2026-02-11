# STORY-010: Implement Streak Calculation Service

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a streak calculation service that computes current and longest streaks from completion data,  
So that users can see their consistency metrics on habit cards and detail pages.

## Description
Implement a reusable service that calculates streak statistics for a given habit: current streak (consecutive completion days from today backward), longest streak (maximum consecutive days ever), and total completions count. The calculation is done on-read from HabitCompletion records, not stored as a counter.

## Acceptance Criteria
```gherkin
GIVEN a habit has completions for the last 7 consecutive days
WHEN the streak service calculates
THEN current streak = 7

GIVEN a habit has completions for days 1–5 and 7–10 (missed day 6)
WHEN the streak service calculates
THEN current streak = 4 (days 7–10) and longest streak = 5 (days 1–5)

GIVEN a habit has no completions
WHEN the streak service calculates
THEN current streak = 0, longest streak = 0, total completions = 0

GIVEN a daily habit was completed today and has a 30-day streak
WHEN the streak is calculated
THEN the response includes today in the count (streak = 30)

GIVEN a weekly habit scheduled for Mon/Wed/Fri
WHEN calculating streaks
THEN only scheduled days are considered (non-scheduled days don't break the streak)

GIVEN the streak API is called
WHEN GET /api/habits/:id/stats processes
THEN it returns { currentStreak, longestStreak, totalCompletions }
```

## Business Rules
- Streak = consecutive completed days (for daily habits) or consecutive scheduled-and-completed occurrences (for weekly/monthly)
- Days where the habit is not scheduled (per frequency) do not break the streak
- Soft-deleted completions are excluded
- Calculation is on-read (computed, not stored)

## Technical Notes
- Service: `src/lib/services/streak.ts`
- Query: fetch all completions for a habit, sorted by date DESC
- Algorithm: iterate from most recent completion backward, counting consecutive days/occurrences
- For weekly/monthly: generate "expected schedule" and check against completions
- API: GET /api/habits/:id/stats returns `{ currentStreak, longestStreak, totalCompletions }`
- Performance: for users with long history, consider pagination or date-range limits (last 365 days)
- Caching: React Query cache on frontend with 2-minute stale time

## Traceability
- **FSD Reference:** FR-029 (Streak & Statistics), BR-113–BR-115
- **TDD Reference:** §5.1 Habits Service
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-008 (Habit Completion API — needs completion data)
- **Blocks:** STORY-006 (Habit Detail View with Streak)
- **External Dependencies:** None

## Definition of Done
- [ ] Streak calculation works for daily habits
- [ ] Streak calculation works for weekly habits (scheduled days only)
- [ ] Streak calculation works for monthly habits (scheduled dates only)
- [ ] Current streak, longest streak, total completions computed correctly
- [ ] Soft-deleted completions excluded
- [ ] GET /api/habits/:id/stats returns correct data
- [ ] Unit tests for all frequency types and edge cases
- [ ] Code merged to main branch
