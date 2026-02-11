Berikut adalah versi **bahasa Inggris** dari dokumen yang kamu berikan, dengan struktur dan makna tetap setara serta bahasa dipoles agar profesional dan konsisten untuk **PRD / technical brief**.

---

# Enhanced Prompt: Vora Web Application – Complete Development Specification

## Project Overview

Develop **Vora**, a comprehensive habit-tracking and task management web application featuring an innovative **Smart Daily Check-in** that monitors and responds to users’ emotional states throughout their productivity journey.

---

## 1. Application Architecture & Navigation Structure

### Primary Navigation System

Implement a **bottom navigation bar** with three main menus:

#### **Menu 1: Home (Habit Dashboard)**

* Daily habit tracking interface
* Interactive calendar view
* Habit category management system with a sidebar
* Quick-access habit completion checkboxes
* Integrated to-do list

#### **Menu 2: Tasks (Task Management)**

* Interactive calendar view
* Task creation and editing interface
* Priority-based task organization
* Deadline management system
* Sub-task hierarchy support

#### **Menu 3: Analytics (Progress Visualization)**

* Statistical dashboard
* Interactive data visualizations
* Performance metrics and trends
* Historical progress tracking

---

## 2. Core Feature Specifications

### A. Habit Management System (Menu 1)

#### Habit Categories

Implement the following predefined categories with example habits:

| Category            | Example Habits                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------- |
| **Personal Growth** | Reading books, Learning new skills, Monthly goal review, Planning for tomorrow            |
| **Sports**          | Gym, Swimming, Running, Cycling, Padel                                                    |
| **Social Health**   | Time with family, Calling parents, Attending workshops or festivals, Talking with friends |
| **Financial**       | Paying bills, Shopping, Monthly budgeting, Weekly financial check                         |
| **Household**       | Cleaning the house, Watering plants, Doing laundry, Weekly priority tasks                 |

#### Habit Creation Form

Design a comprehensive input form with the following fields:

**Basic Information:**

* Habit name (text input)
* Category selection (dropdown from predefined categories)
* Color theme selection (color picker for visual customization)

**Frequency Settings:**
Implement three frequency types with dynamic form fields:

1. **Daily Frequency:**

   * Target input (e.g., “8 glasses of water”)
   * Unit specification (glasses, times, minutes, etc.)
   * Daily numeric goal value

2. **Weekly Frequency:**

   * Multi-select day checkboxes (Monday–Sunday)
   * Visual day selector with toggle states
   * Validation requiring at least one day selected

3. **Monthly Frequency:**

   * Calendar modal for date selection
   * Multi-date selection support
   * Visual calendar interface with highlighted selected dates

**Notification Settings:**

* Time picker for reminders
* “Remind me at” field with clock interface
* Optional: multiple reminder times per habit

---

### B. Smart Daily Check-in & Mood Board System

#### Trigger Mechanism

* Modal is triggered when the user clicks a habit completion checkbox
* Modal is blocking (background interaction disabled until completion)

#### Mood Board Interface

**Mood Selection Screen:**
Display emotion options with visual icons:

* 😊 Happy
* 💪 Proud
* 😟 Worried
* 😠 Annoyed
* 😢 Sad
* 😡 Angry

**Conditional Logic Flow:**

**For Positive Emotions (Happy, Proud):**

1. Display a congratulatory message
2. Show an animated mascot or “Good Job” stamp
3. Store mood data
4. Automatically close the modal after 2 seconds

**For Negative Emotions (Worried, Annoyed, Sad, Angry):**

1. Display an empathetic acknowledgment message
2. Follow-up question: *“What’s making you feel this way?”*
3. Optional reflection text area
4. Supportive prompt: *“What would calm you down right now?”*
5. Suggested activity options:

   * Take a short break
   * Practice deep breathing
   * Listen to calming music
   * Talk to someone
   * Go for a walk
6. Display a supportive mascot animation
7. Store detailed mood and reflection data

**Data Collection:**
Store the following information for each check-in:

