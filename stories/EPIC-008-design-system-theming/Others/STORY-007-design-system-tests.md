# STORY-007: Write Design System Component Tests

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want comprehensive tests for design system components,  
So that component rendering, interactions, accessibility, and theme correctness are verified.

## Description
Write component tests for all core UI components in the design system. Tests cover rendering with various props/variants, interaction behaviors (click, hover, keyboard), accessibility compliance, and theme switching (light ↔ dark). Include visual regression snapshots for key states.

## Acceptance Criteria
```gherkin
GIVEN the component test suite runs
WHEN all Button variants are tested (primary, secondary, ghost, icon-only, loading)
THEN each variant renders correctly

GIVEN Modal tests run
WHEN focus trap and Escape dismiss are tested
THEN modal behaves correctly

GIVEN accessibility tests run
WHEN axe-core scans all components
THEN no WCAG 2.1 AA violations found

GIVEN theme switching tests run
WHEN toggling data-theme between light and dark
THEN component colors switch correctly

GIVEN Toast tests run
WHEN auto-dismiss and manual close are tested
THEN Toast disappears correctly
```

## Technical Notes
- Testing: React Testing Library + @testing-library/jest-dom
- Accessibility: jest-axe for automated WCAG checks
- Snapshot tests: for visual regression of key component states
- Test each component in light and dark themes
- Test keyboard navigation for Modal, Button, Toggle

## Traceability
- **FSD Reference:** FR-032 (Components), FR-040 (Accessibility)
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-001 (Tokens), STORY-002 (Components)
- **Blocks:** None
- **External Dependencies:** jest-axe library

## Definition of Done
- [ ] All 11 component test suites implemented
- [ ] Button variants tested with props
- [ ] Modal focus trap and dismiss tested
- [ ] Accessibility audit (axe) passes for all components
- [ ] Light/dark theme switching verified
- [ ] All tests passing in CI
- [ ] Code merged to main branch
