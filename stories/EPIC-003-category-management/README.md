# EPIC-003: Build Category Management — Story Index

**Epic ID:** EPIC-003  
**Epic Title:** Build Category Management  
**Epic Description:** Allow users to organize their habits into meaningful groups (e.g., Health, Work, Learning) so they can maintain a structured view of their self-improvement areas and quickly filter habits by context.

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Build Category Sidebar & Mobile Selector UI | Must Have | 5 | Not Started | [Link](./Frontend/STORY-001-category-sidebar-ui.md) |
| STORY-002 | Implement Category CRUD Modal UI | Must Have | 5 | Not Started | [Link](./Frontend/STORY-002-category-crud-modal-ui.md) |
| STORY-003 | Implement Drag-and-Drop Category Reorder | Should Have | 3 | Not Started | [Link](./Frontend/STORY-003-category-drag-drop-reorder.md) |

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-004 | Implement Category CRUD API Endpoints | Must Have | 5 | Not Started | [Link](./Backend/STORY-004-category-crud-api.md) |
| STORY-005 | Implement Default Category Seeding | Must Have | 3 | Not Started | [Link](./Backend/STORY-005-default-category-seeding.md) |

### Others Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-006 | Write Category Management Tests | Must Have | 3 | Not Started | [Link](./Others/STORY-006-category-management-tests.md) |

---

## Story Dependency Map
```
STORY-005 ──► STORY-004
STORY-004 ──► STORY-001
STORY-004 ──► STORY-002
STORY-002 ──► STORY-003
STORY-001 ──► STORY-006
STORY-004 ──► STORY-006
```

## Total Estimates
- **Total Story Points:** 24
- **Frontend:** 13
- **Backend:** 8
- **Others:** 3
- **By Priority:**
  - **Must Have:** 21
  - **Should Have:** 3
