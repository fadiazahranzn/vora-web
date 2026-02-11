# EPIC-001: Setup Project Foundation & Infrastructure

## Business Value Statement

Establish the foundational codebase, database, and deployment pipeline so that all subsequent feature EPICs can build on a reliable, production-ready platform. Without this foundation, no feature work can begin.

## Description

This EPIC covers the initial scaffolding of the Next.js 14+ project, PostgreSQL database provisioning, Prisma ORM configuration with migrations, environment setup (dev/preview/production), and CI/CD pipeline creation. It also includes the base file structure, linting/formatting rules, and developer documentation.

## Source Traceability

| Document  | Reference                | Section / Page              |
| --------- | ------------------------ | --------------------------- |
| TDD       | System Architecture      | §2.1 Architecture Overview  |
| TDD       | Deployment Architecture  | §2.3 Environments           |
| TDD       | Data Architecture        | §3.2 Database Design        |
| TDD       | Prisma Schema            | §3.2 Schema                 |
| TDD       | Soft-Delete Middleware    | §3.3 Data Flow              |
| TDD       | CI/CD Pipeline           | §9.3                        |
| TDD       | Technology Stack         | Appendix A                  |

## Scope Definition

| In Scope                                             | Out of Scope                          |
| ---------------------------------------------------- | ------------------------------------- |
| Next.js 14 App Router project initialization          | Feature-specific pages/routes         |
| TypeScript strict configuration                       | Authentication implementation         |
| Prisma schema & first migration (all 10 entities)     | Seed data beyond test fixtures        |
| Soft-delete Prisma middleware                          | UI component development              |
| PostgreSQL provisioning (local + Vercel Postgres)      | Business logic implementation         |
| ESLint + Prettier configuration                        | Testing of feature code               |
| CI/CD pipeline (lint → type-check → test → build)     | Production domain & DNS               |
| Vitest + Playwright base configuration                 | Monitoring/alerting setup             |
| Git repository, branching strategy documentation       | —                                     |
| `.env.example` and environment variable management     | —                                     |

## High-Level Acceptance Criteria

- [ ] `npx create-next-app` project runs locally on `localhost:3000`
- [ ] TypeScript strict mode enabled; `tsc --noEmit` passes with 0 errors
- [ ] Prisma schema defines all 10 entities with correct relationships
- [ ] `npx prisma migrate dev` runs successfully against local PostgreSQL
- [ ] Soft-delete middleware intercepts delete operations on User, Category, Habit, Task
- [ ] ESLint + Prettier run on commit (husky + lint-staged)
- [ ] CI pipeline executes on every PR: lint → type → test → build
- [ ] Preview deployment on Vercel works for any feature branch
- [ ] `@/` path alias resolves correctly in imports
- [ ] `README.md` documents setup, env vars, and contribution guide

## Dependencies

- **Prerequisite EPICs:** None
- **External Dependencies:** PostgreSQL instance (local Docker or Vercel Postgres), Vercel account
- **Technical Prerequisites:** Node.js 20 LTS, npm/pnpm

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Low
- **Estimated Story Count:** 6–8

## Risks & Assumptions

**Assumptions:**
- Team has access to Vercel organization for deployments
- PostgreSQL 15+ is used (local via Docker or Vercel Postgres)
- pnpm is the preferred package manager

**Risks:**
- Prisma schema may need iteration as feature EPICs refine requirements
- Vercel Postgres cold-start latency may affect initial API benchmarks

## Related EPICs

- **Depends On:** None
- **Blocks:** EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009, EPIC-010
- **Related:** EPIC-010 (CI hardening)
