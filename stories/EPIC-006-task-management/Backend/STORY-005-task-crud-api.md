# STORY-005: Implement Task CRUD API Endpoints

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want RESTful API endpoints for task CRUD operations,  
So that the frontend can create, read, update, soft-delete, and filter/sort tasks.

## Description
Implement task management API with full CRUD, filtering, and sorting support. Tasks support title, description, priority, due date, recurrence, and auto-postpone. Listing supports query parameters for filtering (status) and sorting (priority, due date, created date). Deletion is soft-delete. All endpoints enforce auth and row-level security.

## Acceptance Criteria
```gherkin
GIVEN I call POST /api/tasks with valid data
WHEN the task is created
THEN it returns the task with generated ID and defaults (priority=medium, autoPostpone=false)

GIVEN I call GET /api/tasks?filter=overdue&sort=priority
WHEN results are returned
THEN only my overdue incomplete tasks are shown, sorted high→medium→low

GIVEN I call PATCH /api/tasks/:id with { title: "Updated" }
WHEN the update processes
THEN the task title is updated

GIVEN I call DELETE /api/tasks/:id
WHEN the deletion processes
THEN the task is soft-deleted (deletedAt set)

GIVEN I already have 200 active tasks
WHEN I try to create another
THEN I receive 422 with "Maximum 200 active tasks reached"

GIVEN I call any endpoint with another user's task ID
WHEN the server processes
THEN I receive 404 Not Found
```

## Business Rules
- **BR-077:** Title required, max 200 chars
- **BR-078:** Description max 2000 chars
- **BR-079:** Maximum 200 active tasks per user
- **BR-080:** Due date ≥ today on create
- **BR-081:** Priority defaults to "medium"
- **BR-102:** Soft-delete with confirmation

## Technical Notes
- Routes: `src/app/api/tasks/route.ts` (GET, POST), `src/app/api/tasks/[id]/route.ts` (GET, PATCH, DELETE)
- GET query params: `filter` (all|active|completed|overdue), `sort` (priority|dueDate|createdAt)
- Zod schemas: `createTaskSchema`, `updateTaskSchema`
- Prisma: `where: { userId, deletedAt: null }` with dynamic filters
- Sort mapping: priority → CASE statement or enum ordering
- `requireAuth()` on all routes

## Traceability
- **FSD Reference:** FR-020 (Create), FR-023 (Filter/Sort), FR-025 (Edit), FR-026 (Delete), BR-077–BR-103
- **TDD Reference:** §4.2 /api/tasks/*
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** EPIC-001 (Prisma schema), EPIC-002 (auth)
- **Blocks:** STORY-001–004, STORY-006–009
- **External Dependencies:** None

## Definition of Done
- [ ] POST, GET, PATCH, DELETE endpoints implemented
- [ ] Filter and sort query params work
- [ ] 200-task limit enforced
- [ ] Due date validation on create
- [ ] Soft-delete implemented
- [ ] Row-level security enforced
- [ ] Unit tests passing
- [ ] Code merged to main branch
