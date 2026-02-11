# STORY-002: Implement Category CRUD Modal UI

**Epic:** EPIC-003 - Build Category Management  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to create, edit, and delete categories through a modal interface,  
So that I can organize my habits into meaningful groups.

## Description
Implement the category management modal with form fields for name (1–50 chars), icon (emoji picker), and color (12-color palette). The modal supports create mode (empty form) and edit mode (pre-populated). Deletion triggers a confirmation dialog warning that orphaned habits will be reassigned to "Personal". The modal validates uniqueness of category names per user and enforces the 20-category limit.

## Acceptance Criteria
```gherkin
GIVEN I click "Add Category" in the sidebar
WHEN the modal opens
THEN I see an empty form with name input, emoji icon selector, and 12-color palette

GIVEN I fill in name "Fitness", select 🏃 icon, and pick a blue color
WHEN I click "Save"
THEN the category is created and appears in the sidebar immediately

GIVEN I enter a category name that already exists
WHEN I click "Save"
THEN I see an error: "A category with this name already exists"

GIVEN I already have 20 categories
WHEN I try to create a new one
THEN I see an error: "Maximum 20 categories reached. Delete a category to create a new one."

GIVEN I click the edit icon on a category
WHEN the modal opens in edit mode
THEN the form is pre-populated with the current name, icon, and color

GIVEN I click "Delete" on a category
WHEN the confirmation dialog appears
THEN it warns: "Habits in this category will be moved to Personal"

GIVEN I confirm category deletion
WHEN the deletion completes
THEN the category disappears from the sidebar and its habits move to "Personal"
```

## Business Rules
- **BR-043:** Category names must be unique per user
- **BR-044:** Maximum 20 categories per user
- **BR-041:** Icons are stored as emoji strings
- Category deletion reassigns orphaned habits to the default "Personal" category

## Technical Notes
- Modal uses the design system Modal component (EPIC-008)
- Emoji picker: simple grid of common emoji or inline text input
- 12-color palette is shared with the habit color picker
- Mutations via React Query `useMutation` with optimistic updates
- Form validation with Zod schema on client side

## Traceability
- **FSD Reference:** FR-012 (Category CRUD), BR-041–BR-054
- **Wireframe Reference:** Screen 8 — Category Management
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-004 (Category CRUD API)
- **Blocks:** STORY-003 (Drag-and-drop reorder)
- **External Dependencies:** EPIC-008 (Modal, Input, Button components)

## Definition of Done
- [ ] Create category modal works with all fields
- [ ] Edit category modal pre-populates correctly
- [ ] Delete confirmation dialog warns about habit reassignment
- [ ] Name uniqueness validation works
- [ ] 20-category limit enforced
- [ ] Form validation errors display inline
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] Code merged to main branch
