# STORY-001: Build Tasks List Page with Filtering & Sorting

**Epic:** EPIC-006 - Build Task Management System  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an authenticated user,  
I want to view my tasks in a filterable, sortable list,  
So that I can quickly find and manage tasks based on their status, priority, or due date.

## Description
Build the Tasks page accessible via the "Tasks" navigation tab. The page displays tasks in a vertical list with filter tabs (All, Active, Completed, Overdue) and sort options (Due Date, Priority, Created Date). Each task card shows title, priority badge (color-coded), due date, sub-task progress, and overdue indicator. The page includes a FAB for creating new tasks and an empty state with mascot.

## Acceptance Criteria
```gherkin
GIVEN I navigate to the Tasks page
WHEN the page loads
THEN I see all my active tasks with filter tabs and sort dropdown

GIVEN I tap "Active" filter
WHEN the list updates
THEN only incomplete tasks are shown

GIVEN I tap "Completed" filter
WHEN the list updates
THEN only tasks with completedAt set are shown

GIVEN I tap "Overdue" filter
WHEN the list updates
THEN only incomplete tasks with past due dates are shown

GIVEN I select "Priority" sort
WHEN the list reorders
THEN tasks appear High → Medium → Low

GIVEN I select "Due Date" sort
WHEN the list reorders
THEN tasks appear by ascending due date (earliest first)

GIVEN I have no tasks
WHEN the page loads
THEN I see empty state with mascot and "Nothing on your plate!" message

GIVEN overdue tasks exist with auto-postpone enabled
WHEN the page loads
THEN their due dates are updated to today (STORY-007 integration)
```

## Business Rules
- **BR-094:** Filters: All, Today, Upcoming, Overdue
- **BR-095:** Sorts: Priority (High→Low), Due Date (ascending), Created Date (newest)
- **BR-096:** Filters/sorts persist for session, reset on logout
- **BR-079:** Maximum 200 active tasks

## Technical Notes
- Route: `src/app/(app)/tasks/page.tsx`
- Data: GET /api/tasks with query params `?filter=active&sort=priority`
- Filter tabs: horizontal scroll on mobile with active indicator
- Priority badge colors: high=#EF4444, medium=#F59E0B, low=#3B82F6
- Overdue badge: red with "X days overdue" text
- Skeleton loader during fetch
- FAB: same style as habits FAB

## Traceability
- **FSD Reference:** FR-023 (Filter & Sort), BR-094–BR-096
- **Wireframe Reference:** Screen 5 — Tasks View
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-005 (Task CRUD API), STORY-007 (Auto-postpone)
- **Blocks:** None
- **External Dependencies:** EPIC-008 (Card, FAB, EmptyState components)

## Definition of Done
- [ ] Tasks list renders with all task data
- [ ] Filter tabs work: All, Active, Completed, Overdue
- [ ] Sort options work: Priority, Due Date, Created Date
- [ ] Priority badges color-coded correctly
- [ ] Overdue indicator displays days overdue
- [ ] Empty state with mascot
- [ ] FAB triggers create task form
- [ ] Responsive layout
- [ ] Code merged to main branch
