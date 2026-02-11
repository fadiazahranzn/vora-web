# EPIC-005: Implement Smart Mood Check-in

## Business Value Statement

Help users build emotional awareness by prompting a brief mood check after each habit completion. Positive moods receive celebration (confetti), while negative moods are met with gentle reflection prompts and calming activity suggestions — transforming Vora from a simple tracker into an emotionally intelligent companion.

## Description

After a user completes a habit, a modal presents 6 mood options (😊 Happy, 🥲 Proud, 😟 Worried, 😤 Annoyed, 😢 Sad, 😡 Angry). Based on the positive/negative classification of the selected mood, the flow branches:

- **Positive path:** Confetti animation + encouraging message → modal closes
- **Negative path:** Optional reflection text area (max 500 chars) → suggested calming activities (breathing, walk, music, journaling, stretching, hydration) → encouraging close message

Mood data is stored per habit per date (upsert), enabling future analytics on emotional patterns.

## Source Traceability

| Document  | Reference          | Section / Page                 |
| --------- | ------------------ | ------------------------------ |
| FSD       | FR-015             | Trigger mood check-in          |
| FSD       | FR-016             | Select mood (6 options)        |
| FSD       | FR-017             | Positive mood path (confetti)  |
| FSD       | FR-018             | Negative mood path (reflection)|
| FSD       | FR-019             | Mood upsert per habit/date     |
| FSD       | BR-059 to BR-075   | Mood business rules            |
| TDD       | Mood Service       | §5.1 Backend Services          |
| TDD       | Prisma model       | §3.2 MoodCheckin               |
| TDD       | API routes         | §4.2 /api/mood-checkins/*      |
| Wireframe | Smart Check-in     | Screen 4                       |
| Design Sys| MoodGrid, Modal    | §4 Components                  |

## Scope Definition

| In Scope                                               | Out of Scope                         |
| ------------------------------------------------------ | ------------------------------------ |
| Modal trigger after habit completion (500ms delay)       | Mood analytics / trend charts        |
| 6-mood emoji grid with accessible labels                  | Mood history view / timeline         |
| Positive/negative mood classification                     | Mood-based habit recommendations     |
| Confetti burst animation (2000ms) for positive moods      | Push notification for mood reminders |
| Reflection text area (max 500 chars) for negative moods   | AI-generated mood insights           |
| Calming activity suggestion grid (6 activities)            | —                                    |
| Upsert mood check-in per (habit_id, date)                  | —                                    |
| Skip option (user can dismiss without selecting mood)       | —                                    |
| API: GET, POST /api/mood-checkins                           | —                                    |
| Mascot expression changes based on mood selection            | —                                    |

## High-Level Acceptance Criteria

- [ ] Smart Check-in modal appears 500ms after habit completion
- [ ] Modal displays 6 mood emojis in a 3×2 grid with labels
- [ ] Selecting a positive mood (Happy, Proud) triggers confetti animation + encouraging text
- [ ] Selecting a negative mood (Worried, Annoyed, Sad, Angry) shows reflection text area
- [ ] Reflection text area is optional, max 500 characters with live counter
- [ ] After reflection, 6 calming activities are suggested as selectable cards
- [ ] Selected activity is stored alongside the mood check-in
- [ ] User can skip the check-in entirely (dismiss modal, no data saved)
- [ ] Re-completing a habit on the same date upserts the existing mood check-in
- [ ] Mascot expression matches the selected mood (crossfade 300ms)
- [ ] All interactions meet 44×44px minimum touch target
- [ ] Screen reader announces mood selection: "Mood set to [mood name]"

## Dependencies

- **Prerequisite EPICs:** EPIC-004 (habit completion triggers check-in)
- **External Dependencies:** None (confetti is client-side canvas/library)
- **Technical Prerequisites:** HabitCompletion and MoodCheckin models migrated

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Medium (tight coupling with habit completion flow)
- **Estimated Story Count:** 6–8

## Risks & Assumptions

**Assumptions:**
- Confetti is implemented with a lightweight canvas library (e.g., `canvas-confetti`) or Framer Motion
- Calming activities are hardcoded in the client (not fetched from API)
- Mood check-in is optional — users can always dismiss
- One mood check-in per habit per date (upsert)

**Risks:**
- Modal timing (500ms delay after completion) may feel slow or be missed on rapid consecutive completions
- Confetti animation may cause performance issues on low-end mobile devices
- Negative path has 3 steps (mood → reflection → activities) which may feel long — need clear skip affordances

## Related EPICs

- **Depends On:** EPIC-004
- **Blocks:** EPIC-007 (mood data feeds into analytics, though analytics can launch without mood)
- **Related:** EPIC-008 (Modal component, MoodGrid, animations)
