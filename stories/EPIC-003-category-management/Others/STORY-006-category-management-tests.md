# STORY-006: Write Category Management Tests

**Epic:** EPIC-003 - Build Category Management  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want comprehensive tests for category management,  
So that I can ensure the category CRUD operations, UI components, and business rules work correctly and prevent regressions.

## Description
Write unit tests for the category API endpoints, integration tests for the default seeding flow, and component tests for the sidebar and CRUD modal UI. Tests should cover happy paths, error cases (duplicate name, max limit), edge cases (deleting category with habits), and accessibility.

## Acceptance Criteria
```gherkin
GIVEN the category API test suite runs
WHEN all tests execute
THEN GET, POST, PATCH, DELETE endpoints pass with correct responses

GIVEN a duplicate category name is submitted
WHEN the backend test runs
THEN the 409 Conflict response is verified

GIVEN the max 20 categories limit is reached
WHEN a create request is tested
THEN the 422 response is verified

GIVEN the sidebar component tests run
WHEN rendering with mock category data
THEN each category displays icon, name, and habit count correctly

GIVEN the CRUD modal component tests run
WHEN simulating create and edit flows
THEN form validation and submission work as expected
```

## Business Rules
- All API tests verify row-level security (user cannot access another user's categories)
- Tests verify soft-delete with habit reassignment
- Accessibility tests verify keyboard navigation in sidebar and modal

## Technical Notes
- API tests: Jest + supertest or Next.js API route testing utilities
- Component tests: React Testing Library
- Mock Prisma client for unit tests
- Integration tests use test database
- Test files: `__tests__/api/categories/`, `__tests__/components/category/`

## Traceability
- **FSD Reference:** FR-012, BR-041–BR-054
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-001 (sidebar UI), STORY-004 (API endpoints)
- **Blocks:** None
- **External Dependencies:** Testing framework from EPIC-001

## Definition of Done
- [ ] API unit tests for all CRUD endpoints
- [ ] Integration test for default category seeding
- [ ] Component tests for sidebar and CRUD modal
- [ ] Edge case tests (duplicate name, max limit, delete with habits)
- [ ] Row-level security tests
- [ ] All tests passing in CI
- [ ] Code merged to main branch
