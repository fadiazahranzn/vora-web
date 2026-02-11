# STORY-002: Build Create Habit Wizard (3-Step)

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Frontend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to create a new habit through a guided 3-step wizard,  
So that I can easily set up habits with the right name, frequency, and reminder.

## Description
Implement a 3-step wizard for habit creation: **Step 1** — Name, Category, and Color selection; **Step 2** — Frequency configuration (Daily/Weekly/Monthly with conditional fields); **Step 3** — Optional reminder time setup. The wizard supports back navigation without losing data, validates each step before advancing, and submits via POST /api/habits on completion.

## Acceptance Criteria
```gherkin
GIVEN I open the Create Habit wizard
WHEN Step 1 loads
THEN I see inputs for name (text), category (dropdown from my categories), and color (12-color palette)

GIVEN I fill in Step 1 and click "Next"
WHEN Step 2 loads
THEN I see frequency options: Daily, Weekly, Monthly

GIVEN I select "Daily"
WHEN the conditional fields appear
THEN I see target value (number input) and unit (text input, e.g., "glasses")

GIVEN I select "Weekly"
WHEN the conditional fields appear
THEN I see day-of-week checkboxes (Mon–Sun) with at least 1 required

GIVEN I select "Monthly"
WHEN the conditional fields appear
THEN I see a date grid (1–31) with at least 1 required

GIVEN I fill in Step 2 and click "Next"
WHEN Step 3 loads
THEN I see a time picker for optional reminder setup

GIVEN I click "Save" on Step 3
WHEN all validations pass
THEN the habit is created, I see a success toast, and I'm returned to the dashboard

GIVEN I am on Step 2
WHEN I click "Back"
THEN I return to Step 1 with my previous data preserved

GIVEN I leave the name blank on Step 1
WHEN I click "Next"
THEN I see "Habit name is required" and cannot advance
```

## Business Rules
- **BR-013:** Habit name required, max 100 characters
- **BR-014:** Category must be selected from user's categories
- **BR-015:** Color from predefined 12-color palette
- **BR-016:** Frequency: Daily, Weekly, or Monthly
- **BR-017:** Daily: target value + unit required
- **BR-018:** Weekly: ≥1 day selected
- **BR-019:** Monthly: ≥1 date selected
- **BR-020:** Reminder time optional, valid HH:MM format

## Technical Notes
- Modal/full-screen wizard on mobile, modal on desktop
- Form state persisted across steps (React state or React Hook Form)
- 12-color palette: circular color swatches matching design system
- Category dropdown fetches from GET /api/categories
- Submission: POST /api/habits with Zod-validated payload
- Step indicator (1/3, 2/3, 3/3) at top of wizard

## Traceability
- **FSD Reference:** FR-006 (Create Habit), BR-013–BR-020
- **Wireframe Reference:** Screen 3 — Create/Edit Habit
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-007 (Habit CRUD API), EPIC-003 (categories for dropdown)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Input, Button, Modal components)

## Definition of Done
- [ ] 3-step wizard renders with correct fields per step
- [ ] Back navigation preserves data
- [ ] All conditional fields appear based on frequency
- [ ] Per-step validation prevents invalid advancement
- [ ] Successful creation shows toast and returns to dashboard
- [ ] Responsive on mobile and desktop
- [ ] Keyboard accessible (Tab through steps)
- [ ] Code merged to main branch
