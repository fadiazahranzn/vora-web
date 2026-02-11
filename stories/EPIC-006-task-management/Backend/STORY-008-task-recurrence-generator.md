# STORY-008: Implement Task Recurrence Generator

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a recurrence generator that creates the next task instance when a recurring task is completed,  
So that users' recurring tasks continue seamlessly without manual re-creation.

## Description
Implement the recurrence logic that fires when a recurring task is completed. Based on the recurrence rule (daily/weekly/monthly/custom), the system generates a new task instance with the same properties but an advanced due date. The new instance inherits title, description, priority, sub-tasks (reset to incomplete), and auto-postpone setting.

## Acceptance Criteria
```gherkin
GIVEN a daily recurring task is completed on Feb 11
WHEN recurrence runs
THEN a new task is created with dueDate = Feb 12

GIVEN a weekly recurring task (set for Mondays) is completed on Monday Feb 10
WHEN recurrence runs
THEN a new task is created with dueDate = Monday Feb 17

GIVEN a monthly recurring task (set for 15th) is completed on Feb 15
WHEN recurrence runs
THEN a new task is created with dueDate = Mar 15

GIVEN the completed task has 3 sub-tasks
WHEN the new instance is created
THEN it also has the same 3 sub-tasks, all reset to incomplete

GIVEN a custom recurrence rule (every 3 days)
WHEN the task is completed on Feb 11
THEN a new task is created with dueDate = Feb 14

GIVEN a non-recurring task is completed
WHEN completion is processed
THEN no new instance is generated
```

## Business Rules
- **BR-097:** Recurring task completion generates new instance for next occurrence
- **BR-098:** New instance inherits all properties except dueDate (advanced per rule) and completedAt (null)
- **BR-099:** Recurring tasks show recurrence icon indicator

## Technical Notes
- Service: `src/lib/services/recurrence.ts`
- Hook into task completion logic (PATCH /api/tasks/:id with completedAt)
- Date advancement:
  - Daily: +1 day
  - Weekly: +7 days (or next occurrence of the selected day)
  - Monthly: same date next month (handle edge cases: 31st → 28/29/30 Feb)
  - Custom: parse `recurrenceRule` JSON for interval + unit
- Sub-task cloning: deep copy with new IDs, completedAt=null
- New task gets fresh `id`, `createdAt`, and resets `completedAt=null`, `originalDueDate=null`
- Transaction: create new task + sub-tasks in one `$transaction`

## Traceability
- **FSD Reference:** FR-024 (Task Recurrence), BR-097–BR-099
- **TDD Reference:** §5.1 Tasks Service
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task CRUD API)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Daily recurrence generates next-day task
- [ ] Weekly recurrence generates next-week task
- [ ] Monthly recurrence handles edge cases (month-end)
- [ ] Custom recurrence parses rule JSON correctly
- [ ] Sub-tasks cloned with reset completion
- [ ] Non-recurring tasks not affected
- [ ] Transaction for atomic creation
- [ ] Unit tests for all recurrence types
- [ ] Code merged to main branch
