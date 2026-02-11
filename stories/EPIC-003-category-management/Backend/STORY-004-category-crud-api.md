# STORY-004: Implement Category CRUD API Endpoints

**Epic:** EPIC-003 - Build Category Management  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want RESTful API endpoints for category CRUD operations,  
So that the frontend can create, read, update, delete, and reorder categories.

## Description
Implement the following API endpoints with auth middleware, Zod validation, and row-level security (userId filtering). All endpoints require authentication. Categories are scoped to the authenticated user. Deletion is soft-delete with habit reassignment to the default "Personal" category.

## Acceptance Criteria
```gherkin
GIVEN I am authenticated
WHEN I call GET /api/categories
THEN I receive a list of my categories ordered by sort_order, excluding soft-deleted ones

GIVEN I am authenticated
WHEN I call POST /api/categories with { name: "Fitness", icon: "🏃", defaultColor: "#3B82F6" }
THEN a new category is created with the next sort_order value

GIVEN I try to create a category with a duplicate name
WHEN I call POST /api/categories
THEN I receive 409 Conflict with error "Category name already exists"

GIVEN I already have 20 categories
WHEN I call POST /api/categories
THEN I receive 422 with error "Maximum 20 categories reached"

GIVEN I am authenticated
WHEN I call PATCH /api/categories/:id with { name: "Updated Name" }
THEN the category is updated

GIVEN I call DELETE /api/categories/:id
WHEN the category has 3 habits assigned
THEN the category is soft-deleted and all 3 habits are reassigned to "Personal"

GIVEN I call PATCH /api/categories/reorder with { orderedIds: [...] }
WHEN the request contains valid category IDs
THEN all sort_order values are updated in a single transaction

GIVEN I call GET /api/categories/:id where the category belongs to another user
WHEN the server processes the request
THEN I receive 404 Not Found
```

## Business Rules
- **BR-043:** Category names unique per user (case-insensitive comparison)
- **BR-044:** Maximum 20 categories per user
- Soft-delete: sets `deletedAt` timestamp, excluded from all list queries
- Habit reassignment on delete: update `categoryId` to user's "Personal" category

## Technical Notes
- Routes: `src/app/api/categories/route.ts` (GET, POST), `src/app/api/categories/[id]/route.ts` (PATCH, DELETE), `src/app/api/categories/reorder/route.ts` (PATCH)
- Zod schemas: `createCategorySchema`, `updateCategorySchema`, `reorderCategoriesSchema`
- Auth: `requireAuth()` guard on all routes
- Prisma queries filter by `userId` and `deletedAt: null`
- Reorder uses `$transaction` for atomic sort_order updates

## Traceability
- **FSD Reference:** FR-012 (Category CRUD), BR-041–BR-054
- **TDD Reference:** §4.2 /api/categories/*, §5.1 Categories Service
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** EPIC-001 (Prisma schema), EPIC-002 (auth middleware), STORY-005 (default seeding)
- **Blocks:** STORY-001, STORY-002, STORY-006
- **External Dependencies:** None

## Definition of Done
- [ ] All CRUD endpoints implemented and returning correct responses
- [ ] Zod validation on all inputs
- [ ] Row-level security enforced (userId filtering)
- [ ] Soft-delete with habit reassignment works
- [ ] 20-category limit enforced
- [ ] Name uniqueness enforced (case-insensitive)
- [ ] Reorder endpoint uses transaction
- [ ] Unit tests passing
- [ ] Code merged to main branch
