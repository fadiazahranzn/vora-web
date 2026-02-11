# STORY-007: Configure Testing Framework

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want Vitest for unit/integration tests and Playwright for E2E tests configured,  
So that all feature stories can include automated test coverage from day one.

## Description
Install and configure Vitest as the unit/integration test runner with React Testing Library for component tests. Install and configure Playwright for end-to-end browser testing. Set up test scripts, coverage reporting, and create example test files to validate the setup.

## Acceptance Criteria
```gherkin
GIVEN Vitest is installed
WHEN I run `npm run test`
THEN Vitest executes all *.test.ts files and reports results

GIVEN React Testing Library is configured
WHEN I write a component test rendering a React component
THEN the test compiles and runs successfully

GIVEN Playwright is installed
WHEN I run `npm run test:e2e`
THEN Playwright launches a browser and runs *.spec.ts files

GIVEN coverage is configured
WHEN I run `npm run test:coverage`
THEN a coverage report is generated showing line and branch coverage

GIVEN an example test file exists
WHEN a new developer checks out the project
THEN they have a working test example to reference
```

## Business Rules
- None specific — testing infrastructure

## Technical Notes
- Vitest config: `vitest.config.ts` with path aliases matching tsconfig
- React Testing Library: `@testing-library/react`, `@testing-library/jest-dom`
- Playwright config: `playwright.config.ts` with Chrome, Firefox, WebKit
- Scripts: `"test"`, `"test:watch"`, `"test:coverage"`, `"test:e2e"`
- Coverage provider: `v8` (built into Vitest)
- Create `__tests__/` directory convention or colocate with `.test.ts` suffix

## Traceability
- **FSD Reference:** N/A (testing infrastructure)
- **TDD Reference:** §9.2 Testing Strategy
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-001 (project initialized)
- **Blocks:** STORY-006 (CI pipeline runs tests)
- **External Dependencies:** None

## Definition of Done
- [ ] Vitest configured and running unit tests
- [ ] React Testing Library installed and working
- [ ] Playwright configured with multi-browser support
- [ ] Coverage reporting functional
- [ ] Example test files created for each framework
- [ ] Test scripts added to package.json
- [ ] Code merged to main branch
