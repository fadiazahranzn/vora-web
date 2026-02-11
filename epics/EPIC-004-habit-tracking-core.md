# EPIC-004: Build Habit Tracking Core

## Business Value Statement

Deliver the primary user-facing feature: the ability to create, schedule, complete, and track habits on a daily basis — giving users a tangible sense of progress and accountability through visual completion indicators and streak tracking.

## Description

This EPIC implements the complete habit lifecycle. Users can create habits with a name, category, color, frequency (daily/weekly/monthly), target values, and optional reminders. The Home Dashboard lists habits scheduled for the selected date, grouped by category, with completion checkboxes. Completing a habit triggers a bounce animation, updates the progress bar, and (in coordination with EPIC-005) opens the mood check-in. Users can also uncomplete, edit, and soft-delete habits. Streaks are calculated based on consecutive completion days.

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-006             | Create habit                   |
| FSD       | FR-007             | List habits by date            |
| FSD       | FR-008             | Edit habit                     |
| FSD       | FR-009             | Delete (soft) habit            |
| FSD       | FR-010             | Complete habit                 |
| FSD       | FR-011             | Uncomplete habit               |
| FSD       | BR-013 to BR-040   | Habit business rules           |
| TDD       | Habits Service     | §5.1 Backend Services          |
| TDD       | Prisma models      | §3.2 Habit, HabitCompletion    |
| TDD       | API routes         | §4.2 /api/habits/*             |
| TDD       | Zod validators     | §4.4 createHabitSchema         |
| Wireframe | Home Dashboard     | Screen 2                       |
| Wireframe | Create/Edit Habit  | Screen 3                       |
| Design Sys| HabitCard, FAB     | §4 Components                  |

## Scope Definition

| In Scope                                               | Out of Scope                         |
| ------------------------------------------------------ | ------------------------------------ |
| Create habit (3-step wizard: Name→Frequency→Reminder)   | Push notification delivery           |
| Daily/weekly/monthly frequency configuration             | Habit templates / presets            |
| 12-color picker for habit customization                   | Habit sharing / social features      |
| Category assignment (requires EPIC-003)                   | Historical data import               |
| Date-based habit listing (with date picker navigation)    | Mood check-in flow (→ EPIC-005)      |
| Complete / uncomplete habit for a date                     | Analytics computation (→ EPIC-007)   |
| Checkbox bounce animation + progress bar update            | —                                    |
| Edit habit (all fields except frequency type)               | —                                    |
| Soft-delete habit                                           | —                                    |
| Streak calculation (consecutive completion days)             | —                                    |
| Habit sorting within categories (drag-and-drop)              | —                                    |
| Home Dashboard page with mascot greeting + progress bar       | —                                    |
| FAB for "Create Habit" action                                 | —                                    |
| API: GET, POST /api/habits                                     | —                                    |
| API: GET, PATCH, DELETE /api/habits/:id                         | —                                    |
| API: POST /api/habits/:id/complete, /uncomplete                 | —                                    |

## High-Level Acceptance Criteria

- [ ] User can create a habit via 3-step wizard with name, category, color, frequency, and optional reminder time
- [ ] Home Dashboard shows habits scheduled for the selected date, grouped by category
- [ ] Date picker allows navigating to past/future dates to view scheduled habits
- [ ] Tapping a habit checkbox marks it complete with bounce animation (300ms)
- [ ] Completion rate progress bar updates with fill animation (500ms)
- [ ] User can uncomplete a previously completed habit
- [ ] Habit detail shows current streak and completion history
- [ ] User can edit a habit's name, color, category, target value, and reminder time
- [ ] User can soft-delete a habit (removed from list, data preserved)
- [ ] Habits respect frequency rules: daily habits show every day, weekly habits show on selected days, monthly habits show on selected dates
- [ ] Unique constraint on (habit_id, date) prevents duplicate completions (BR-036)
- [ ] Maximum 50 active habits per user (BR-015)
- [ ] Empty state shows mascot with "Create your first habit!" CTA

## Dependencies

- **Prerequisite EPICs:** EPIC-001, EPIC-002, EPIC-003
- **External Dependencies:** None
- **Technical Prerequisites:** Habit, HabitCompletion models migrated; auth & categories functional

## Complexity Assessment

- **Size:** L
- **Technical Complexity:** High
- **Integration Complexity:** Medium
- **Estimated Story Count:** 10–14

## Risks & Assumptions

**Assumptions:**
- Frequency type cannot be changed after creation (only target values can be edited)
- Streak calculation is done on-read (computed, not stored)
- Date picker defaults to today and allows navigation ±1 year
- Reminder time is stored but push notification delivery is out of scope for v1

**Risks:**
- Streak calculation performance for users with long histories — may need materialized view
- Optimistic updates for completion may conflict if user is on a stale date view
- 3-step wizard UX must gracefully handle back-navigation without losing data

## Related EPICs

- **Depends On:** EPIC-001, EPIC-002, EPIC-003
- **Blocks:** EPIC-005 (mood check-in triggers after completion), EPIC-007 (analytics depends on completions)
- **Related:** EPIC-008 (HabitCard, ProgressBar, FAB components)
