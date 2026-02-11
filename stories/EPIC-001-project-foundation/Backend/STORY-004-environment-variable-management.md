# STORY-004: Setup Environment Variable Management

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Backend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a standardized environment variable management system with validation,  
So that misconfigured environments are caught early and secrets are never committed to version control.

## Description
Create `.env.example` with all required environment variables documented, set up Zod-based runtime validation for env vars at application startup, configure `.gitignore` to exclude `.env*` files (except `.env.example`), and document the variable setup process. Support dev/preview/production environments per TDD §2.3.

## Acceptance Criteria
```gherkin
GIVEN the .env.example file exists
WHEN a new developer clones the repo
THEN they can copy it to .env.local and fill in their values

GIVEN a required environment variable is missing
WHEN the application starts
THEN it throws a descriptive error listing the missing variable(s)

GIVEN all environment variables are set correctly
WHEN the application starts
THEN no env validation errors occur

GIVEN a developer accidentally adds .env.local
WHEN they stage files for commit
THEN .gitignore prevents .env.local from being committed
```

## Business Rules
- None specific — infrastructure security

## Technical Notes
- Required environment variables:
  - `DATABASE_URL` — PostgreSQL connection string
  - `NEXTAUTH_URL` — Application URL
  - `NEXTAUTH_SECRET` — JWT encryption secret
  - `GOOGLE_CLIENT_ID` — Google OAuth client ID
  - `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- Use `@t3-oss/env-nextjs` or custom Zod schema in `src/lib/env.ts`
- Validate at import time (top of `src/lib/env.ts`)

## Traceability
- **FSD Reference:** A-04 (OAuth credentials configured)
- **TDD Reference:** §2.3 Environments
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-001 (project initialized)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] `.env.example` with all variables documented
- [ ] Zod validation schema for env vars
- [ ] Missing variable generates descriptive error at startup
- [ ] `.gitignore` excludes `.env*` except `.env.example`
- [ ] Code merged to main branch
