# EPIC-001: Setup Project Foundation & Infrastructure — Story Index

**Epic ID:** EPIC-001  
**Epic Title:** Setup Project Foundation & Infrastructure  
**Epic Description:** Establish the foundational codebase, database, and deployment pipeline so that all subsequent feature EPICs can build on a reliable, production-ready platform.

---

## Story Index by Role

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Initialize Next.js Project with TypeScript | Must Have | 3 | Not Started | [Link](./Backend/STORY-001-initialize-nextjs-project.md) |
| STORY-002 | Configure Prisma ORM & Database Schema | Must Have | 5 | Not Started | [Link](./Backend/STORY-002-configure-prisma-schema.md) |
| STORY-003 | Implement Soft-Delete Prisma Middleware | Must Have | 3 | Not Started | [Link](./Backend/STORY-003-soft-delete-middleware.md) |
| STORY-004 | Setup Environment Variable Management | Must Have | 2 | Not Started | [Link](./Backend/STORY-004-environment-variable-management.md) |

### Others Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-005 | Configure ESLint, Prettier & Git Hooks | Must Have | 3 | Not Started | [Link](./Others/STORY-005-eslint-prettier-git-hooks.md) |
| STORY-006 | Setup CI/CD Pipeline | Must Have | 5 | Not Started | [Link](./Others/STORY-006-cicd-pipeline.md) |
| STORY-007 | Configure Testing Framework | Must Have | 3 | Not Started | [Link](./Others/STORY-007-testing-framework.md) |
| STORY-008 | Create Developer Documentation | Should Have | 2 | Not Started | [Link](./Others/STORY-008-developer-documentation.md) |

---

## Story Dependency Map
```
STORY-001 ──► STORY-002 ──► STORY-003
STORY-001 ──► STORY-004
STORY-001 ──► STORY-005
STORY-001 ──► STORY-007 ──► STORY-006
STORY-001 ──► STORY-008
```

## Total Estimates
- **Total Story Points:** 26
- **Backend:** 13
- **Others:** 13
- **By Priority:**
  - **Must Have:** 24
  - **Should Have:** 2