* Timestamp
* Associated habit
* Selected emotion
* Reflection text (if provided)
* Selected calming activity

---

### C. Task Management System (Menu 2)

#### Task Creation Form

**1. Task Identification:**

* Main task title (required)
* Description (optional, rich text)

**2. Sub-task Management:**

* Add multiple sub-tasks (dynamic list)
* Sub-task completion checkboxes
* Indented visual hierarchy
* Drag-and-drop reordering support

**3. Scheduling:**

* **Due Date:** calendar-based date picker
* **Auto Postpone:** toggle switch

  * Enabled: incomplete tasks automatically move to the next day
  * Disabled: tasks remain on their original due date

**4. Priority System:**

* 🔴 **High Priority:** red badge/border
* 🟡 **Medium Priority:** yellow badge/border
* 🟢 **Low Priority:** green badge/border

**5. Recurrence Settings:**

* Dropdown options:

  * Does not repeat
  * Daily
  * Weekly (day selection)
  * Monthly (date selection)
  * Custom (defined intervals)

**Task Display Logic:**

* Default sorting by priority
* Filters: All, Today, Upcoming, Overdue
* Swipe actions: Edit, Delete, Postpone
* Completion checkbox with strikethrough animation

---

## 3. Analytics & Visualization Dashboard (Menu 3)

### Key Performance Indicators

#### Completion Rate

* Total habit completion percentage
* Formula: `(Completed Habits / Total Scheduled Habits) × 100`
* Displayed as a circular progress indicator
* Real-time updates

#### Habit Activity Visualization

Line chart displaying:

* X-axis: time period
* Y-axis: completion rate
* Interactive tooltips
* Toggle between weekly, monthly, and yearly views

#### Statistical Metrics

* **Streak Days:** consecutive days with all habits completed 🔥
* **Perfect Days:** days with 100% completion 🏆
* **Active Days:** days with any habit activity

### Calendar Heatmap

* Monthly calendar grid
* Daily performance color coding:

  * 🟢 80–100% completion
  * 🟡 40–79% completion
  * 🔴 1–39% completion
  * ⚪ Skipped
* Detailed tooltips
* Clickable days for detailed breakdown

---

## 4. UI/UX Requirements

### Color Theme System

* Custom color per habit
* Predefined color palette (8–12 colors)
* Light mode and dark mode
* User preferences stored locally

### UI Components

* Animated toggle switches
* Modal pop-ups with blur effect
* Full-featured calendar & date pickers
* Locale-aware time picker

### Animations & Interactions

* Completion stamp animations
* Expressive mascot based on mood
* Micro-interactions (buttons, checkboxes, progress)
* Milestone confetti (optional)

### Accessibility

* WCAG 2.1 AA compliance
* Keyboard navigation
* Screen reader support
* Sufficient color contrast
* Minimum touch target size: 44×44px

### Responsive Design

* Mobile-first (minimum width 320px)
* Tablet breakpoint (768px)
* Desktop breakpoint (1024px+)
* Bottom navigation transforms into a sidebar on desktop

---

## 5. Technical Implementation Guidelines

### Data Persistence

* Local storage (offline support)
* Cloud synchronization (optional)
* Data export/import

### Performance

* Initial load time under 2 seconds
* Smooth 60fps animations
* Lazy loading for charts

### Compatibility

* Chrome, Firefox, Safari, Edge
* Progressive Web App (PWA) support
* Offline functionality

---

## 6. Success Criteria & Deliverables

### Minimum Viable Product (MVP):

1. Fully functional habit tracking
2. Smart Daily Check-in & Mood Board
3. Basic task management
4. Analytics dashboard
5. Responsive design
6. Theme customization

### Future Enhancements:

* Social features
* AI-powered habit recommendations
* Calendar integrations
* Gamification features
* Collaborative habits

---

## Deliverable Format

* Fully functional web application
* Clean, well-documented code
* Responsive UI aligned with specifications
* User guide
* Core feature testing coverage
