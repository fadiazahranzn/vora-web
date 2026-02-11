# STORY-003: Implement Auth State & Route Protection

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want protected routes that prevent unauthorized access,  
So that my data is secure and unauthenticated users cannot view app content.

## Description
Implement Next.js middleware for route protection that redirects unauthenticated users to `/login` for all `(app)` routes, and redirects authenticated users away from `/login` and `/register`. Create a `useSession` hook wrapper for client components and implement the logout flow that clears session and redirects.

## Acceptance Criteria
```gherkin
GIVEN I am not authenticated
WHEN I navigate to any page under the (app) route group
THEN I am redirected to /login

GIVEN I am authenticated
WHEN I navigate to /login or /register
THEN I am redirected to the Home Dashboard (/)

GIVEN I am authenticated
WHEN I click "Log out" in settings
THEN my session is terminated, cookies are cleared, and I am redirected to /login

GIVEN I log out
WHEN I use the browser back button
THEN I cannot access authenticated pages (redirected to /login)

GIVEN I close and reopen the browser within 30 days
WHEN the page loads
THEN I am still authenticated (session persists)
```

## Business Rules
- **BR-009:** Logout shall invalidate the current session token
- **BR-010:** Locally cached data shall be preserved for offline access upon re-login
- **BR-011:** Sessions shall persist across browser restarts
- **BR-012:** When a session expires, the user shall be prompted to re-authenticate

## Technical Notes
- Use Next.js `middleware.ts` for server-side route protection
- `matcher` config: all routes except `/login`, `/register`, `/api/auth/*`, `/_next/*`, static assets
- Client-side: wrap `(app)` layout with `SessionProvider` from NextAuth
- Logout: call `signOut({ callbackUrl: '/login' })` from NextAuth
- Handle session expiry with redirect to `/login?expired=true`

## Traceability
- **FSD Reference:** FR-004 (Logout), FR-005 (Session Persistence)
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-004 (NextAuth configured)
- **Blocks:** All feature stories that require authentication
- **External Dependencies:** None

## Definition of Done
- [ ] Middleware redirects unauthenticated users from (app) routes
- [ ] Middleware redirects authenticated users from auth pages
- [ ] Logout clears session and redirects
- [ ] Session persists across browser restarts
- [ ] Back button after logout doesn't expose content
- [ ] Code merged to main branch
