# EPIC-008: Implement Design System & Theming — Story Index

**Epic ID:** EPIC-008  
**Epic Title:** Implement Design System & Theming  
**Epic Description:** Create a cohesive, accessible design system with CSS custom properties, reusable UI components, responsive layouts, mascot integration, and full theming support (light/dark/system).

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Implement CSS Design Tokens & Theme Variables | Must Have | 5 | Not Started | [Link](./Frontend/STORY-001-design-tokens-theme-vars.md) |
| STORY-002 | Build Core UI Component Library | Must Have | 8 | Not Started | [Link](./Frontend/STORY-002-core-ui-components.md) |
| STORY-003 | Implement Responsive Layout Shell | Must Have | 5 | Not Started | [Link](./Frontend/STORY-003-responsive-layout-shell.md) |
| STORY-004 | Build Theme Switcher (Light/Dark/System) | Must Have | 5 | Not Started | [Link](./Frontend/STORY-004-theme-switcher.md) |
| STORY-005 | Implement Mascot Component & Animations | Should Have | 5 | Not Started | [Link](./Frontend/STORY-005-mascot-component.md) |
| STORY-006 | Implement Micro-Animations & Transitions | Should Have | 3 | Not Started | [Link](./Frontend/STORY-006-micro-animations.md) |

### Others Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-007 | Write Design System Component Tests | Must Have | 3 | Not Started | [Link](./Others/STORY-007-design-system-tests.md) |

---

## Story Dependency Map
```
STORY-001 ──► STORY-002
STORY-001 ──► STORY-003
STORY-001 ──► STORY-004
STORY-002 ──► STORY-005
STORY-002 ──► STORY-006
STORY-001 ──► STORY-007
STORY-002 ──► STORY-007
```

## Total Estimates
- **Total Story Points:** 34
- **Frontend:** 31
- **Others:** 3
- **By Priority:**
  - **Must Have:** 26
  - **Should Have:** 8
