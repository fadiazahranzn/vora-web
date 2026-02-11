# STORY-002: Build Create/Edit Task Form

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to create and edit tasks with title, description, priority, due date, recurrence, and auto-postpone settings,  
So that I can manage my to-dos with all the details I need.

## Description
Build the task creation and editing form as a modal or full-screen view. The form includes: title (required, max 200 chars), description (optional, max 2000 chars), priority selector (high/medium/low, default medium), due date picker, recurrence options (none/daily/weekly/monthly/custom), and auto-postpone toggle. Edit mode pre-populates all fields. Editing a recurring task prompts for scope: "this occurrence only" or "all future occurrences."

## Acceptance Criteria
```gherkin
GIVEN I click the FAB on the Tasks page
WHEN the create form opens
THEN I see all fields with priority defaulting to "Medium" and auto-postpone OFF

GIVEN I enter a title and click "Save"
WHEN the task is created
THEN it appears in the task list with default priority and a success toast

GIVEN I leave the title blank
WHEN I click "Save"
THEN I see "Task title is required"

GIVEN I set a due date in the past
WHEN validation runs
THEN I see "Due date must be today or later"

GIVEN I toggle recurrence to "Weekly"
WHEN the recurrence is set
THEN a recurrence icon appears on the task card

GIVEN I click edit on a recurring task
WHEN the prompt appears
THEN I choose "Edit this occurrence" or "Edit all future occurrences"

GIVEN I toggle auto-postpone ON
WHEN the task is saved
THEN the auto-postpone flag is stored on the task
```

## Business Rules
- **BR-077:** Title required, max 200 chars
- **BR-078:** Description optional, max 2000 chars
- **BR-080:** Due date must be today or future
- **BR-081:** Priority defaults to "Medium"
- **BR-082:** Recurrence: none, daily, weekly, monthly, custom
- **BR-083:** Auto-postpone defaults to OFF
- **BR-100:** All fields editable in edit mode
- **BR-101:** Editing recurring task prompts for scope

## Technical Notes
- Form state: React Hook Form with Zod resolver
- Priority: 3 radio-style buttons with color indicators
- Due date: reuse DatePicker from EPIC-008
- Recurrence selector: dropdown with secondary config (custom rule JSON)
- Auto-postpone: toggle switch component
- Mutation: POST /api/tasks (create), PATCH /api/tasks/:id (edit)

## Traceability
- **FSD Reference:** FR-020 (Create Task), FR-025 (Edit Task), BR-077–BR-083, BR-100–BR-101
- **Wireframe Reference:** Screen 6 — Create/Edit Task
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task CRUD API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Input, Button, Modal, DatePicker)

## Definition of Done
- [ ] Create form works with all fields and defaults
- [ ] Edit form pre-populates correctly
- [ ] Validation for title, due date, description length
- [ ] Recurrence options selectable
- [ ] Recurring task edit shows scope prompt
- [ ] Auto-postpone toggle works
- [ ] Success toast on create/edit
- [ ] Code merged to main branch
