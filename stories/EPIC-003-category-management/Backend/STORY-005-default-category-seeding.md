# STORY-005: Implement Default Category Seeding

**Epic:** EPIC-003 - Build Category Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a new user,  
I want to have default categories (Health, Work, Personal, Learning) automatically created when I register,  
So that I can start organizing my habits immediately without manual setup.

## Description
Hook into the NextAuth `createUser` event (or the registration API flow) to automatically create 4 default categories for every new user. Each category has a predefined name, icon emoji, and default color. The "Personal" category serves as the fallback for habit reassignment on category deletion.

## Acceptance Criteria
```gherkin
GIVEN a new user registers via email
WHEN their account is created
THEN 4 default categories are created: Health (💪, green), Work (💼, blue), Personal (🏠, purple), Learning (📚, orange)

GIVEN a new user registers via Google OAuth
WHEN their account is created
THEN the same 4 default categories are created

GIVEN default categories are seeded
WHEN the user views their categories
THEN all 4 appear with correct icons, colors, and sort_order (1–4)

GIVEN default categories exist
WHEN a category is deleted and habits need reassignment
THEN habits are reassigned to the "Personal" category (which cannot be deleted)

GIVEN the seeding process fails mid-way
WHEN an error occurs
THEN the entire transaction rolls back (no partial categories created)
```

## Business Rules
- **BR-041:** Default categories are created synchronously during user registration
- "Personal" category is marked with `isDefault: true` and cannot be deleted by the user
- Default categories: Health (💪, #22C55E), Work (💼, #3B82F6), Personal (🏠, #A855F7), Learning (📚, #F97316)

## Technical Notes
- Hook: NextAuth `events.createUser` callback in `src/lib/auth.ts`
- Use Prisma `$transaction` to create all 4 categories atomically
- Set `sort_order` sequentially: 1, 2, 3, 4
- Mark "Personal" with `isDefault: true` for deletion protection
- Idempotency: check if categories already exist before seeding (edge case: race condition on duplicate registration)

## Traceability
- **FSD Reference:** FR-012, BR-041
- **TDD Reference:** §5.1 Categories Service
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** EPIC-001 (Prisma Category model), EPIC-002 (NextAuth createUser event)
- **Blocks:** STORY-004 (API needs defaults to exist for reassignment logic)
- **External Dependencies:** None

## Definition of Done
- [ ] 4 default categories created on email registration
- [ ] 4 default categories created on Google OAuth registration
- [ ] Categories have correct names, icons, colors, and sort_order
- [ ] "Personal" is marked as `isDefault: true`
- [ ] Transaction rolls back on partial failure
- [ ] Unit tests for seeding logic passing
- [ ] Code merged to main branch
