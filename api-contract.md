# API Contract Specification

# Vora – Smart Habit Tracking & Task Management Web Application

---

## Document Information

| Field              | Detail                                          |
| ------------------ | ----------------------------------------------- |
| **Document Title** | Vora – API Contract (OpenAPI 3.0)               |
| **Version**        | 1.0.0                                           |
| **Date**           | 2026-02-10                                      |
| **FSD Reference**  | `prompter/vora-web-app/fsd.md` v1.0             |
| **ERD Reference**  | `prompter/vora-web-app/erd.md` v1.0             |
| **Author**         | [Author Name]                                   |
| **Status**         | Draft                                           |

---

## 1. API Overview

### 1.1 Base Configuration

| Property        | Value                                         |
| --------------- | --------------------------------------------- |
| **Base URL**    | `/api`                                        |
| **Protocol**    | HTTPS                                         |
| **Auth**        | NextAuth.js (JWT in HTTP-only cookies)        |
| **Content-Type**| `application/json`                            |
| **API Style**   | RESTful                                       |

### 1.2 Authentication

All endpoints except `/api/auth/*` require an authenticated session. Authentication is managed via NextAuth.js:

- **Session Cookie:** HTTP-only secure cookie (`next-auth.session-token`)
- **CSRF Token:** Required for mutation requests (POST/PATCH/DELETE)
- **Unauthorized Response:** `401 Unauthorized` with redirect to login

