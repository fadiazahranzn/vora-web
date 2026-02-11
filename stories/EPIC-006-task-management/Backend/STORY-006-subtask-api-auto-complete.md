# STORY-006: Implement Sub-task API & Auto-Complete Logic

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want sub-task CRUD endpoints with parent auto-complete logic,  
So that the frontend can manage sub-tasks and the system auto-completes parent tasks when all sub-tasks are done.

## Description
Implement sub-task management API nested under tasks. Sub-tasks support create, read, complete/uncomplete, and delete operations. The critical business logic: when all sub-tasks of a parent task are completed, the parent task auto-completes. Conversely, unchecking a sub-task after parent auto-complete reverts the parent. Max 20 sub-tasks per task.

## Acceptance Criteria
```gherkin
GIVEN I call POST /api/tasks/:taskId/subtasks with { title: "Buy groceries" }
WHEN the sub-task is created
THEN it returns the sub-task with sortOrder assigned

GIVEN I call PATCH /api/tasks/:taskId/subtasks/:id with { completedAt: now }
WHEN this is the last incomplete sub-task
THEN the parent task auto-completes in the same transaction

GIVEN the parent was auto-completed
WHEN I call PATCH to uncomplete a sub-task
THEN the parent task's completedAt is set to null

GIVEN a task has 20 sub-tasks
WHEN I try to add another
THEN I receive 422 with "Maximum 20 sub-tasks per task"

GIVEN I call DELETE /api/tasks/:taskId/subtasks/:id
WHEN the sub-task is removed
THEN it no longer appears in the sub-task list

GIVEN completing a parent task manually
WHEN the parent is completed
THEN sub-tasks remain in their current state (NOT auto-completed)
```

## Business Rules
- **BR-085:** Sub-tasks completed independently
- **BR-086:** All sub-tasks complete → parent auto-completes
- **BR-087:** Parent complete does NOT cascade to sub-tasks
- **BR-090:** Max 20 sub-tasks per task

## Technical Notes
- Routes: `src/app/api/tasks/[taskId]/subtasks/route.ts` (GET, POST), `src/app/api/tasks/[taskId]/subtasks/[id]/route.ts` (PATCH, DELETE)
- Auto-complete: use `$transaction` — update sub-task + check count + conditionally update parent
- Revert: if sub-task uncompleted and parent was auto-completed, set parent `completedAt = null`
- Detect auto-complete vs manual: could use a flag or check if all sub-tasks were complete
- Sub-tasks have sortOrder for display ordering

## Traceability
- **FSD Reference:** FR-021 (Complete Sub-task), BR-084–BR-088, BR-090
- **TDD Reference:** §4.2 /api/tasks/:id/subtasks/*
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task CRUD API)
- **Blocks:** STORY-003 (Sub-task UI)
- **External Dependencies:** None

## Definition of Done
- [ ] Sub-task CRUD endpoints implemented
- [ ] Auto-complete parent on last sub-task completion
- [ ] Parent revert on sub-task uncomplete
- [ ] 20 sub-task limit enforced
- [ ] Atomic transactions for auto-complete
- [ ] Row-level security
- [ ] Unit tests passing
- [ ] Code merged to main branch
