# STORY-008: Implement Habit Completion & Uncomplete API

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want API endpoints to complete and uncomplete habits for a specific date,  
So that the frontend can record daily progress and allow undo actions.

## Description
Implement habit completion and uncomplete endpoints. Completing a habit creates a HabitCompletion record with a unique constraint on (habit_id, user_id, date). Uncompleting soft-deletes the completion record and its associated mood check-in. The API enforces that completions can only be made for the current date.

## Acceptance Criteria
```gherkin
GIVEN I call POST /api/habits/:id/complete with date = today
WHEN the habit is not yet completed today
THEN a HabitCompletion record is created with habit_id, user_id, date, completedAt

GIVEN I call POST /api/habits/:id/complete for a habit already completed today
WHEN the duplicate check runs
THEN I receive 409 Conflict with error "Habit already completed for this date"

GIVEN I call POST /api/habits/:id/complete with a past date
WHEN the validation runs
THEN I receive 422 with error "Can only complete habits for the current date"

GIVEN I call DELETE /api/habits/:id/complete with date = today
WHEN the habit was completed today
THEN the HabitCompletion is soft-deleted and the associated MoodCheckin is soft-deleted

GIVEN I call DELETE /api/habits/:id/complete
WHEN no completion exists for today
THEN I receive 404 Not Found

GIVEN a numeric daily habit with target = 8
WHEN I call POST /api/habits/:id/complete with value = 8
THEN the completion is created with value = 8
```

## Business Rules
- **BR-036:** HabitCompletion stores habitId, userId, date, completedAt
- **BR-037:** Unique constraint on (habit_id, user_id, date) — one completion per day
- **BR-038:** Unchecking soft-deletes the associated mood check-in
- **BR-035:** Numeric daily habits require meeting the target value

## Technical Notes
- Routes: `src/app/api/habits/[id]/complete/route.ts` (POST, DELETE)
- POST body: `{ date: "YYYY-MM-DD", value?: number }`
- DELETE body: `{ date: "YYYY-MM-DD" }`
- Unique constraint: Prisma `@@unique([habitId, userId, date])`
- Soft-delete cascade: use `$transaction` to soft-delete both completion and mood
- `requireAuth()` + verify habit belongs to user

## Traceability
- **FSD Reference:** FR-010 (Complete), FR-011 (Uncomplete), BR-033–BR-040
- **TDD Reference:** §4.2 /api/habits/:id/complete
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-007 (Habit CRUD API)
- **Blocks:** STORY-003 (Habit Card UI), STORY-011 (Tests)
- **External Dependencies:** None

## Definition of Done
- [ ] POST /complete creates HabitCompletion record
- [ ] Duplicate completion returns 409
- [ ] Past date completion rejected
- [ ] DELETE /complete soft-deletes completion + mood
- [ ] Numeric habits validate target value
- [ ] Unique constraint enforced at DB level
- [ ] Unit tests passing
- [ ] Code merged to main branch
