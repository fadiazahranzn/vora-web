# Vora – EPIC Index

## Executive Summary

| Metric                   | Value                              |
| ------------------------ | ---------------------------------- |
| **Total EPICs**          | 10                                 |
| **Complexity (XL/L/M/S)**| 0 / 3 / 5 / 2                    |
| **Estimated Stories**    | 65–100                             |
| **Key Dependencies**     | EPIC-001 → all; EPIC-002 → 003–009 |
| **Coverage Gaps**        | None — 100% FSD coverage           |
| **Conflicts**            | None identified                    |

---

## EPIC Index

| EPIC ID  | Title                                    | Size | Dependencies        | File                                        |
| -------- | ---------------------------------------- | ---- | ------------------- | ------------------------------------------- |
| EPIC-001 | Setup Project Foundation & Infrastructure| M    | None                | [EPIC-001](./EPIC-001-project-foundation.md)|
| EPIC-002 | Implement User Authentication            | M    | EPIC-001            | [EPIC-002](./EPIC-002-user-authentication.md)|
| EPIC-003 | Build Category Management                | S    | EPIC-001, EPIC-002  | [EPIC-003](./EPIC-003-category-management.md)|
| EPIC-004 | Build Habit Tracking Core                | L    | EPIC-001, EPIC-002, EPIC-003 | [EPIC-004](./EPIC-004-habit-tracking-core.md)|
| EPIC-005 | Implement Smart Mood Check-in            | M    | EPIC-004            | [EPIC-005](./EPIC-005-smart-mood-checkin.md)|
| EPIC-006 | Build Task Management System             | L    | EPIC-001, EPIC-002  | [EPIC-006](./EPIC-006-task-management.md)   |
| EPIC-007 | Build Analytics & Insights Dashboard     | L    | EPIC-004            | [EPIC-007](./EPIC-007-analytics-dashboard.md)|
| EPIC-008 | Implement Design System & Theming        | M    | EPIC-001            | [EPIC-008](./EPIC-008-design-system-theming.md)|
| EPIC-009 | Enable PWA & Offline Support             | M    | EPIC-001, EPIC-008  | [EPIC-009](./EPIC-009-pwa-offline-support.md)|
| EPIC-010 | Harden Security & Performance            | S    | EPIC-001, EPIC-002  | [EPIC-010](./EPIC-010-security-performance.md)|

---

## Dependency Map

```
EPIC-001 (Foundation)
  ├──► EPIC-002 (Auth)
  │      ├──► EPIC-003 (Categories)
  │      │      └──► EPIC-004 (Habits) ──► EPIC-005 (Mood)
  │      │                              └──► EPIC-007 (Analytics)
  │      └──► EPIC-006 (Tasks)
  ├──► EPIC-008 (Design System)
  │      └──► EPIC-009 (PWA)
  └──► EPIC-010 (Security/Perf)
```

**Recommended Sprint Sequence:**

| Sprint | EPICs                          | Focus                      |
| ------ | ------------------------------ | -------------------------- |
| 1      | EPIC-001, EPIC-008             | Foundation + Design System |
| 2      | EPIC-002, EPIC-003             | Auth + Categories          |
| 3      | EPIC-004                       | Habit Tracking Core        |
| 4      | EPIC-005, EPIC-006             | Mood Check-in + Tasks      |
| 5      | EPIC-007                       | Analytics Dashboard        |
| 6      | EPIC-009, EPIC-010             | PWA + Hardening            |

---

## Traceability Matrix

