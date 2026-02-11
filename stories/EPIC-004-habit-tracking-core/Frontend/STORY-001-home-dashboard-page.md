# STORY-001: Build Home Dashboard Page

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to see my habits for today on the Home Dashboard,  
So that I can quickly see what I need to accomplish and track my daily progress.

## Description
Build the Home Dashboard page as the primary landing page after login. It displays a greeting with the user's name, the mascot, a progress bar showing today's completion rate, and a list of habits scheduled for the selected date grouped by category. The page includes a date picker for navigation, a FAB for creating new habits, and an empty state with mascot CTA when no habits exist.

## Acceptance Criteria
```gherkin
GIVEN I am authenticated
WHEN I navigate to the Home Dashboard (/)
THEN I see a greeting ("Good morning, [Name]!"), the mascot, a progress bar, and my habits for today

GIVEN I have 5 habits scheduled for today
WHEN the page loads
THEN all 5 habits appear grouped by their categories

GIVEN I have 3 of 5 habits complete
WHEN I view the progress bar
THEN it shows 60% filled with animation

GIVEN I have no habits
WHEN the page loads
THEN I see an empty state with mascot and "Create your first habit!" CTA button

GIVEN habits are loading
WHEN the API request is pending
THEN I see skeleton loaders in place of habit cards

GIVEN I click the FAB (+ button)
WHEN the action triggers
THEN the Create Habit wizard opens
```

## Business Rules
- **BR-021:** Dashboard displays only habits scheduled for the current date based on frequency
- **BR-022:** Daily habits appear every day
- **BR-023:** Weekly habits appear only on selected days
- **BR-024:** Monthly habits appear only on selected dates
- **BR-025:** Habits grouped by category when category filter is active
- **BR-026:** Each habit card displays name, category icon, color, completion checkbox, streak count

## Technical Notes
- Route: `src/app/(app)/page.tsx` (inside authenticated layout)
- Data fetching: GET /api/habits?date=YYYY-MM-DD via React Query
- Progress bar: `(completed / total) × 100`
- Skeleton loader component from EPIC-008
- FAB positioned fixed bottom-right (above bottom nav on mobile)
- Greeting changes by time of day: Morning (<12), Afternoon (<17), Evening (≥17)

## Traceability
- **FSD Reference:** FR-007 (Read Habits), BR-021–BR-026
- **Wireframe Reference:** Screen 2 — Home Dashboard
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-009 (Habits-by-date API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (ProgressBar, Skeleton, FAB, EmptyState components)

## Definition of Done
- [ ] Dashboard renders with greeting, mascot, progress bar, and habit list
- [ ] Habits grouped by category with correct data
- [ ] Empty state displays when no habits exist
- [ ] Skeleton loaders show during loading
- [ ] FAB triggers Create Habit wizard
- [ ] Progress bar updates with completions
- [ ] Responsive across mobile, tablet, desktop
- [ ] Code merged to main branch
