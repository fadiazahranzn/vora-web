# EPIC-008: Implement Design System & Theming

## Business Value Statement

Establish a cohesive, premium visual identity across every screen of Vora by implementing the design token system, reusable UI components, responsive layouts, mascot integration, and light/dark/system theme support — ensuring the app feels polished and delightful from the first interaction.

## Description

This EPIC translates the Design System specification (design-system.md) into production CSS and React components. It covers: CSS Custom Properties for all tokens (colors, spacing, typography, shadows, motion), global reset and base styles, the responsive layout shell (sidebar for desktop, bottom navigation for mobile), the shared component library (Button, Input, Card, Modal, Toast, ProgressBar, Skeleton, EmptyState, FAB, DatePicker), mascot component with mood-based expressions, and the theme toggle (light/dark/system) with `prefers-color-scheme` auto-detection.

## Source Traceability

| Document    | Reference           | Section / Page                   |
| ----------- | ------------------- | -------------------------------- |
| FSD         | FR-031              | Theme toggle (light/dark)        |
| FSD         | FR-032              | Custom habit colors              |
| FSD         | FR-033–036          | Navigation & layout              |
| FSD         | FR-039–040          | Animations & mascot              |
| TDD         | Frontend Arch       | §5.2 Component hierarchy         |
| TDD         | File Structure      | §9 Design System in code         |
| Design Sys  | All sections        | §2–9 Tokens, Components, Layout  |
| Wireframe   | All screens         | Responsive layouts               |

## Scope Definition

| In Scope                                                | Out of Scope                        |
| ------------------------------------------------------- | ----------------------------------- |
| CSS Custom Properties (`:root` + `[data-theme="dark"]`)   | Feature-specific page UI            |
| Global reset, base styles, typography                      | Backend logic                       |
| Responsive layout shell (sidebar, bottom nav, content)     | Business-specific data fetching     |
| Button component (4 variants, 4 sizes, all states)          | Habit/Task-specific cards           |
| Input component (text, email, password, number, textarea)    | Form validation logic               |
| Card component (static, interactive, expandable, selectable)  | —                                  |
| Modal / Bottom Sheet (responsive: sheet on mobile, dialog on desktop) | —                          |
| Toast notification system (success, error, info)               | —                                  |
| ProgressBar (linear + circular)                                 | —                                  |
| Skeleton loader with shimmer animation                           | —                                  |
| Empty state component with mascot                                 | —                                  |
| Floating Action Button (FAB)                                       | —                                  |
| DatePicker (day navigation)                                         | —                                  |
| Mascot component with 4 expression variants                         | —                                  |
| Theme toggle (light/dark/system) with persistence                    | —                                  |
| `useTheme` hook for theme management                                  | —                                  |
| `useMediaQuery` hook for responsive logic                              | —                                  |
| `prefers-reduced-motion` support                                        | —                                  |
| Inter font loading via `next/font`                                       | —                                  |

## High-Level Acceptance Criteria

- [ ] All design tokens from design-system.md are implemented as CSS Custom Properties
- [ ] Dark mode activates correctly via `[data-theme="dark"]` attribute
- [ ] System theme auto-detection works via `prefers-color-scheme` media query
- [ ] Theme toggle persists choice to localStorage and applies on page load
- [ ] Bottom navigation shows 3 tabs (Home, Tasks, Analytics) on mobile (<1024px)
- [ ] Sidebar shows category list on desktop (≥1024px)
- [ ] All interactive elements meet 44×44px minimum touch target
- [ ] Button, Input, Card, Modal, Toast, ProgressBar, Skeleton, EmptyState, FAB components work as specified
- [ ] Mascot displays 4 expressions (happy, proud, concerned, cheering) and transitions smoothly
- [ ] All animations respect `prefers-reduced-motion: reduce`
- [ ] Inter font loads with `display: swap` via `next/font`
- [ ] Skeleton loaders display during API loading states
- [ ] Focus-visible outline uses accent color with 2px offset

## Dependencies

- **Prerequisite EPICs:** EPIC-001 (project setup)
- **External Dependencies:** Google Fonts (Inter), mascot artwork (SVG/PNG assets)
- **Technical Prerequisites:** Next.js project initialized

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Low
- **Estimated Story Count:** 8–10

## Risks & Assumptions

**Assumptions:**
- Mascot artwork is provided as static assets (SVG preferred for theme compatibility)
- No CSS preprocessor needed — vanilla CSS Custom Properties are sufficient
- Framer Motion handles complex animations; CSS handles simpler transitions
- Bottom navigation and sidebar are mutually exclusive based on viewport

**Risks:**
- Component API surface may need adjustment as feature EPICs consume them
- Mascot expressions require design assets that may not be ready at sprint start
- Dark mode contrast ratios must be verified for all color combinations

## Related EPICs

- **Depends On:** EPIC-001
- **Blocks:** EPIC-009 (PWA theming)
- **Related:** All feature EPICs consume these components
