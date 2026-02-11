# STORY-002: Implement Positive Mood Path (Confetti + Celebration)

**Epic:** EPIC-005 - Implement Smart Mood Check-in  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user who selects a positive mood,  
I want to see a congratulatory message with confetti animation,  
So that I feel celebrated and motivated to keep building good habits.

## Description
When the user selects "Happy" or "Proud", the modal transitions to the celebration view: a randomized congratulatory message, confetti burst animation (2000ms), and the mascot in celebration mode. The modal auto-closes after 2 seconds. Mood data is saved before auto-close. The user can dismiss early by clicking X.

## Acceptance Criteria
```gherkin
GIVEN I select "Happy"
WHEN the positive path activates
THEN I see a congratulatory message (randomized from ≥5 options) and confetti animation

GIVEN the confetti animation starts
WHEN 2000ms elapses
THEN the confetti stops and the modal auto-closes

GIVEN the positive path is active
WHEN I click X before the 2-second timer
THEN the modal closes immediately

GIVEN the modal auto-closes
WHEN the close event fires
THEN a `mood_checkin_completed` event fires with `isPositive: true`

GIVEN I select "Proud"
WHEN the path activates
THEN the same celebration flow occurs as for "Happy"

GIVEN the mood data is saved
WHEN the API call to save mood completes
THEN the data is persisted before the modal closes
```

## Business Rules
- **BR-063:** Randomized congratulatory message from ≥5 options
- **BR-064:** Animated mascot or "Good Job" stamp
- **BR-065:** Modal auto-closes after 2 seconds (±200ms)
- **BR-066:** Mood data stored before auto-close

## Technical Notes
- Confetti: `canvas-confetti` library (lightweight, ~5KB) or Framer Motion particles
- Confetti burst: 50–80 particles, gravity pull, 2s duration
- Congratulatory messages array: ["Amazing work! 🎉", "You're on fire! 🔥", "Keep it up! 💪", "Fantastic! ⭐", "You're crushing it! 🏆"]
- Auto-close: `setTimeout(2000)` with cleanup on early dismiss
- Save mood: POST /api/mood-checkins fires immediately on mood selection (don't wait for timer)
- Performance: canvas-confetti is lazy-loaded

## Traceability
- **FSD Reference:** FR-017 (Positive Mood Path), BR-063–BR-066
- **Wireframe Reference:** Screen 4 — Smart Check-in (Positive)
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-001 (Mood Selection Modal)
- **Blocks:** None
- **External Dependencies:** `canvas-confetti` library

## Definition of Done
- [ ] Congratulatory message displayed (randomized)
- [ ] Confetti animation plays for 2000ms
- [ ] Modal auto-closes after 2 seconds
- [ ] Early dismiss works via X button
- [ ] Mood data saved before close
- [ ] `mood_checkin_completed` event fires
- [ ] Confetti library lazy-loaded
- [ ] Respects `prefers-reduced-motion`
- [ ] Code merged to main branch
