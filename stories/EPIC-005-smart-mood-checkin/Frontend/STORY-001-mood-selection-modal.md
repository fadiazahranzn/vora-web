# STORY-001: Build Mood Selection Modal UI

**Epic:** EPIC-005 - Implement Smart Mood Check-in  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want a modal that appears after completing a habit asking me to select my mood,  
So that I can quickly record how I feel and build emotional awareness.

## Description
Build the Smart Check-in modal that triggers 500ms after a habit completion checkbox is clicked. The modal displays a 3×2 grid of 6 mood options with emoji icons and labels. Selecting a mood routes the user to either the positive path or negative path. The modal is dismissible via X button or Escape key (skipping the check-in still completes the habit). Background interaction is blocked with a blurred overlay.

## Acceptance Criteria
```gherkin
GIVEN I click a habit completion checkbox
WHEN 500ms elapses
THEN the Smart Check-in modal appears with a blurred backdrop overlay

GIVEN the modal is open
WHEN I view the mood options
THEN I see 6 moods in a 3×2 grid: Happy (😊), Proud (💪), Worried (😟), Annoyed (😠), Sad (😢), Angry (😡)

GIVEN I click "Happy" or "Proud"
WHEN the selection registers
THEN the positive mood path activates (STORY-002)

GIVEN I click "Worried", "Annoyed", "Sad", or "Angry"
WHEN the selection registers
THEN the negative mood path activates (STORY-003)

GIVEN the modal is open
WHEN I press Escape or click X
THEN the modal closes, the habit is marked complete, and a `mood_checkin_skipped` event fires

GIVEN the modal is open
WHEN I try to interact with the background
THEN interaction is blocked (overlay prevents clicks)

GIVEN I have not selected a mood
WHEN I try to advance
THEN I cannot proceed (a mood selection is required to continue the flow)
```

## Business Rules
- **BR-055:** Modal triggers immediately on checkbox click (with 500ms animation delay)
- **BR-056:** Modal is blocking — background disabled with backdrop blur
- **BR-057:** Dismissible via X button or Escape key
- **BR-058:** Dismissing still marks the habit as complete
- **BR-059:** Six mood options displayed
- **BR-060:** Exactly one mood per check-in
- **BR-061:** Moods classified: Positive (Happy, Proud), Negative (Worried, Annoyed, Sad, Angry)
- **BR-062:** Selection determines positive vs. negative path

## Technical Notes
- Component: `src/components/mood/MoodCheckinModal.tsx`
- Modal uses design system Modal component with `backdrop-filter: blur(8px)`
- Mood grid: CSS Grid 3×2 layout
- Each mood button: 44×44px minimum touch target, emoji + label
- Selected mood has visual highlight (scale + border)
- State machine or useReducer for flow management: idle → mood-select → positive/negative → done
- Screen reader: `aria-live="polite"` announces "Mood set to [mood name]"
- `setTimeout(500)` delay after checkbox click before showing modal

## Traceability
- **FSD Reference:** FR-015 (Check-in Trigger), FR-016 (Mood Selection), BR-055–BR-062
- **Wireframe Reference:** Screen 4 — Smart Check-in
- **Design System:** MoodGrid, Modal §4
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-005 (Mood Check-in API)
- **Blocks:** STORY-002, STORY-003, STORY-004
- **External Dependencies:** EPIC-004 (habit completion triggers this modal), EPIC-008 (Modal component)

## Definition of Done
- [ ] Modal appears 500ms after habit completion click
- [ ] 6 moods displayed in 3×2 grid with emoji + labels
- [ ] Mood selection routes to correct path (positive/negative)
- [ ] Dismiss via X/Escape completes habit without mood data
- [ ] Background interaction blocked during modal
- [ ] All touch targets ≥ 44×44px
- [ ] Screen reader announces mood selection
- [ ] Code merged to main branch