### 1.3 Standard Response Envelope

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-10T09:00:00.000Z"
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "timestamp": "2026-02-10T09:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "issue": "Email is already in use" }
    ]
  }
}
```

### 1.4 Standard Error Codes

| HTTP Status | Error Code            | Description                            |
| ----------- | --------------------- | -------------------------------------- |
| 400         | `VALIDATION_ERROR`    | Request body/params failed validation  |
| 401         | `UNAUTHORIZED`        | Missing or invalid session             |
| 403         | `FORBIDDEN`           | Authenticated but not authorized       |
| 404         | `NOT_FOUND`           | Resource does not exist                |
| 409         | `CONFLICT`            | Duplicate/conflict (e.g., email taken) |
| 422         | `UNPROCESSABLE`       | Semantically invalid (e.g., past date) |
| 429         | `RATE_LIMITED`         | Too many requests                      |
| 500         | `INTERNAL_ERROR`      | Unexpected server error                |

### 1.5 Common Query Parameters

| Parameter | Type    | Default | Description                                |
| --------- | ------- | ------- | ------------------------------------------ |
| `page`    | integer | 1       | Page number for pagination                 |
| `limit`   | integer | 20      | Items per page (max: 100)                  |
| `sort`    | string  | varies  | Sort field (prefix `-` for descending)     |

### 1.6 API Tags

| Tag            | Description                                     |
| -------------- | ----------------------------------------------- |
| `auth`         | Authentication & session management             |
| `habits`       | Habit CRUD and completion                       |
| `mood-checkins`| Smart Check-in mood data                        |
| `tasks`        | Task CRUD and completion                        |
| `subtasks`     | Sub-task management within tasks                |
| `categories`   | Habit category management                       |
| `analytics`    | Dashboard analytics and statistics              |
| `users`        | User profile management                         |

---

## 2. OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Vora API
  description: |
    RESTful API for Vora – Smart Habit Tracking & Task Management PWA.
    Supports habit management, mood check-ins, task management, and analytics.
  version: 1.0.0
  contact:
    name: Vora Development Team

servers:
  - url: /api
    description: Application API (relative to domain)

tags:
  - name: auth
    description: Authentication & session management
  - name: users
    description: User profile management
  - name: categories
    description: Habit category management
  - name: habits
    description: Habit CRUD and completion
  - name: mood-checkins
    description: Smart Check-in mood data
  - name: tasks
    description: Task CRUD and completion
  - name: subtasks
    description: Sub-task management
  - name: analytics
    description: Dashboard analytics and statistics

security:
  - sessionCookie: []

paths:
  # ══════════════════════════════════════════════
  # AUTH ENDPOINTS
  # ══════════════════════════════════════════════

  /auth/register:
    post:
      tags: [auth]
      operationId: registerUser
      summary: Register a new user with email credentials
      description: |
        Creates a new user account with email and password.
        - FSD Reference: FR-001
        - Business Rules: BR-001, BR-002, BR-003
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
            example:
              email: "user@example.com"
              password: "SecurePass1"
              name: "John Doe"
      responses:
        '201':
          description: User registered successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
              example:
                success: true
                data:
                  user:
                    id: "550e8400-e29b-41d4-a716-446655440000"
                    email: "user@example.com"
                    name: "John Doe"
                    theme: "system"
                    createdAt: "2026-02-10T09:00:00.000Z"
                  token: "eyJhbGciOiJIUzI1NiIs..."
        '400':
          description: Validation error (weak password, invalid email format)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: "VALIDATION_ERROR"
                  message: "Validation failed"
                  details:
                    - field: "password"
                      issue: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit"
        '409':
          description: Email already in use
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: "CONFLICT"
                  message: "An account with this email already exists"

  /auth/login:
    post:
      tags: [auth]
      operationId: loginUser
      summary: Log in with email credentials
      description: |
        Authenticates user with email and password. Issues JWT session.
        - FSD Reference: FR-003
        - Business Rules: BR-006, BR-007, BR-008
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
            example:
              email: "user@example.com"
              password: "SecurePass1"
      responses:
        '200':
          description: Login successful
          headers:
            Set-Cookie:
              description: Session cookie (HTTP-only)
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: "UNAUTHORIZED"
                  message: "Invalid email or password"
        '429':
          description: Account locked (5+ failed attempts)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: "RATE_LIMITED"
                  message: "Too many failed attempts. Please try again in 15 minutes."

  /auth/logout:
    post:
      tags: [auth]
      operationId: logoutUser
      summary: Log out and invalidate session
      description: |
        Terminates the current session and removes the session cookie.
        - FSD Reference: FR-004
        - Business Rules: BR-009, BR-010
      responses:
        '200':
          description: Logout successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true

  /auth/session:
    get:
      tags: [auth]
      operationId: getSession
      summary: Get current session and user info
      description: |
        Returns the current user's session data if authenticated.
        - FSD Reference: FR-005
      responses:
        '200':
          description: Active session
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SessionResponse'
        '401':
          description: No active session

  # ══════════════════════════════════════════════
  # USER ENDPOINTS
  # ══════════════════════════════════════════════

  /users/me:
    get:
      tags: [users]
      operationId: getCurrentUser
      summary: Get current user profile
      description: Returns the authenticated user's profile data.
      responses:
        '200':
          description: User profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
    patch:
      tags: [users]
      operationId: updateCurrentUser
      summary: Update current user profile
      description: |
        Updates user profile fields (name, avatar, theme).
        - FSD Reference: FR-031 (theme toggle)
        - Business Rules: BR-122, BR-123
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
            example:
              name: "Jane Doe"
              theme: "dark"
      responses:
        '200':
          description: Profile updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/ValidationError'

  # ══════════════════════════════════════════════
  # CATEGORY ENDPOINTS
  # ══════════════════════════════════════════════

  /categories:
    get:
      tags: [categories]
      operationId: listCategories
      summary: List all categories (system defaults + user-created)
      description: |
        Returns all categories available to the user, including system
        defaults and user-created custom categories. Each category
        includes its active habit count.
        - FSD Reference: FR-012
        - Business Rules: BR-041, BR-042
      parameters:
        - name: includeHabitCount
          in: query
          schema:
            type: boolean
            default: true
          description: Include count of active habits per category
      responses:
        '200':
          description: Category list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CategoryListResponse'
              example:
                success: true
                data:
                  - id: "cat-001"
                    name: "Health"
                    icon: "🏃"
                    defaultColor: "#4CAF50"
                    isDefault: true
                    habitCount: 3
                  - id: "cat-002"
                    name: "Education"
                    icon: "📚"
                    defaultColor: "#2196F3"
                    isDefault: true
                    habitCount: 2
    post:
      tags: [categories]
      operationId: createCategory
      summary: Create a custom category
      description: |
        Creates a new user-owned category.
        Category name must be unique per user.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCategoryRequest'
            example:
              name: "Side Projects"
              icon: "🚀"
              defaultColor: "#9C27B0"
      responses:
        '201':
          description: Category created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CategoryResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
        '409':
          description: Category name already exists for this user

  /categories/{categoryId}:
    parameters:
      - $ref: '#/components/parameters/categoryId'
    patch:
      tags: [categories]
      operationId: updateCategory
      summary: Update a custom category
      description: Only user-created categories can be updated.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateCategoryRequest'
      responses:
        '200':
          description: Category updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CategoryResponse'
        '403':
          description: Cannot modify system-default categories
        '404':
          $ref: '#/components/responses/NotFound'
    delete:
      tags: [categories]
      operationId: deleteCategory
      summary: Delete a custom category
      description: |
        Deletes a user-created category. Cannot delete if habits
        are still assigned to this category.
      responses:
        '204':
          description: Category deleted
        '403':
          description: Cannot delete system-default categories
        '409':
          description: Category has active habits; reassign them first

  # ══════════════════════════════════════════════
  # HABIT ENDPOINTS
  # ══════════════════════════════════════════════

  /habits:
    get:
      tags: [habits]
      operationId: listHabits
      summary: List habits for a specific date
      description: |
        Returns habits scheduled for the given date based on their
        frequency (daily, weekly, monthly). Includes completion status.
        - FSD Reference: FR-007
        - Business Rules: BR-021 to BR-026
      parameters:
        - name: date
          in: query
          required: true
          schema:
            type: string
            format: date
          description: Date to show habits for (YYYY-MM-DD)
          example: "2026-02-10"
        - name: categoryId
          in: query
          schema:
            type: string
            format: uuid
          description: Filter by category ID
        - name: includeCompleted
          in: query
          schema:
            type: boolean
            default: true
          description: Include completion status for the date
      responses:
        '200':
          description: Habit list for the date
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitListResponse'
              example:
                success: true
                data:
                  - id: "hab-001"
                    name: "Drink Water"
                    categoryId: "cat-001"
                    category:
                      id: "cat-001"
                      name: "Health"
                      icon: "🏃"
                    color: "#4CAF50"
                    frequency: "daily"
                    targetValue: 8
                    targetUnit: "glasses"
                    reminderTime: "08:00"
                    isCompleted: true
                    completionId: "comp-001"
                    streak: 7
                  - id: "hab-002"
                    name: "Read Book"
                    categoryId: "cat-002"
                    category:
                      id: "cat-002"
                      name: "Education"
                      icon: "📚"
                    color: "#2196F3"
                    frequency: "daily"
                    targetValue: 30
                    targetUnit: "pages"
                    reminderTime: "21:00"
                    isCompleted: false
                    completionId: null
                    streak: 3
        '400':
          $ref: '#/components/responses/ValidationError'

    post:
      tags: [habits]
      operationId: createHabit
      summary: Create a new habit
      description: |
        Creates a new habit with name, category, color, frequency,
        and optional reminder.
        - FSD Reference: FR-006
        - Business Rules: BR-013 to BR-020
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateHabitRequest'
            example:
              name: "Drink Water"
              categoryId: "cat-001"
              color: "#4CAF50"
              frequency: "daily"
              targetValue: 8
              targetUnit: "glasses"
              reminderTime: "08:00"
      responses:
        '201':
          description: Habit created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitResponse'
        '400':
          $ref: '#/components/responses/ValidationError'

  /habits/{habitId}:
    parameters:
      - $ref: '#/components/parameters/habitId'
    get:
      tags: [habits]
      operationId: getHabit
      summary: Get habit details
      description: Returns full details of a specific habit.
      responses:
        '200':
          description: Habit details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitResponse'
        '404':
          $ref: '#/components/responses/NotFound'
    patch:
      tags: [habits]
      operationId: updateHabit
      summary: Update a habit
      description: |
        Updates habit properties. Changes take effect from the
        current day forward; historical data is preserved.
        - FSD Reference: FR-008
        - Business Rules: BR-027, BR-028, BR-029
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateHabitRequest'
            example:
              name: "Drink More Water"
              targetValue: 10
      responses:
        '200':
          description: Habit updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [habits]
      operationId: deleteHabit
      summary: Soft-delete a habit
      description: |
        Soft-deletes a habit (sets deletedAt). Historical completion
        and analytics data is preserved.
        - FSD Reference: FR-009
        - Business Rules: BR-030, BR-031, BR-032
      responses:
        '204':
          description: Habit deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /habits/{habitId}/complete:
    parameters:
      - $ref: '#/components/parameters/habitId'
    post:
      tags: [habits]
      operationId: completeHabit
      summary: Mark habit as complete for a date
      description: |
        Creates a completion record for the habit on the specified date.
        Only one completion per habit per calendar day is allowed.
        - FSD Reference: FR-010
        - Business Rules: BR-033 to BR-037
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CompleteHabitRequest'
            example:
              date: "2026-02-10"
              value: 8
      responses:
        '201':
          description: Habit completed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitCompletionResponse'
              example:
                success: true
                data:
                  id: "comp-001"
                  habitId: "hab-001"
                  userId: "user-001"
                  date: "2026-02-10"
                  value: 8
                  completedAt: "2026-02-10T14:30:00.000Z"
        '409':
          description: Already completed for this date
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                error:
                  code: "CONFLICT"
                  message: "Habit already completed for this date"
        '404':
          $ref: '#/components/responses/NotFound'

  /habits/{habitId}/uncomplete:
    parameters:
      - $ref: '#/components/parameters/habitId'
    post:
      tags: [habits]
      operationId: uncompleteHabit
      summary: Undo habit completion for a date
      description: |
        Soft-deletes the completion record and associated mood
        check-in for the specified date.
        - FSD Reference: FR-011
        - Business Rules: BR-038, BR-039, BR-040
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [date]
              properties:
                date:
                  type: string
                  format: date
            example:
              date: "2026-02-10"
      responses:
        '200':
          description: Completion reverted
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
        '404':
          description: No completion found for this date

  # ══════════════════════════════════════════════
  # MOOD CHECK-IN ENDPOINTS
  # ══════════════════════════════════════════════

  /mood-checkins:
    post:
      tags: [mood-checkins]
      operationId: createMoodCheckin
      summary: Record a mood check-in
      description: |
        Creates or updates (upsert) a mood check-in for a habit
        completion. Duplicate check-ins for the same habit/day
        overwrite the previous record.
        - FSD Reference: FR-015, FR-016, FR-017, FR-018, FR-019
        - Business Rules: BR-059 to BR-075
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMoodCheckinRequest'
            examples:
              positive:
                summary: Positive mood (happy)
                value:
                  habitId: "hab-001"
                  completionId: "comp-001"
                  mood: "happy"
              negative_with_reflection:
                summary: Negative mood with reflection
                value:
                  habitId: "hab-002"
                  completionId: "comp-002"
                  mood: "worried"
                  reflectionText: "Feeling stressed about deadlines"
                  selectedActivity: "deep_breathing"
      responses:
        '201':
          description: Mood check-in recorded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MoodCheckinResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
        '404':
          description: Habit or completion not found

    get:
      tags: [mood-checkins]
      operationId: listMoodCheckins
      summary: List mood check-ins for a date range
      description: Returns mood check-ins within a date range for analytics.
      parameters:
        - name: startDate
          in: query
          required: true
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          required: true
          schema:
            type: string
            format: date
        - name: habitId
          in: query
          schema:
            type: string
            format: uuid
          description: Filter by specific habit
      responses:
        '200':
          description: Mood check-in list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MoodCheckinListResponse'

  # ══════════════════════════════════════════════
  # TASK ENDPOINTS
  # ══════════════════════════════════════════════

  /tasks:
    get:
      tags: [tasks]
      operationId: listTasks
      summary: List tasks with filtering and sorting
      description: |
        Returns tasks with optional filters and sorting.
        Auto-postpone is applied on load for overdue tasks
        with auto_postpone enabled.
        - FSD Reference: FR-023
        - Business Rules: BR-094, BR-095, BR-096
      parameters:
        - name: filter
          in: query
          schema:
            type: string
            enum: [all, today, upcoming, overdue]
            default: all
          description: |
            - `all`: All active tasks
            - `today`: Tasks due today
            - `upcoming`: Tasks due after today
            - `overdue`: Incomplete tasks past due date
        - name: sort
          in: query
          schema:
            type: string
            enum: [priority, dueDate, -createdAt]
            default: priority
          description: |
            - `priority`: High → Medium → Low
            - `dueDate`: Ascending by due date
            - `-createdAt`: Newest first
        - name: page
          in: query
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      responses:
        '200':
          description: Task list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskListResponse'

    post:
      tags: [tasks]
      operationId: createTask
      summary: Create a new task
      description: |
        Creates a new task with optional sub-tasks, due date,
        priority, recurrence, and auto-postpone settings.
        - FSD Reference: FR-020
        - Business Rules: BR-077 to BR-083
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskRequest'
            example:
              title: "Review project proposal"
              description: "<p>Review the Q2 proposal document</p>"
              priority: "high"
              dueDate: "2026-02-15"
              recurrence: "none"
              autoPostpone: false
              subTasks:
                - title: "Read executive summary"
                - title: "Check budget estimates"
                - title: "Write feedback"
      responses:
        '201':
          description: Task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
        '422':
          description: Due date is in the past

  /tasks/{taskId}:
    parameters:
      - $ref: '#/components/parameters/taskId'
    get:
      tags: [tasks]
      operationId: getTask
      summary: Get task details (with sub-tasks)
      description: Returns full task details including all sub-tasks.
      responses:
        '200':
          description: Task details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
        '404':
          $ref: '#/components/responses/NotFound'

    patch:
      tags: [tasks]
      operationId: updateTask
      summary: Update a task
      description: |
        Updates task properties. For recurring tasks, optional
        `scope` field controls whether to update this occurrence
        only or all future occurrences.
        - FSD Reference: FR-025
        - Business Rules: BR-100, BR-101
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTaskRequest'
      responses:
        '200':
          description: Task updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [tasks]
      operationId: deleteTask
      summary: Soft-delete a task
      description: |
        Soft-deletes a task and its sub-tasks. For recurring tasks,
        optional `scope` query param controls deletion scope.
        - FSD Reference: FR-026
        - Business Rules: BR-102, BR-103
      parameters:
        - name: scope
          in: query
          schema:
            type: string
            enum: [this, future]
            default: this
          description: For recurring tasks — delete this or all future
      responses:
        '204':
          description: Task deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /tasks/{taskId}/complete:
    parameters:
      - $ref: '#/components/parameters/taskId'
    post:
      tags: [tasks]
      operationId: completeTask
      summary: Mark a task as complete
      description: |
        Marks the task as complete. For recurring tasks, creates
        a new instance for the next occurrence.
        - FSD Reference: FR-021, FR-024
        - Business Rules: BR-084, BR-088, BR-097, BR-098
      responses:
        '200':
          description: Task completed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
              example:
                success: true
                data:
                  id: "task-001"
                  title: "Review project proposal"
                  completedAt: "2026-02-10T14:30:00.000Z"
                  nextOccurrenceId: null
        '404':
          $ref: '#/components/responses/NotFound'

  /tasks/{taskId}/uncomplete:
    parameters:
      - $ref: '#/components/parameters/taskId'
    post:
      tags: [tasks]
      operationId: uncompleteTask
      summary: Revert task completion
      description: Removes the completedAt timestamp, marking the task as incomplete.
      responses:
        '200':
          description: Task uncompleted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
        '404':
          $ref: '#/components/responses/NotFound'

  # ── SUB-TASK ENDPOINTS ──

  /tasks/{taskId}/subtasks:
    parameters:
      - $ref: '#/components/parameters/taskId'
    post:
      tags: [subtasks]
      operationId: createSubTask
      summary: Add a sub-task to a task
      description: Creates a new sub-task under the specified parent task.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateSubTaskRequest'
            example:
              title: "Check references"
      responses:
        '201':
          description: Sub-task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SubTaskResponse'
        '404':
          $ref: '#/components/responses/NotFound'

  /tasks/{taskId}/subtasks/{subTaskId}:
    parameters:
      - $ref: '#/components/parameters/taskId'
      - $ref: '#/components/parameters/subTaskId'
    patch:
      tags: [subtasks]
      operationId: updateSubTask
      summary: Update a sub-task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateSubTaskRequest'
      responses:
        '200':
          description: Sub-task updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SubTaskResponse'
        '404':
          $ref: '#/components/responses/NotFound'
    delete:
      tags: [subtasks]
      operationId: deleteSubTask
      summary: Delete a sub-task
      responses:
        '204':
          description: Sub-task deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /tasks/{taskId}/subtasks/{subTaskId}/complete:
    parameters:
      - $ref: '#/components/parameters/taskId'
      - $ref: '#/components/parameters/subTaskId'
    post:
      tags: [subtasks]
      operationId: completeSubTask
      summary: Complete a sub-task
      description: |
        Marks a sub-task as complete. If ALL sub-tasks of the parent
        task are now complete, the parent task auto-completes.
        - FSD Reference: FR-021
        - Business Rules: BR-085, BR-086, BR-087
      responses:
        '200':
          description: Sub-task completed (includes parent task status)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SubTaskCompleteResponse'
              example:
                success: true
                data:
                  subTask:
                    id: "sub-001"
                    title: "Read executive summary"
                    completedAt: "2026-02-10T14:30:00.000Z"
                  parentAutoCompleted: true

  /tasks/{taskId}/subtasks/{subTaskId}/uncomplete:
    parameters:
      - $ref: '#/components/parameters/taskId'
      - $ref: '#/components/parameters/subTaskId'
    post:
      tags: [subtasks]
      operationId: uncompleteSubTask
      summary: Revert sub-task completion
      description: |
        Reverts sub-task completion. If the parent was auto-completed,
        it also reverts to incomplete.
      responses:
        '200':
          description: Sub-task uncompleted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SubTaskCompleteResponse'

  # ══════════════════════════════════════════════
  # ANALYTICS ENDPOINTS
  # ══════════════════════════════════════════════

  /analytics/completion-rate:
    get:
      tags: [analytics]
      operationId: getCompletionRate
      summary: Get habit completion rate for a date
      description: |
        Returns the completion rate as a percentage for the given date.
        - FSD Reference: FR-027
        - Business Rules: BR-104, BR-105, BR-106, BR-107
      parameters:
        - name: date
          in: query
          required: true
          schema:
            type: string
            format: date
          example: "2026-02-10"
      responses:
        '200':
          description: Completion rate
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CompletionRateResponse'
              example:
                success: true
                data:
                  date: "2026-02-10"
                  rate: 60.0
                  completed: 3
                  scheduled: 5

  /analytics/chart:
    get:
      tags: [analytics]
      operationId: getActivityChart
      summary: Get activity chart data
      description: |
        Returns completion rate data points for the activity line chart.
        - FSD Reference: FR-028
        - Business Rules: BR-108 to BR-112
      parameters:
        - name: view
          in: query
          required: true
          schema:
            type: string
            enum: [weekly, monthly, yearly]
            default: weekly
          description: |
            - `weekly`: Last 7 days
            - `monthly`: Last 30 days
            - `yearly`: Last 12 months (aggregated by month)
      responses:
        '200':
          description: Chart data points
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChartDataResponse'
              example:
                success: true
                data:
                  view: "weekly"
                  dataPoints:
                    - date: "2026-02-04"
                      rate: 80.0
                    - date: "2026-02-05"
                      rate: 100.0
                    - date: "2026-02-06"
                      rate: 60.0
                    - date: "2026-02-07"
                      rate: 40.0
                    - date: "2026-02-08"
                      rate: 100.0
                    - date: "2026-02-09"
                      rate: 80.0
                    - date: "2026-02-10"
                      rate: 60.0

  /analytics/stats:
    get:
      tags: [analytics]
      operationId: getStats
      summary: Get streak and statistics
      description: |
        Returns calculated statistics: streak days, perfect days,
        and active days.
        - FSD Reference: FR-029
        - Business Rules: BR-113, BR-114, BR-115
      responses:
        '200':
          description: Statistics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StatsResponse'
              example:
                success: true
                data:
                  streak: 7
                  perfectDays: 15
                  activeDays: 42

  /analytics/heatmap:
    get:
      tags: [analytics]
      operationId: getHeatmap
      summary: Get calendar heatmap data
      description: |
        Returns daily completion data for a month to render the
        calendar heatmap.
        - FSD Reference: FR-030
        - Business Rules: BR-116 to BR-121
      parameters:
        - name: month
          in: query
          required: true
          schema:
            type: string
            pattern: '^\d{4}-\d{2}$'
          description: Month in YYYY-MM format
          example: "2026-02"
      responses:
        '200':
          description: Heatmap data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HeatmapResponse'
              example:
                success: true
                data:
                  month: "2026-02"
                  days:
                    - date: "2026-02-01"
                      rate: 100.0
                      completed: 5
                      scheduled: 5
                      level: "green"
                    - date: "2026-02-02"
                      rate: 60.0
                      completed: 3
                      scheduled: 5
                      level: "yellow"
                    - date: "2026-02-03"
                      rate: 20.0
                      completed: 1
                      scheduled: 5
                      level: "red"

  /analytics/heatmap/{date}:
    get:
      tags: [analytics]
      operationId: getHeatmapDetail
      summary: Get detailed habit breakdown for a heatmap day
      description: |
        Returns a per-habit breakdown for a specific date,
        showing which habits were completed or missed.
        - FSD Reference: FR-030 (BR-119)
      parameters:
        - name: date
          in: path
          required: true
          schema:
            type: string
            format: date
      responses:
        '200':
          description: Day detail
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HeatmapDetailResponse'
              example:
                success: true
                data:
                  date: "2026-02-01"
                  rate: 60.0
                  habits:
                    - habitId: "hab-001"
                      name: "Drink Water"
                      color: "#4CAF50"
                      completed: true
                    - habitId: "hab-002"
                      name: "Read Book"
                      color: "#2196F3"
                      completed: false
```

