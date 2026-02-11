# STORY-002: Configure Prisma ORM & Database Schema

**Epic:** EPIC-001 - Setup Project Foundation & Infrastructure  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want the Prisma ORM configured with the complete database schema for all 10 entities,  
So that the data layer is ready for all feature EPICs to build upon.

## Description
Install and configure Prisma ORM with PostgreSQL. Define the complete schema with all 10 entities (User, Account, Session, Category, Habit, HabitCompletion, MoodCheckin, Task, SubTask, PostponeHistory) and 5 enums (Frequency, Priority, Mood, Recurrence, Activity). Run the initial migration against local PostgreSQL and verify all relationships and indexes are created correctly. Reference ERD §2 and TDD §3.2.

## Acceptance Criteria
```gherkin
GIVEN Prisma is installed and configured
WHEN I run `npx prisma generate`
THEN the Prisma client is generated without errors

GIVEN the schema defines all 10 entities
WHEN I run `npx prisma migrate dev --name init`
THEN the migration executes successfully against local PostgreSQL

GIVEN the schema includes proper relationships
WHEN I inspect the generated migration SQL
THEN I see all foreign key constraints, indexes, and unique constraints as defined in the ERD

GIVEN the schema includes all 5 enums
WHEN I check the database
THEN Frequency, Priority, Mood, Recurrence, and Activity enums are created

GIVEN Prisma Studio is available
WHEN I run `npx prisma studio`
THEN I can browse all 10 tables in the web UI

GIVEN the schema includes indexes
WHEN I check the migration
THEN composite indexes exist on (habitId, userId, date) for HabitCompletion and (habitId, userId, date) for MoodCheckin
```

## Business Rules
- **BR-001:** Email must be unique across all accounts (unique constraint on User.email)
- **BR-037:** One completion per habit per calendar day (unique constraint on HabitCompletion)
- **BR-075:** Duplicate check-in same habit/day overwrites (unique constraint on MoodCheckin for upsert)

## Technical Notes
- PostgreSQL 15+ (local via Docker or Vercel Postgres)
- Use `@db.Uuid` for all ID fields with `@default(uuid())`
- All timestamp fields use `@default(now())` and `@updatedAt` where applicable
- Soft-delete fields (`deletedAt DateTime?`) on User, Category, Habit, HabitCompletion, MoodCheckin, Task
- Include `schema.prisma` with datasource, generator, and all models
- Create a `docker-compose.yml` for local PostgreSQL

## Traceability
- **FSD Reference:** §6.1 Data Entities (all 7 FSD entities), §6.2 Data Relationships
- **ERD Reference:** All 10 entities, 14 relationships
- **TDD Reference:** §3.2 Database Design, §3.2 Schema
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-001 (project initialized)
- **Blocks:** STORY-003 (soft-delete middleware)
- **External Dependencies:** PostgreSQL instance (Docker or Vercel Postgres)

## Definition of Done
- [ ] Prisma schema defines all 10 entities with correct types, constraints, and relations
- [ ] `npx prisma migrate dev` runs successfully
- [ ] `npx prisma generate` produces client without errors
- [ ] All foreign keys and indexes verified
- [ ] docker-compose.yml for local PostgreSQL tested
- [ ] Unit tests for Prisma client connectivity passing
- [ ] Code merged to main branch
