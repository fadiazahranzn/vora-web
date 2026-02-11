# EPIC-003: Build Category Management

## Business Value Statement

Allow users to organize their habits into meaningful groups (e.g., Health, Work, Learning) so they can maintain a structured view of their self-improvement areas and quickly filter habits by context.

## Description

This EPIC delivers the full category lifecycle: creating categories with a name, icon, and default color; listing categories in the sidebar (desktop) or in modal selectors (mobile); editing category details; reordering categories via drag-and-drop; deleting categories with reassignment of orphaned habits; and seeding default categories for new users (BR-041). Each user has isolated categories.

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-012             | Category CRUD                  |
| FSD       | BR-041 to BR-054   | Category business rules        |
| TDD       | Categories Service  | §5.1 Backend Services          |
| TDD       | Prisma model       | §3.2 Category entity           |
| TDD       | API routes         | §4.2 /api/categories/*         |
| Wireframe | Category Sidebar   | Screen 8                       |

## Scope Definition

| In Scope                                              | Out of Scope                          |
| ----------------------------------------------------- | ------------------------------------- |
| Create category (name, icon, defaultColor)             | Sharing categories between users      |
| List categories for authenticated user                  | Nested/hierarchical categories        |
| Edit category (name, icon, color)                       | Category analytics or stats           |
| Delete category (soft-delete, reassign habits)           | Bulk import/export of categories      |
| Default category seeding on user registration            | —                                     |
| Drag-and-drop reorder (sort_order update)                | —                                     |
| Desktop sidebar display with category filters            | —                                     |
| Mobile category selector in habit create/edit modal       | —                                     |
| API: GET, POST /api/categories                            | —                                     |
| API: PATCH, DELETE /api/categories/:id                    | —                                     |

## High-Level Acceptance Criteria

- [ ] New users receive default categories (Health, Work, Personal, Learning) on registration
- [ ] User can create a category with name (1–50 chars), icon emoji, and color
- [ ] User can view all their categories in sidebar (desktop) or selector (mobile)
- [ ] User can edit any category's name, icon, or color
- [ ] User can reorder categories via drag-and-drop; sort_order persists
- [ ] Deleting a category reassigns its habits to the default "Personal" category
- [ ] Soft-deleted categories do not appear in lists
- [ ] Category names are unique per user (BR-043)
- [ ] Maximum 20 categories per user (BR-044)
- [ ] API returns 404 for categories belonging to other users

## Dependencies

- **Prerequisite EPICs:** EPIC-001 (Prisma schema), EPIC-002 (auth)
- **External Dependencies:** None
- **Technical Prerequisites:** Category model migrated, auth middleware functional

## Complexity Assessment

- **Size:** S
- **Technical Complexity:** Low
- **Integration Complexity:** Low
- **Estimated Story Count:** 5–6

## Risks & Assumptions

**Assumptions:**
- Default categories are created synchronously during user registration (NextAuth `createUser` event)
- Icons are stored as emoji strings (no icon library needed)
- 12-color palette shared with habit color picker

**Risks:**
- Drag-and-drop reorder may require optimistic UI with rollback on API failure
- Default category reassignment on delete must handle edge cases (zero habits, already default)

## Related EPICs

- **Depends On:** EPIC-001, EPIC-002
- **Blocks:** EPIC-004 (habits require category assignment)
- **Related:** EPIC-008 (sidebar component)
