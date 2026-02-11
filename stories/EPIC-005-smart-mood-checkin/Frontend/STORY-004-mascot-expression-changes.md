# STORY-004: Implement Mascot Expression Changes

**Epic:** EPIC-005 - Implement Smart Mood Check-in  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want the mascot's expression to change based on my mood selection,  
So that the app feels emotionally responsive and companion-like.

## Description
Implement mascot expression transitions within the Smart Check-in modal. The mascot has 4 expression variants (happy, proud, concerned, cheering) and crossfades between them (300ms transition) based on the selected mood. The mascot appears at key moments: initial modal state (neutral/happy), after positive selection (cheering), during negative reflection (concerned), and at the closing celebration/support step.

## Acceptance Criteria
```gherkin
GIVEN the check-in modal opens
WHEN no mood is selected yet
THEN the mascot shows the default happy expression

GIVEN I select "Happy"
WHEN the expression updates
THEN the mascot crossfades to the cheering expression (300ms)

GIVEN I select "Sad"
WHEN the expression updates
THEN the mascot crossfades to the concerned expression (300ms)

GIVEN I complete the negative mood flow
WHEN the final supportive step shows
THEN the mascot shows a supportive/hugging expression

GIVEN the user has `prefers-reduced-motion` enabled
WHEN expressions change
THEN the mascot switches instantly without crossfade animation
```

## Business Rules
- Mascot expression matches the selected mood
- Crossfade transition: 300ms duration
- 4 expression variants: happy, proud, concerned, cheering
- Respect `prefers-reduced-motion`

## Technical Notes
- Component: `src/components/mascot/Mascot.tsx`
- Expression assets: SVG or PNG sprites (from design team)
- Crossfade: CSS `opacity` transition or Framer Motion `AnimatePresence`
- Expression mapping: { happy → happy, proud → proud, worried/sad → concerned, annoyed/angry → concerned, celebration → cheering }
- Mascot size: ~120×120px in modal context
- Lazy-load mascot assets if they exceed 50KB total

## Traceability
- **FSD Reference:** FR-038 (Mascot Animations), BR-145–BR-147
- **Design System:** Mascot component §4
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-001 (Mood Selection Modal)
- **Blocks:** None
- **External Dependencies:** Mascot design assets (SVG/PNG)

## Definition of Done
- [ ] 4 mascot expressions render correctly
- [ ] Crossfade transition (300ms) on mood selection
- [ ] Correct expression mapped to each mood
- [ ] `prefers-reduced-motion` respected
- [ ] Assets under 200KB total
- [ ] Code merged to main branch
