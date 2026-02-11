# STORY-004: Build Theme Switcher (Light/Dark/System)

**Epic:** EPIC-008 - Implement Design System & Theming  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to switch between light, dark, and system themes,  
So that I can use the app in my preferred visual mode including automatic OS-based switching.

## Description
Build the theme switcher with 3 options (Light ☀️, Dark 🌙, System 🖥️). The switcher lives in the sidebar on desktop and the Profile page on mobile. Theme preference is persisted in localStorage and applied immediately without flash. System mode uses `prefers-color-scheme` media query. Critical CSS prevents FOUC (Flash of Unstyled Content) by applying theme before first render.

## Acceptance Criteria
```gherkin
GIVEN I select "Dark" theme
WHEN the theme applies
THEN all colors switch to dark mode values immediately (no flash)

GIVEN I select "System"
WHEN my OS is set to dark mode
THEN the app renders in dark theme

GIVEN I select "Light"
WHEN the theme applies
THEN all colors switch to light mode values

GIVEN I select a theme and close the browser
WHEN I reopen the app
THEN the same theme is active (persisted in localStorage)

GIVEN the page loads for the first time
WHEN no theme preference exists
THEN the System theme is used (matching OS preference)

GIVEN I switch from dark to light
WHEN the transition occurs
THEN background and text colors transition smoothly (200ms)
```

## Business Rules
- **BR-128:** Three theme options: Light, Dark, System
- **BR-129:** Default: System (matches OS preference)
- **BR-130:** Preference persisted in localStorage
- **BR-131:** No FOUC — theme applied before first paint
- **BR-132:** System mode listens to `prefers-color-scheme` changes in real-time

## Technical Notes
- Theme context: `src/contexts/ThemeContext.tsx` with `useTheme()` hook
- FOUC prevention: inline `<script>` in `<head>` (via `src/app/layout.tsx`) that reads localStorage and sets `data-theme` before React hydrates
- localStorage key: `vora-theme` with values `light|dark|system`
- System mode: `matchMedia('(prefers-color-scheme: dark)')` with `addEventListener('change')`
- Theme toggle UI: 3-segment button with icons (☀️ 🌙 🖥️)
- CSS transition: `transition: background-color 200ms, color 200ms` on `body`

## Traceability
- **FSD Reference:** FR-034 (Theme Support), BR-128–BR-132
- **Wireframe Reference:** Screen 9 — Profile/Settings
- **Design System:** Theme Switcher §4
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-001 (Design Tokens with dark variants)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] 3 theme options selectable: Light, Dark, System
- [ ] Theme applied immediately, no FOUC
- [ ] localStorage persistence across sessions
- [ ] System mode tracks OS preference in real-time
- [ ] Smooth 200ms transition between themes
- [ ] Default is System when no preference set
- [ ] FOUC prevention script in <head>
- [ ] Code merged to main branch
