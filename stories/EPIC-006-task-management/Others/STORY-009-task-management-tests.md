# STORY-009: Write Task Management Tests

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Others  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want comprehensive tests for the task management system,  
So that CRUD, sub-tasks, auto-postpone, recurrence, and filtering work correctly.

## Description
Write integration and unit tests for the task management system covering API endpoints, sub-task auto-complete logic, auto-postpone engine, recurrence generator, and frontend task list interactions.

## Acceptance Criteria
```gherkin
GIVEN the task API tests run
WHEN all CRUD operations are tested
THEN create, read, update, soft-delete pass with correct responses

GIVEN the sub-task auto-complete tests run
WHEN testing all-sub-tasks-complete scenario
THEN parent auto-completes and reverts correctly

GIVEN the auto-postpone tests run
WHEN testing overdue tasks with auto-postpone enabled
THEN due dates update and history records are created

GIVEN the recurrence tests run
WHEN testing all recurrence types (daily, weekly, monthly, custom)
THEN new instances are generated with correct dates

GIVEN the filter/sort tests run
WHEN testing all filter/sort combinations
THEN correct results are returned
```

## Technical Notes
- API tests: Jest with test database or mocked Prisma
- Component tests: React Testing Library for task list and form
- Auto-postpone edge cases: no overdue tasks, completed tasks, multiple postponements
- Recurrence edge cases: month-end, leap year, custom intervals
- Sub-task edge cases: empty sub-tasks, single sub-task, uncomplete after auto-complete

## Traceability
- **FSD Reference:** FR-020–FR-026, BR-077–BR-103
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task API)
- **Blocks:** None
- **External Dependencies:** Testing framework from EPIC-001

## Definition of Done
- [ ] CRUD API tests for all operations
- [ ] Sub-task auto-complete tests
- [ ] Auto-postpone engine tests with edge cases
- [ ] Recurrence generator tests for all types
- [ ] Filter and sort combination tests
- [ ] Frontend component tests
- [ ] All tests passing in CI
- [ ] Code merged to main branch
