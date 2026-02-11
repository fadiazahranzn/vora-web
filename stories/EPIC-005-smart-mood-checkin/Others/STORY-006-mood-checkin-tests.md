# STORY-006: Write Mood Check-in Tests

**Epic:** EPIC-005 - Implement Smart Mood Check-in  
**Role:** Others  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a developer,  
I want comprehensive tests for the mood check-in system,  
So that the modal flow, mood paths, and API behave correctly and regressions are caught early.

## Description
Write tests covering the mood check-in API (upsert, validation, derived fields), frontend modal flow (mood selection → positive/negative path → close), and integration between habit completion and mood check-in trigger. Include accessibility tests for the modal.

## Acceptance Criteria
```gherkin
GIVEN the mood API test suite runs
WHEN all tests execute
THEN POST upsert, GET retrieval, validation, and derived isPositive tests pass

GIVEN the modal component tests run
WHEN simulating mood selection flow
THEN positive and negative paths render correct steps

GIVEN the integration tests run
WHEN a habit completion triggers the modal
THEN the full flow from checkbox → modal → mood save → close works

GIVEN the accessibility tests run
WHEN checking the modal
THEN focus trapping, Escape dismiss, and screen reader announcements are verified
```

## Business Rules
- Tests verify upsert behavior (same habit/date overwrites)
- Tests verify isPositive derivation for all 6 moods
- Tests verify reflection text 500-char limit
- Tests verify dismiss behavior (habit still completes)

## Technical Notes
- API tests: Jest with mocked Prisma
- Component tests: React Testing Library
- Integration test: simulate checkbox click → modal render → mood click → API call
- Accessibility: check `role="dialog"`, `aria-label`, focus management
- Test files: `__tests__/api/mood-checkins/`, `__tests__/components/mood/`

## Traceability
- **FSD Reference:** FR-015–FR-019, BR-055–BR-076
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-001 (Modal UI), STORY-005 (API)
- **Blocks:** None
- **External Dependencies:** Testing framework from EPIC-001

## Definition of Done
- [ ] API tests for upsert, validation, derived fields
- [ ] Component tests for modal flow (both paths)
- [ ] Integration test for habit completion → mood check-in
- [ ] Accessibility tests for modal
- [ ] All tests passing in CI
- [ ] Code merged to main branch
