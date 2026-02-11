# STORY-005: Configure ESLint, Prettier & Git Hooks

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want automated code quality and formatting tools running on every commit,  
So that the codebase maintains consistent style and catches errors early.

## Description
Configure ESLint with Next.js recommended rules and TypeScript parser, set up Prettier for code formatting, and install Husky + lint-staged to run lint and format checks on every Git commit. This ensures no malformed or unformatted code reaches the repository.

## Acceptance Criteria
```gherkin
GIVEN ESLint is configured
WHEN I run `npm run lint`
THEN ESLint checks all .ts/.tsx files with Next.js and TypeScript rules

GIVEN Prettier is configured
WHEN I run `npm run format`
THEN all source files are formatted according to the Prettier configuration

GIVEN Husky git hooks are installed
WHEN I make a commit with linting errors
THEN the commit is rejected with a descriptive error message

GIVEN lint-staged is configured
WHEN I commit only staged files
THEN only those files are linted and formatted (not the entire codebase)

GIVEN a new developer clones the repo and runs npm install
WHEN the installation completes
THEN Husky hooks are automatically set up (via `prepare` script)
```

## Business Rules
- None specific — developer tooling

## Technical Notes
- ESLint config: `eslint-config-next`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`
- Prettier config: `semi: false`, `singleQuote: true`, `trailingComma: 'es5'`, `tabWidth: 2`
- Husky: `pre-commit` hook runs lint-staged
- lint-staged config: `"*.{ts,tsx}": ["eslint --fix", "prettier --write"]`
- Add scripts: `"lint"`, `"format"`, `"format:check"` to package.json

## Traceability
- **FSD Reference:** N/A (developer tooling)
- **TDD Reference:** §9.1 Coding Standards
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-001 (project initialized)
- **Blocks:** STORY-006 (CI pipeline runs lint)
- **External Dependencies:** None

## Definition of Done
- [ ] ESLint configured with TypeScript + Next.js rules
- [ ] Prettier configured with project conventions
- [ ] Husky pre-commit hook installed and working
- [ ] lint-staged runs on staged files only
- [ ] `npm run lint` and `npm run format` scripts work
- [ ] Code merged to main branch
