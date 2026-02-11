# Technical Design Document

**Project:** Vora – Smart Habit Tracking & Task Management PWA
**Version:** 1.0
**Date:** 2026-02-10
**Author:** Solutions Architect
**Status:** Draft

---

## 1. Executive Summary

Vora is a Progressive Web Application for habit tracking, mood check-ins, task management, and personal analytics targeting young adults (18–30). The system provides daily habit completion workflows with emotional intelligence features (mood check-ins with positive/negative branching paths), a full task manager with sub-tasks and auto-postpone, and a rich analytics dashboard with streaks, charts, and calendar heatmaps.

The architecture follows a **Next.js full-stack monolith** pattern — a single deployable unit serving both the React frontend and API routes. This choice optimizes for development velocity, reduces infrastructure complexity, and leverages Next.js's built-in SSR/SSG capabilities for performance. The database layer uses **PostgreSQL** with **Prisma ORM**, providing type-safe queries and migration management. Authentication is handled by **NextAuth.js** with JWT sessions stored in HTTP-only cookies.

**Key Technical Decisions:**
- Next.js 14+ App Router for server components and API routes
- PostgreSQL + Prisma for relational data with soft-delete middleware
- NextAuth.js for email/password + Google OAuth authentication
- Vanilla CSS with CSS Custom Properties (design tokens) — no Tailwind
- PWA with service worker for offline-first capability
- Vercel deployment with serverless functions

---

## 2. System Architecture

