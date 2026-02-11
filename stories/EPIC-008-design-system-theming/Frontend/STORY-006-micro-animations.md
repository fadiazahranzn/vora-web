# STORY-006: Implement Micro-Animations & Transitions

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want smooth micro-animations on completions, page transitions, and interactive elements,  
So that the app feels polished, responsive, and delightful to use.

## Description
Implement a consistent animation system with CSS keyframes and transition utilities. Includes: completion stamp bounce (300ms), page transition fade (200ms), card hover lift (150ms), button press scale-down (100ms), list item stagger (50ms delay each), and skeleton pulse (1.5s loop). All animations respect `prefers-reduced-motion`.

## Acceptance Criteria
```gherkin
GIVEN I complete a habit
WHEN the stamp animation plays
THEN a checkmark scales from 0 to 1.1 to 1 over 300ms

GIVEN I navigate between pages
WHEN the transition occurs
THEN pages cross-fade with a 200ms opacity transition

GIVEN I hover over a card on desktop
WHEN the hover state activates
THEN the card subtly lifts with translateY(-2px) and shadow increase (150ms)

GIVEN I click a button
WHEN the press state activates
THEN the button scales to 0.97 for 100ms then returns

GIVEN a list of items loads
WHEN they appear
THEN each item staggers in with 50ms delay between items

GIVEN the user has prefers-reduced-motion
WHEN any animation would play
THEN it is replaced with instant state changes (no motion)
```

## Business Rules
- **BR-149:** All animations ≤ 500ms duration
- **BR-150:** `prefers-reduced-motion` respected globally
- Animation durations from design tokens: fast=150ms, normal=300ms, slow=500ms

## Technical Notes
- File: `src/styles/animations.css` (global animation keyframes and utilities)
- Keyframes: `stamp-bounce`, `fade-in`, `slide-up`, `stagger-in`, `skeleton-pulse`
- Utility classes: `.animate-stamp`, `.animate-fade`, `.animate-stagger-[index]`
- Reduced motion: `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`
- Framer Motion: only for complex orchestrated animations (completion + confetti)
- CSS-only for simple animations (hover, press, fade)

## Traceability
- **FSD Reference:** FR-037 (Completion Animation), FR-039 (Reduced Motion), BR-149–BR-150
- **Design System:** §5 Animations
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-002 (Core UI Components)
- **Blocks:** None
- **External Dependencies:** Framer Motion (for complex animations only)

## Definition of Done
- [ ] All animation keyframes defined in animations.css
- [ ] Stamp bounce animation works on habit completion
- [ ] Page transition fade implemented
- [ ] Card hover lift and button press scale work
- [ ] List stagger animation works
- [ ] Skeleton pulse animation works
- [ ] `prefers-reduced-motion` globally respected
- [ ] Code merged to main branch
