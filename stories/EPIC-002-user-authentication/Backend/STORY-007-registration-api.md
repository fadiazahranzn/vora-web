# STORY-007: Build Registration API Endpoint

**Epic:** EPIC-002 - Implement User Authentication  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a new user,  
I want to register with my email and password via an API,  
So that my account is created securely with proper validation.

## Description
Build the `POST /api/auth/register` endpoint that accepts name, email, and password, validates all inputs using Zod, hashes the password with bcrypt, creates the User record, seeds default categories for the new user, and returns the created user (without password). Trigger the `user_registered` analytics event.

## Acceptance Criteria
```gherkin
GIVEN I send a valid registration request
WHEN the API processes it
THEN the user is created, default categories are seeded, and a 201 response is returned

GIVEN I send a registration request with an existing email
WHEN the API processes it
THEN a 409 Conflict error is returned with message "An account with this email already exists"

GIVEN I send a password that doesn't meet requirements
WHEN the API validates input
THEN a 400 Bad Request is returned listing the unmet password criteria

GIVEN I send a request with missing required fields
WHEN the API validates input
THEN a 400 Bad Request is returned with specific field errors

GIVEN registration succeeds
WHEN the user is created
THEN 4 default categories (Health, Work, Personal, Learning) are seeded for the user
```

## Business Rules
- **BR-001:** Email must be unique
- **BR-002:** Password ≥ 8 chars, ≥ 1 uppercase, ≥ 1 lowercase, ≥ 1 digit
- **BR-003:** Email must match RFC 5322 format
- **BR-041:** Default categories seeded on registration

## Technical Notes
- Route: `src/app/api/auth/register/route.ts`
- Zod schema for validation: `{ name: z.string().min(1).max(100), email: z.string().email(), password: z.string().regex(...) }`
- Password hashing: `bcrypt.hash(password, 12)`
- Default categories: `[{ name: "Health", icon: "💪" }, { name: "Work", icon: "💼" }, { name: "Personal", icon: "🏠" }, { name: "Learning", icon: "📚" }]`
- Response excludes `passwordHash` field
- Transaction: create user + seed categories atomically

## Traceability
- **FSD Reference:** FR-001 (Email Registration), BR-001–BR-003, BR-041
- **TDD Reference:** §4.3 Authentication
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** EPIC-001 (Prisma schema)
- **Blocks:** STORY-002 (Registration UI)
- **External Dependencies:** None

## Definition of Done
- [ ] POST /api/auth/register endpoint works
- [ ] Zod validation for all inputs
- [ ] Password hashed with bcrypt (12 rounds)
- [ ] Duplicate email returns 409
- [ ] Default categories seeded on registration
- [ ] Response excludes password hash
- [ ] Unit tests passing
- [ ] Code merged to main branch
