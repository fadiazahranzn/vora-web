# STORY-006: Setup CI/CD Pipeline

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Others  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want an automated CI/CD pipeline that runs on every pull request,  
So that code quality, type safety, and tests are verified before merging.

## Description
Create a GitHub Actions workflow that executes on every PR: lint → type-check → test → build. Configure Vercel for automatic preview deployments on feature branches and production deployment on main branch merge. Set up branch protection rules requiring CI to pass before merging.

## Acceptance Criteria
```gherkin
GIVEN a pull request is opened
WHEN the CI workflow triggers
THEN it runs lint, type-check, unit tests, and build steps in sequence

GIVEN a lint error exists in the PR
WHEN the CI pipeline runs
THEN the pipeline fails on the lint step with a descriptive error

GIVEN all CI checks pass
WHEN I view the PR on GitHub
THEN a green checkmark appears on the CI status

GIVEN a PR is merged to main
WHEN Vercel detects the push
THEN a production deployment is triggered automatically

GIVEN a feature branch PR is opened
WHEN Vercel detects the PR
THEN a preview deployment is created with a unique URL
```

## Business Rules
- None specific — DevOps infrastructure

## Technical Notes
- GitHub Actions workflow file: `.github/workflows/ci.yml`
- Steps: `install → lint → tsc --noEmit → vitest run → next build`
- Node.js 20 LTS in CI
- Cache `node_modules` and `.next/cache` for faster builds
- Vercel integration: automatic via GitHub App or `vercel.json`
- Branch protection: require CI pass + 1 review for main

## Traceability
- **FSD Reference:** N/A (DevOps)
- **TDD Reference:** §9.3 CI/CD Pipeline
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-005 (ESLint config), STORY-007 (test framework)
- **Blocks:** None
- **External Dependencies:** GitHub Actions, Vercel account

## Definition of Done
- [ ] `.github/workflows/ci.yml` created and runs successfully
- [ ] Pipeline stages: lint → type-check → test → build
- [ ] Preview deployments work for PRs
- [ ] Production deployment on main merge works
- [ ] CI runs complete in < 5 minutes
- [ ] Code merged to main branch
