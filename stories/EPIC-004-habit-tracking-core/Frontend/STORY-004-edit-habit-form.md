# STORY-004: Build Edit Habit Form

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to edit an existing habit's name, color, category, target value, and reminder,  
So that I can adjust my habits as my goals evolve.

## Description
Implement the habit edit form that pre-populates with current values and allows updating all fields except frequency type (which is locked after creation). The form includes a "Delete" button that triggers a confirmation dialog for soft-deletion. Changes take effect from the current day forward.

## Acceptance Criteria
```gherkin
GIVEN I click the edit icon on a habit card
WHEN the edit form opens
THEN all fields are pre-populated with current values

GIVEN the frequency field
WHEN the edit form loads
THEN the frequency type is displayed but disabled/locked

GIVEN I change the name from "Read Books" to "Read Science Books"
WHEN I click "Save"
THEN the habit updates immediately in the dashboard and a success toast appears

GIVEN I click "Delete Habit"
WHEN the confirmation dialog appears
THEN it says "Delete [habit name]? This action cannot be undone."

GIVEN I confirm deletion
WHEN the action completes
THEN the habit disappears from the list, data is preserved for analytics, and a success toast appears
```

## Business Rules
- **BR-027:** All fields from creation are editable (except frequency type)
- **BR-028:** Changing frequency does not delete historical completion data
- **BR-029:** Changes take effect from the current day forward
- **BR-030:** Deletion is soft-delete
- **BR-031:** Confirmation dialog before deletion

## Technical Notes
- Same form components as Create Wizard but in single-page layout (not multi-step)
- Mutation: PATCH /api/habits/:id
- Deletion: DELETE /api/habits/:id (soft-delete)
- Frequency type shown as read-only badge/chip
- Target value and unit editable for daily habits
- Weekly days and monthly dates editable within their frequency

## Traceability
- **FSD Reference:** FR-008 (Update Habit), FR-009 (Delete Habit), BR-027–BR-032
- **Wireframe Reference:** Screen 3 — Create/Edit Habit
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-007 (Habit CRUD API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Input, Button, Modal components)

## Definition of Done
- [ ] Edit form pre-populates with current values
- [ ] Frequency type is locked/read-only
- [ ] Save updates habit and shows toast
- [ ] Delete shows confirmation dialog
- [ ] Soft-delete preserves data for analytics
- [ ] Keyboard and screen reader accessible
- [ ] Code merged to main branch
