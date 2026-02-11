# STORY-003: Implement Sub-task UI & Auto-Complete

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to add sub-tasks to my tasks and see the parent auto-complete when all sub-tasks are done,  
So that I can break down complex tasks and track granular progress.

## Description
Implement inline sub-task management within the task detail/edit view. Users can add up to 20 sub-tasks, each with a title and completion checkbox. Sub-task completion toggles are independent. When all sub-tasks are completed, the parent task auto-completes with a visual feedback animation. Unchecking a sub-task after parent auto-complete reverts the parent.

## Acceptance Criteria
```gherkin
GIVEN I am creating or editing a task
WHEN I click "Add Sub-task"
THEN an inline text input appears for the sub-task title

GIVEN I have 3 sub-tasks
WHEN I view the task card in the list
THEN I see "1/3 completed" sub-task progress indicator

GIVEN I check all 3 sub-tasks
WHEN the last one is completed
THEN the parent task auto-completes with strikethrough animation

GIVEN the parent was auto-completed
WHEN I uncheck one sub-task
THEN the parent reverts to incomplete (strikethrough removed)

GIVEN I already have 20 sub-tasks
WHEN I try to add another
THEN the "Add Sub-task" button is disabled with tooltip "Maximum 20 sub-tasks"

GIVEN I check a single sub-task
WHEN the toggle processes
THEN only that sub-task shows completed (parent remains incomplete unless all done)
```

## Business Rules
- **BR-079 (adapted):** Max 20 sub-tasks per task (BR-090)
- **BR-085:** Sub-tasks completed independently of parent
- **BR-086:** All sub-tasks complete → parent auto-completes
- **BR-087:** Completing parent does NOT auto-complete sub-tasks
- **BR-093 (adapted):** Parent auto-complete = BR-093

## Technical Notes
- Sub-tasks rendered as an indented list within task detail/edit view
- Each sub-task: checkbox + title, inline edit, delete (swipe or X button)
- Progress indicator on task card: "X/Y completed" with mini progress bar
- Auto-complete: frontend watches sub-task completion count, calls PATCH parent when all done
- Optimistic UI: update local state → API call → rollback on failure
- Drag-and-drop reorder of sub-tasks (optional, Could Have)

## Traceability
- **FSD Reference:** FR-021 (Complete Task/Sub-task), BR-084–BR-088
- **Wireframe Reference:** Screen 6 — Task Detail (Sub-tasks)
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-006 (Sub-task API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Input, Checkbox components)

## Definition of Done
- [ ] Add sub-tasks inline with title input
- [ ] Sub-task completion toggles independently
- [ ] Parent auto-completes when all sub-tasks done
- [ ] Parent reverts on sub-task uncomplete
- [ ] 20 sub-task limit enforced
- [ ] Progress indicator on task card
- [ ] Optimistic UI with rollback
- [ ] Code merged to main branch