### 2.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT (Browser / PWA)                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js App Router (React 18+)                          │   │
│  │  ├─ Server Components (SSR / RSC)                        │   │
│  │  ├─ Client Components (interactive UI)                   │   │
│  │  ├─ Service Worker (offline cache, background sync)      │   │
│  │  └─ CSS Custom Properties (design tokens)                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────────┐
│  SERVER (Next.js API Routes — Vercel Serverless)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Layer (/api/*)                                      │   │
│  │  ├─ NextAuth.js (/api/auth/*)                            │   │
│  │  ├─ Habits Service                                       │   │
│  │  ├─ Tasks Service                                        │   │
│  │  ├─ Mood Check-in Service                                │   │
│  │  ├─ Analytics Service                                    │   │
│  │  ├─ Categories Service                                   │   │
│  │  └─ Users Service                                        │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Middleware Layer                                         │   │
│  │  ├─ Authentication middleware                            │   │
│  │  ├─ Rate limiting (in-memory / Redis)                    │   │
│  │  ├─ Request validation (Zod)                             │   │
│  │  └─ Soft-delete query filter (Prisma middleware)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Prisma Client (TCP)
┌─────────────────────────▼───────────────────────────────────────┐
│  DATABASE (PostgreSQL)                                          │
│  ├─ Users, Accounts, Sessions (NextAuth)                        │
│  ├─ Categories, Habits, HabitCompletions                        │
│  ├─ MoodCheckins                                                │
│  ├─ Tasks, SubTasks, PostponeHistory                            │
│  └─ Indexes, constraints, soft-delete flags                     │
└─────────────────────────────────────────────────────────────────┘
```

**Architecture Pattern:** Full-stack Next.js monolith with serverless deployment.

**Justification:**
- Single deployment unit reduces DevOps overhead for a small team
- Server Components enable zero-JS data fetching for pages
- API routes co-located with frontend for shared types
- Vercel's serverless functions auto-scale per-route
- Prisma's type generation provides end-to-end type safety

### 2.2 Component Architecture

| Component              | Responsibility                              | Technology              | Dependencies           |
| ---------------------- | ------------------------------------------- | ----------------------- | ---------------------- |
| Web Client             | UI rendering, client-side state, PWA        | React 18, Next.js 14    | API routes             |
| API Routes             | Business logic, data access, auth           | Next.js Route Handlers  | Prisma, NextAuth       |
| Auth Module            | Registration, login, session management     | NextAuth.js v5          | PostgreSQL, bcrypt     |
| Prisma ORM             | Database queries, migrations, type safety   | Prisma 5.x              | PostgreSQL             |
| Service Worker         | Offline caching, background sync            | Workbox                 | Cache API              |
| CSS Design System      | Theming, tokens, component styles           | CSS Custom Properties   | None                   |

### 2.3 Deployment Architecture

| Environment | Infrastructure     | Database             | URL                         |
| ----------- | ------------------ | -------------------- | --------------------------- |
| Development | `localhost:3000`   | Local PostgreSQL     | `http://localhost:3000`     |
| Preview     | Vercel Preview      | Vercel Postgres (branch) | `*.vercel.app`          |
| Production  | Vercel Production   | Vercel Postgres      | `https://vora.app`         |

**Containerization:** Not required — Vercel handles serverless function packaging. For self-hosted scenarios, a `Dockerfile` with multi-stage build (Node.js 20 + `next build`) is recommended.

---

## 3. Data Architecture

### 3.1 Data Model

*Derived from ERD v1.0 — 10 entities, 14 relationships.*

#### Entity Specifications

| Entity           | Attributes                                                                                                   | PK         | Soft Delete |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ---------- | ----------- |
| User             | id, email, name, password_hash, avatar_url, theme, email_verified, created_at, updated_at, deleted_at        | id (UUID)  | Yes         |
| Account          | id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at                    | id (UUID)  | No          |
| Session          | id, session_token, user_id, expires                                                                          | id (UUID)  | No          |
| Category         | id, user_id, name, icon, default_color, is_default, sort_order, created_at, updated_at, deleted_at           | id (UUID)  | Yes         |
| Habit            | id, user_id, category_id, name, color, frequency, target_value, target_unit, weekly_days, monthly_dates, reminder_time, is_active, sort_order, created_at, updated_at, deleted_at | id (UUID) | Yes |
| HabitCompletion  | id, habit_id, user_id, date, value, completed_at                                                             | id (UUID)  | No          |
| MoodCheckin      | id, user_id, habit_id, completion_id, date, mood, is_positive, reflection_text, selected_activity, created_at | id (UUID) | No          |
| Task             | id, user_id, title, description, priority, due_date, original_due_date, recurrence, recurrence_rule, auto_postpone, completed_at, sort_order, parent_task_id, created_at, updated_at, deleted_at | id (UUID) | Yes |
| SubTask          | id, task_id, title, completed_at, sort_order, created_at                                                     | id (UUID)  | No (cascade)|
| PostponeHistory  | id, task_id, from_date, to_date, reason, created_at                                                          | id (UUID)  | No          |

### 3.2 Database Design

**Technology:** PostgreSQL 15+

**Justification:**
- Relational data with complex queries (analytics aggregations, date-range filtering)
- Native array types for `weekly_days` and `monthly_dates` (avoids junction tables)
- Robust JSON support for `recurrence_rule`
- Mature ecosystem, Prisma first-class support
- Vercel Postgres available for serverless deployment

#### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── NextAuth Entities ──

model User {
  id             String    @id @default(uuid())
  email          String    @unique
  name           String
  passwordHash   String?   @map("password_hash")
  avatarUrl      String?   @map("avatar_url")
  theme          Theme     @default(SYSTEM)
  emailVerified  DateTime? @map("email_verified")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  accounts         Account[]
  sessions         Session[]
  categories       Category[]
  habits           Habit[]
  habitCompletions HabitCompletion[]
  moodCheckins     MoodCheckin[]
  tasks            Task[]

  @@map("users")
}

model Account {
  id                String  @id @default(uuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refreshToken      String? @map("refresh_token") @db.Text
  accessToken       String? @map("access_token") @db.Text
  expiresAt         Int?    @map("expires_at")
  tokenType         String? @map("token_type")
  scope             String?
  idToken           String? @map("id_token") @db.Text
  sessionState      String? @map("session_state")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ── Domain Entities ──

model Category {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  name         String
  icon         String
  defaultColor String    @map("default_color")
  isDefault    Boolean   @default(false) @map("is_default")
  sortOrder    Int       @default(0) @map("sort_order")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")

  user   User   @relation(fields: [userId], references: [id])
  habits Habit[]

  @@map("categories")
}

model Habit {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  categoryId   String    @map("category_id")
  name         String
  color        String
  frequency    Frequency
  targetValue  Int?      @map("target_value")
  targetUnit   String?   @map("target_unit")
  weeklyDays   Int[]     @map("weekly_days")
  monthlyDates Int[]     @map("monthly_dates")
  reminderTime String?   @map("reminder_time")
  isActive     Boolean   @default(true) @map("is_active")
  sortOrder    Int       @default(0) @map("sort_order")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")

  user        User              @relation(fields: [userId], references: [id])
  category    Category          @relation(fields: [categoryId], references: [id])
  completions HabitCompletion[]
  moodCheckins MoodCheckin[]

  @@map("habits")
}

model HabitCompletion {
  id          String   @id @default(uuid())
  habitId     String   @map("habit_id")
  userId      String   @map("user_id")
  date        DateTime @db.Date
  value       Int?
  completedAt DateTime @default(now()) @map("completed_at")

  habit        Habit         @relation(fields: [habitId], references: [id])
  user         User          @relation(fields: [userId], references: [id])
  moodCheckin  MoodCheckin?

  @@unique([habitId, date])
  @@map("habit_completions")
}

model MoodCheckin {
  id               String   @id @default(uuid())
  userId           String   @map("user_id")
  habitId          String   @map("habit_id")
  completionId     String   @unique @map("completion_id")
  date             DateTime @db.Date
  mood             Mood
  isPositive       Boolean  @map("is_positive")
  reflectionText   String?  @map("reflection_text") @db.VarChar(500)
  selectedActivity String?  @map("selected_activity")
  createdAt        DateTime @default(now()) @map("created_at")

  user       User            @relation(fields: [userId], references: [id])
  habit      Habit           @relation(fields: [habitId], references: [id])
  completion HabitCompletion @relation(fields: [completionId], references: [id])

  @@unique([habitId, date])
  @@map("mood_checkins")
}

model Task {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  title           String
  description     String?   @db.Text
  priority        Priority  @default(MEDIUM)
  dueDate         DateTime? @map("due_date") @db.Date
  originalDueDate DateTime? @map("original_due_date") @db.Date
  recurrence      Recurrence @default(NONE)
  recurrenceRule  Json?     @map("recurrence_rule")
  autoPostpone    Boolean   @default(false) @map("auto_postpone")
  completedAt     DateTime? @map("completed_at")
  sortOrder       Int       @default(0) @map("sort_order")
  parentTaskId    String?   @map("parent_task_id")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  user             User              @relation(fields: [userId], references: [id])
  parentTask       Task?             @relation("TaskRecurrence", fields: [parentTaskId], references: [id])
  childTasks       Task[]            @relation("TaskRecurrence")
  subTasks         SubTask[]
  postponeHistory  PostponeHistory[]

  @@map("tasks")
}

model SubTask {
  id          String    @id @default(uuid())
  taskId      String    @map("task_id")
  title       String
  completedAt DateTime? @map("completed_at")
  sortOrder   Int       @default(0) @map("sort_order")
  createdAt   DateTime  @default(now()) @map("created_at")

  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@map("sub_tasks")
}

model PostponeHistory {
  id        String   @id @default(uuid())
  taskId    String   @map("task_id")
  fromDate  DateTime @map("from_date") @db.Date
  toDate    DateTime @map("to_date") @db.Date
  reason    String   @default("auto")
  createdAt DateTime @default(now()) @map("created_at")

  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@map("postpone_history")
}

// ── Enums ──

enum Theme {
  LIGHT
  DARK
  SYSTEM
}

enum Frequency {
  DAILY
  WEEKLY
  MONTHLY
}

enum Mood {
  HAPPY
  PROUD
  WORRIED
  ANNOYED
  SAD
  ANGRY
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

enum Recurrence {
  NONE
  DAILY
  WEEKLY
  MONTHLY
  CUSTOM
}
```

#### Indexing Strategy

| Table              | Index                                    | Type     | Purpose                          |
| ------------------ | ---------------------------------------- | -------- | -------------------------------- |
| users              | `email`                                  | Unique   | Login lookups                    |
| habit_completions  | `(habit_id, date)`                       | Unique   | Upsert / prevent duplicates     |
| habit_completions  | `(user_id, date)`                        | Compound | Daily completion queries         |
| mood_checkins      | `(habit_id, date)`                       | Unique   | Upsert / prevent duplicates     |
| mood_checkins      | `(user_id, date)`                        | Compound | Date-range mood queries          |
| habits             | `(user_id, deleted_at)`                  | Compound | List active habits per user      |
| tasks              | `(user_id, deleted_at, due_date)`        | Compound | Task filtering & sorting         |
| tasks              | `(user_id, deleted_at, completed_at)`    | Compound | Overdue task detection           |
| categories         | `(user_id, deleted_at)`                  | Compound | List categories per user         |
| postpone_history   | `task_id`                                | Standard | Postpone count aggregation       |

### 3.3 Data Flow

#### Soft-Delete Middleware (Prisma)

```typescript
// src/lib/prisma-middleware.ts
import { Prisma } from '@prisma/client';

const SOFT_DELETE_MODELS = ['User', 'Category', 'Habit', 'Task'];

export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    if (SOFT_DELETE_MODELS.includes(params.model ?? '')) {
      // Intercept delete → update with deletedAt
      if (params.action === 'delete') {
        params.action = 'update';
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        params.args.data = { deletedAt: new Date() };
      }

      // Auto-filter soft-deleted records on reads
      if (['findFirst', 'findMany', 'findUnique'].includes(params.action)) {
        if (!params.args.where) params.args.where = {};
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      }
    }
    return next(params);
  };
}
```

#### Caching Strategy

| Data                 | Cache Layer       | TTL     | Invalidation                    |
| -------------------- | ----------------- | ------- | ------------------------------- |
| User session         | JWT cookie        | 30 days | Logout, password change         |
| Categories list      | React Query       | 5 min   | On category CRUD                |
| Habits list (by date)| React Query       | 30s     | On completion/uncomplete        |
| Analytics stats      | React Query       | 2 min   | On any completion event         |
| Heatmap month data   | React Query       | 5 min   | On completion for that month    |
| Static assets        | Service Worker    | Long    | On app update (versioned)       |

---

## 4. API Design

### 4.1 API Architecture

- **Style:** RESTful with JSON payloads
- **Base Path:** `/api` (Next.js Route Handlers)
- **Versioning:** URL-based when needed (`/api/v2/...`), currently unversioned
- **Authentication:** NextAuth.js session cookies (JWT, HTTP-only)
- **Rate Limiting:** 100 req/min per user (in-memory with `lru-cache`, Redis for production)
- **Response Envelope:** `{ success: boolean, data?: T, error?: ErrorObject, meta?: PaginationMeta }`

### 4.2 Route Handler Structure

```
src/app/api/
├── auth/
│   ├── [...nextauth]/route.ts .... NextAuth catch-all
│   ├── register/route.ts ......... POST /api/auth/register
│   └── session/route.ts .......... GET  /api/auth/session
├── users/
│   └── me/route.ts ............... GET, PATCH /api/users/me
├── categories/
│   ├── route.ts .................. GET, POST /api/categories
│   └── [categoryId]/route.ts ..... PATCH, DELETE /api/categories/:id
├── habits/
│   ├── route.ts .................. GET, POST /api/habits
│   └── [habitId]/
│       ├── route.ts .............. GET, PATCH, DELETE /api/habits/:id
│       ├── complete/route.ts ..... POST /api/habits/:id/complete
│       └── uncomplete/route.ts ... POST /api/habits/:id/uncomplete
├── mood-checkins/
│   └── route.ts .................. GET, POST /api/mood-checkins
├── tasks/
│   ├── route.ts .................. GET, POST /api/tasks
│   └── [taskId]/
│       ├── route.ts .............. GET, PATCH, DELETE /api/tasks/:id
│       ├── complete/route.ts ..... POST
│       ├── uncomplete/route.ts ... POST
│       └── subtasks/
│           ├── route.ts .......... POST /api/tasks/:id/subtasks
│           └── [subTaskId]/
│               ├── route.ts ...... PATCH, DELETE
│               ├── complete/route.ts ... POST
│               └── uncomplete/route.ts . POST
└── analytics/
    ├── completion-rate/route.ts .. GET
    ├── chart/route.ts ............ GET
    ├── stats/route.ts ............ GET
    └── heatmap/
        ├── route.ts .............. GET /api/analytics/heatmap?month=
        └── [date]/route.ts ....... GET /api/analytics/heatmap/:date
```

### 4.3 Authentication & Authorization

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string, deletedAt: null },
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});

// Reusable auth guard for route handlers
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError('UNAUTHORIZED', 'Authentication required');
  }
  return session.user;
}
```

**Permission Model:** Single-role (all authenticated users have equal permissions). Row-level security enforced by `userId` filtering in every query.

### 4.4 Request Validation (Zod)

```typescript
// src/lib/validators/habit.ts
import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1).max(100),
  categoryId: z.string().uuid(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  targetValue: z.number().int().min(1).optional(),
  targetUnit: z.string().max(50).optional(),
  weeklyDays: z.array(z.number().int().min(0).max(6)).min(1).optional(),
  monthlyDates: z.array(z.number().int().min(1).max(31)).min(1).optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
}).refine(
  (data) => {
    if (data.frequency === 'daily') return data.targetValue != null && data.targetUnit != null;
    if (data.frequency === 'weekly') return data.weeklyDays != null && data.weeklyDays.length > 0;
    if (data.frequency === 'monthly') return data.monthlyDates != null && data.monthlyDates.length > 0;
    return true;
  },
  { message: 'Frequency-specific fields required' }
);

export const completeHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.number().int().min(0).optional(),
});
```

---

## 5. Component Design

### 5.1 Backend Services

#### Habits Service

- **Responsibility:** CRUD habits, complete/uncomplete, streak calculation
- **Key Functions:**
  - `listHabitsForDate(userId, date)` — Returns habits scheduled for date with completion status
  - `completeHabit(userId, habitId, date, value?)` — Upsert completion record
  - `uncompleteHabit(userId, habitId, date)` — Remove completion record
  - `calculateStreak(habitId)` — Compute consecutive completion days
- **Business Rules:** BR-013 to BR-040 (name validation, frequency rules, color palette, sort order)

#### Tasks Service

- **Responsibility:** CRUD tasks + sub-tasks, auto-postpone, recurrence
- **Key Functions:**
  - `listTasks(userId, filter, sort, page, limit)` — Filtered/sorted paginated tasks
  - `autoPostpone(userId)` — Move overdue tasks with `autoPostpone=true` to today
  - `completeTask(userId, taskId)` — Mark complete, create next recurrence if applicable
  - `completeSubTask(userId, taskId, subTaskId)` — Complete sub-task, check parent auto-complete
- **Business Rules:** BR-077 to BR-103

#### Analytics Service

- **Responsibility:** Compute completion rates, streaks, chart data, heatmap
- **Key Functions:**
  - `getCompletionRate(userId, date)` — scheduled vs completed count for date
  - `getChartData(userId, view)` — Aggregated rate data for weekly/monthly/yearly
  - `getStats(userId)` — streak, perfectDays, activeDays
  - `getHeatmap(userId, month)` — Daily rates for a month with color levels
  - `getHeatmapDetail(userId, date)` — Per-habit breakdown for a day
- **Business Rules:** BR-104 to BR-121

#### Mood Check-in Service

- **Responsibility:** Record and retrieve mood data
- **Key Functions:**
  - `upsertMoodCheckin(userId, data)` — Create or update mood for habit+date
  - `listMoodCheckins(userId, startDate, endDate, habitId?)` — Date-range query
- **Business Rules:** BR-059 to BR-075 (6 moods, positive/negative classification, upsert)

### 5.2 Frontend Architecture

#### Framework & State Management

| Concern            | Solution                    | Justification                              |
| ------------------ | --------------------------- | ------------------------------------------ |
| Framework          | Next.js 14 App Router       | SSR, RSC, file-based routing               |
| Server State       | TanStack Query (React Query)| Caching, re-fetch, optimistic updates      |
| Client State       | React `useState` / `useReducer` | Minimal client state needed           |
| Form State         | React Hook Form + Zod       | Validation, performance                    |
| Theme State        | CSS Custom Properties + `data-theme` attribute | No JS re-render on theme change |

#### Page & Component Hierarchy

```
src/app/
├── layout.tsx ................... Root layout (fonts, theme, providers)
├── (auth)/
│   ├── login/page.tsx ........... Login screen
│   └── register/page.tsx ........ Register screen
├── (app)/
│   ├── layout.tsx ............... App shell (sidebar, topbar, bottom nav)
│   ├── page.tsx ................. Home (Habits Dashboard)
│   ├── tasks/page.tsx ........... Tasks view
│   ├── analytics/page.tsx ....... Analytics view
│   └── settings/page.tsx ........ Profile & settings
└── not-found.tsx ................ 404
```

#### Wireframe → Component Mapping

| Wireframe Screen       | Page Route       | Components                                                                                         | State Requirements                | API Calls                                    |
| ---------------------- | ---------------- | -------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------- |
| Login / Register       | `/login`, `/register` | `AuthForm`, `Button`, `Input`, `SocialButton`                                                | Form state (RHF)                  | POST auth/login, POST auth/register          |
| Home (Habits Dashboard)| `/`              | `DatePicker`, `MascotCard`, `ProgressBar`, `CategorySection`, `HabitCard`, `FAB`                   | Selected date, habits query       | GET habits, GET completion-rate              |
| Create/Edit Habit Modal| Modal on `/`     | `Modal`, `StepWizard`, `Input`, `Dropdown`, `ColorPicker`, `DaySelector`, `TimePicker`             | Wizard step, form state           | POST/PATCH habits, GET categories            |
| Smart Check-in         | Modal on `/`     | `Modal`, `MoodGrid`, `ConfettiAnimation`, `ReflectionForm`, `ActivityGrid`                         | Selected mood, reflection text    | POST mood-checkins                           |
| Tasks View             | `/tasks`         | `FilterTabs`, `TaskCard`, `SubTaskList`, `PriorityBadge`, `OverdueBadge`, `FAB`                    | Active filter, tasks query        | GET tasks, POST tasks/complete               |
| Create/Edit Task Modal | Modal on `/tasks`| `Modal`, `Input`, `RichTextEditor`, `PrioritySelector`, `DatePicker`, `RecurrenceSelector`, `Toggle` | Form state                    | POST/PATCH tasks                             |
| Analytics View         | `/analytics`     | `CircularProgress`, `StatsCards`, `LineChart`, `ViewToggle`, `HeatmapCalendar`, `DayDetailSheet`   | Chart view, selected month        | GET analytics/*                              |
| Settings               | `/settings`      | `Input`, `AvatarUpload`, `ThemeToggle`, `Button`                                                   | Form state                        | GET/PATCH users/me                           |

#### Key Client-Side Libraries

| Library             | Version | Purpose                            |
| ------------------- | ------- | ---------------------------------- |
| `@tanstack/react-query` | 5.x | Server state management            |
| `react-hook-form`   | 7.x    | Form handling with validation      |
| `zod`               | 3.x    | Schema validation (shared with API)|
| `recharts`          | 2.x    | Line chart in analytics            |
| `framer-motion`     | 11.x   | Animations (modal, confetti, bounce)|
| `next-pwa`          | 5.x    | Service worker generation          |

---

## 6. Security Design

### 6.1 Security Controls

| Control Area         | Implementation                                       | Standard         |
| -------------------- | ---------------------------------------------------- | ---------------- |
| Authentication       | NextAuth.js JWT in HTTP-only, Secure, SameSite cookies| OWASP AuthN      |
| Password Storage     | bcrypt (12 rounds)                                   | OWASP Password   |
| Password Policy      | Min 8 chars, 1 upper, 1 lower, 1 digit (BR-002)     | NIST 800-63      |
| Account Lockout      | 5 failed attempts → 15 min lock (BR-006)             | OWASP AuthN      |
| CSRF Protection      | NextAuth CSRF token + SameSite cookies               | OWASP CSRF       |
| Input Validation     | Zod schemas on all API inputs, server-side           | OWASP Injection  |
| XSS Prevention       | React auto-escaping + CSP headers                    | OWASP XSS        |
| SQL Injection         | Prisma parameterized queries (no raw SQL)           | OWASP Injection  |
| Rate Limiting        | 100 req/min per user, 10 req/min on auth endpoints   | OWASP DoS        |
| HTTPS                | TLS 1.3 enforced by Vercel                           | Transport        |
| Row-Level Security   | `userId` filter on every query                       | Data isolation   |

### 6.2 Data Protection

| Concern              | Approach                                              |
| -------------------- | ----------------------------------------------------- |
| Encryption at Rest   | Vercel Postgres uses AES-256 at rest                  |
| Encryption in Transit| TLS 1.3 for all HTTP; Prisma uses TLS to database     |
| PII Fields           | email, name, avatarUrl, reflectionText               |
| Data Masking         | Passwords never returned in API responses             |
| Soft Delete          | Records retained with `deletedAt`, excluded from queries |
| Data Retention       | Soft-deleted data purged after 90 days (cron job)    |

### 6.3 HTTP Security Headers

```typescript
// next.config.js → headers
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '0' }, // Rely on CSP instead
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://accounts.google.com",
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

---

## 7. Performance & Scalability

### 7.1 Performance Requirements

| Metric               | Target       | Measurement                      |
| -------------------- | ------------ | -------------------------------- |
| First Contentful Paint| < 1.5s      | Lighthouse / Web Vitals          |
| Largest Contentful Paint | < 2.5s   | Lighthouse / Web Vitals          |
| Time to Interactive  | < 3.5s       | Lighthouse                       |
| API Response (P95)   | < 200ms      | Vercel Analytics                 |
| API Response (P99)   | < 500ms      | Vercel Analytics                 |
| Lighthouse Score     | ≥ 90 (all)   | Chrome DevTools                  |
| Bundle Size (main)   | < 150KB gz   | `next build` output              |

### 7.2 Scalability Design

| Layer      | Approach                                              |
| ---------- | ----------------------------------------------------- |
| Frontend   | Static pages (SSG) where possible; ISR for analytics  |
| API        | Vercel serverless — auto-scales per route             |
| Database   | Connection pooling via PgBouncer (Vercel Postgres)    |
| Caching    | React Query client-side; potential Redis for analytics |

### 7.3 Optimization Techniques

- **Server Components:** Default for non-interactive pages (zero client JS)
- **Code Splitting:** Per-route automatic via Next.js App Router
- **Image Optimization:** `next/image` for avatars and mascot assets
- **Font Loading:** `next/font` with `display: swap` for Inter
- **Prefetching:** `<Link prefetch>` for navigation routes
- **Optimistic Updates:** React Query `onMutate` for habit completion (instant UI)

---

## 8. Error Handling & Logging

### 8.1 Error Handling Strategy

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Array<{ field: string; issue: string }>
  ) {
    super(message);
  }
}

// Error codes → HTTP status mapping
const ERROR_MAP: Record<string, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

// API route wrapper
export function withErrorHandling(handler: Function) {
  return async (req: Request, ctx: any) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof AppError) {
        return Response.json(
          { success: false, error: { code: error.code, message: error.message, details: error.details } },
          { status: error.statusCode }
        );
      }
      console.error('Unhandled error:', error);
      return Response.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
        { status: 500 }
      );
    }
  };
}
```

### 8.2 Logging & Monitoring

| Concern        | Tool                    | Configuration                     |
| -------------- | ----------------------- | --------------------------------- |
| Server Logs    | Vercel Logs + `pino`    | JSON structured, log level by env |
| Client Errors  | `window.onerror` + API  | Report to `/api/log/client-error` |
| Performance    | Vercel Analytics        | Web Vitals auto-collected         |
| Uptime         | Vercel Health Checks    | `/api/health` endpoint            |
| Error Tracking | Sentry (optional)       | Source maps uploaded on deploy    |

---

## 9. Development Guidelines

### 9.1 Coding Standards

| Area           | Standard                                             |
| -------------- | ---------------------------------------------------- |
| Language       | TypeScript strict mode (`strict: true`)              |
| Formatting     | Prettier (default config)                            |
| Linting        | ESLint with `next/core-web-vitals` + custom rules    |
| Naming         | camelCase (variables), PascalCase (components/types), snake_case (DB) |
| Imports        | Absolute paths via `@/` alias                        |
| CSS            | Design system tokens only — no hardcoded values      |
| Components     | One component per file, co-located CSS               |
| API Routes     | Zod validation → auth check → business logic → response |

### 9.2 Testing Strategy

| Test Type      | Scope                     | Coverage Target | Tools                      |
| -------------- | ------------------------- | --------------- | -------------------------- |
| Unit           | Utils, validators, services| 80%            | Vitest                     |
| Component      | React components           | 70%            | Vitest + Testing Library   |
| Integration    | API routes + database      | 70%            | Vitest + Prisma test utils |
| E2E            | Critical user flows        | 3-5 flows      | Playwright                 |

**Critical E2E Flows:**
1. Register → Login → Create Habit → Complete → Mood Check-in
2. Create Task with Sub-tasks → Complete Sub-tasks → Auto-complete parent
3. Analytics: verify completion rate changes after habit completion

### 9.3 CI/CD Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Push   │───▸│  Lint +  │───▸│  Test    │───▸│  Build   │
│  to Git  │    │  Format  │    │  (Vitest)│    │  (Next)  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                                    ┌────────────────▸│
                                    │                 ▼
                               ┌──────────┐    ┌──────────┐
                               │ Preview  │    │Production│
                               │ Deploy   │    │ Deploy   │
                               │ (branch) │    │ (main)   │
                               └──────────┘    └──────────┘
```

**Quality Gates:**
- ESLint: 0 errors
- TypeScript: 0 type errors
- Unit tests: 100% pass
- Build: successful `next build`
- Bundle analysis: no regression > 5%

---

## 10. Technical Risks & Mitigations

| Risk                                    | Impact | Probability | Mitigation                                                |
| --------------------------------------- | ------ | ----------- | --------------------------------------------------------- |
| Cold start latency (serverless)         | Med    | Med         | Keep functions warm; use Edge Runtime for auth checks     |
| PostgreSQL connection limits             | High   | Med         | PgBouncer pooling; connection limit per function          |
| Offline data sync conflicts             | Med    | Low         | Last-write-wins; server timestamp as source of truth      |
| Large analytics queries slow down        | Med    | Med         | Pre-compute daily aggregates via cron; index optimization |
| Service worker cache staleness           | Low    | Med         | Versioned cache keys; network-first for API calls         |
| Bundle size growth                       | Med    | Med         | Bundle analyzer in CI; lazy-load charts & animations      |
| Prisma Client size in serverless         | Med    | Low         | Use Prisma Accelerate or edge-compatible adapter          |

---

## 11. Dependencies & Assumptions

### 11.1 Technical Dependencies

| Dependency          | Type       | Version | Purpose                           |
| ------------------- | ---------- | ------- | --------------------------------- |
| Next.js             | Framework  | 14.x    | Full-stack React framework        |
| React               | Library    | 18.x    | UI library                        |
| Prisma              | ORM        | 5.x     | Database access + migrations      |
| NextAuth.js         | Library    | 5.x     | Authentication                    |
| PostgreSQL          | Database   | 15+     | Primary data store                |
| Zod                 | Library    | 3.x     | Runtime validation                |
| TanStack Query      | Library    | 5.x     | Server state management           |
| React Hook Form     | Library    | 7.x     | Form management                   |
| Recharts            | Library    | 2.x     | Chart visualization               |
| Framer Motion       | Library    | 11.x    | UI animations                     |
| bcryptjs            | Library    | 2.x     | Password hashing                  |
| Vercel              | Platform   | —       | Hosting & deployment              |

### 11.2 Assumptions

1. PostgreSQL is provided by Vercel Postgres (or any PG-compatible service)
2. Google OAuth credentials are configured in the Google Cloud Console
3. The application serves a single tenant (no multi-org support in v1)
4. All users have equal permissions (no admin role in v1)
5. Timezone handling uses the user's browser timezone (no stored tz preference)
6. Rich text for task descriptions uses HTML (sanitized server-side)
7. Mascot artwork is provided as static SVG/PNG assets
8. Email notifications (reminders) are out of scope for v1

---

## 12. Appendices

### Appendix A: Technology Stack

| Layer          | Technology          | Version | Justification                                    |
| -------------- | ------------------- | ------- | ------------------------------------------------ |
| Runtime        | Node.js             | 20 LTS  | Long-term support, Next.js requirement           |
| Framework      | Next.js             | 14.x    | SSR, RSC, API routes, file-based routing         |
| Language       | TypeScript          | 5.x     | Type safety, DX, shared types                    |
| UI Library     | React               | 18.x    | Component model, ecosystem                       |
| Styling        | CSS Custom Props     | —       | Design tokens, no build step, theme-aware        |
| Font           | Inter (Google)       | —       | Modern, variable-weight, excellent readability   |
| Database       | PostgreSQL           | 15+     | Relational, arrays, JSON, mature                 |
| ORM            | Prisma               | 5.x     | Type-safe, migration management                  |
| Auth           | NextAuth.js          | 5.x     | Multi-provider, JWT/session, Prisma adapter      |
| Validation     | Zod                  | 3.x     | Runtime + compile-time safety                    |
| State          | TanStack Query       | 5.x     | Caching, refetch, optimistic updates             |
| Forms          | React Hook Form      | 7.x     | Performance, validation integration              |
| Charts         | Recharts             | 2.x     | Declarative, customizable, React-native          |
| Animation      | Framer Motion        | 11.x    | Declarative, layout animations, gestures         |
| PWA            | next-pwa             | 5.x     | Service worker, offline cache                    |
| Testing        | Vitest               | 1.x     | Fast, ESM-native, Jest-compatible                |
| E2E Testing    | Playwright           | 1.x     | Cross-browser, reliable                          |
| Hosting        | Vercel               | —       | Zero-config Next.js, serverless, edge            |

### Appendix B: Glossary

| Term              | Definition                                                      |
| ----------------- | --------------------------------------------------------------- |
| Soft Delete       | Setting `deletedAt` instead of removing row                     |
| Upsert            | Insert or update if exists (used for completions & moods)       |
| Auto-Postpone     | Automatically moving overdue task due dates to today            |
| Streak            | Consecutive days with at least one habit completion             |
| Perfect Day       | Day where all scheduled habits were completed                   |
| Active Day        | Day where at least one habit was completed                      |
| Smart Check-in    | Post-completion mood survey with branching positive/negative flow|
| RSC               | React Server Components (zero client JS by default)             |
| FAB               | Floating Action Button (circular "+" button)                    |

### Appendix C: Reference Documents

| Document         | Path                     | Version |
| ---------------- | ------------------------ | ------- |
| FSD              | `fsd.md`                 | 1.0     |
| ERD              | `erd.md`                 | 1.0     |
| API Contract     | `api-contract.md`        | 1.0.0   |
| Wireframes       | `wireframes.md`          | 1.0     |
| Design System    | `design-system.md`       | 1.0     |

---

## Verification Checklist

- [x] All FSD functional requirements (FR-001→040) have technical specifications
- [x] All 10 ERD entities reflected in Prisma schema with correct types & relationships
- [x] All 28 API endpoints mapped to route handler files
- [x] All wireframe screens mapped to frontend page routes & components
- [x] Security: auth, CSRF, XSS, SQLi, rate limiting, HTTPS addressed
- [x] Performance targets defined with measurement methods
- [x] Testing strategy covers unit, component, integration, and E2E
- [x] Technical risks identified with mitigation strategies
- [x] Design system tokens integrated into CSS implementation

---

*Document generated on 2026-02-10. Derived from FSD v1.0, ERD v1.0, API Contract v1.0.0, Wireframes v1.0, and Design System v1.0.*
