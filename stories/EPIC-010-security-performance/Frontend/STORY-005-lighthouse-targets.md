# STORY-005: Achieve Lighthouse Performance Targets

**Epic:** EPIC-010 - Security & Performance Hardening  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want the application to score ≥90 on all Lighthouse audit categories,  
So that the app delivers a fast, accessible, best-practice-compliant experience.

## Description
Optimize the application to achieve Lighthouse scores: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95, PWA ≥90. This involves addressing any remaining performance bottlenecks, accessibility gaps, meta tag completions, and PWA audit requirements. Run Lighthouse CI in the deployment pipeline.

## Acceptance Criteria
```gherkin
GIVEN I run Lighthouse audit on the Home Dashboard
WHEN the audit completes
THEN Performance score is ≥ 90

GIVEN I run Lighthouse audit on any page
WHEN the Accessibility audit completes
THEN Accessibility score is ≥ 95

GIVEN I run Lighthouse audit
WHEN Best Practices audit completes
THEN Best Practices score is ≥ 95

GIVEN I run Lighthouse audit
WHEN SEO audit completes
THEN SEO score is ≥ 95

GIVEN I run Lighthouse PWA audit
WHEN the PWA checklist is evaluated
THEN PWA score is ≥ 90

GIVEN specific performance metrics
WHEN I measure
THEN FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TTI < 3.5s on 4G connection
```

## Business Rules
- **BR-168:** Lighthouse Performance ≥ 90
- **BR-169:** Lighthouse Accessibility ≥ 95
- **BR-170:** Lighthouse Best Practices ≥ 95
- **BR-171:** Lighthouse SEO ≥ 95
- **BR-172:** Lighthouse PWA ≥ 90
- **BR-173:** Core Web Vitals: FCP < 1.5s, LCP < 2.5s, CLS < 0.1

## Technical Notes
- Run `lighthouse` CLI or Chrome DevTools audit on production build
- Lighthouse CI: `@lhci/cli` in CI/CD pipeline with budget assertions
- Performance: preload critical resources, defer non-critical JS, optimize images
- Accessibility: ensure all aria-labels, alt text, contrast, focus indicators
- SEO: meta description, canonical URL, heading hierarchy, sitemap
- Best Practices: HTTPS, no console errors, no deprecated APIs
- PWA: manifest, service worker, offline fallback, HTTPS

## Traceability
- **FSD Reference:** FR-046 (Lighthouse Targets), BR-168–BR-173
- **TDD Reference:** §5.6 Performance Optimization, §5.7 Monitoring
- **Epic:** EPIC-010

## Dependencies
- **Depends On:** STORY-004 (Bundle Optimization)
- **Blocks:** STORY-006 (Tests)
- **External Dependencies:** Lighthouse CLI, @lhci/cli

## Definition of Done
- [ ] Lighthouse Performance ≥ 90 on main route
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Lighthouse PWA ≥ 90
- [ ] FCP < 1.5s, LCP < 2.5s, CLS < 0.1
- [ ] Lighthouse CI budget assertions configured
- [ ] Code merged to main branch
