# EPIC-005: Implement Smart Mood Check-in — Story Index

**Epic ID:** EPIC-005  
**Epic Title:** Implement Smart Mood Check-in  
**Epic Description:** Help users build emotional awareness by prompting a brief mood check after each habit completion, with positive celebrations and negative mood support paths.

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Build Mood Selection Modal UI | Must Have | 5 | Not Started | [Link](./Frontend/STORY-001-mood-selection-modal.md) |
| STORY-002 | Implement Positive Mood Path (Confetti + Celebration) | Must Have | 3 | Not Started | [Link](./Frontend/STORY-002-positive-mood-path.md) |
| STORY-003 | Implement Negative Mood Path (Reflection + Activities) | Must Have | 5 | Not Started | [Link](./Frontend/STORY-003-negative-mood-path.md) |
| STORY-004 | Implement Mascot Expression Changes | Should Have | 3 | Not Started | [Link](./Frontend/STORY-004-mascot-expression-changes.md) |

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-005 | Implement Mood Check-in API Endpoints | Must Have | 5 | Not Started | [Link](./Backend/STORY-005-mood-checkin-api.md) |

### Others Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-006 | Write Mood Check-in Tests | Must Have | 3 | Not Started | [Link](./Others/STORY-006-mood-checkin-tests.md) |

---

## Story Dependency Map
```
STORY-005 ──► STORY-001
STORY-001 ──► STORY-002
STORY-001 ──► STORY-003
STORY-001 ──► STORY-004
STORY-005 ──► STORY-006
STORY-001 ──► STORY-006
```

## Total Estimates
- **Total Story Points:** 24
- **Frontend:** 16
- **Backend:** 5
- **Others:** 3
- **By Priority:**
  - **Must Have:** 21
  - **Should Have:** 3
