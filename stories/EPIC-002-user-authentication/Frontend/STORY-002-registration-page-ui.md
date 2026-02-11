# STORY-002: Build Registration Page UI

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a new user,  
I want a registration page with name, email, and password fields,  
So that I can create an account and start tracking my habits.

## Description
Build the registration page at `/register` with name, email, password, and confirm password inputs plus a "Create Account" button, "Continue with Google" OAuth button, and link to login. Include real-time password strength validation showing unmet requirements and confirm password matching.

## Acceptance Criteria
```gherkin
GIVEN I navigate to /register
WHEN the page renders
THEN I see name, email, password, confirm password inputs, "Create Account" button, Google button, and login link

GIVEN I enter a password that doesn't meet requirements
WHEN I type in the password field
THEN I see live validation: checkmarks for met criteria, X marks for unmet (≥8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit)

GIVEN I enter a password and a different confirm password
WHEN the confirm password loses focus
THEN I see "Passwords do not match" error

GIVEN I enter an email already in use
WHEN I submit the form
THEN I see "An account with this email already exists"

GIVEN registration succeeds
WHEN the account is created
THEN I am redirected to the Home Dashboard

GIVEN I click "Continue with Google"
WHEN the Google popup completes authorization
THEN my account is created and I am redirected to Home Dashboard
```

## Business Rules
- **BR-001:** Email must be unique across all accounts
- **BR-002:** Password ≥ 8 characters, ≥ 1 uppercase, ≥ 1 lowercase, ≥ 1 digit
- **BR-003:** Email must match RFC 5322 format
- **BR-004:** Google account email matching existing credential account shall be linked
- **BR-005:** Google profile name used as display name

## Technical Notes
- Route: `/register` (outside the `(app)` route group)
- Password requirements regex: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`
- Real-time password strength indicator showing each criterion
- Use design system components
- Analytics event: `user_registered` with `authMethod: "email"` or `"google"`

## Traceability
- **FSD Reference:** FR-001 (Email Registration), FR-002 (Google OAuth Registration)
- **Wireframe Reference:** Screen 1 — Register
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-007 (Registration API), STORY-004 (NextAuth for Google)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Registration page renders with all fields
- [ ] Real-time password strength validation works
- [ ] Confirm password matching validation works
- [ ] Duplicate email error displays correctly
- [ ] Successful registration redirects to dashboard
- [ ] Google OAuth registration works
- [ ] Analytics events fire on registration
- [ ] Code merged to main branch
