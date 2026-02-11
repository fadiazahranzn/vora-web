# EPIC-006: Build Task Management System

## Business Value Statement

Give users a complete task manager integrated alongside their habit tracker so they can manage one-off and recurring to-dos with priorities, sub-tasks, and automatic rescheduling — keeping everything in one place and reducing the need for a separate productivity app.

## Description

This EPIC delivers a full-featured task management system: create tasks with title, description, priority (high/medium/low), due date, recurrence rules, and optional sub-tasks. Tasks appear in a filterable/sortable list view. The auto-postpone feature automatically moves overdue tasks with the flag enabled to today. Sub-task completion can auto-complete the parent task when all sub-tasks are done. Recurring tasks generate a new instance upon completion.

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-020             | Create task                    |
| FSD       | FR-021             | Complete task / sub-task       |
| FSD       | FR-022             | Auto-postpone overdue tasks    |
| FSD       | FR-023             | Filter and sort tasks          |
| FSD       | FR-024             | Recurring tasks                |
| FSD       | FR-025             | Edit task                      |
| FSD       | FR-026             | Delete (soft) task             |
| FSD       | BR-077 to BR-103   | Task business rules            |
| TDD       | Tasks Service      | §5.1 Backend Services          |
| TDD       | Prisma models      | §3.2 Task, SubTask, PostponeHistory |
| TDD       | API routes         | §4.2 /api/tasks/*              |
| Wireframe | Tasks View         | Screen 5                       |
| Wireframe | Create/Edit Task   | Screen 6                       |

## Scope Definition

| In Scope                                                | Out of Scope                        |
| ------------------------------------------------------- | ----------------------------------- |
| Create task (title, description, priority, due date)      | Task assignment to other users      |
| Priority levels: high, medium, low with color badges       | Kanban or board view                |
| Due date with date picker                                   | Time-of-day scheduling              |
| Recurrence (daily, weekly, monthly, custom)                  | Task dependencies / blockers        |
| Auto-postpone toggle per task                                 | File attachments on tasks           |
| Auto-postpone execution (move due date to today)              | Task labels / tags                  |
| Sub-task creation (inline, max 20 per task) (BR-090)           | Drag-and-drop task reorder          |
| Sub-task completion toggle                                      | —                                  |
| Parent auto-complete when all sub-tasks done (BR-093)            | —                                  |
| Task completion / uncomplete                                      | —                                  |
| Filter by status (all, active, completed, overdue)                 | —                                  |
| Sort by due date, priority, created date                            | —                                  |
| Postpone history tracking                                            | —                                  |
| Soft-delete task                                                      | —                                  |
| Overdue badge indicator                                                | —                                  |
| API: full CRUD on /api/tasks/*, /api/tasks/:id/subtasks/*               | —                                  |

## High-Level Acceptance Criteria

- [ ] User can create a task with title (1–200 chars), optional description, priority, and due date
- [ ] Priority badge displays correct color (high=red, medium=yellow, low=blue)
- [ ] User can add up to 20 sub-tasks to any task
- [ ] Completing all sub-tasks automatically completes the parent task
- [ ] Completing a recurring task generates the next occurrence based on recurrence rule
- [ ] Tasks with auto-postpone enabled and past due dates are moved to today on page load
- [ ] Postpone history records from_date, to_date, and reason for each auto-postpone
- [ ] Filter tabs work: All, Active, Completed, Overdue
- [ ] Sort options work: Due Date, Priority, Created Date
- [ ] User can edit all task fields except completed_at
- [ ] User can soft-delete a task (removed from view, data preserved)
- [ ] Overdue tasks show a visual indicator (red badge with days overdue)
- [ ] Maximum 200 active tasks per user (BR-079)
- [ ] Empty state shows mascot with "Nothing on your plate!" message

## Dependencies

- **Prerequisite EPICs:** EPIC-001, EPIC-002
- **External Dependencies:** None
- **Technical Prerequisites:** Task, SubTask, PostponeHistory models migrated

## Complexity Assessment

- **Size:** L
- **Technical Complexity:** High
- **Integration Complexity:** Low
- **Estimated Story Count:** 10–13

## Risks & Assumptions

**Assumptions:**
- Auto-postpone runs on page load (client-side trigger → server execution), not via a cron job
- Recurring task generation is synchronous on completion (no background queue)
- Task description supports plain text only (no rich text in v1)
- Sub-tasks do not have their own due dates or priorities

**Risks:**
- Auto-postpone for many overdue tasks could create a slow page load — may need batch API
- Recurring task generation for "custom" rules needs clear recurrence_rule JSON schema
- Parent auto-complete on last sub-task completion requires atomic transaction to avoid race conditions

## Related EPICs

- **Depends On:** EPIC-001, EPIC-002
- **Blocks:** None directly
- **Related:** EPIC-007 (task completion data could feed analytics in future), EPIC-008 (TaskCard component)
