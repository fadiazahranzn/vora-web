# STORY-006: Build Habit Detail View with Streak

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Should Have

---

## User Story
As an authenticated user,  
I want to view a detailed page for each habit showing my current streak and completion history,  
So that I can understand my performance and stay motivated.

## Description
Build the habit detail view accessible by tapping a habit card. It displays the habit's full configuration (name, category, color, frequency, target, reminder) and a stats section showing current streak, longest streak, and a mini calendar heatmap of recent completions. The page also provides edit and delete actions.

## Acceptance Criteria
```gherkin
GIVEN I tap on a habit card body
WHEN the detail view opens
THEN I see the habit's name, category, color, frequency, target/unit, and reminder time

GIVEN I view the stats section
WHEN the data loads
THEN I see current streak (🔥), longest streak, and total completions count

GIVEN I view the mini calendar
WHEN the recent 30 days are displayed
THEN completed days show green dots and missed days show gray dots

GIVEN I click "Edit" on the detail view
WHEN the edit form opens
THEN it pre-populates with this habit's data

GIVEN I click "Delete" on the detail view
WHEN the confirmation dialog appears
THEN I can confirm soft-deletion

GIVEN the habit has never been completed
WHEN I view the stats
THEN streaks show 0 and the calendar has no green dots
```

## Business Rules
- Current streak: consecutive days from today backward with a completion
- Longest streak: maximum consecutive completion days ever
- Mini calendar shows last 30 days of completion/miss data

## Technical Notes
- Route: `src/app/(app)/habits/[id]/page.tsx`
- Data: GET /api/habits/:id + GET /api/habits/:id/stats (streak + history)
- Mini calendar: simple 30-day grid with color coding
- Streak calculation from STORY-010 (backend service)
- Lazy-load the mini calendar component

## Traceability
- **FSD Reference:** FR-007 (View Habits), FR-008 (Edit), FR-009 (Delete)
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-010 (Streak Calculation Service)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Card component)

## Definition of Done
- [ ] Detail view renders with all habit configuration
- [ ] Current streak, longest streak, total completions display correctly
- [ ] Mini calendar shows 30-day completion history
- [ ] Edit and Delete actions work from detail view
- [ ] Responsive layout
- [ ] Code merged to main branch