---

## 3. Component Schemas

The following schemas are referenced in the OpenAPI specification above. They are presented in readable YAML format:

```yaml
components:

  # ══════════════════════════════════════════════
  # SECURITY SCHEMES
  # ══════════════════════════════════════════════

  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: next-auth.session-token
      description: NextAuth.js JWT session cookie (HTTP-only, Secure)

  # ══════════════════════════════════════════════
  # REUSABLE PARAMETERS
  # ══════════════════════════════════════════════

  parameters:
    habitId:
      name: habitId
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Unique habit identifier

    taskId:
      name: taskId
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Unique task identifier

    subTaskId:
      name: subTaskId
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Unique sub-task identifier

    categoryId:
      name: categoryId
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: Unique category identifier

  # ══════════════════════════════════════════════
  # STANDARD RESPONSES
  # ══════════════════════════════════════════════

  responses:
    ValidationError:
      description: Validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "VALIDATION_ERROR"
              message: "Validation failed"
              details:
                - field: "name"
                  issue: "Name is required"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "NOT_FOUND"
              message: "Resource not found"

    Unauthorized:
      description: Not authenticated
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "UNAUTHORIZED"
              message: "Authentication required"

  # ══════════════════════════════════════════════
  # SCHEMAS
  # ══════════════════════════════════════════════

  schemas:

    # ── Common ──

    ErrorResponse:
      type: object
      required: [success, error]
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          required: [code, message]
          properties:
            code:
              type: string
              enum:
                - VALIDATION_ERROR
                - UNAUTHORIZED
                - FORBIDDEN
                - NOT_FOUND
                - CONFLICT
                - UNPROCESSABLE
                - RATE_LIMITED
                - INTERNAL_ERROR
            message:
              type: string
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  issue:
                    type: string

    PaginationMeta:
      type: object
      properties:
        page:
          type: integer
          example: 1
        limit:
          type: integer
          example: 20
        total:
          type: integer
          example: 45
        totalPages:
          type: integer
          example: 3
        timestamp:
          type: string
          format: date-time

    # ── Auth Schemas ──

    RegisterRequest:
      type: object
      required: [email, password, name]
      properties:
        email:
          type: string
          format: email
          maxLength: 255
          description: RFC 5322 email address
          example: "user@example.com"
        password:
          type: string
          minLength: 8
          maxLength: 128
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
          description: "Min 8 chars, 1 uppercase, 1 lowercase, 1 digit (BR-002)"
          example: "SecurePass1"
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: Display name
          example: "John Doe"

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
          example: "user@example.com"
        password:
          type: string
          example: "SecurePass1"

    AuthResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          properties:
            user:
              $ref: '#/components/schemas/UserSummary'
            token:
              type: string
              description: JWT token (also set in HTTP-only cookie)

    SessionResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            user:
              $ref: '#/components/schemas/UserSummary'
            expires:
              type: string
              format: date-time

    # ── User Schemas ──

    UserSummary:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        avatarUrl:
          type: string
          nullable: true
        theme:
          type: string
          enum: [light, dark, system]
        createdAt:
          type: string
          format: date-time

    UserResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/UserSummary'

    UpdateUserRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        avatarUrl:
          type: string
          maxLength: 500
          nullable: true
        theme:
          type: string
          enum: [light, dark, system]

    # ── Category Schemas ──

    Category:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        icon:
          type: string
          description: Emoji icon
        defaultColor:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'
        isDefault:
          type: boolean
        habitCount:
          type: integer
          description: Number of active habits in this category
        createdAt:
          type: string
          format: date-time

    CategoryResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/Category'

    CategoryListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: array
          items:
            $ref: '#/components/schemas/Category'

    CreateCategoryRequest:
      type: object
      required: [name, icon, defaultColor]
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 50
        icon:
          type: string
          minLength: 1
          maxLength: 10
          description: Single emoji character
        defaultColor:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'

    UpdateCategoryRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 50
        icon:
          type: string
          maxLength: 10
        defaultColor:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'

    # ── Habit Schemas ──

    Habit:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        categoryId:
          type: string
          format: uuid
        category:
          type: object
          properties:
            id:
              type: string
              format: uuid
            name:
              type: string
            icon:
              type: string
        color:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'
        frequency:
          type: string
          enum: [daily, weekly, monthly]
        targetValue:
          type: integer
          nullable: true
          minimum: 1
          description: Required if frequency=daily
        targetUnit:
          type: string
          nullable: true
          maxLength: 50
          description: Required if frequency=daily
        weeklyDays:
          type: array
          items:
            type: integer
            minimum: 0
            maximum: 6
          nullable: true
          description: Required if frequency=weekly (0=Mon..6=Sun)
        monthlyDates:
          type: array
          items:
            type: integer
            minimum: 1
            maximum: 31
          nullable: true
          description: Required if frequency=monthly
        reminderTime:
          type: string
          pattern: '^\d{2}:\d{2}$'
          nullable: true
          description: HH:MM format
        isActive:
          type: boolean
        sortOrder:
          type: integer
        isCompleted:
          type: boolean
          description: Completion status for the queried date
        completionId:
          type: string
          format: uuid
          nullable: true
          description: Completion record ID (null if not completed)
        streak:
          type: integer
          description: Current consecutive completion streak
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    HabitResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/Habit'

    HabitListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: array
          items:
            $ref: '#/components/schemas/Habit'

    CreateHabitRequest:
      type: object
      required: [name, categoryId, color, frequency]
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
          description: "Habit name (BR-013)"
        categoryId:
          type: string
          format: uuid
        color:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'
          description: "Must be from predefined palette (BR-015)"
        frequency:
          type: string
          enum: [daily, weekly, monthly]
          description: "BR-016"
        targetValue:
          type: integer
          minimum: 1
          description: "Required if frequency=daily (BR-017)"
        targetUnit:
          type: string
          maxLength: 50
          description: "Required if frequency=daily (BR-017)"
        weeklyDays:
          type: array
          items:
            type: integer
            minimum: 0
            maximum: 6
          minItems: 1
          description: "Required if frequency=weekly (BR-018)"
        monthlyDates:
          type: array
          items:
            type: integer
            minimum: 1
            maximum: 31
          minItems: 1
          description: "Required if frequency=monthly (BR-019)"
        reminderTime:
          type: string
          pattern: '^\d{2}:\d{2}$'
          description: "Optional reminder time HH:MM (BR-020)"

    UpdateHabitRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        categoryId:
          type: string
          format: uuid
        color:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'
        frequency:
          type: string
          enum: [daily, weekly, monthly]
        targetValue:
          type: integer
          minimum: 1
          nullable: true
        targetUnit:
          type: string
          maxLength: 50
          nullable: true
        weeklyDays:
          type: array
          items:
            type: integer
          nullable: true
        monthlyDates:
          type: array
          items:
            type: integer
          nullable: true
        reminderTime:
          type: string
          nullable: true
        sortOrder:
          type: integer
          minimum: 0

    # ── Habit Completion Schemas ──

    CompleteHabitRequest:
      type: object
      required: [date]
      properties:
        date:
          type: string
          format: date
          description: Completion date (YYYY-MM-DD)
        value:
          type: integer
          minimum: 0
          description: Achieved value for numeric habits

    HabitCompletion:
      type: object
      properties:
        id:
          type: string
          format: uuid
        habitId:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        date:
          type: string
          format: date
        value:
          type: integer
          nullable: true
        completedAt:
          type: string
          format: date-time

    HabitCompletionResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/HabitCompletion'

    # ── Mood Check-in Schemas ──

    CreateMoodCheckinRequest:
      type: object
      required: [habitId, completionId, mood]
      properties:
        habitId:
          type: string
          format: uuid
        completionId:
          type: string
          format: uuid
        mood:
          type: string
          enum: [happy, proud, worried, annoyed, sad, angry]
          description: "Six mood options (BR-059)"
        reflectionText:
          type: string
          maxLength: 500
          description: "Optional text reflection for negative moods"
        selectedActivity:
          type: string
          enum:
            - short_break
            - deep_breathing
            - calming_music
            - talk_to_someone
            - go_for_walk
          description: "Optional calming activity suggestion"

    MoodCheckin:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        habitId:
          type: string
          format: uuid
        completionId:
          type: string
          format: uuid
        date:
          type: string
          format: date
        mood:
          type: string
          enum: [happy, proud, worried, annoyed, sad, angry]
        isPositive:
          type: boolean
          description: "true for happy/proud, false otherwise (BR-061)"
        reflectionText:
          type: string
          nullable: true
        selectedActivity:
          type: string
          nullable: true
        createdAt:
          type: string
          format: date-time

    MoodCheckinResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/MoodCheckin'

    MoodCheckinListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: array
          items:
            $ref: '#/components/schemas/MoodCheckin'

    # ── Task Schemas ──

    Task:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
          nullable: true
          description: Rich text (HTML)
        priority:
          type: string
          enum: [high, medium, low]
        dueDate:
          type: string
          format: date
          nullable: true
        originalDueDate:
          type: string
          format: date
          nullable: true
          description: Original due date before auto-postpone
        recurrence:
          type: string
          enum: [none, daily, weekly, monthly, custom]
        recurrenceRule:
          type: object
          nullable: true
          description: Custom recurrence configuration
        autoPostpone:
          type: boolean
        completedAt:
          type: string
          format: date-time
          nullable: true
        sortOrder:
          type: integer
        parentTaskId:
          type: string
          format: uuid
          nullable: true
        subTasks:
          type: array
          items:
            $ref: '#/components/schemas/SubTask'
        postponeCount:
          type: integer
          description: Number of times this task was auto-postponed
        nextOccurrenceId:
          type: string
          format: uuid
          nullable: true
          description: ID of next recurring instance (if applicable)
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    TaskResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/Task'

    TaskListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: array
          items:
            $ref: '#/components/schemas/Task'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    CreateTaskRequest:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
          description: "Task title (BR-077)"
        description:
          type: string
          maxLength: 2000
          description: "Rich text HTML content (BR-078)"
        priority:
          type: string
          enum: [high, medium, low]
          default: medium
        dueDate:
          type: string
          format: date
          description: "Must be >= today (BR-080)"
        recurrence:
          type: string
          enum: [none, daily, weekly, monthly, custom]
          default: none
        recurrenceRule:
          type: object
          nullable: true
          description: Required if recurrence=custom
        autoPostpone:
          type: boolean
          default: false
        subTasks:
          type: array
          items:
            type: object
            required: [title]
            properties:
              title:
                type: string
                maxLength: 200
          description: Initial sub-tasks to create with the task

    UpdateTaskRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 2000
          nullable: true
        priority:
          type: string
          enum: [high, medium, low]
        dueDate:
          type: string
          format: date
          nullable: true
        recurrence:
          type: string
          enum: [none, daily, weekly, monthly, custom]
        recurrenceRule:
          type: object
          nullable: true
        autoPostpone:
          type: boolean
        sortOrder:
          type: integer
          minimum: 0
        scope:
          type: string
          enum: [this, future]
          default: this
          description: For recurring tasks — update scope

    # ── Sub-Task Schemas ──

    SubTask:
      type: object
      properties:
        id:
          type: string
          format: uuid
        taskId:
          type: string
          format: uuid
        title:
          type: string
        completedAt:
          type: string
          format: date-time
          nullable: true
        sortOrder:
          type: integer
        createdAt:
          type: string
          format: date-time

    SubTaskResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          $ref: '#/components/schemas/SubTask'

    SubTaskCompleteResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            subTask:
              $ref: '#/components/schemas/SubTask'
            parentAutoCompleted:
              type: boolean
              description: Whether parent task was auto-completed

    CreateSubTaskRequest:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200

    UpdateSubTaskRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        sortOrder:
          type: integer
          minimum: 0

    # ── Analytics Schemas ──

    CompletionRateResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            date:
              type: string
              format: date
            rate:
              type: number
              format: float
              minimum: 0
              maximum: 100
              description: "Percentage (BR-104)"
            completed:
              type: integer
            scheduled:
              type: integer

    ChartDataResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            view:
              type: string
              enum: [weekly, monthly, yearly]
            dataPoints:
              type: array
              items:
                type: object
                properties:
                  date:
                    type: string
                    format: date
                    description: Date or month start date
                  rate:
                    type: number
                    format: float
                    minimum: 0
                    maximum: 100

    StatsResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            streak:
              type: integer
              minimum: 0
              description: "Consecutive days with ≥1 completion (BR-113)"
            perfectDays:
              type: integer
              minimum: 0
              description: "Days with 100% completion (BR-114)"
            activeDays:
              type: integer
              minimum: 0
              description: "Total days with ≥1 completion (BR-115)"

    HeatmapResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            month:
              type: string
              pattern: '^\d{4}-\d{2}$'
            days:
              type: array
              items:
                type: object
                properties:
                  date:
                    type: string
                    format: date
                  rate:
                    type: number
                    format: float
                  completed:
                    type: integer
                  scheduled:
                    type: integer
                  level:
                    type: string
                    enum: [none, red, yellow, green]
                    description: |
                      - none: no habits scheduled
                      - red: 0-39% (BR-117)
                      - yellow: 40-79% (BR-117)
                      - green: 80-100% (BR-117)

    HeatmapDetailResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            date:
              type: string
              format: date
            rate:
              type: number
              format: float
            habits:
              type: array
              items:
                type: object
                properties:
                  habitId:
                    type: string
                    format: uuid
                  name:
                    type: string
                  color:
                    type: string
                  completed:
                    type: boolean
```

