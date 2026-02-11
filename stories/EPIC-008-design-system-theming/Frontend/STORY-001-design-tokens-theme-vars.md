# STORY-001: Implement CSS Design Tokens & Theme Variables

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a comprehensive set of CSS custom properties (design tokens) for colors, spacing, typography, and effects,  
So that the entire application uses consistent, easily themeable values.

## Description
Define all design tokens as CSS custom properties on `:root` for the light theme and `[data-theme="dark"]` for the dark theme. Tokens include color palette (primary, secondary, accent, semantic), spacing scale (4px base), typography (font families, sizes, weights, line heights), border radii, shadows, and transitions. All component styles must reference tokens, never hardcoded values.

## Acceptance Criteria
```gherkin
GIVEN the global stylesheet loads
WHEN no theme override is set
THEN all CSS custom properties for the light theme are available

GIVEN [data-theme="dark"] is applied to <html>
WHEN styles cascade
THEN all color tokens switch to dark theme values

GIVEN a developer creates a new component
WHEN they need a color
THEN they reference `var(--color-primary)` instead of hardcoded hex

GIVEN the token file is loaded
WHEN I inspect the :root
THEN I see tokens for: colors (14+), spacing (8+), typography (6+ sizes), radii (4+), shadows (3+)

GIVEN the spacing scale
WHEN px values are checked
THEN they follow a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

GIVEN the font stack
WHEN I inspect typography tokens
THEN the primary font is "Inter" and fallback is system-ui, sans-serif
```

## Business Rules
- All visual properties must use CSS custom properties (no hardcoded values)
- Light and dark themes must have equivalent token coverage
- 4px spacing base unit
- Font: Inter (Google Fonts), with system-ui fallback

## Technical Notes
- File: `src/styles/tokens.css` (imported first in global stylesheet)
- Color naming: `--color-primary-{50|100|...|900}`, `--color-success`, `--color-error`, etc.
- Spacing: `--space-1` (4px) through `--space-16` (64px)
- Typography: `--font-size-xs` through `--font-size-3xl`, `--font-weight-regular|medium|semibold|bold`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Radii: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px)
- Transitions: `--transition-fast` (150ms), `--transition-normal` (300ms), `--transition-slow` (500ms)
- Dark theme: invert backgrounds, adjust text contrast, desaturate colors slightly

## Traceability
- **FSD Reference:** FR-031 (CSS Custom Properties), FR-034 (Light/Dark theme)
- **Design System Doc Reference:** §2 Design Tokens
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** EPIC-001 (Next.js setup, global CSS entry point)
- **Blocks:** STORY-002, STORY-003, STORY-004, STORY-007
- **External Dependencies:** Google Fonts (Inter)

## Definition of Done
- [ ] All color tokens defined for light and dark themes
- [ ] Spacing scale (4px base) defined
- [ ] Typography tokens defined with Inter font
- [ ] Shadow, radius, and transition tokens defined
- [ ] Dark theme tokens apply when `[data-theme="dark"]` is set
- [ ] No hardcoded values in any component CSS
- [ ] Documented in design system doc or README
- [ ] Code merged to main branch
