# STORY-003: Implement Negative Mood Path (Reflection + Activities)

**Epic:** EPIC-005 - Implement Smart Mood Check-in  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user who selects a negative mood,  
I want to be guided through a gentle reflection with calming activity suggestions,  
So that I can process my emotions and feel supported by the app.

## Description
When the user selects a negative mood (Worried, Annoyed, Sad, Angry), the modal transitions through a 3-step supportive flow: **Step 1** — Empathetic acknowledgment message; **Step 2** — "What's making you feel this way?" optional reflection text area (max 500 chars with live counter); **Step 3** — "What would calm you down?" with 6 calming activity suggestion cards. After the flow, a supportive mascot animation plays and the modal closes. All collected data is saved.

## Acceptance Criteria
```gherkin
GIVEN I select "Sad"
WHEN the negative path activates
THEN I see an empathetic message like "It's okay to feel this way"

GIVEN I am on the reflection step
WHEN I see the text area
THEN it shows "What's making you feel this way?" with a max 500 character limit and live counter

GIVEN I enter 500 characters in the reflection
WHEN I type one more character
THEN no additional input is accepted

GIVEN I click "Continue" (with or without reflection text)
WHEN Step 3 loads
THEN I see 6 calming activity cards: Take a short break, Practice deep breathing, Listen to calming music, Talk to someone, Go for a walk, Stay hydrated

GIVEN I select an activity or click "Skip"
WHEN the final step loads
THEN I see a supportive mascot animation and encouraging close message

GIVEN the flow completes
WHEN the modal closes
THEN a `mood_checkin_completed` event fires with isPositive: false, hasReflection, and selectedActivity

GIVEN I am on any step of the negative path
WHEN I click X or press Escape
THEN the modal closes, mood is saved (without reflection/activity data), and habit is completed
```

## Business Rules
- **BR-067:** Step 1: empathetic acknowledgment message
- **BR-068:** Step 2: optional reflection text area, max 500 chars
- **BR-069:** Step 3: "What would calm you down?" with activity options
- **BR-070:** 6 calming activities (updated from FSD: 6 not 5)
- **BR-071:** Activity selection is optional (can skip)
- **BR-072:** Step 4: supportive mascot animation, then close
- **BR-073:** All data (mood, reflection, activity) stored

## Technical Notes
- Multi-step flow within the same modal (step indicator optional)
- Reflection text area: standard `<textarea>` with `maxLength={500}` and live char counter
- Activity cards: 3×2 grid with icon + label per card, selectable (radio-like)
- Activities hardcoded client-side (not from API)
- Data payloads: reflectionText and selectedActivity sent in POST /api/mood-checkins
- Step state managed via useReducer or useState
- Each step has a clear "Continue" / "Skip" CTA
- Back navigation within the negative path should be supported

## Traceability
- **FSD Reference:** FR-018 (Negative Mood Path), BR-067–BR-073
- **Wireframe Reference:** Screen 4 — Smart Check-in (Negative)
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-001 (Mood Selection Modal)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Card, Button, textarea components)

## Definition of Done
- [ ] Empathetic message displays on negative mood selection
- [ ] Reflection text area with 500-char limit and live counter
- [ ] 6 calming activity cards display in grid
- [ ] Activity selection is optional (skip available)
- [ ] Supportive mascot animation at end
- [ ] All data saved: mood, reflection, activity
- [ ] Early dismiss saves partial data
- [ ] Responsive on mobile and desktop
- [ ] Code merged to main branch
