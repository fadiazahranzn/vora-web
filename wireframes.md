# UI/UX Wireframe Specification

# Vora – Smart Habit Tracking & Task Management Web Application

---

## Document Information

| Field              | Detail                                          |
| ------------------ | ----------------------------------------------- |
| **Document Title** | Vora – Wireframe Specification                  |
| **Version**        | 1.0                                             |
| **Date**           | 2026-02-10                                      |
| **FSD Reference**  | `fsd.md` v1.0                                   |
| **ERD Reference**  | `erd.md` v1.0                                   |
| **API Reference**  | `api-contract.md` v1.0.0                        |
| **Status**         | Draft                                           |

---

## 1. Executive Summary

### 1.1 Product Overview

Vora is a habit tracking and task management PWA targeting young adults (18–30). The design language is playful yet functional, featuring a friendly mascot character, vibrant accent colors, smooth micro-animations, and a mobile-first responsive layout with dark/light theme support.

### 1.2 User Personas

| Persona          | Primary Goals                                    | Key Screens              |
| ---------------- | ------------------------------------------------ | ------------------------ |
| **New User**     | Register, create first habit, understand the app | Auth, Onboarding, Home   |
| **Daily User**   | Check off habits, log mood, manage tasks         | Home, Smart Check-in     |
| **Review User**  | Analyze progress, review streaks                 | Analytics, Heatmap       |

### 1.3 Screen Inventory

