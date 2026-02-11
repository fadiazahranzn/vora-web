# STORY-001: Implement Security Headers Middleware

**Epic:** EPIC-010 - Security & Performance Hardening  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want all HTTP responses to include security headers,  
So that the application is protected against common web vulnerabilities (XSS, clickjacking, MIME sniffing).

## Description
Configure Next.js middleware (or `next.config.js` headers) to add security headers to all responses. Headers include Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and Strict-Transport-Security (HSTS). CSP should be restrictive but allow required external resources (Google Fonts, analytics if applicable).

## Acceptance Criteria
```gherkin
GIVEN any HTTP response from the application
WHEN I inspect the response headers
THEN I see Content-Security-Policy with script-src, style-src, img-src, font-src directives

GIVEN the response headers
WHEN I check X-Frame-Options
THEN it is set to "DENY"

GIVEN the response headers
WHEN I check X-Content-Type-Options
THEN it is set to "nosniff"

GIVEN the response headers
WHEN I check Referrer-Policy
THEN it is set to "strict-origin-when-cross-origin"

GIVEN the response headers
WHEN I check Strict-Transport-Security
THEN it is set to "max-age=31536000; includeSubDomains"

GIVEN the CSP header
WHEN I check script-src
THEN it includes 'self' and 'nonce-' or 'strict-dynamic' for inline scripts
```

## Business Rules
- **BR-151:** All responses must include security headers
- **BR-152:** CSP must block inline scripts (except nonce-based)
- **BR-153:** X-Frame-Options prevents clickjacking
- **BR-154:** HSTS enforces HTTPS

## Technical Notes
- Method: `next.config.js` `headers()` function or middleware
- CSP: `default-src 'self'; script-src 'self' 'nonce-{dynamic}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://*.googleapis.com`
- Nonce generation: per-request nonce for Next.js inline scripts
- HSTS: only set in production (not in dev)
- Permissions-Policy: `camera=(), microphone=(), geolocation=()`

## Traceability
- **FSD Reference:** FR-041 (Security Headers), BR-151–BR-154
- **TDD Reference:** §5.5 Security Configuration
- **Epic:** EPIC-010

## Dependencies
- **Depends On:** EPIC-001 (Next.js configuration)
- **Blocks:** STORY-006 (Tests)
- **External Dependencies:** None

## Definition of Done
- [ ] CSP header set with appropriate directives
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] HSTS set in production
- [ ] Permissions-Policy configured
- [ ] App still functions correctly with CSP applied
- [ ] Code merged to main branch
