# STORY-006: Write Security & Performance Tests

**Epic:** EPIC-010 - Security & Performance Hardening  
**Role:** Others  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want security and performance tests,  
So that security headers, rate limiting, input sanitization, and bundle size constraints are verified.

## Description
Write tests that verify all security measures are in place and performance budgets are met. Includes header verification tests, rate limit behavior tests, input sanitization tests, CSRF validation tests, bundle size assertion tests, and Lighthouse CI budget tests.

## Acceptance Criteria
```gherkin
GIVEN the security header tests run
WHEN checking all response headers
THEN CSP, X-Frame-Options, HSTS, and other headers are present and correct

GIVEN the rate limit tests run
WHEN exceeding the limit
THEN 429 is returned with correct headers

GIVEN the sanitization tests run
WHEN submitting XSS payloads
THEN HTML/script tags are stripped from all text fields

GIVEN the CSRF tests run
WHEN making mutations without a token
THEN 403 is returned

GIVEN the bundle size tests run
WHEN checking the production build
THEN initial JS < 200KB gzipped

GIVEN the Lighthouse CI tests run
WHEN budgets are checked
THEN all category scores meet minimum targets
```

## Technical Notes
- Security headers: integration test that inspects response headers
- Rate limiting: test by making rapid sequential requests
- Sanitization: parameterized test with various XSS payloads
- CSRF: test with missing, invalid, and valid tokens
- Bundle size: `bundlesize` npm package or custom script checking `.next/static`
- Lighthouse CI: `@lhci/cli assert` with budget configuration

## Traceability
- **FSD Reference:** FR-041–FR-046, BR-151–BR-173
- **Epic:** EPIC-010

## Dependencies
- **Depends On:** STORY-001 (Headers), STORY-002 (Rate Limit), STORY-003 (Sanitization/CSRF), STORY-005 (Lighthouse)
- **Blocks:** None
- **External Dependencies:** bundlesize, @lhci/cli

## Definition of Done
- [x] Security header tests passing
- [x] Rate limit tests passing
- [x] Input sanitization tests with XSS payloads
- [x] CSRF validation tests passing
- [x] Bundle size assertion tests passing
- [x] Lighthouse CI budget tests configured and passing
- [x] All tests in CI
- [ ] Code merged to main branch
