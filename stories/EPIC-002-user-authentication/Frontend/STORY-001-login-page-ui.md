# STORY-001: Build Login Page UI

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a returning user,  
I want a clean login page with email/password fields and a Google sign-in button,  
So that I can access my account quickly and securely.

## Description
Build the login page UI at `/login` with email input, password input, "Log In" submit button, "Continue with Google" OAuth button, and a link to the registration page. The page should match the wireframe Screen 1 and design system specifications. Include client-side validation, loading states, and error message display.

## Acceptance Criteria
```gherkin
GIVEN I navigate to /login
WHEN the page renders
THEN I see email input, password input, "Log In" button, "Continue with Google" button, and "Don't have an account? Register" link

GIVEN I am already authenticated
WHEN I navigate to /login
THEN I am redirected to the Home Dashboard (/)

GIVEN I submit the form with empty fields
WHEN I click "Log In"
THEN I see inline validation errors for required fields

GIVEN I enter invalid credentials
WHEN I click "Log In"
THEN I see the error message "Invalid email or password"

GIVEN I click "Log In" with valid data
WHEN the request is processing
THEN the button shows a loading spinner and is disabled

GIVEN my account is locked
WHEN I try to log in
THEN I see "Too many failed attempts. Please try again in 15 minutes."
```

## Business Rules
- **BR-006:** After 5 failed login attempts, show lockout message
- **BR-007:** Sessions expire after 30 days
- **BR-008:** Valid JWT must be present for authenticated routes

## Technical Notes
- Route: `/login` (outside the `(app)` route group)
- Use design system Input and Button components (EPIC-008)
- Google button uses `signIn('google')` from NextAuth
- Form state management with `useFormState` or React Hook Form
- Accessibility: all inputs have associated labels, focus management on error

## Traceability
- **FSD Reference:** FR-003 (User Login), BR-006, BR-007, BR-008
- **Wireframe Reference:** Screen 1 — Login
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-004 (NextAuth configured)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Login page renders at /login with all specified elements
- [ ] Client-side validation works for empty/invalid fields
- [ ] Error messages display correctly
- [ ] Loading state shows during submission
- [ ] Redirect logic works for authenticated users
- [ ] Accessibility audit passes (keyboard nav, screen reader)
- [ ] Code merged to main branch
