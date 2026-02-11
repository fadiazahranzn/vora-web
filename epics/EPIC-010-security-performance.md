# EPIC-010: Harden Security & Performance

## Business Value Statement

Ensure Vora meets production-grade security and performance standards so users can trust the application with their personal data and experience consistently fast, reliable interactions — protecting both user safety and brand reputation.

## Description

This cross-cutting EPIC addresses non-functional requirements: security headers (CSP, X-Frame-Options, etc.), rate limiting on API endpoints, input sanitization verification, CSRF protection audit, performance benchmarking against defined targets (FCP <1.5s, API P95 <200ms), bundle size optimization, lazy loading of heavy components, image optimization, and Lighthouse audits. It also covers structured logging setup and health check endpoint.

## Source Traceability

| Document  | Reference            | Section / Page                 |
| --------- | -------------------- | ------------------------------ |
| TDD       | Security Controls    | §6.1 Security Controls         |
| TDD       | Security Headers     | §6.3 HTTP Security Headers     |
| TDD       | Data Protection      | §6.2 Data Protection           |
| TDD       | Performance Targets  | §7.1 Performance Requirements  |
| TDD       | Optimization         | §7.3 Optimization Techniques   |
| TDD       | Error Handling       | §8.1 Error Handling Strategy   |
| TDD       | Logging              | §8.2 Logging & Monitoring      |
| FSD       | NFR (throughout)     | Security, performance mentions |

## Scope Definition

| In Scope                                                | Out of Scope                        |
| ------------------------------------------------------- | ----------------------------------- |
| Security headers in `next.config.js`                      | Penetration testing (external)      |
| Content Security Policy (CSP) configuration                | SOC 2 compliance audit              |
| Rate limiting: 100 req/min general, 10 req/min auth        | WAF / DDoS protection (infra level) |
| CSRF token verification audit                                | Data encryption key management      |
| Input sanitization audit (Zod + Prisma parameterized)         | Bug bounty program                  |
| Row-level security audit (userId filtering in all queries)     | —                                  |
| Bundle analysis + optimization (target <150KB gzipped)          | —                                  |
| Lazy loading: Recharts, Framer Motion, confetti                  | —                                  |
| `next/image` for all images and mascot assets                     | —                                  |
| `next/font` for Inter with `display: swap`                         | —                                  |
| Lighthouse audit: Performance ≥90, Accessibility ≥90, SEO ≥90      | —                                  |
| Structured logging with `pino`                                       | —                                  |
| Health check endpoint: GET /api/health                                | —                                  |
| Error response standardization (AppError class)                        | —                                  |
| Soft-deleted data purge documentation (90-day policy)                   | —                                  |

## High-Level Acceptance Criteria

- [ ] All security headers from TDD §6.3 are set in `next.config.js` and verified
- [ ] CSP blocks inline scripts from external sources; allows Google OAuth and fonts
- [ ] Rate limiter returns 429 after exceeding threshold (tested with load tool)
- [ ] All API routes validate input with Zod before processing
- [ ] No API route returns data belonging to another user (row-level security audit)
- [ ] Passwords are never included in any API response
- [ ] Lighthouse Performance score ≥ 90 on Home Dashboard
- [ ] Lighthouse Accessibility score ≥ 90 on all pages
- [ ] Main JS bundle < 150KB gzipped
- [ ] Recharts and Framer Motion are lazy-loaded (not in initial bundle)
- [ ] Structured JSON logging via `pino` in all API routes
- [ ] GET /api/health returns 200 with database connectivity check
- [ ] AppError class and `withErrorHandling` wrapper used in all route handlers
- [ ] Core Web Vitals: FCP <1.5s, LCP <2.5s, CLS <0.1

## Dependencies

- **Prerequisite EPICs:** EPIC-001 (baseline config), EPIC-002 (auth to audit)
- **External Dependencies:** None
- **Technical Prerequisites:** Feature EPICs should be substantially complete for meaningful audit

## Complexity Assessment

- **Size:** S
- **Technical Complexity:** Medium
- **Integration Complexity:** Low
- **Estimated Story Count:** 5–7

## Risks & Assumptions

**Assumptions:**
- Rate limiting uses in-memory LRU cache (acceptable for serverless with low concurrency)
- Structured logging is sufficient (no external APM tool in v1)
- Lighthouse audits run against production build on Vercel Preview
- Soft-delete purge is documented but implemented as a manual database script (no automated cron in v1)

**Risks:**
- CSP may break Google OAuth or font loading if not configured carefully — test all auth flows after applying
- In-memory rate limiting resets on each serverless cold start — may need Redis for production
- Bundle optimization may require trade-offs with feature richness

## Related EPICs

- **Depends On:** EPIC-001, EPIC-002
- **Blocks:** None (runs in parallel as continuous hardening)
- **Related:** All EPICs (security & performance are cross-cutting)
