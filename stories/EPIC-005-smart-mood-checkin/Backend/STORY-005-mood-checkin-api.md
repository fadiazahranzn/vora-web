# STORY-005: Implement Mood Check-in API Endpoints

**Epic:** EPIC-005 - Implement Smart Mood Check-in  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a developer,  
I want API endpoints for creating and retrieving mood check-in records,  
So that mood data is persisted and available for future analytics.

## Description
Implement mood check-in API endpoints with upsert behavior: if a check-in already exists for the same (habit_id, user_id, date), it is overwritten. The POST endpoint accepts mood, optional reflectionText, and optional selectedActivity. A GET endpoint retrieves check-ins for a date range. All endpoints require authentication and enforce row-level security.

## Acceptance Criteria
```gherkin
GIVEN I call POST /api/mood-checkins with valid mood data
WHEN no check-in exists for this habit/date
THEN a new MoodCheckin record is created

GIVEN I call POST /api/mood-checkins for the same habit/date
WHEN a check-in already exists
THEN the existing record is upserted (overwritten) with new data

GIVEN I submit mood = "happy"
WHEN the server processes the request
THEN isPositive is automatically set to true

GIVEN I submit mood = "angry" with reflectionText = "Stressful day"
WHEN the server processes
THEN reflectionText and mood are stored, isPositive = false

GIVEN I call GET /api/mood-checkins?date=2026-02-11
WHEN check-ins exist for that date
THEN I receive all my mood check-ins for that date with habit details

GIVEN the reflectionText exceeds 500 characters
WHEN validation runs
THEN I receive 422 with error "Reflection text must be 500 characters or less"

GIVEN an invalid mood value is submitted
WHEN validation runs
THEN I receive 422 with error listing valid moods
```

## Business Rules
- **BR-074:** Each record stores: id, userId, habitId, date, mood, isPositive, reflectionText, selectedActivity, createdAt
- **BR-075:** Duplicate check-in same habit/date overwrites (upsert)
- **BR-059:** Valid moods: happy, proud, worried, annoyed, sad, angry
- **BR-061:** isPositive derived: happy/proud = true, others = false
- Reflection max 500 chars
- Selected activity: one of 6 predefined values or null

## Technical Notes
- Routes: `src/app/api/mood-checkins/route.ts` (GET, POST)
- POST body: `{ habitId, date, mood, reflectionText?, selectedActivity? }`
- Upsert: Prisma `upsert` with `where: { habitId_userId_date: { habitId, userId, date } }`
- isPositive: computed server-side from mood value
- Zod schema: `moodCheckinSchema` with enum validation for mood and activity
- GET supports query params: `?date=YYYY-MM-DD` or `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `requireAuth()` on all routes

## Traceability
- **FSD Reference:** FR-019 (Mood Data Persistence), BR-074–BR-076
- **TDD Reference:** §4.2 /api/mood-checkins/*, §5.1 Mood Service
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** EPIC-001 (Prisma MoodCheckin model), EPIC-002 (auth), EPIC-004 (HabitCompletion)
- **Blocks:** STORY-001 (Modal needs API), STORY-006 (Tests)
- **External Dependencies:** None

## Definition of Done
- [ ] POST creates/upserts mood check-in record
- [ ] isPositive computed from mood value
- [ ] GET returns check-ins for date/range
- [ ] Zod validation for mood enum, activity enum, text length
- [ ] Row-level security enforced
- [ ] Upsert works for same habit/date
- [ ] Unit tests passing
- [ ] Code merged to main branch
