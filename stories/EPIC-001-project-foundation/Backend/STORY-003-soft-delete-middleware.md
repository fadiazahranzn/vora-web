# STORY-003: Implement Soft-Delete Prisma Middleware

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a Prisma middleware that automatically handles soft-delete operations,  
So that delete operations set `deletedAt` instead of destroying data, and queries automatically filter out soft-deleted records.

## Description
Implement Prisma middleware that intercepts `delete` and `deleteMany` operations on entities with `deletedAt` fields (User, Category, Habit, HabitCompletion, MoodCheckin, Task) and converts them to `update` operations setting the `deletedAt` timestamp. Additionally, intercept `findMany`, `findFirst`, and `findUnique` queries to automatically exclude records where `deletedAt` is not null.

## Acceptance Criteria
```gherkin
GIVEN a Habit record exists
WHEN I call `prisma.habit.delete({ where: { id } })`
THEN the record's `deletedAt` is set to the current timestamp instead of being destroyed

GIVEN a soft-deleted Habit exists
WHEN I call `prisma.habit.findMany()`
THEN the soft-deleted record is NOT included in the results

GIVEN a soft-deleted Habit exists
WHEN I query with an explicit `{ deletedAt: { not: null } }` filter
THEN the soft-deleted record IS returned (for admin/recovery purposes)

GIVEN a SubTask record (no deletedAt field)
WHEN I call `prisma.subTask.delete()`
THEN the record is hard-deleted as normal

GIVEN multiple habits exist, some soft-deleted
WHEN I call `prisma.habit.count()`
THEN only non-deleted habits are counted
```

## Business Rules
- **BR-030:** Habit deletion shall be soft-delete
- **BR-102:** Task deletion shall be soft-delete
- **BR-038:** Uncompleting a habit shall soft-delete the associated mood check-in record

## Technical Notes
- Middleware should be registered in a centralized `src/lib/prisma.ts` file
- Affected models: User, Category, Habit, HabitCompletion, MoodCheckin, Task
- Non-affected models: Account, Session, SubTask, PostponeHistory (hard-delete)
- The middleware should be configurable (list of models with soft-delete)
- Consider using Prisma client extensions (v4.16+) instead of middleware for better type safety

## Traceability
- **FSD Reference:** BR-030 (Habit soft-delete), BR-102 (Task soft-delete), BR-038 (MoodCheckin soft-delete)
- **TDD Reference:** §3.3 Data Flow — Soft-Delete Middleware
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-002 (Prisma schema)
- **Blocks:** None directly (all feature stories implicitly depend on this)
- **External Dependencies:** None

## Definition of Done
- [ ] Soft-delete middleware intercepts delete operations on specified models
- [ ] Queries automatically exclude soft-deleted records
- [ ] Explicit filter for soft-deleted records works
- [ ] Models without `deletedAt` field behave normally
- [ ] Unit tests covering all soft-delete scenarios passing
- [ ] Code merged to main branch
