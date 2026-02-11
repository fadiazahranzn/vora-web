# STORY-005: Implement Mascot Component & Animations

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want a friendly mascot character that appears throughout the app with contextual animations,  
So that the app feels personable, encouraging, and companion-like.

## Description
Build the reusable Mascot component with multiple expression states and animation capabilities. The mascot appears on the dashboard greeting, empty states, mood check-in modal, and celebration moments. It supports 6 expression variants with smooth transitions and respects reduced motion preferences.

## Acceptance Criteria
```gherkin
GIVEN I view the Home Dashboard
WHEN the greeting section loads
THEN the mascot appears with a waving animation

GIVEN I complete all habits for today
WHEN the mascot updates
THEN it transitions to the celebration expression with a jump animation

GIVEN I have 0% completion and visit the dashboard
WHEN the mascot renders
THEN it shows an encouraging/beckoning expression

GIVEN I view an empty state (no habits, no tasks)
WHEN the mascot appears
THEN it shows a pointing gesture toward the CTA button

GIVEN the user has prefers-reduced-motion enabled
WHEN the mascot renders
THEN it shows static images with no animation

GIVEN the mascot assets total
WHEN calculating bundle size
THEN all mascot assets are under 200KB total (lazy-loaded)
```

## Business Rules
- **BR-145:** Expressions: happy, waving, celebrating, encouraging, concerned, pointing
- **BR-146:** Mascot appears in: dashboard greeting, empty states, mood check-in, celebrations
- **BR-147:** All animations respect `prefers-reduced-motion`
- **BR-148:** Assets lazy-loaded and under 200KB total

## Technical Notes
- Component: `src/components/mascot/Mascot.tsx`
- Props: `expression`, `size` (sm/md/lg), `animate` (boolean), `className`
- Assets: SVG sprites or optimized PNGs in `public/mascot/`
- Animations: CSS keyframes for wave, jump, bounce, point
- Lazy loading: `next/image` with priority=false for non-critical placements
- Expression transitions: CSS `opacity` crossfade (300ms)
- Size mapping: sm=64px, md=120px, lg=200px

## Traceability
- **FSD Reference:** FR-038 (Mascot animations), BR-145–BR-150
- **Wireframe Reference:** All screens with mascot
- **Design System:** Mascot Component §4
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-002 (Core UI Components)
- **Blocks:** None
- **External Dependencies:** Mascot design assets (SVG/PNG from design team)

## Definition of Done
- [ ] Mascot component renders with all 6 expressions
- [ ] Animations play correctly (wave, jump, bounce, point)
- [ ] `prefers-reduced-motion` shows static images
- [ ] Assets under 200KB total
- [ ] Lazy-loaded in non-critical placements
- [ ] 3 size variants work correctly
- [ ] Code merged to main branch
