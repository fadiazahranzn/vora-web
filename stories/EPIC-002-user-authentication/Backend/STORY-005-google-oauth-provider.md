# STORY-005: Implement Google OAuth Provider

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a user,  
I want to sign in with my Google account,  
So that I can register and log in without creating a separate password.

## Description
Add the Google OAuth provider to the NextAuth.js configuration. Handle account linking when a Google account email matches an existing credential-based account. Use the Google profile name as the display name and avatar URL from Google profile.

## Acceptance Criteria
```gherkin
GIVEN Google OAuth is configured
WHEN I click "Continue with Google" and authorize
THEN my account is created (or linked) and I am signed in

GIVEN I have an existing email/password account with email user@gmail.com
WHEN I sign in with Google using the same email
THEN my Google account is linked to the existing account (no duplicate)

GIVEN I sign in with Google for the first time
WHEN the account is created
THEN my Google profile name is used as the display name

GIVEN I close the Google authorization popup without completing
WHEN I return to the login page
THEN no error is shown and I remain on the login page

GIVEN Google OAuth fails (network issue, invalid config)
WHEN the error callback fires
THEN the error "Google sign-in failed. Please try again." is displayed
```

## Business Rules
- **BR-004:** Google account email matching existing credential account shall be linked
- **BR-005:** Google profile name used as display name

## Technical Notes
- Google provider config: `GoogleProvider({ clientId, clientSecret })`
- Callback URL: `{NEXTAUTH_URL}/api/auth/callback/google`
- Google Cloud Console: configure OAuth consent screen + credentials
- Account linking: handled by Prisma adapter (Account table links multiple providers)
- Environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

## Traceability
- **FSD Reference:** FR-002 (Google OAuth Registration/Login)
- **TDD Reference:** §4.3 Authentication
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-004 (NextAuth base configuration)
- **Blocks:** None
- **External Dependencies:** Google Cloud Console (OAuth client credentials)

## Definition of Done
- [ ] Google OAuth provider configured in NextAuth
- [ ] New users can register via Google
- [ ] Existing email accounts are linked to Google
- [ ] Google profile name and avatar are imported
- [ ] Popup close without auth handled gracefully
- [ ] Error states handled with user-friendly messages
- [ ] Code merged to main branch
