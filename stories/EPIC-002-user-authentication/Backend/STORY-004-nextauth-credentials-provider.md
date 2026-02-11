# STORY-004: Configure NextAuth.js with Credentials Provider

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want NextAuth.js v5 configured with the Prisma adapter and Credentials provider,  
So that the authentication system supports email/password login with JWT sessions.

## Description
Install and configure NextAuth.js v5 with the Prisma adapter for database session management. Set up the Credentials provider for email/password authentication with bcrypt password verification. Configure JWT strategy with 30-day session expiry, HTTP-only cookies, and the necessary callbacks (jwt, session) to include userId in the token.

## Acceptance Criteria
```gherkin
GIVEN NextAuth is configured
WHEN I call the signin API with valid email and password
THEN a JWT session is created and returned as an HTTP-only cookie

GIVEN valid credentials are provided
WHEN NextAuth processes the signin
THEN the password is verified against the bcrypt hash in the database

GIVEN authentication succeeds
WHEN the JWT callback fires
THEN the user's ID is included in the JWT token

GIVEN the session callback fires
WHEN accessing the session on the server
THEN the session object includes the user's ID, name, and email

GIVEN an invalid NEXTAUTH_SECRET
WHEN NextAuth tries to decrypt a token
THEN it fails gracefully with a JWEDecryptionFailed error (not a crash)

GIVEN the NextAuth API routes are set up
WHEN I navigate to /api/auth/signin
THEN the NextAuth default (or custom) signin page loads
```

## Business Rules
- **BR-007:** Sessions expire after 30 days of inactivity
- **BR-008:** JWT must be present for authenticated API requests

## Technical Notes
- NextAuth v5 with App Router: `src/app/api/auth/[...nextauth]/route.ts`
- Auth config: `src/lib/auth.ts`
- Prisma adapter: `@auth/prisma-adapter`
- JWT strategy: `{ strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }`
- Password hashing: bcrypt with 12 rounds
- Callbacks: `jwt` (add userId), `session` (expose userId)
- Pages: `{ signIn: "/login" }` (custom page)

## Traceability
- **FSD Reference:** FR-003 (Login), FR-005 (Session), BR-007, BR-008
- **TDD Reference:** §4.3 Authentication & Auth
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** EPIC-001 (Prisma schema with User, Account, Session)
- **Blocks:** STORY-001, STORY-003, STORY-005, STORY-006, STORY-008
- **External Dependencies:** None

## Definition of Done
- [ ] NextAuth v5 configured with Prisma adapter
- [ ] Credentials provider verifies email/password with bcrypt
- [ ] JWT sessions created with 30-day expiry
- [ ] JWT and session callbacks include userId
- [ ] HTTP-only cookies for session storage
- [ ] Custom signin page configured
- [ ] Unit tests for auth configuration passing
- [ ] Code merged to main branch
