# STORY-008: Implement requireAuth Guard Utility

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Backend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a reusable `requireAuth()` utility for API routes,  
So that I can easily protect endpoints and access the authenticated user's ID.

## Description
Create a `requireAuth()` utility function that extracts and validates the session from API route handlers. If no valid session exists, it returns a 401 Unauthorized response. If valid, it returns the authenticated user's ID and session data. This utility will be used by all protected API routes across all feature EPICs.

## Acceptance Criteria
```gherkin
GIVEN a protected API route uses requireAuth()
WHEN a request arrives with a valid session token
THEN the function returns the user's ID and session object

GIVEN a protected API route uses requireAuth()
WHEN a request arrives without a session token
THEN the function returns a 401 Unauthorized JSON response

GIVEN a protected API route uses requireAuth()
WHEN a request arrives with an expired session token
THEN the function returns a 401 Unauthorized JSON response

GIVEN requireAuth() is used across multiple API routes
WHEN each route calls the utility
THEN it provides consistent authentication behavior and error responses
```

## Business Rules
- **BR-008:** A valid session token (JWT) must be present for all authenticated API requests

## Technical Notes
- Location: `src/lib/auth.ts` (alongside NextAuth config)
- Implementation: `getServerSession(authOptions)` → extract `session.user.id`
- Return type: `{ userId: string; session: Session }` or throw `AppError`
- Usage pattern:
  ```typescript
  export async function GET(req: NextRequest) {
    const { userId } = await requireAuth()
    // ... use userId for data queries
  }
  ```
- Consistent 401 response format: `{ error: "Unauthorized", message: "Authentication required" }`

## Traceability
- **FSD Reference:** FR-005 (Session Management), BR-008
- **TDD Reference:** §4.3 Authentication, §8.1 Error Handling
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-004 (NextAuth configured)
- **Blocks:** All backend stories in EPIC-003 through EPIC-010
- **External Dependencies:** None

## Definition of Done
- [ ] `requireAuth()` utility function implemented
- [ ] Returns userId and session on valid auth
- [ ] Returns 401 on missing/invalid/expired token
- [ ] Used in at least one example API route
- [ ] Unit tests passing
- [ ] Code merged to main branch
