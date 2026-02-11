# STORY-002: Build Core UI Component Library

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Frontend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a library of reusable, accessible UI components,  
So that all feature pages use consistent, design-system-compliant building blocks.

## Description
Build the core component library using the design tokens from STORY-001. Components include: **Button** (primary, secondary, ghost, icon-only, loading state), **Card** (standard, elevated, interactive), **Input** (text, number, textarea, with label, error, helper), **Modal** (with backdrop, focus trap, Escape dismiss), **BottomSheet** (mobile-only), **Toast** (success, error, info), **Badge** (priority, status), **Skeleton** (line, circle, card), **ProgressBar** (linear), **EmptyState** (with mascot), **Toggle** (switch). All components must pass WCAG 2.1 AA accessibility checks.

## Acceptance Criteria
```gherkin
GIVEN I import a Button component
WHEN I render it with variant="primary"
THEN it uses --color-primary background, --color-on-primary text, and has hover/focus states

GIVEN I render a Modal
WHEN it opens
THEN focus is trapped inside, Escape closes it, and a backdrop blur overlay appears

GIVEN I render an Input with error="Required"
WHEN the error prop is set
THEN the input border turns red and error text appears below with aria-describedby link

GIVEN I render any component
WHEN I inspect it
THEN all styles reference CSS custom properties (tokens), not hardcoded values

GIVEN I render a Toast with type="success"
WHEN it appears
THEN it auto-dismisses after 4 seconds (configurable), has a close button, and uses role="alert"

GIVEN I render a Skeleton
WHEN loading is true
THEN animated pulse placeholder appears with correct shape

GIVEN all components are rendered
WHEN an accessibility audit runs
THEN no WCAG 2.1 AA violations are found
```

## Business Rules
- All interactive elements have minimum 44×44px touch targets
- Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text
- Focus indicators visible on all interactive elements
- Components support both light and dark themes

## Technical Notes
- Directory: `src/components/ui/`
- One component per file: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`, `BottomSheet.tsx`, `Toast.tsx`, `Badge.tsx`, `Skeleton.tsx`, `ProgressBar.tsx`, `EmptyState.tsx`, `Toggle.tsx`
- CSS Modules or vanilla CSS (per component: `Button.module.css`)
- Modal: uses `<dialog>` element or portal with focus-trap-react
- Toast: context provider pattern (`useToast()` hook)
- All components accept `className` prop for extension
- TypeScript props interfaces for all components

## Traceability
- **FSD Reference:** FR-032 (Reusable Components), FR-040 (Accessibility)
- **Design System Doc Reference:** §4 Components
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-001 (Design Tokens)
- **Blocks:** STORY-005 (Mascot), STORY-006 (Animations), STORY-007 (Tests)
- **External Dependencies:** None (vanilla implementation)

## Definition of Done
- [ ] All 11 components implemented with TypeScript interfaces
- [ ] All components use design tokens (no hardcoded values)
- [ ] All components support light and dark themes
- [ ] Modal has focus trap and Escape dismiss
- [ ] Toast auto-dismisses with configurable duration
- [ ] Touch targets ≥ 44×44px
- [ ] WCAG 2.1 AA compliant (contrast, focus, aria)
- [ ] Documented with usage examples (Storybook optional)
- [ ] Code merged to main branch