---

## 4. FSD-to-Endpoint Traceability Matrix

| FSD Requirement | Endpoint(s)                                           | Method | Operation ID          |
| --------------- | ----------------------------------------------------- | ------ | --------------------- |
| FR-001          | `/auth/register`                                      | POST   | registerUser          |
| FR-002          | NextAuth OAuth (handled by NextAuth `/api/auth/*`)    | —      | (NextAuth built-in)   |
| FR-003          | `/auth/login`                                         | POST   | loginUser             |
| FR-004          | `/auth/logout`                                        | POST   | logoutUser            |
| FR-005          | `/auth/session`                                       | GET    | getSession            |
| FR-006          | `/habits` (POST)                                      | POST   | createHabit           |
| FR-007          | `/habits` (GET)                                       | GET    | listHabits            |
| FR-008          | `/habits/{habitId}` (PATCH)                           | PATCH  | updateHabit           |
| FR-009          | `/habits/{habitId}` (DELETE)                          | DELETE | deleteHabit           |
| FR-010          | `/habits/{habitId}/complete`                          | POST   | completeHabit         |
| FR-011          | `/habits/{habitId}/uncomplete`                        | POST   | uncompleteHabit       |
| FR-012          | `/categories` (GET, POST), `/categories/{id}` (PATCH, DELETE) | CRUD | listCategories, createCategory, updateCategory, deleteCategory |
| FR-015          | `/mood-checkins` (POST)                               | POST   | createMoodCheckin     |
| FR-016          | `/mood-checkins` (POST — mood selection)              | POST   | createMoodCheckin     |
| FR-017          | `/mood-checkins` (POST — positive path)               | POST   | createMoodCheckin     |
| FR-018          | `/mood-checkins` (POST — negative path)               | POST   | createMoodCheckin     |
| FR-019          | `/mood-checkins` (POST — upsert + animation)          | POST   | createMoodCheckin     |
| FR-020          | `/tasks` (POST)                                       | POST   | createTask            |
| FR-021          | `/tasks/{id}/complete`, subtask endpoints              | POST   | completeTask, completeSubTask |
| FR-022          | `/tasks` (GET — auto-postpone triggered on load)      | GET    | listTasks             |
| FR-023          | `/tasks` (GET — filtering/sorting)                    | GET    | listTasks             |
| FR-024          | `/tasks/{id}/complete` (recurring task)               | POST   | completeTask          |
| FR-025          | `/tasks/{id}` (PATCH)                                 | PATCH  | updateTask            |
| FR-026          | `/tasks/{id}` (DELETE)                                | DELETE | deleteTask            |
| FR-027          | `/analytics/completion-rate`                          | GET    | getCompletionRate     |
| FR-028          | `/analytics/chart`                                    | GET    | getActivityChart      |
| FR-029          | `/analytics/stats`                                    | GET    | getStats              |
| FR-030          | `/analytics/heatmap`, `/analytics/heatmap/{date}`     | GET    | getHeatmap, getHeatmapDetail |
| FR-031          | `/users/me` (PATCH — theme)                           | PATCH  | updateCurrentUser     |
| FR-032          | `/habits` (POST — color field)                        | POST   | createHabit           |
| FR-033–040      | Client-side only (navigation, PWA, offline, animation)| —      | N/A                   |

