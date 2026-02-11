# STORY-003: Build Habit Card with Completion UI

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see each habit as a card with a completion checkbox,  
So that I can quickly mark habits as done and see a satisfying animation confirming my progress.

## Description
Build the HabitCard component that displays habit name, category icon, color accent, streak count, and a completion checkbox. Clicking the checkbox triggers the Smart Check-in modal (EPIC-005) and then plays a bounce animation (300ms) with a completion stamp. The progress bar on the dashboard updates in real-time. Completed habits show a checked state with muted styling.

## Acceptance Criteria
```gherkin
GIVEN a habit card renders on the dashboard
WHEN I view it
THEN I see the habit name, category icon, color accent border, streak badge, and completion checkbox

GIVEN I click the completion checkbox on an uncompleted habit
WHEN the Smart Check-in modal is dismissed/completed
THEN the checkbox shows checked, a bounce animation plays (300ms), and the progress bar updates

GIVEN a habit is already completed today
WHEN I view the card
THEN the checkbox is checked, the card has muted styling, and the completion stamp is visible

GIVEN I uncheck a completed habit
WHEN the uncomplete action processes
THEN the completion reverts, the stamp disappears, mood data is soft-deleted, and progress bar updates

GIVEN a habit has a 7-day streak
WHEN I view the card
THEN I see "🔥 7" streak badge on the card

GIVEN I click the habit card body (not the checkbox)
WHEN the action triggers
THEN I navigate to the habit detail view
```

## Business Rules
- **BR-033:** Checkbox click triggers Smart Check-in modal
- **BR-034:** Habit marked complete only after check-in modal closes
- **BR-037:** One completion per habit per calendar day
- **BR-038:** Unchecking removes mood check-in (soft-delete)
- **BR-039:** Completion stamp animation reverses on uncomplete
- **BR-040:** `habit_uncompleted` event fires on uncomplete

## Technical Notes
- Component: `src/components/habit/HabitCard.tsx`
- Bounce animation: CSS `@keyframes` or Framer Motion `scale` (1 → 1.1 → 1, 300ms)
- Completion stamp: overlay SVG/CSS checkmark with scale-in animation
- Optimistic UI: update local state → API call → rollback on error
- Mutation: POST /api/habits/:id/complete, DELETE /api/habits/:id/complete
- `habit_completed` and `habit_uncompleted` analytics events

## Traceability
- **FSD Reference:** FR-010 (Complete Habit), FR-011 (Uncomplete Habit), BR-033–BR-040
- **Wireframe Reference:** Screen 2 — Home Dashboard (Habit Card)
- **Design System:** HabitCard component §4
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-008 (Completion API)
- **Blocks:** None
- **External Dependencies:** EPIC-005 (Smart Check-in modal integration), EPIC-008 (Card, ProgressBar components)

## Definition of Done
- [ ] HabitCard renders with all specified elements
- [ ] Checkbox triggers check-in modal then completes habit
- [ ] Bounce animation plays on completion (300ms)
- [ ] Uncomplete reverts card state and soft-deletes mood
- [ ] Streak badge displays correctly
- [ ] Progress bar updates in real-time
- [ ] Optimistic UI with rollback
- [ ] Accessible (checkbox has label, keyboard operable)
- [ ] Code merged to main branch
