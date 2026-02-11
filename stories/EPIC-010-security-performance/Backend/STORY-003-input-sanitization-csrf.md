# STORY-003: Implement Input Sanitization & CSRF Protection

**Epic:** EPIC-010 - Security & Performance Hardening  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want all user inputs sanitized and CSRF protection on mutation endpoints,  
So that the application is safe from injection attacks and cross-site request forgery.

## Description
Implement input sanitization on all API endpoints to strip HTML/script tags from text inputs (habit names, task titles, reflection text, category names). Use DOMPurify or a server-side sanitizer. Implement CSRF token validation for all mutation (POST, PATCH, DELETE) endpoints. Zod schemas already validate types; this layer adds security-specific sanitization.

## Acceptance Criteria
```gherkin
GIVEN I submit a habit name containing "<script>alert('xss')</script>"
WHEN the server processes the input
THEN the HTML tags are stripped and stored as "alert('xss')"

GIVEN I submit a reflection text with HTML entities
WHEN the server sanitizes
THEN dangerous HTML is removed while safe text is preserved

GIVEN I make a POST request without a CSRF token
WHEN the CSRF middleware validates
THEN I receive 403 Forbidden with "Invalid CSRF token"

GIVEN I make a POST request with a valid CSRF token
WHEN the CSRF middleware validates
THEN the request proceeds normally

GIVEN I make a GET request
WHEN the CSRF middleware checks
THEN GET requests are exempt from CSRF validation (safe methods)

GIVEN the page loads
WHEN I inspect the meta tags or cookies
THEN a CSRF token is available for the client to use in requests
```

## Business Rules
- **BR-160:** All text inputs sanitized before persistence
- **BR-161:** HTML/script tags stripped from user input
- **BR-162:** CSRF token required on all state-changing requests
- **BR-163:** Safe methods (GET, HEAD, OPTIONS) exempt from CSRF

## Technical Notes
- Sanitization: custom utility using Zod `.transform()` + regex or `xss` npm package
- Apply sanitization as Zod schema transform: `.transform((val) => sanitize(val))`
- CSRF: `csrf-csrf` or `next-csrf` package for Next.js
- CSRF token: set in cookie (SameSite=Strict) or meta tag, validated via custom header `X-CSRF-Token`
- Middleware: check CSRF on POST/PATCH/DELETE in `src/middleware.ts`
- Whitelist: allow safe HTML entities like &amp; &lt; etc. in display

## Traceability
- **FSD Reference:** FR-043 (Input Sanitization), FR-044 (CSRF), BR-160–BR-163
- **TDD Reference:** §5.5 Security Configuration
- **Epic:** EPIC-010

## Dependencies
- **Depends On:** EPIC-001 (middleware), EPIC-002 (auth)
- **Blocks:** STORY-006 (Tests)
- **External Dependencies:** `xss` or `isomorphic-dompurify` library

## Definition of Done
- [ ] All text inputs sanitized in Zod schemas
- [ ] HTML/script injection prevented
- [ ] CSRF token generated and validated
- [ ] POST/PATCH/DELETE require valid CSRF token
- [ ] GET requests exempt from CSRF
- [ ] Client can access CSRF token for requests
- [ ] Unit tests passing
- [ ] Code merged to main branch
