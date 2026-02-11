# STORY-002: Implement Rate Limiting

**Epic:** EPIC-010 - Security & Performance Hardening  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want rate limiting on API endpoints and authentication routes,  
So that the application is protected against brute-force attacks and API abuse.

## Description
Implement tiered rate limiting: global API limit (100 requests/minute per IP), auth endpoint limit (10 requests/minute per IP for login/register), and mutation endpoint limit (30 requests/minute per user). Rate limit information is returned in response headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset). When exceeded, return 429 Too Many Requests.

## Acceptance Criteria
```gherkin
GIVEN I make 101 API requests in 1 minute
WHEN the rate limit is exceeded
THEN I receive 429 Too Many Requests with Retry-After header

GIVEN I make 11 login requests in 1 minute
WHEN the auth rate limit is exceeded
THEN I receive 429 with "Too many login attempts. Try again in X seconds."

GIVEN I check response headers on any API call
WHEN I inspect X-RateLimit-*
THEN I see Limit, Remaining, and Reset headers

GIVEN the rate limit window resets
WHEN I wait for the reset period
THEN my requests are allowed again at the full limit

GIVEN different users make requests from different IPs
WHEN rate limits are checked
THEN each IP/user has independent counters
```

## Business Rules
- **BR-155:** Global API: 100 req/min per IP
- **BR-156:** Auth endpoints: 10 req/min per IP
- **BR-157:** Mutation endpoints: 30 req/min per authenticated user
- **BR-158:** 429 response with Retry-After header
- **BR-159:** Rate limit headers on all responses

## Technical Notes
- Library: `upstash/ratelimit` with Redis adapter, or in-memory `Map` for dev
- Middleware: `src/middleware.ts` — apply rate limit before route handlers
- Key strategy: IP-based for unauthenticated, userId-based for authenticated
- Redis: Upstash Redis for production (sliding window algorithm)
- Dev fallback: in-memory rate limiter with Map
- Auth routes: `/api/auth/*` — stricter limit
- Rate limit headers: added in middleware before/after processing

## Traceability
- **FSD Reference:** FR-042 (Rate Limiting), BR-155–BR-159
- **TDD Reference:** §5.5 Security Configuration
- **Epic:** EPIC-010

## Dependencies
- **Depends On:** EPIC-001 (Next.js middleware), EPIC-002 (auth for user identification)
- **Blocks:** STORY-006 (Tests)
- **External Dependencies:** Upstash Redis (or similar)

## Definition of Done
- [ ] Global rate limit: 100 req/min per IP
- [ ] Auth rate limit: 10 req/min per IP
- [ ] Mutation rate limit: 30 req/min per user
- [ ] 429 response with Retry-After header
- [ ] X-RateLimit-* headers on all responses
- [ ] Independent counters per IP/user
- [ ] Production Redis setup
- [ ] Dev fallback to in-memory
- [ ] Unit tests passing
- [ ] Code merged to main branch
