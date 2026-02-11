# EPIC-006: Build Task Management System — Story Index

**Epic ID:** EPIC-006  
**Epic Title:** Build Task Management System  
**Epic Description:** Give users a complete task manager integrated alongside their habit tracker with priorities, sub-tasks, recurrence, and automatic rescheduling.

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Build Tasks List Page with Filtering & Sorting | Must Have | 5 | Not Started | [Link](./Frontend/STORY-001-tasks-list-page.md) |
| STORY-002 | Build Create/Edit Task Form | Must Have | 5 | Not Started | [Link](./Frontend/STORY-002-create-edit-task-form.md) |
| STORY-003 | Implement Sub-task UI & Auto-Complete | Must Have | 5 | Not Started | [Link](./Frontend/STORY-003-subtask-ui-auto-complete.md) |
| STORY-004 | Implement Task Completion & Overdue Indicators | Must Have | 3 | Not Started | [Link](./Frontend/STORY-004-task-completion-overdue.md) |

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-005 | Implement Task CRUD API Endpoints | Must Have | 5 | Not Started | [Link](./Backend/STORY-005-task-crud-api.md) |
| STORY-006 | Implement Sub-task API & Auto-Complete Logic | Must Have | 5 | Not Started | [Link](./Backend/STORY-006-subtask-api-auto-complete.md) |
| STORY-007 | Implement Auto-Postpone Engine | Must Have | 5 | Not Started | [Link](./Backend/STORY-007-auto-postpone-engine.md) |
| STORY-008 | Implement Task Recurrence Generator | Must Have | 5 | Not Started | [Link](./Backend/STORY-008-task-recurrence-generator.md) |

### Others Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-009 | Write Task Management Tests | Must Have | 5 | Not Started | [Link](./Others/STORY-009-task-management-tests.md) |

---

## Story Dependency Map
```
STORY-005 ──► STORY-006
STORY-005 ──► STORY-007
STORY-005 ──► STORY-008
STORY-005 ──► STORY-001
STORY-005 ──► STORY-002
STORY-006 ──► STORY-003
STORY-005 ──► STORY-004
STORY-007 ──► STORY-001
STORY-005 ──► STORY-009
```

## Total Estimates
- **Total Story Points:** 43
- **Frontend:** 18
- **Backend:** 20
- **Others:** 5
- **By Priority:**
  - **Must Have:** 43
