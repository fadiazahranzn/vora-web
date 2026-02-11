# EPIC-004: Build Habit Tracking Core — Story Index

**Epic ID:** EPIC-004  
**Epic Title:** Build Habit Tracking Core  
**Epic Description:** Deliver the primary user-facing feature: the ability to create, schedule, complete, and track habits on a daily basis — giving users a tangible sense of progress and accountability through visual completion indicators and streak tracking.

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Build Home Dashboard Page | Must Have | 5 | Not Started | [Link](./Frontend/STORY-001-home-dashboard-page.md) |
| STORY-002 | Build Create Habit Wizard (3-Step) | Must Have | 8 | Not Started | [Link](./Frontend/STORY-002-create-habit-wizard.md) |
| STORY-003 | Build Habit Card with Completion UI | Must Have | 5 | Not Started | [Link](./Frontend/STORY-003-habit-card-completion-ui.md) |
| STORY-004 | Build Edit Habit Form | Must Have | 3 | Not Started | [Link](./Frontend/STORY-004-edit-habit-form.md) |
| STORY-005 | Implement Date Picker Navigation | Must Have | 3 | Not Started | [Link](./Frontend/STORY-005-date-picker-navigation.md) |
| STORY-006 | Build Habit Detail View with Streak | Should Have | 5 | Not Started | [Link](./Frontend/STORY-006-habit-detail-streak-view.md) |

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-007 | Implement Habit CRUD API Endpoints | Must Have | 5 | Not Started | [Link](./Backend/STORY-007-habit-crud-api.md) |
| STORY-008 | Implement Habit Completion & Uncomplete API | Must Have | 5 | Not Started | [Link](./Backend/STORY-008-habit-completion-api.md) |
| STORY-009 | Implement Habits-by-Date Query with Frequency Logic | Must Have | 5 | Not Started | [Link](./Backend/STORY-009-habits-by-date-query.md) |
| STORY-010 | Implement Streak Calculation Service | Must Have | 5 | Not Started | [Link](./Backend/STORY-010-streak-calculation-service.md) |

### Others Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-011 | Write Habit Tracking Integration Tests | Must Have | 5 | Not Started | [Link](./Others/STORY-011-habit-tracking-tests.md) |

---

## Story Dependency Map
```
STORY-007 ──► STORY-008
STORY-007 ──► STORY-009
STORY-009 ──► STORY-001
STORY-007 ──► STORY-002
STORY-008 ──► STORY-003
STORY-007 ──► STORY-004
STORY-009 ──► STORY-005
STORY-010 ──► STORY-006
STORY-007 ──► STORY-011
STORY-008 ──► STORY-011
```

## Total Estimates
- **Total Story Points:** 54
- **Frontend:** 29
- **Backend:** 20
- **Others:** 5
- **By Priority:**
  - **Must Have:** 49
  - **Should Have:** 5
