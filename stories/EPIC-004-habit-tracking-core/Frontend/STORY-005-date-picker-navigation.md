# STORY-005: Implement Date Picker Navigation

**Epic:** EPIC-004 - Build Habit Tracking Core  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to navigate between dates using a date picker on the Home Dashboard,  
So that I can view habits scheduled for past and future dates.

## Description
Build a date picker component at the top of the Home Dashboard that defaults to today. It supports horizontal swipe/scroll for day-by-day navigation and a calendar popup for jumping to any date (±1 year). Selecting a date refetches the habit list for that date and updates the completion progress bar. Dates with completions show a dot indicator.

## Acceptance Criteria
```gherkin
GIVEN I view the Home Dashboard
WHEN the page loads
THEN today's date is highlighted in the date picker

GIVEN I swipe left on the date picker
WHEN the next day loads
THEN the habit list updates to show habits for that day

GIVEN I tap the date label
WHEN the calendar popup opens
THEN I can navigate to any date within ±1 year

GIVEN I select a past date (e.g., yesterday)
WHEN the habit list loads
THEN I see habits scheduled for yesterday with their completion status

GIVEN a date has at least one completion
WHEN I view that date in the picker
THEN a small dot indicator appears below the date

GIVEN I select a date with no scheduled habits
WHEN the view updates
THEN I see "No habits scheduled for this date"
```

## Business Rules
- **BR-046:** Calendar defaults to the current date
- **BR-047:** Selecting a date updates the habit list for that date
- **BR-048:** Dates with completions show a dot indicator
- **BR-049:** Calendar supports month navigation (previous/next)

## Technical Notes
- Date picker: horizontal scrollable day strip (7 days visible) + calendar popup
- Calendar popup: month grid with navigation arrows
- Query key includes date: `useQuery(['habits', date])`
- Date format: `YYYY-MM-DD` for API calls
- Dot indicators need completion data: lightweight prefetch of completion dates for visible month
- DatePicker component from EPIC-008

## Traceability
- **FSD Reference:** FR-013 (Interactive Calendar), BR-046–BR-049
- **Wireframe Reference:** Screen 2 — Home Dashboard (Calendar strip)
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-009 (Habits-by-date API)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (DatePicker component)

## Definition of Done
- [ ] Date picker defaults to today
- [ ] Swipe/scroll navigates day-by-day
- [ ] Calendar popup supports month navigation
- [ ] Selecting a date refetches habits
- [ ] Dot indicators show on dates with completions
- [ ] ±1 year range supported
- [ ] Touch and keyboard accessible
- [ ] Code merged to main branch
