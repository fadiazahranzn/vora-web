# STORY-004: Implement Task Completion & Overdue Indicators

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to complete tasks with a strikethrough animation and see visual overdue indicators,  
So that I get satisfying feedback on completion and can easily spot tasks that need attention.

## Description
Implement task completion interaction: checking a task triggers a strikethrough animation on the title. For recurring tasks, completion generates a new instance. Overdue tasks display a red badge with "X days overdue". The task completion and uncomplete use POST/DELETE to the completion endpoint.

## Acceptance Criteria
```gherkin
GIVEN I check a task's checkbox
WHEN the completion processes
THEN the task title shows a strikethrough animation (400ms) and a `task_completed` event fires

GIVEN I uncheck a completed task
WHEN the uncomplete processes
THEN the strikethrough reverses and the task becomes active again

GIVEN a task has a due date 3 days ago and is incomplete
WHEN I view the task
THEN I see a red badge "3 days overdue"

GIVEN I complete a recurring daily task
WHEN the completion processes
THEN the current task is marked complete and a new instance appears for tomorrow

GIVEN a task has no due date
WHEN I view it
THEN no due date or overdue badge is displayed

GIVEN I complete a task
WHEN the task list updates
THEN the task moves to the "Completed" section/filter with a smooth transition
```

## Business Rules
- **BR-084:** Completing a task triggers strikethrough animation
- **BR-088:** `task_completed` event fires
- **BR-097:** Recurring task completion generates next occurrence
- Overdue = due date < today AND not completed

## Technical Notes
- Strikethrough animation: CSS `text-decoration: line-through` with width transition
- Mutation: PATCH /api/tasks/:id with `{ completedAt: new Date() }` or `{ completedAt: null }`
- Overdue calculation: `dayjs().diff(dueDate, 'day')` for badge text
- Recurring completion: backend handles next occurrence creation (STORY-008)
- Smooth list transition: Framer Motion `AnimatePresence` for task moving between sections

## Traceability
- **FSD Reference:** FR-021 (Complete Task), FR-024 (Recurrence), BR-084–BR-088, BR-097–BR-099
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task CRUD API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (animations)

## Definition of Done
- [ ] Checkbox triggers strikethrough animation
- [ ] Uncomplete reverses strikethrough
- [ ] Overdue badge shows correct days
- [ ] Recurring task generates next occurrence on complete
- [ ] Analytics events fire correctly
- [ ] Smooth list transitions
- [ ] Code merged to main branch
