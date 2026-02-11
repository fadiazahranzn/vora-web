# STORY-001: Initialize Next.js Project with TypeScript

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want a properly initialized Next.js 14+ project with TypeScript strict mode,  
So that I have a reliable, type-safe foundation to build all application features.

## Description
Scaffold the Next.js 14+ project using the App Router with TypeScript in strict mode. Configure the `@/` path alias for clean imports, set up the base folder structure following the TDD §9 recommendations, and ensure the project compiles and runs on `localhost:3000` without errors.

## Acceptance Criteria
```gherkin
GIVEN the project is initialized
WHEN I run `npm run dev`
THEN the application starts on localhost:3000 with no compilation errors

GIVEN TypeScript strict mode is enabled
WHEN I run `tsc --noEmit`
THEN the check passes with 0 errors

GIVEN the `@/` path alias is configured
WHEN I import using `@/lib/utils`
THEN the import resolves correctly in both IDE and compilation

GIVEN the base folder structure is created
WHEN I inspect the `src/` directory
THEN I see the following directories: app/, components/, lib/, hooks/, styles/, types/

GIVEN the project uses the App Router
WHEN I check next.config.js
THEN `appDir` is enabled and the app/ directory contains a root layout.tsx and page.tsx
```

## Business Rules
- None specific — foundational setup story

## Technical Notes
- Use `npx create-next-app@latest` with `--typescript --app --src-dir` flags
- Configure `tsconfig.json` with `"strict": true` and path aliases
- Use pnpm as the package manager per team convention
- Base folder structure per TDD §9:
  ```
  src/
  ├── app/          # App Router pages & layouts
  ├── components/   # Reusable UI components
  ├── lib/          # Utilities, services, constants
  ├── hooks/        # Custom React hooks
  ├── styles/       # Global CSS & design tokens
  └── types/        # TypeScript type definitions
  ```

## Traceability
- **FSD Reference:** N/A (infrastructure)
- **TDD Reference:** §2.1 Architecture Overview, §9 File Structure
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** None
- **Blocks:** STORY-002, STORY-003, STORY-004, STORY-005, STORY-006, STORY-007, STORY-008
- **External Dependencies:** Node.js 20 LTS, pnpm

## Definition of Done
- [ ] Code implemented and peer-reviewed
- [ ] `npm run dev` starts successfully on localhost:3000
- [ ] `tsc --noEmit` passes with 0 errors
- [ ] `@/` path alias works in imports
- [ ] Base folder structure created
- [ ] Code merged to main branch
