# STORY-007: Implement Habit CRUD API Endpoints

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want RESTful API endpoints for habit CRUD operations,  
So that the frontend can create, read, update, and soft-delete habits.

## Description
Implement habit management API endpoints with comprehensive Zod validation, auth middleware, and row-level security. The create endpoint validates frequency-dependent fields (daily target/unit, weekly days, monthly dates). The update endpoint locks frequency type changes. All list queries exclude soft-deleted habits and filter by authenticated user.

## Acceptance Criteria
```gherkin
GIVEN I am authenticated
WHEN I call POST /api/habits with valid data
THEN a habit is created with all specified fields

GIVEN I create a daily habit without target value
WHEN the validation runs
THEN I receive 422 with error "Target value is required for daily habits"

GIVEN I create a weekly habit with no days selected
WHEN the validation runs
THEN I receive 422 with error "At least one day must be selected"

GIVEN I already have 50 active habits
WHEN I try to create another
THEN I receive 422 with error "Maximum 50 active habits reached"

GIVEN I call GET /api/habits
WHEN the request processes
THEN I receive only my non-deleted habits ordered by category

GIVEN I call PATCH /api/habits/:id with { frequency: "weekly" } (changed from daily)
WHEN the validation runs
THEN I receive 422 with error "Frequency type cannot be changed after creation"

GIVEN I call DELETE /api/habits/:id
WHEN the deletion processes
THEN the habit is soft-deleted (deletedAt set) and remains in database for analytics
```

## Business Rules
- **BR-013:** Name required, max 100 chars
- **BR-014:** Category must exist and belong to user
- **BR-015:** Color from predefined palette (validated)
- **BR-016–019:** Frequency-dependent field validation
- **BR-015 (EPIC):** Maximum 50 active habits per user
- **BR-030:** Soft-delete only
- **BR-027–029:** All fields editable except frequency type

## Technical Notes
- Routes: `src/app/api/habits/route.ts` (GET, POST), `src/app/api/habits/[id]/route.ts` (GET, PATCH, DELETE)
- Zod schemas: `createHabitSchema` with conditional validation per frequency
- `requireAuth()` on all routes
- Prisma: `where: { userId, deletedAt: null }` on all queries
- Soft-delete: `update({ data: { deletedAt: new Date() } })`

## Traceability
- **FSD Reference:** FR-006 (Create), FR-007 (Read), FR-008 (Update), FR-009 (Delete), BR-013–BR-032
- **TDD Reference:** §4.2 /api/habits/*, §5.1 Habits Service, §4.4 createHabitSchema
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** EPIC-001 (Prisma schema), EPIC-002 (auth), EPIC-003 (categories)
- **Blocks:** STORY-002, STORY-004, STORY-008, STORY-009, STORY-011
- **External Dependencies:** None

## Definition of Done
- [ ] POST, GET, PATCH, DELETE endpoints implemented
- [ ] Zod validation with frequency-dependent rules
- [ ] 50-habit limit enforced
- [ ] Frequency type change rejected on update
- [ ] Soft-delete implemented
- [ ] Row-level security enforced
- [ ] Unit tests passing
- [ ] Code merged to main branch