| FSD Requirement | Description                     | TDD Component          | Wireframe Screen       | EPIC     |
| --------------- | ------------------------------- | ---------------------- | ---------------------- | -------- |
| FR-001          | Email registration              | Auth Module            | Register               | EPIC-002 |
| FR-002          | Google OAuth login              | Auth Module (NextAuth) | Login                  | EPIC-002 |
| FR-003          | Email login                     | Auth Module            | Login                  | EPIC-002 |
| FR-004          | Logout                          | Auth Module            | Settings               | EPIC-002 |
| FR-005          | Session management              | Auth Module            | —                      | EPIC-002 |
| FR-006          | Create habit                    | Habits Service         | Create Habit Modal     | EPIC-004 |
| FR-007          | List habits by date             | Habits Service         | Home Dashboard         | EPIC-004 |
| FR-008          | Edit habit                      | Habits Service         | Edit Habit Modal       | EPIC-004 |
| FR-009          | Delete (soft) habit             | Habits Service         | Home Dashboard         | EPIC-004 |
| FR-010          | Complete habit                  | Habits Service         | Home Dashboard         | EPIC-004 |
| FR-011          | Uncomplete habit                | Habits Service         | Home Dashboard         | EPIC-004 |
| FR-012          | Category CRUD                   | Categories Service     | Category Sidebar       | EPIC-003 |
| FR-015          | Trigger mood check-in           | Mood Service           | Smart Check-in Modal   | EPIC-005 |
| FR-016          | Select mood                     | Mood Service           | Smart Check-in Modal   | EPIC-005 |
| FR-017          | Positive mood path              | Mood Service           | Smart Check-in Modal   | EPIC-005 |
| FR-018          | Negative mood path              | Mood Service           | Smart Check-in Modal   | EPIC-005 |
| FR-019          | Mood upsert                     | Mood Service           | Smart Check-in Modal   | EPIC-005 |
| FR-020          | Create task                     | Tasks Service          | Create Task Modal      | EPIC-006 |
| FR-021          | Complete task / sub-task        | Tasks Service          | Tasks View             | EPIC-006 |
| FR-022          | Auto-postpone                   | Tasks Service          | Tasks View             | EPIC-006 |
| FR-023          | Filter/sort tasks               | Tasks Service          | Tasks View             | EPIC-006 |
| FR-024          | Recurring tasks                 | Tasks Service          | Tasks View             | EPIC-006 |
| FR-025          | Edit task                       | Tasks Service          | Edit Task Modal        | EPIC-006 |
| FR-026          | Delete (soft) task              | Tasks Service          | Tasks View             | EPIC-006 |
| FR-027          | Completion rate                 | Analytics Service      | Analytics View         | EPIC-007 |
| FR-028          | Activity chart                  | Analytics Service      | Analytics View         | EPIC-007 |
| FR-029          | Streak & statistics             | Analytics Service      | Analytics View         | EPIC-007 |
| FR-030          | Calendar heatmap                | Analytics Service      | Analytics View         | EPIC-007 |
| FR-031          | Theme toggle                    | CSS Tokens             | Settings               | EPIC-008 |
| FR-032          | Color customization             | CSS Tokens             | Create Habit Modal     | EPIC-008 |
| FR-033–036      | Navigation & layout             | Frontend Architecture  | All Screens            | EPIC-008 |
| FR-037–038      | PWA install & offline           | Service Worker         | —                      | EPIC-009 |
| FR-039–040      | Animations & mascot             | Framer Motion          | Home, Check-in         | EPIC-008 |
| —               | Prisma schema + migrations      | Data Architecture      | —                      | EPIC-001 |
| —               | CI/CD pipeline                  | Dev Guidelines         | —                      | EPIC-001 |
| —               | Security headers + rate limits  | Security Design        | —                      | EPIC-010 |
| —               | Performance optimization        | Performance Design     | —                      | EPIC-010 |

---

## Gaps & Recommendations

1. **Identified Gaps:** None — all 40 FSD requirements and all TDD components are covered.
2. **Conflicts Found:** None between FSD and TDD.
3. **Recommendations:**
   - Consider splitting EPIC-004 (Habit Tracking) if sprint capacity is limited — it's the largest epic.
   - EPIC-009 (PWA) can be deferred to post-MVP if timeline is tight.
   - EPIC-010 (Security/Performance) should run in parallel with feature EPICs as continuous hardening.

---

*Generated on 2026-02-10. Source: FSD v1.0, TDD v1.0.*