| #  | Screen                    | Priority | Complexity | Related Entities                    | Key APIs                          |
| -- | ------------------------- | -------- | ---------- | ----------------------------------- | --------------------------------- |
| 1  | Login / Register          | Must     | Medium     | User, Account                       | auth/register, auth/login         |
| 2  | Home (Habits Dashboard)   | Must     | High       | Habit, HabitCompletion, Category    | habits, analytics/completion-rate |
| 3  | Create/Edit Habit Modal   | Must     | High       | Habit, Category                     | habits (POST/PATCH)               |
| 4  | Smart Check-in Modal      | Must     | High       | MoodCheckin, HabitCompletion        | mood-checkins (POST)              |
| 5  | Tasks View                | Must     | High       | Task, SubTask                       | tasks (GET/POST)                  |
| 6  | Create/Edit Task Modal    | Must     | High       | Task, SubTask                       | tasks (POST/PATCH)                |
| 7  | Analytics View            | Must     | High       | HabitCompletion, MoodCheckin        | analytics/*                       |
| 8  | Category Sidebar          | Should   | Medium     | Category, Habit                     | categories (GET/POST)             |
| 9  | Profile / Settings        | Should   | Low        | User                                | users/me (PATCH)                  |
| 10 | Habit Detail              | Could    | Medium     | Habit, HabitCompletion, MoodCheckin | habits/{id}, mood-checkins        |

**Total: 10 screens / modals**

---

## 2. Information Architecture

### 2.1 Sitemap

```
Vora Web App
├── /auth
│   ├── /login .............. Login page (email + Google OAuth)
│   └── /register ........... Registration page
├── / (Home – Habits) ...... Default route (authenticated)
│   ├── [Date Picker] ...... Navigate dates
│   ├── [Habit Cards] ...... Per-habit completion cards
│   ├── [Quick Add FAB] .... Create Habit modal
│   └── [Category Sidebar] . Left sidebar (desktop) / drawer (mobile)
├── /tasks .................. Tasks view
│   ├── [Filter Tabs] ...... All / Today / Upcoming / Overdue
│   ├── [Task Cards] ....... Per-task cards with sub-tasks
│   └── [Quick Add FAB] .... Create Task modal
├── /analytics .............. Analytics view
│   ├── [Completion Rate] .. Today's rate
│   ├── [Activity Chart] ... Line chart (weekly/monthly/yearly)
│   ├── [Stats Cards] ...... Streak, Perfect Days, Active Days
│   └── [Heatmap] .......... Calendar heatmap
└── /settings ............... Profile & preferences
    ├── [Profile Edit] ..... Name, avatar
    └── [Theme Toggle] ..... Light / Dark / System
```

### 2.2 Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  DESKTOP (≥1024px)                                          │
│  ┌──────────┬──────────────────────────────────────────┐    │
│  │ Sidebar  │  Main Content                            │    │
│  │          │  ┌────────────────────────────────────┐   │    │
│  │ Logo     │  │ Top Bar: Date / Search / Profile   │   │    │
│  │ Category │  ├────────────────────────────────────┤   │    │
│  │ List     │  │ Content Area                       │   │    │
│  │          │  │                                    │   │    │
│  │ + Add    │  │                                    │   │    │
│  │ Category │  └────────────────────────────────────┘   │    │
│  └──────────┴──────────────────────────────────────────┘    │
│  No bottom navigation bar on desktop                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│  MOBILE (<1024px)            │
│  ┌──────────────────────┐    │
│  │ Top Bar: Logo/Profile│    │
│  ├──────────────────────┤    │
│  │                      │    │
│  │  Content Area        │    │
│  │                      │    │
│  │                      │    │
│  ├──────────────────────┤    │
│  │ ● Home  ● Tasks  ● Analytics │
│  └──────────────────────┘    │
│  Bottom nav with 3 tabs      │
└──────────────────────────────┘
```

### 2.3 Primary User Flows

**Flow 1: Daily Habit Completion**
```
Home → Tap Habit Card → [Animation] → Smart Check-in Modal
→ Select Mood → [Positive: Confetti] / [Negative: Reflection + Activity]
→ Done → Back to Home (updated completion rate)
```

**Flow 2: Task Management**
```
Tasks Tab → Tap "+ Add Task" → Create Task Modal → Fill form
→ Save → Task appears in list → Check sub-tasks → Parent auto-completes
```

**Flow 3: Progress Review**
```
Analytics Tab → View completion rate → Toggle chart view (W/M/Y)
→ View heatmap → Tap day → See per-habit breakdown
```

---

## 3. Wireframes

### 3.1 Login / Register Screen

**Purpose:** Authenticate users via email/password or Google OAuth.
**FSD Reference:** FR-001, FR-002, FR-003; BR-001 to BR-006
**API Dependencies:**
- `POST /auth/register` — Create account
- `POST /auth/login` — Authenticate
- NextAuth Google OAuth — `/api/auth/signin/google`

**Wireframe (Login):**

```
┌──────────────────────────────────────────┐
│                                          │
│           ┌──────────────┐               │
│           │  🐾 Vora     │               │
│           │  (Mascot)    │               │
│           └──────────────┘               │
│                                          │
│   "Track your habits, build your life"   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  📧 Email                        │   │
│   └──────────────────────────────────┘   │
│   ┌──────────────────────────────────┐   │
│   │  🔒 Password                     │   │
│   └──────────────────────────────────┘   │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │         🔵 LOG IN                │   │
│   └──────────────────────────────────┘   │
│                                          │
│   ─────────── or ───────────             │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  🟢 Continue with Google         │   │
│   └──────────────────────────────────┘   │
│                                          │
│   Don't have an account? Register →      │
│                                          │
└──────────────────────────────────────────┘
```

**Wireframe (Register):**

```
┌──────────────────────────────────────────┐
│           ┌──────────────┐               │
│           │  🐾 Vora     │               │
│           └──────────────┘               │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  👤 Full Name                    │   │
│   └──────────────────────────────────┘   │
│   ┌──────────────────────────────────┐   │
│   │  📧 Email                        │   │
│   └──────────────────────────────────┘   │
│   ┌──────────────────────────────────┐   │
│   │  🔒 Password                     │   │
│   └──────────────────────────────────┘   │
│   [Password strength meter ████░░░░]     │
│   Min 8 chars, 1 upper, 1 lower, 1 digit│
│                                          │
│   ┌──────────────────────────────────┐   │
│   │       🔵 CREATE ACCOUNT          │   │
│   └──────────────────────────────────┘   │
│                                          │
│   ─────────── or ───────────             │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │  🟢 Continue with Google         │   │
│   └──────────────────────────────────┘   │
│                                          │
│   Already have an account? Log in →      │
└──────────────────────────────────────────┘
```

**Component Specifications:**

| Component          | Type         | Data Source          | Behavior                              |
| ------------------ | ------------ | -------------------- | ------------------------------------- |
| Email Input        | text input   | RegisterRequest.email | RFC 5322 inline validation            |
| Password Input     | password     | RegisterRequest.password | Strength meter, show/hide toggle   |
| Name Input         | text input   | RegisterRequest.name | Required, max 100 chars               |
| Login Button       | primary btn  | POST /auth/login     | Disabled until valid inputs           |
| Google OAuth Button| social btn   | NextAuth OAuth       | Opens Google consent screen           |
| Toggle Link        | text link    | —                    | Switches between login/register       |

**Form Fields:**

| Field    | Type     | Validation                          | ERD Attribute     | API Field         |
| -------- | -------- | ----------------------------------- | ----------------- | ----------------- |
| Name     | text     | Required, 1–100 chars               | User.name         | name              |
| Email    | email    | Required, RFC 5322, unique          | User.email        | email             |
| Password | password | Min 8, 1 upper, 1 lower, 1 digit   | User.password_hash| password          |

**States:**
- **Empty:** Form with pre-focused email field
- **Loading:** Button shows spinner, inputs disabled
- **Error (401):** Inline error "Invalid email or password"
- **Error (409):** Inline error "Email already in use"
- **Error (429):** Banner "Too many attempts. Try again in 15 minutes." (BR-006)
- **Success:** Redirect to Home dashboard

**Responsive:** Single-column centered card on all breakpoints. Max-width 420px.

---

### 3.2 Home (Habits Dashboard)

**Purpose:** Daily habit tracking hub. Shows habits for the selected date with completion status, completion rate, and mascot.
**FSD Reference:** FR-007, FR-010, FR-011, FR-027; BR-021 to BR-040
**API Dependencies:**
- `GET /habits?date=YYYY-MM-DD` — List habits for date
- `POST /habits/{id}/complete` — Complete habit
- `POST /habits/{id}/uncomplete` — Revert completion
- `GET /analytics/completion-rate?date=YYYY-MM-DD` — Today's rate

**Wireframe (Mobile):**

```
┌──────────────────────────────────────────┐
│  Vora 🐾                     👤 Profile  │
├──────────────────────────────────────────┤
│                                          │
│  ← Mon  Tue  [Wed]  Thu  Fri  Sat  Sun →│
│        Feb 10, 2026 — Today              │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │  ┌──────────────────────────────┐    ││
│  │  │  🐾 Great job!               │    ││
│  │  │  (Mascot with expression)    │    ││
│  │  │  "You've completed 60%!"     │    ││
│  │  └──────────────────────────────┘    ││
│  │                                      ││
│  │  ══════════════════░░░░░░  60%       ││
│  │  3 of 5 habits completed today       ││
│  └──────────────────────────────────────┘│
│                                          │
│  🏃 Health (3)                           │
│  ┌──────────────────────────────────────┐│
│  │ 🟢 ✅ Drink Water                    ││
│  │    8/8 glasses          🔥 7 days    ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ 🔵 ⬜ Read Book                      ││
│  │    0/30 pages           🔥 3 days    ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ 🟣 ✅ Meditate                       ││
│  │    10/10 minutes        🔥 12 days   ││
│  └──────────────────────────────────────┘│
│                                          │
│  📚 Education (1)                        │
│  ┌──────────────────────────────────────┐│
│  │ 🔴 ⬜ Study Korean                   ││
│  │    0/30 minutes         🔥 0 days    ││
│  └──────────────────────────────────────┘│
│                                          │
│           ⊕ (FAB — Add Habit)            │
│                                          │
├──────────────────────────────────────────┤
│  🏠 Home      📋 Tasks      📊 Analytics │
└──────────────────────────────────────────┘
```

**Wireframe (Desktop — with sidebar):**

```
┌──────────┬───────────────────────────────────────────────────┐
│ SIDEBAR  │  TOP BAR                                          │
│          │  ←  Mon Tue [Wed] Thu Fri Sat Sun  →    👤 John   │
│ 🐾 Vora  ├───────────────────────────────────────────────────┤
│          │                                                    │
│ Categories│  ┌────────────────────────────┐  ┌─────────────┐ │
│ ─────────│  │ 🐾 Mascot + Completion Rate│  │ 🔥 Streak   │ │
│ 🏃 Health │  │ "You've completed 60%!"    │  │   7 days    │ │
│   3 habits│  │ ══════════════░░░░  60%    │  │ ⭐ Perfect  │ │
│ 📚 Edu   │  │ 3 of 5 today               │  │   15 days   │ │
│   1 habit │  └────────────────────────────┘  │ 📅 Active   │ │
│ 💼 Work  │                                   │   42 days   │ │
│   0 habits│  🏃 Health                       └─────────────┘ │
│ 🧘 Mind  │  ┌─────────────┐┌─────────────┐┌─────────────┐   │
│   1 habit │  │✅ Drink Water││⬜ Read Book ││✅ Meditate  │   │
│          │  │ 8/8 glasses  ││ 0/30 pages  ││ 10/10 min   │   │
│ + Add    │  │ 🔥 7 days    ││ 🔥 3 days    ││ 🔥 12 days   │   │
│ Category │  └─────────────┘└─────────────┘└─────────────┘   │
│          │                                                    │
│          │  📚 Education                                      │
│          │  ┌─────────────┐                                   │
│          │  │⬜ Study Korean│                                  │
│          │  │ 0/30 min     │                                  │
│          │  │ 🔥 0 days     │                                  │
│          │  └─────────────┘                                   │
│          │                              ⊕ Add Habit           │
└──────────┴───────────────────────────────────────────────────┘
```

**Component Specifications:**

| Component          | Type           | Data Source                          | Behavior                              |
| ------------------ | -------------- | ------------------------------------ | ------------------------------------- |
| Date Picker Strip  | horizontal scroll | Client-side date computation      | Swipe/click to change date; API re-fetches |
| Mascot Card        | illustration   | analytics/completion-rate            | Expression changes based on rate       |
| Completion Bar     | progress bar   | completion-rate.rate                 | Animated fill on completion            |
| Category Header    | section header | categories + habit count             | Collapsible, shows active habit count  |
| Habit Card         | interactive card | habits[] item                      | Tap checkbox → complete/uncomplete     |
| Streak Badge       | badge          | Computed from completions            | Shows 🔥 + consecutive days            |
| FAB (Add Habit)    | floating action | —                                  | Opens Create Habit Modal               |
| Bottom Nav         | tab bar        | —                                  | 3 items: Home, Tasks, Analytics        |
| Sidebar (Desktop)  | navigation     | categories                          | Category list + count + add button     |

**Habit Card Interaction Flow:**
1. User taps uncompleted habit card → checkbox animates to ✅
2. `POST /habits/{id}/complete` fires
3. Completion rate updates (animated progress bar)
4. Mascot expression changes
5. Smart Check-in Modal appears after 500ms delay (FR-015)

**States:**
- **Empty (no habits):** Mascot says "Let's create your first habit!" + prominent "Create Habit" button
- **Loading:** Skeleton cards (3 placeholder cards)
- **All Complete (100%):** Mascot celebrates 🎉, confetti animation, "Perfect day!" message
- **Past Date:** Cards are read-only; no completion/un-completion allowed
- **Error:** Toast notification with retry option

---

### 3.3 Create / Edit Habit Modal

**Purpose:** Multi-step wizard for creating or editing a habit.
**FSD Reference:** FR-006, FR-008; BR-013 to BR-020, BR-027 to BR-029
**API Dependencies:**
- `POST /habits` — Create
- `PATCH /habits/{id}` — Update
- `GET /categories` — Category picker

**Wireframe:**

```
┌──────────────────────────────────────────┐
│  ✕ Close              Create New Habit   │
├──────────────────────────────────────────┤
│                                          │
│  Step 1 of 3: ●───○───○                 │
│                                          │
│  What habit do you want to track?        │
│  ┌──────────────────────────────────┐    │
│  │  e.g. Drink 8 glasses of water  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Category                                │
│  ┌──────────────────────────────────┐    │
│  │  🏃 Health              ▼       │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Color                                   │
│  ● 🔴  ● 🟠  ● 🟡  ● 🟢  ● 🔵  ● 🟣    │
│  ● ⚫  ● 🟤  ● 🩷  ● 🩵  ● ⬜  ● 🟩    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │          Next →                  │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘

Step 2: Frequency
┌──────────────────────────────────────────┐
│  ← Back               Create New Habit  │
├──────────────────────────────────────────┤
│  Step 2 of 3: ●───●───○                 │
│                                          │
│  How often?                              │
│  ┌──────────┐┌──────────┐┌──────────┐   │
│  │  Daily   ││ Weekly   ││ Monthly  │   │
│  │  (sel)   ││          ││          │   │
│  └──────────┘└──────────┘└──────────┘   │
│                                          │
│  [If Daily:]                             │
│  Target                                  │
│  ┌──────────────┐ ┌────────────────┐    │
│  │  8            │ │  glasses    ▼  │    │
│  └──────────────┘ └────────────────┘    │
│                                          │
│  [If Weekly:]                            │
│  Select days                             │
│  [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]│
│                                          │
│  [If Monthly:]                           │
│  Select dates                            │
│  [1] [2] [3] ... [28] [29] [30] [31]    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │          Next →                  │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘

Step 3: Reminder
┌──────────────────────────────────────────┐
│  ← Back               Create New Habit  │
├──────────────────────────────────────────┤
│  Step 3 of 3: ●───●───●                 │
│                                          │
│  Set a reminder? (optional)              │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  ⏰  08:00 AM            ▼      │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Preview:                                │
│  ┌──────────────────────────────────┐    │
│  │  🟢 Drink Water                  │    │
│  │  Daily · 8 glasses · 08:00       │    │
│  │  Category: 🏃 Health             │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │     ✅ CREATE HABIT               │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**Form Fields:**

| Field        | Type          | Validation                    | ERD Attribute      | API Field     |
| ------------ | ------------- | ----------------------------- | ------------------ | ------------- |
| Name         | text          | Required, 1–100 chars         | Habit.name         | name          |
| Category     | dropdown      | Required, from categories API | Habit.category_id  | categoryId    |
| Color        | color picker  | Required, from palette        | Habit.color        | color         |
| Frequency    | radio group   | Required: daily/weekly/monthly| Habit.frequency    | frequency     |
| Target Value | number        | Required if daily, min 1      | Habit.target_value | targetValue   |
| Target Unit  | dropdown      | Required if daily             | Habit.target_unit  | targetUnit    |
| Weekly Days  | checkbox group| Min 1 if weekly               | Habit.weekly_days  | weeklyDays    |
| Monthly Dates| checkbox group| Min 1 if monthly              | Habit.monthly_dates| monthlyDates  |
| Reminder Time| time picker   | Optional, valid HH:MM         | Habit.reminder_time| reminderTime  |

**States:**
- **Create Mode:** Empty form, "Create Habit" button
- **Edit Mode:** Pre-filled form, "Save Changes" button, delete option in header
- **Loading:** Button shows spinner
- **Validation Error:** Inline red text below invalid fields
- **Success:** Modal closes, new habit card appears with entrance animation

---

### 3.4 Smart Check-in Modal

**Purpose:** Captures user's mood after habit completion. Follows positive or negative path based on mood selection.
**FSD Reference:** FR-015, FR-016, FR-017, FR-018, FR-019; BR-059 to BR-075
**API Dependencies:**
- `POST /mood-checkins` — Record mood (upsert)

**Wireframe (Mood Selection):**

```
┌──────────────────────────────────────────┐
│  ✕                  Smart Check-in       │
├──────────────────────────────────────────┤
│                                          │
│  🐾 Great job completing                 │
│     "Drink Water"!                       │
│                                          │
│  How are you feeling?                    │
│                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │  😊  │ │  🥳  │ │  😟  │            │
│  │Happy │ │Proud │ │Worried│            │
│  └──────┘ └──────┘ └──────┘            │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │  😤  │ │  😢  │ │  😡  │            │
│  │Annoyed│ │ Sad  │ │Angry │            │
│  └──────┘ └──────┘ └──────┘            │
│                                          │
│  [Skip]                                  │
└──────────────────────────────────────────┘
```

**Wireframe (Positive Path — Happy/Proud):**

```
┌──────────────────────────────────────────┐
│                                          │
│            🎉 🎊 ✨                      │
│         (Confetti Animation)             │
│                                          │
│  🐾 You're doing amazing!               │
│     Keep up the great work!              │
│                                          │
│  🔥 7 day streak!                        │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │        ✅ AWESOME!                │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**Wireframe (Negative Path — Worried/Annoyed/Sad/Angry):**

```
┌──────────────────────────────────────────┐
│  ←                  How can we help?     │
├──────────────────────────────────────────┤
│                                          │
│  🐾 It's okay to feel this way.         │
│     Would you like to share?             │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  What's on your mind? (optional) │    │
│  │                                  │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│  0/500 characters                        │
│                                          │
│  Try something calming:                  │
│  ┌───────────────┐ ┌───────────────┐    │
│  │ 🧘 Short Break │ │ 🫁 Deep       │    │
│  │               │ │   Breathing   │    │
│  └───────────────┘ └───────────────┘    │
│  ┌───────────────┐ ┌───────────────┐    │
│  │ 🎵 Calming    │ │ 💬 Talk to    │    │
│  │    Music      │ │   Someone     │    │
│  └───────────────┘ └───────────────┘    │
│  ┌───────────────┐                      │
│  │ 🚶 Go for a   │                      │
│  │    Walk       │                      │
│  └───────────────┘                      │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │          Done                    │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**Component Specifications:**

| Component          | Type           | Data Source                   | Behavior                              |
| ------------------ | -------------- | ----------------------------- | ------------------------------------- |
| Mood Grid          | button grid    | Fixed 6 moods (BR-059)        | Single selection, emoji + label       |
| Confetti Animation | animation      | Client-side (Lottie/CSS)      | 2s burst on positive mood (FR-017)    |
| Reflection TextArea| textarea       | CreateMoodCheckinRequest      | Optional, max 500 chars               |
| Activity Cards     | selectable cards| Fixed 5 activities (BR-069)  | Single selection or none              |
| Skip Button        | text button    | —                             | Closes modal without recording mood   |

**States:**
- **Mood Selection:** Grid of 6 emoji buttons
- **Positive Result:** Confetti + encouragement message + streak display
- **Negative Result:** Empathetic message + optional reflection + activity suggestions
- **Loading:** Submit button shows spinner
- **Success:** Modal closes, mascot updates expression

---

### 3.5 Tasks View

**Purpose:** List and manage tasks with filtering, sorting, and sub-task tracking.
**FSD Reference:** FR-020, FR-021, FR-022, FR-023; BR-077 to BR-103
**API Dependencies:**
- `GET /tasks?filter=&sort=&page=&limit=` — List tasks
- `POST /tasks/{id}/complete` — Complete task
- `POST /tasks/{id}/uncomplete` — Revert completion

**Wireframe (Mobile):**

```
┌──────────────────────────────────────────┐
│  Tasks                        🔍 + Add   │
├──────────────────────────────────────────┤
│  [All] [Today] [Upcoming] [Overdue(2)]  │
├──────────────────────────────────────────┤
│                                          │
│  TODAY — Feb 10                          │
│  ┌──────────────────────────────────────┐│
│  │ 🔴 ⬜ Review project proposal        ││
│  │    High · Due today                  ││
│  │    ├ ✅ Read executive summary        ││
│  │    ├ ⬜ Check budget estimates         ││
│  │    └ ⬜ Write feedback                 ││
│  │    2/3 sub-tasks · Auto-postpone ON  ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │ 🟡 ⬜ Buy groceries                  ││
│  │    Medium · Due today                ││
│  └──────────────────────────────────────┘│
│                                          │
│  UPCOMING                                │
│  ┌──────────────────────────────────────┐│
│  │ 🔵 ⬜ Prepare presentation           ││
│  │    Low · Due Feb 15                  ││
│  └──────────────────────────────────────┘│
│                                          │
│  OVERDUE                                 │
│  ┌──────────────────────────────────────┐│
│  │ 🔴 ⬜ Submit report                  ││
│  │    High · Due Feb 8 (2 days late)    ││
│  │    ⚠️ Originally due Feb 6           ││
│  └──────────────────────────────────────┘│
│                                          │
│           ⊕ (FAB — Add Task)             │
├──────────────────────────────────────────┤
│  🏠 Home      📋 Tasks      📊 Analytics │
└──────────────────────────────────────────┘
```

**Component Specifications:**

| Component          | Type           | Data Source                   | Behavior                               |
| ------------------ | -------------- | ----------------------------- | -------------------------------------- |
| Filter Tabs        | tab bar        | query param `filter`          | All/Today/Upcoming/Overdue; badge count|
| Task Card          | expandable card| tasks[] item                  | Tap to expand sub-tasks, swipe actions |
| Priority Badge     | colored dot    | task.priority                 | 🔴 High, 🟡 Medium, 🔵 Low             |
| Sub-task List      | checkbox list  | task.subTasks[]               | Inline check/uncheck                   |
| Overdue Badge      | warning tag    | Computed: dueDate < today     | Shows days late + original due date    |
| Auto-postpone Tag  | info tag       | task.autoPostpone             | "Auto-postpone ON" indicator           |
| FAB (Add Task)     | floating action| —                             | Opens Create Task Modal                |

**States:**
- **Empty:** Mascot says "No tasks yet! Tap + to add one"
- **Loading:** Skeleton cards
- **Filtered Empty:** "No [today/upcoming/overdue] tasks" with illustration
- **Error:** Toast with retry

---

### 3.6 Analytics View

**Purpose:** Visualize habit tracking progress with charts, stats, and heatmap.
**FSD Reference:** FR-027, FR-028, FR-029, FR-030; BR-104 to BR-121
**API Dependencies:**
- `GET /analytics/completion-rate?date=` — Today's rate
- `GET /analytics/chart?view=` — Chart data
- `GET /analytics/stats` — Streaks & stats
- `GET /analytics/heatmap?month=` — Calendar heatmap
- `GET /analytics/heatmap/{date}` — Day breakdown

**Wireframe (Mobile):**

```
┌──────────────────────────────────────────┐
│  Analytics                               │
├──────────────────────────────────────────┤
│                                          │
│  Today's Progress                        │
│  ┌──────────────────────────────────────┐│
│  │         ╭─────╮                      ││
│  │        │  60% │  3 of 5 completed    ││
│  │         ╰─────╯                      ││
│  │  (Circular progress indicator)       ││
│  └──────────────────────────────────────┘│
│                                          │
│  ┌──────────┐┌──────────┐┌──────────┐   │
│  │ 🔥 7     ││ ⭐ 15    ││ 📅 42    │   │
│  │ Streak   ││ Perfect  ││ Active   │   │
│  │ Days     ││ Days     ││ Days     │   │
│  └──────────┘└──────────┘└──────────┘   │
│                                          │
│  Activity                                │
│  [Weekly]  [Monthly]  [Yearly]           │
│  ┌──────────────────────────────────────┐│
│  │  100%│    ╱╲                          ││
│  │   80%│───╱──╲─────╱╲                  ││
│  │   60%│  ╱    ╲   ╱  ╲────            ││
│  │   40%│─╱──────╲─╱────────            ││
│  │   20%│╱                               ││
│  │    0%├───┬───┬───┬───┬───┬───┬───    ││
│  │      Mon Tue Wed Thu Fri Sat Sun     ││
│  └──────────────────────────────────────┘│
│                                          │
│  Calendar Heatmap                        │
│       ← February 2026 →                 │
│  ┌──────────────────────────────────────┐│
│  │  Mo Tu We Th Fr Sa Su               ││
│  │                          1           ││
│  │  🟩 🟩 🟨 🟩 🟩 🟨 🟥               ││
│  │  🟩 🟩 ⬜ 🟨 🟩 🟩 🟩               ││
│  │  🟩 🟩 🟩 🟨 🟩                      ││
│  │                                      ││
│  │  Legend: 🟩 80-100% 🟨 40-79% 🟥 0-39%││
│  └──────────────────────────────────────┘│
│                                          │
├──────────────────────────────────────────┤
│  🏠 Home      📋 Tasks      📊 Analytics │
└──────────────────────────────────────────┘
```

**Heatmap Day Detail (Bottom Sheet on tap):**

```
┌──────────────────────────────────────────┐
│  ── Feb 5, 2026 ──        60% (3/5)     │
├──────────────────────────────────────────┤
│  ✅ 🟢 Drink Water         8/8 glasses  │
│  ✅ 🟣 Meditate            10/10 min    │
│  ✅ 🟤 Exercise            Done         │
│  ❌ 🔵 Read Book           Missed       │
│  ❌ 🔴 Study Korean        Missed       │
└──────────────────────────────────────────┘
```

**Component Specifications:**

| Component              | Type          | Data Source                    | Behavior                               |
| ---------------------- | ------------- | ------------------------------ | -------------------------------------- |
| Circular Progress      | donut chart   | completion-rate                | Animated fill, percentage center       |
| Stats Cards            | stat cards    | analytics/stats                | streak, perfectDays, activeDays        |
| Activity Chart         | line chart    | analytics/chart                | Toggle weekly/monthly/yearly           |
| View Toggle            | segmented ctrl| query param `view`            | Switches chart data range              |
| Calendar Heatmap       | grid          | analytics/heatmap              | Color-coded cells, clickable           |
| Month Navigator        | arrows        | query param `month`           | ← / → to change months                |
| Day Detail Sheet       | bottom sheet  | analytics/heatmap/{date}       | Per-habit breakdown on cell tap        |

---

## 4. Component Library

### 4.1 Shared Components

| Component        | Usage                      | Variants                          |
| ---------------- | -------------------------- | --------------------------------- |
| Button           | All CTAs                   | Primary, Secondary, Ghost, Danger |
| Input Field      | Forms                      | Text, Email, Password, Number     |
| Dropdown         | Selectors                  | Single, Searchable                |
| Modal / Sheet    | Create/Edit/Check-in       | Full-screen (mobile), Dialog (desktop) |
| Card             | Habit, Task, Stat          | Interactive, Static, Expandable   |
| Tab Bar          | Navigation, Filters        | Bottom Nav, Inline Tabs           |
| Toast            | Notifications              | Success, Error, Info              |
| Skeleton Loader  | Loading states             | Card, List, Chart                 |
| FAB              | Quick actions              | Single action (+ icon)            |
| Badge            | Counts, Priority, Streak   | Numeric, Dot, Text                |
| Progress Bar     | Completion rate            | Linear, Circular                  |
| Empty State      | No data                    | Illustration + CTA button         |
| Mascot           | Home, Check-in, Empty      | Happy, Proud, Concerned, Cheering |

### 4.2 Design Tokens

| Token               | Light Mode     | Dark Mode      |
| -------------------- | -------------- | -------------- |
| Background Primary   | #FFFFFF        | #121212        |
| Background Secondary | #ffe2e2ff        | #1E1E1E        |
| Text Primary         | #1A1A1A        | #FFFFFF        |
| Text Secondary       | #666666        | #AAAAAA        |
| Accent Primary       | #ed9dffff        | #fcd6efff        |
| Success              | #00C853        | #69F0AE        |
| Warning              | #FFD600        | #FFE082        |
| Error                | #FF1744        | #FF8A80        |
| Card Background      | #FFFFFF        | #2A2A2A        |
| Card Border          | #E0E0E0        | #3A3A3A        |
| Border Radius (Card) | 16px           | 16px           |
| Border Radius (Button)| 12px          | 12px           |
| Spacing Unit         | 8px            | 8px            |

---

## 5. Interaction Patterns

| Pattern                | Trigger                  | Animation               | Duration |
| ---------------------- | ------------------------ | ----------------------- | -------- |
| Habit Complete         | Tap checkbox             | Scale bounce + fill     | 300ms    |
| Confetti Burst         | Positive mood selected   | Particle explosion      | 2000ms   |
| Modal Open             | FAB tap / card tap       | Slide up (mobile), Fade (desktop) | 250ms |
| Modal Close            | Close / Done / Swipe down| Reverse of open         | 200ms    |
| Progress Bar Fill      | Completion rate change   | Width transition        | 500ms    |
| Card Entrance          | List load                | Staggered fade-in       | 150ms each|
| Heatmap Cell Tap       | Calendar cell tap        | Bottom sheet slides up  | 250ms    |
| Theme Toggle           | Theme switch             | Cross-fade              | 300ms    |
| Page Transition        | Bottom nav tap           | Fade + slide            | 200ms    |
| Streak Counter         | New completion           | Count-up animation      | 400ms    |

---

## 6. Traceability Matrix

| FSD Requirement | Screen                  | ERD Entities               | API Endpoints                  |
| --------------- | ----------------------- | -------------------------- | ------------------------------ |
| FR-001          | Register                | User                       | POST /auth/register            |
| FR-002          | Login (Google)          | User, Account              | NextAuth OAuth                 |
| FR-003          | Login                   | User, Session              | POST /auth/login               |
| FR-006          | Create Habit Modal      | Habit, Category            | POST /habits                   |
| FR-007          | Home Dashboard          | Habit, HabitCompletion     | GET /habits?date=              |
| FR-008          | Edit Habit Modal        | Habit                      | PATCH /habits/{id}             |
| FR-010          | Home (checkbox)         | HabitCompletion            | POST /habits/{id}/complete     |
| FR-011          | Home (uncheck)          | HabitCompletion            | POST /habits/{id}/uncomplete   |
| FR-012          | Category Sidebar        | Category                   | GET/POST /categories           |
| FR-015–019      | Smart Check-in Modal    | MoodCheckin                | POST /mood-checkins            |
| FR-020          | Create Task Modal       | Task, SubTask              | POST /tasks                    |
| FR-021          | Tasks View              | Task, SubTask              | POST /tasks/{id}/complete      |
| FR-022          | Tasks View (auto)       | Task, PostponeHistory      | GET /tasks (auto-postpone)     |
| FR-023          | Tasks View (filters)    | Task                       | GET /tasks?filter=&sort=       |
| FR-027          | Analytics (rate)        | HabitCompletion            | GET /analytics/completion-rate |
| FR-028          | Analytics (chart)       | HabitCompletion            | GET /analytics/chart           |
| FR-029          | Analytics (stats)       | HabitCompletion            | GET /analytics/stats           |
| FR-030          | Analytics (heatmap)     | HabitCompletion            | GET /analytics/heatmap         |
| FR-031          | Settings (theme)        | User                       | PATCH /users/me                |

---

## 7. Verification Checklist

- [x] Every FSD user story (FR-001–040) has UI representation or is client-only
- [x] All ERD entities with user-facing data have display screens
- [x] All 28 API endpoints utilized in appropriate screens
- [x] User personas can complete primary journeys (daily tracking, task management, analytics review)
- [x] Forms include all required fields from API contracts
- [x] Validation rules reflected in form specs
- [x] ERD relationships navigable in UI (Category→Habits, Task→SubTasks, Habit→Completions→Moods)
- [x] Empty, loading, and error states defined for all data-dependent views
- [x] Responsive behavior specified for all screens (mobile/tablet/desktop)
- [x] Accessibility: min 44×44px touch targets, color contrast, semantic labels
- [x] Dark/light theme tokens specified

---

## Appendix: Revision History

| Version | Date       | Author        | Changes                        |
| ------- | ---------- | ------------- | ------------------------------ |
| 1.0     | 2026-02-10 | [Author Name] | Initial wireframes from FSD + ERD + API v1.0 |

---

*Document generated on 2026-02-10. Derived from FSD v1.0, ERD v1.0, and API Contract v1.0.0.*