---

## 5. ERD-to-Schema Mapping

| ERD Entity       | API Schema(s)                | Notes                                             |
| ---------------- | ---------------------------- | ------------------------------------------------- |
| User             | UserSummary, UpdateUserRequest | Profile data; password hash never exposed        |
| Account          | (Internal — NextAuth)        | Managed by NextAuth adapter                       |
| Session          | SessionResponse              | Exposed via `/auth/session`                       |
| Category         | Category, CreateCategoryRequest, UpdateCategoryRequest | Full CRUD          |
| Habit            | Habit, CreateHabitRequest, UpdateHabitRequest | Includes computed `isCompleted`, `streak` |
| HabitCompletion  | HabitCompletion, CompleteHabitRequest | Created via `/habits/{id}/complete`     |
| MoodCheckin      | MoodCheckin, CreateMoodCheckinRequest | Upsert semantics                         |
| Task             | Task, CreateTaskRequest, UpdateTaskRequest | Includes nested `subTasks`          |
| SubTask          | SubTask, CreateSubTaskRequest, UpdateSubTaskRequest | Nested under Task           |
| PostponeHistory  | (Internal)                   | Not directly exposed; data available via `Task.postponeCount` |

---

## 6. Endpoint Summary

### Total Endpoints: 28

| Tag            | Count | Endpoints                                                      |
| -------------- | ----- | -------------------------------------------------------------- |
| auth           | 4     | register, login, logout, session                               |
| users          | 2     | get profile, update profile                                    |
| categories     | 4     | list, create, update, delete                                   |
| habits         | 5     | list, create, get, update, delete                              |
| habits (actions)| 2    | complete, uncomplete                                           |
| mood-checkins  | 2     | create (upsert), list                                          |
| tasks          | 5     | list, create, get, update, delete                              |
| tasks (actions)| 2     | complete, uncomplete                                           |
| subtasks       | 5     | create, update, delete, complete, uncomplete                   |
| analytics      | 4     | completion-rate, chart, stats, heatmap + heatmap detail        |

---

## 7. Verification Checklist

- [x] All FSD use cases (FR-001 through FR-040) have corresponding endpoints or are client-only
- [x] All ERD entities have schema definitions (Account and PostponeHistory are internal)
- [x] All relationships properly represented (nested SubTasks, linked Category in Habit)
- [x] Authentication defined for all protected endpoints (sessionCookie scheme)
- [x] Error responses cover all documented scenarios (400, 401, 403, 404, 409, 422, 429, 500)
- [x] Examples provided for all major request/response pairs
- [x] Naming conventions consistent: camelCase properties, kebab-case URLs, PascalCase schemas
- [x] Pagination pattern applied to paginated endpoints (tasks)
- [x] Business rules mapped to validation constraints (BR references in schema descriptions)
- [x] Soft-delete semantics documented for habits and tasks (DELETE returns 204)

---

## Appendix: Revision History

| Version | Date       | Author        | Changes                          |
| ------- | ---------- | ------------- | -------------------------------- |
| 1.0.0   | 2026-02-10 | [Author Name] | Initial API contract from FSD + ERD v1.0 |

---

*Document generated on 2026-02-10. This API contract is derived from FSD v1.0 and ERD v1.0.*
