# STORY-007: Implement Auto-Postpone Engine

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want an auto-postpone service that moves overdue tasks to today,  
So that users with enabled auto-postpone see their tasks rescheduled automatically.

## Description
Implement the auto-postpone engine that runs on page load (triggered by a client-side API call). The engine finds all tasks for the authenticated user where autoPostpone=true, dueDate < today, and completedAt is null. For each, it updates dueDate to today, preserves originalDueDate, and creates a PostponeHistory record.

## Acceptance Criteria
```gherkin
GIVEN I call POST /api/tasks/auto-postpone
WHEN 3 tasks have auto-postpone enabled and are overdue
THEN all 3 tasks' dueDates are updated to today

GIVEN a task has auto-postpone ON and is 5 days overdue
WHEN postponement runs
THEN originalDueDate is preserved and a PostponeHistory record is created with from_date, to_date, reason="auto"

GIVEN a completed task has auto-postpone ON and is overdue
WHEN postponement runs
THEN it is NOT postponed (completed tasks excluded)

GIVEN no tasks are overdue
WHEN postponement runs
THEN no changes are made and 200 with empty results is returned

GIVEN auto-postpone runs
WHEN the response is returned
THEN it includes the count of postponed tasks and their IDs

GIVEN a task has been postponed multiple times
WHEN I view the postpone history
THEN all postponement records are available chronologically
```

## Business Rules
- **BR-089:** Auto-postpone moves overdue task due date to current date
- **BR-091:** Original due date preserved in `originalDueDate` field
- **BR-092:** Postpone history tracks each postponement
- **BR-093:** Auto-postpone does NOT apply to completed tasks

## Technical Notes
- Route: POST /api/tasks/auto-postpone (triggered on dashboard/tasks page load)
- Query: `WHERE autoPostpone = true AND dueDate < today AND completedAt IS NULL AND deletedAt IS NULL AND userId = authUser`
- Batch update using `$transaction` for atomicity
- PostponeHistory: `{ taskId, fromDate, toDate, reason: "auto", createdAt }`
- Idempotency: if called multiple times on the same day, tasks already at today aren't re-postponed
- Performance: batch query, not N+1 — single UPDATE with WHERE clause

## Traceability
- **FSD Reference:** FR-022 (Auto-Postpone), BR-089–BR-093
- **TDD Reference:** §5.1 Tasks Service
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task CRUD API)
- **Blocks:** STORY-001 (Tasks List Page triggers auto-postpone on load)
- **External Dependencies:** None

## Definition of Done
- [ ] POST /api/tasks/auto-postpone updates overdue tasks
- [ ] originalDueDate preserved on first postpone
- [ ] PostponeHistory records created
- [ ] Completed tasks excluded
- [ ] Idempotent for same-day calls
- [ ] Batch operation (not N+1)
- [ ] Unit tests passing
- [ ] Code merged to main branch
