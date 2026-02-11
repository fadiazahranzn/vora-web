# STORY-004: Implement Bundle Optimization & Code Splitting

**Epic:** EPIC-010 - Security & Performance Hardening  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want the application bundle optimized with code splitting, tree shaking, and lazy loading,  
So that the initial page load is fast and only necessary code is downloaded.

## Description
Optimize the production bundle by implementing route-based code splitting (Next.js automatic), component-level lazy loading for heavy components (Recharts, confetti, mascot), tree shaking of unused exports, image optimization with `next/image`, and font optimization. Target: initial JS bundle < 200KB gzipped for the main route.

## Acceptance Criteria
```gherkin
GIVEN I build the production bundle
WHEN I analyze the bundle size
THEN the initial JS for the main route is < 200KB gzipped

GIVEN the Analytics page loads
WHEN Recharts is required
THEN it is loaded as a separate chunk (not in the initial bundle)

GIVEN the mood check-in triggers confetti
WHEN canvas-confetti is needed
THEN it is loaded dynamically at that moment

GIVEN I view images in the app
WHEN the images render
THEN they use next/image with WebP format and appropriate sizing

GIVEN I inspect the font loading
WHEN Google Fonts (Inter) loads
THEN it uses font-display: swap and is preloaded

GIVEN the production build runs
WHEN tree shaking occurs
THEN unused exports are eliminated from the bundle
```

## Business Rules
- **BR-164:** Initial JS bundle < 200KB gzipped
- **BR-165:** Heavy libraries lazy-loaded
- **BR-166:** Images optimized with next/image
- **BR-167:** Fonts optimized with preloading

## Technical Notes
- Next.js: automatic route-based code splitting
- Dynamic imports: `React.lazy()` or `next/dynamic` for Recharts, canvas-confetti, MascotPNG
- Bundle analyzer: `@next/bundle-analyzer` for visualization
- Images: `next/image` with `format=webp`, responsive sizes
- Fonts: `next/font/google` for Inter (automatic optimization)
- Tree shaking: ensure named exports, avoid barrel file re-exports
- Compression: verify gzip/brotli in production server

## Traceability
- **FSD Reference:** FR-045 (Bundle Optimization), BR-164–BR-167
- **TDD Reference:** §5.6 Performance Optimization
- **Epic:** EPIC-010

## Dependencies
- **Depends On:** All feature EPICs (optimizing the complete application)
- **Blocks:** STORY-005 (Lighthouse Targets)
- **External Dependencies:** @next/bundle-analyzer

## Definition of Done
- [ ] Initial JS bundle < 200KB gzipped
- [ ] Heavy libraries lazy-loaded (Recharts, confetti)
- [ ] Images use next/image with WebP
- [ ] Fonts use next/font with preloading
- [ ] Bundle analyzer report reviewed
- [ ] No unused large dependencies
- [ ] Production build succeeds
- [ ] Code merged to main branch
