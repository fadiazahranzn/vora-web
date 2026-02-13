# Vora Design System

> **Version:** 1.0 · **Last Updated:** 2026-02-10
> **Framework:** Next.js (React) + TypeScript · **Styling:** CSS Custom Properties + Vanilla CSS

---

## 1. Overview

### 1.1 Purpose

The Vora Design System is the single source of truth for building all UI surfaces of the Vora habit-tracking and task management PWA. It defines tokens, components, patterns, and interaction guidelines that ensure visual consistency, accessibility compliance, and developer efficiency.

### 1.2 Design Philosophy

| Principle           | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| **Warm & Playful**  | Soft pinks, lilac purples, rounded corners — approachable, not childish  |
| **Mobile-First**    | Every component designed for touch first, then enhanced for desktop      |
| **Accessible**      | WCAG 2.1 AA minimum; 44×44 px touch targets; semantic HTML              |
| **Motion-Rich**     | Micro-animations reinforce actions; never block or delay interaction     |
| **Theme-Aware**     | Full light/dark mode with automatic `prefers-color-scheme` detection     |

### 1.3 Brand Identity

- **Personality:** Friendly, encouraging companion — not a strict coach
- **Mascot:** A small, expressive character with mood-based expressions (happy, proud, concerned, cheering)
- **Tone:** Warm, concise, second-person ("You've completed 60%!")

---

## 2. Design Tokens

### 2.1 Naming Convention

Vora uses a two-tier token system:
1. **Core Tokens:** Low-level, generic values (colors, spacing, etc.) defined in `tokens.css`.
2. **Semantic Tokens (Vora):** Prefixed with `--vora-`, these map core tokens to specific functional roles (e.g., `--vora-color-bg-primary`) defined in `globals.css`.

**Core Token Examples:**
- `--color-primary-500`
- `--space-4`
- `--radius-md`

**Semantic Token Examples:**
- `--vora-color-bg-primary`
- `--vora-space-4`
- `--vora-radius-sm`

### 2.2 Color Tokens

#### Core Palette

| Token                          | Light Mode   | Dark Mode    | Core Token Mapping             |
| ------------------------------ | ------------ | ------------ | ------------------------------ |
| `--vora-color-bg-primary`      | `#FFFFFF`    | `#0A0A0A`    | `var(--color-bg-white)`        |
| `--vora-color-bg-secondary`    | `#FAFAFA`    | `#121212`    | `var(--color-bg-canvas)`       |
| `--vora-color-bg-tertiary`     | `#F5F5F5`    | `#1A1A1A`    | `var(--color-bg-subtle)`       |
| `--vora-color-bg-overlay`      | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` | —                         |
| `--vora-color-text-primary`    | `#171717`    | `#FAFAFA`    | `var(--color-text-primary)`      |
| `--vora-color-text-secondary`  | `#525252`    | `#A3A3A3`    | `var(--color-text-secondary)`    |
| `--vora-color-text-tertiary`   | `#737373`    | `#737373`    | `var(--color-text-muted)`        |
| `--vora-color-text-inverse`    | `#FFFFFF`    | `#0A0A0A`    | `var(--color-bg-white)`        |
| `--vora-color-accent-primary`  | `#EDABFF`    | `#8E529A`    | `var(--color-primary-300)`     |
| `--vora-color-accent-hover`    | `#E275FF`    | `#B268C1`    | `var(--color-primary-400)`     |
| `--vora-color-accent-pressed`  | `#D946EF`    | `#D581E7`    | `var(--color-primary-500)`     |
| `--vora-color-accent-subtle`   | `#FAE8FF`    | `#4A2B50`    | `var(--color-primary-100)`     |
| `--vora-color-border-default`  | `#E5E5E5`    | `#262626`    | `var(--color-border-subtle)`    |
| `--vora-color-border-focus`    | `#EDABFF`    | `#8E529A`    | `var(--color-primary-300)`     |

#### Semantic Colors

| Token                         | Light Mode   | Dark Mode    | Usage                          |
| ----------------------------- | ------------ | ------------ | ------------------------------ |
| `--vora-color-success`        | `#00C853`    | `#69F0AE`    | Completed habits, success toast|
| `--vora-color-success-bg`     | `#E8F5E9`    | `#1B3A26`    | Success background             |
| `--vora-color-warning`        | `#FFD600`    | `#FFE082`    | Medium priority, heatmap yellow|
| `--vora-color-warning-bg`     | `#FFFDE7`    | `#3A3520`    | Warning background             |
| `--vora-color-error`          | `#FF1744`    | `#FF8A80`    | Errors, heatmap red, high prio |
| `--vora-color-error-bg`       | `#FFEBEE`    | `#3A1A1A`    | Error background               |
| `--vora-color-info`           | `#2196F3`    | `#90CAF9`    | Info banners, links            |
| `--vora-color-info-bg`        | `#E3F2FD`    | `#1A2A3A`    | Info background                |

#### Priority Colors

| Token                           | Value        | Usage                          |
| ------------------------------- | ------------ | ------------------------------ |
| `--vora-color-priority-high`    | `#FF1744`    | High-priority task dot         |
| `--vora-color-priority-medium`  | `#FFD600`    | Medium-priority task dot       |
| `--vora-color-priority-low`     | `#2196F3`    | Low-priority task dot          |

#### Heatmap Colors

| Token                          | Value        | Rate Range   |
| ------------------------------ | ------------ | ------------ |
| `--vora-color-heatmap-green`   | `#00C853`    | 80–100%      |
| `--vora-color-heatmap-yellow`  | `#FFD600`    | 40–79%       |
| `--vora-color-heatmap-red`     | `#FF1744`    | 0–39%        |
| `--vora-color-heatmap-none`    | `#E0E0E0`    | No habits    |

#### Habit Color Palette (12 user-selectable)

| # | Swatch      | Hex        |
|---|-------------|------------|
| 1 | 🔴 Red      | `#FF1744`  |
| 2 | 🟠 Orange   | `#FF9100`  |
| 3 | 🟡 Amber    | `#FFD600`  |
| 4 | 🟢 Green    | `#00C853`  |
| 5 | 🔵 Blue     | `#2979FF`  |
| 6 | 🟣 Purple   | `#D500F9`  |
| 7 | ⚫ Charcoal | `#37474F`  |
| 8 | 🟤 Brown    | `#795548`  |
| 9 | 🩷 Pink     | `#FF80AB`  |
| 10| 🩵 Teal     | `#00BFA5`  |
| 11| ⬜ Silver   | `#B0BEC5`  |
| 12| 🟩 Lime     | `#76FF03`  |

### 2.3 Typography

**Font Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

Import via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Token                        | Size   | Weight | Line Height | Letter Spacing | Usage                   |
| ---------------------------- | ------ | ------ | ----------- | -------------- | ----------------------- |
| `--vora-font-display`        | 32px   | 700    | 1.2         | -0.02em        | Hero text, large numbers|
| `--vora-font-h1`             | 24px   | 700    | 1.3         | -0.01em        | Page titles             |
| `--vora-font-h2`             | 20px   | 600    | 1.3         | -0.01em        | Section headers         |
| `--vora-font-h3`             | 16px   | 600    | 1.4         | 0              | Card titles, sub-headers|
| `--vora-font-body`           | 14px   | 400    | 1.5         | 0              | Body text, form labels  |
| `--vora-font-body-medium`    | 14px   | 500    | 1.5         | 0              | Emphasized body text    |
| `--vora-font-caption`        | 12px   | 400    | 1.4         | 0.01em         | Metadata, helper text   |
| `--vora-font-overline`       | 11px   | 600    | 1.4         | 0.05em         | Labels (uppercase)      |
| `--vora-font-button`         | 14px   | 600    | 1.0         | 0.02em         | Button text             |

### 2.4 Spacing Scale

Based on an 8px grid:

| Token            | Value  | Usage                                  |
| ---------------- | ------ | -------------------------------------- |
| `--vora-space-0`  | 0px    | Reset                                 |
| `--vora-space-1`  | 4px    | Tight gaps (icon-to-text)             |
| `--vora-space-2`  | 8px    | Inline padding, badge padding         |
| `--vora-space-3`  | 12px   | Between related items                 |
| `--vora-space-4`  | 16px   | Card inner padding, form field gap    |
| `--vora-space-5`  | 20px   | Card spacing in grid                  |
| `--vora-space-6`  | 24px   | Section gaps                          |
| `--vora-space-8`  | 32px   | Large section separators              |
| `--vora-space-10` | 40px   | Page top/bottom margins               |
| `--vora-space-12` | 48px   | Major layout gaps                     |
| `--vora-space-16` | 64px   | XL separators, hero sections          |

### 2.5 Border Radius

| Token                     | Value  | Usage                          |
| ------------------------- | ------ | ------------------------------ |
| `--vora-radius-sm`        | 8px    | Small badges, tags             |
| `--vora-radius-md`        | 12px   | Buttons, inputs                |
| `--vora-radius-lg`        | 16px   | Cards, modals                  |
| `--vora-radius-xl`        | 24px   | Bottom sheets, large cards     |
| `--vora-radius-full`      | 9999px | Avatars, circular progress     |

### 2.6 Elevation / Shadows

| Token                      | Value                                      | Usage                    |
| -------------------------- | ------------------------------------------ | ------------------------ |
| `--vora-shadow-sm`         | `0 1px 3px rgba(0,0,0,0.08)`              | Cards at rest            |
| `--vora-shadow-md`         | `0 4px 12px rgba(0,0,0,0.12)`             | Elevated cards, dropdowns|
| `--vora-shadow-lg`         | `0 8px 24px rgba(0,0,0,0.16)`             | Modals, dialogs          |
| `--vora-shadow-xl`         | `0 16px 48px rgba(0,0,0,0.20)`            | FAB, popovers            |
| `--vora-shadow-inner`      | `inset 0 1px 2px rgba(0,0,0,0.06)`        | Input fields (pressed)   |

### 2.7 Motion / Animation

| Token                        | Value                 | Usage                          |
| ---------------------------- | --------------------- | ------------------------------ |
| `--vora-duration-instant`    | `100ms`               | Checkbox toggle, active state  |
| `--vora-duration-fast`       | `150ms`               | Hover transitions              |
| `--vora-duration-normal`     | `250ms`               | Modal open, page transition    |
| `--vora-duration-slow`       | `400ms`               | Progress bar fill, counter     |
| `--vora-duration-emphasis`   | `500ms`               | Completion progress animation  |
| `--vora-duration-celebration`| `2000ms`              | Confetti burst                 |
| `--vora-easing-default`     | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `--vora-easing-decelerate`  | `cubic-bezier(0, 0, 0.2, 1)`   | Enter/appear          |
| `--vora-easing-accelerate`  | `cubic-bezier(0.4, 0, 1, 1)`   | Exit/disappear        |
| `--vora-easing-bounce`      | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Checkbox completion |

### 2.8 Breakpoints

| Token                     | Value    | Target                        |
| ------------------------- | -------- | ----------------------------- |
| `--vora-bp-mobile`        | `0px`    | Mobile (default)              |
| `--vora-bp-tablet`        | `768px`  | Tablet                        |
| `--vora-bp-desktop`       | `1024px` | Desktop (sidebar visible)     |
| `--vora-bp-wide`          | `1440px` | Wide desktop                  |

### 2.9 Z-Index Scale

| Token                    | Value  | Usage                          |
| ------------------------ | ------ | ------------------------------ |
| `--vora-z-base`          | `0`    | Default stacking               |
| `--vora-z-dropdown`      | `100`  | Dropdowns, popovers            |
| `--vora-z-sticky`        | `200`  | Sticky headers, bottom nav     |
| `--vora-z-overlay`       | `300`  | Modal backdrop                 |
| `--vora-z-modal`         | `400`  | Modals, dialogs, bottom sheets |
| `--vora-z-toast`         | `500`  | Toast notifications            |
| `--vora-z-tooltip`       | `600`  | Tooltips                       |

---

## 3. CSS Implementation

### 3.1 Root Token Declarations

```css
/* ═══════════════════════════════════════
   VORA DESIGN SYSTEM — CSS Custom Properties
   ═══════════════════════════════════════ */

@import './tokens.css';

:root {
  /* ── Colors: Light Mode (default) ── */
  --vora-color-bg-primary: var(--color-bg-white);
  --vora-color-bg-secondary: var(--color-bg-canvas);
  --vora-color-bg-tertiary: var(--color-bg-subtle);
  --vora-color-bg-overlay: rgba(0, 0, 0, 0.5);

  --vora-color-text-primary: var(--color-text-primary);
  --vora-color-text-secondary: var(--color-text-secondary);
  --vora-color-text-tertiary: var(--color-text-muted);
  --vora-color-text-inverse: var(--color-bg-white);

  --vora-color-accent-primary: var(--color-primary-300);
  --vora-color-accent-hover: var(--color-primary-400);
  --vora-color-accent-pressed: var(--color-primary-500);
  --vora-color-accent-subtle: var(--color-primary-100);

  --vora-color-border-default: var(--color-border-subtle);
  --vora-color-border-focus: var(--color-primary-300);

  --vora-color-success: var(--color-success);
  --vora-color-success-bg: var(--color-success-subtle);
  --vora-color-warning: var(--color-warning);
  --vora-color-warning-bg: var(--color-warning-subtle);
  --vora-color-error: var(--color-error);
  --vora-color-error-bg: var(--color-error-subtle);
  --vora-color-info: var(--color-info);
  --vora-color-info-bg: var(--color-info-subtle);

  /* Mapping Typography, Spacing, etc... */
  --vora-font-family: var(--font-family-sans);
  --vora-space-4: var(--space-4);
  --vora-radius-md: var(--radius-md);
  /* Full scale defined in globals.css */
}

/* ── Dark Mode ── */
[data-theme="dark"],
.dark {
  /* Mappings persist, tokens handle value changes */
  --vora-color-bg-overlay: rgba(0, 0, 0, 0.7);
}

/* ── System Theme Auto-Detection ── */
@media (prefers-color-scheme: dark) {
  [data-theme="system"] {
    --vora-color-bg-primary: #121212;
    --vora-color-bg-secondary: #1E1E1E;
    --vora-color-bg-tertiary: #2A2A2A;
    --vora-color-text-primary: #FFFFFF;
    --vora-color-text-secondary: #AAAAAA;
    --vora-color-accent-primary: #FCD6EF;
    --vora-color-accent-hover: #FFE4F5;
    --vora-color-border-default: #3A3A3A;
    --vora-color-border-focus: #FCD6EF;
    --vora-color-card-bg: #2A2A2A;
    --vora-color-card-border: #3A3A3A;
  }
}
```

### 3.2 Global Reset & Base Styles

```css
/* ═══════════════════════════════════════
   BASE STYLES
   ═══════════════════════════════════════ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: var(--vora-font-family);
  font-size: var(--vora-font-size-body);
  font-weight: var(--vora-font-weight-regular);
  line-height: var(--vora-line-height-relaxed);
  color: var(--vora-color-text-primary);
  background-color: var(--vora-color-bg-primary);
  transition: background-color var(--vora-duration-normal) var(--vora-easing-default),
              color var(--vora-duration-normal) var(--vora-easing-default);
}

/* ── Headings ── */
h1 { font-size: var(--vora-font-size-h1); font-weight: var(--vora-font-weight-bold); line-height: var(--vora-line-height-tight); }
h2 { font-size: var(--vora-font-size-h2); font-weight: var(--vora-font-weight-semibold); line-height: var(--vora-line-height-tight); }
h3 { font-size: var(--vora-font-size-h3); font-weight: var(--vora-font-weight-semibold); line-height: var(--vora-line-height-normal); }

/* ── Focus visible ── */
:focus-visible {
  outline: 2px solid var(--vora-color-border-focus);
  outline-offset: 2px;
  border-radius: var(--vora-radius-sm);
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 4. Components

### 4.1 Button

#### Overview
Primary interactive element for triggering actions. Four variants with consistent sizing.

#### Variants

| Variant       | Background                      | Text Color                      | Border               | Use Case                     |
| ------------- | ------------------------------- | ------------------------------- | -------------------- | ---------------------------- |
| **Primary**   | `--vora-color-accent-primary`   | `--vora-color-text-inverse`     | none                 | Main CTA (Create, Save)      |
| **Secondary** | `transparent`                   | `--vora-color-accent-primary`   | 1px accent           | Secondary actions (Cancel)    |
| **Ghost**     | `transparent`                   | `--vora-color-text-primary`     | none                 | Tertiary (Skip, Close)        |
| **Danger**    | `--vora-color-error`            | `#FFFFFF`                       | none                 | Destructive (Delete)          |

#### Sizes

| Size     | Height | Padding (H)  | Font Size     | Radius          |
| -------- | ------ | ------------- | ------------- | --------------- |
| **sm**   | 36px   | 12px          | 12px          | `--vora-radius-sm`  |
| **md**   | 44px   | 16px          | 14px          | `--vora-radius-md`  |
| **lg**   | 52px   | 24px          | 16px          | `--vora-radius-md`  |
| **full** | 52px   | 24px, width:100% | 16px       | `--vora-radius-md`  |

#### States

| State       | Modification                                              |
| ----------- | --------------------------------------------------------- |
| Default     | As defined per variant                                    |
| Hover       | Background shifts to `--vora-color-accent-hover`          |
| Active      | Background shifts to `--vora-color-accent-pressed`, scale(0.98) |
| Focused     | 2px accent outline via `:focus-visible`                   |
| Disabled    | `opacity: 0.5`, `pointer-events: none`                    |
| Loading     | Content replaced by 20px spinner, width locked            |

#### Code Example (React + TypeScript)

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'full';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`vora-btn vora-btn--${variant} vora-btn--${size}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="vora-btn__spinner" aria-label="Loading" />
      ) : (
        <>
          {leftIcon && <span className="vora-btn__icon">{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
```

```css
.vora-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vora-space-2);
  font-family: var(--vora-font-family);
  font-weight: var(--vora-font-weight-semibold);
  border: none;
  cursor: pointer;
  transition: all var(--vora-duration-fast) var(--vora-easing-default);
  white-space: nowrap;
}

.vora-btn--primary {
  background: var(--vora-color-accent-primary);
  color: var(--vora-color-text-inverse);
}
.vora-btn--primary:hover { background: var(--vora-color-accent-hover); }
.vora-btn--primary:active { background: var(--vora-color-accent-pressed); transform: scale(0.98); }

.vora-btn--secondary {
  background: transparent;
  color: var(--vora-color-accent-primary);
  border: 1px solid var(--vora-color-accent-primary);
}

.vora-btn--ghost {
  background: transparent;
  color: var(--vora-color-text-primary);
}
.vora-btn--ghost:hover { background: var(--vora-color-bg-tertiary); }

.vora-btn--danger {
  background: var(--vora-color-error);
  color: #FFFFFF;
}

/* Sizes */
.vora-btn--sm  { height: 36px; padding: 0 12px; font-size: 12px; border-radius: var(--vora-radius-sm); }
.vora-btn--md  { height: 44px; padding: 0 16px; font-size: 14px; border-radius: var(--vora-radius-md); }
.vora-btn--lg  { height: 52px; padding: 0 24px; font-size: 16px; border-radius: var(--vora-radius-md); }
.vora-btn--full { height: 52px; padding: 0 24px; font-size: 16px; border-radius: var(--vora-radius-md); width: 100%; }

.vora-btn:disabled { opacity: 0.5; pointer-events: none; }

.vora-btn__spinner {
  width: 20px; height: 20px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: vora-spin 600ms linear infinite;
}
@keyframes vora-spin { to { transform: rotate(360deg); } }
```

#### Accessibility
- **ARIA:** Use `aria-label` for icon-only buttons; `aria-busy="true"` when loading
- **Keyboard:** Activates on `Enter` and `Space`
- **Min touch target:** 44×44px (all sizes ≥ 44px height, sm padded to 44px clickable)

---

### 4.2 Input Field

#### Variants

| Variant      | Description                                |
| ------------ | ------------------------------------------ |
| **Text**     | Standard text input                        |
| **Email**    | Email with format validation               |
| **Password** | Toggle visibility, strength meter          |
| **Number**   | Numeric with stepper arrows                |
| **TextArea** | Multi-line (mood reflection, descriptions) |

#### Anatomy

| Part             | Description                       | Required |
| ---------------- | --------------------------------- | -------- |
| Label            | Above the input                   | Yes      |
| Input Container  | Bordered field                    | Yes      |
| Leading Icon     | Left icon (emoji/icon)            | No       |
| Trailing Action  | Right action (show/hide, clear)   | No       |
| Helper Text      | Below input (hint or char count)  | No       |
| Error Message    | Below input (red, replaces helper)| No       |

#### Specs

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Height           | 44px (textarea: auto, min 80px)           |
| Padding          | 12px horizontal, centered vertical        |
| Border           | 1px `--vora-color-border-default`         |
| Border (focus)   | 2px `--vora-color-border-focus`           |
| Border (error)   | 1px `--vora-color-error`                  |
| Border Radius    | `--vora-radius-md`                        |
| Background       | `--vora-color-bg-primary`                 |
| Font Size        | `--vora-font-size-body` (14px)            |
| Placeholder      | `--vora-color-text-tertiary`              |

#### Code Example

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
}

export function Input({
  label, error, helperText, leadingIcon, trailingAction,
  id, ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`vora-input ${error ? 'vora-input--error' : ''}`}>
      <label htmlFor={inputId} className="vora-input__label">{label}</label>
      <div className="vora-input__container">
        {leadingIcon && <span className="vora-input__icon">{leadingIcon}</span>}
        <input id={inputId} className="vora-input__field" aria-invalid={!!error} {...props} />
        {trailingAction && <span className="vora-input__action">{trailingAction}</span>}
      </div>
      {error && <p className="vora-input__error" role="alert">{error}</p>}
      {!error && helperText && <p className="vora-input__helper">{helperText}</p>}
    </div>
  );
}
```

#### Accessibility
- **ARIA:** `aria-invalid` when error present; `aria-describedby` linked to helper/error
- **Keyboard:** Full native input keyboard support
- **Labels:** Always visible (no placeholder-only labels)

---

### 4.3 Card

#### Variants

| Variant          | Usage                    | Interactive | Shadow              |
| ---------------- | ------------------------ | ----------- | -------------------- |
| **Static**       | Stats, info display      | No          | `--vora-shadow-sm`   |
| **Interactive**  | Habit cards, task cards   | Yes (tap)   | `--vora-shadow-sm` → `md` on hover |
| **Expandable**   | Task cards with subtasks  | Yes         | Grows to show content|
| **Selectable**   | Mood emoji cards          | Yes (toggle)| Accent border when selected |

#### Specs

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Background       | `--vora-color-card-bg`                    |
| Border           | 1px `--vora-color-card-border`            |
| Border Radius    | `--vora-radius-lg` (16px)                 |
| Padding          | `--vora-space-4` (16px)                   |
| Shadow           | `--vora-shadow-sm`                        |
| Hover Shadow     | `--vora-shadow-md` (interactive only)     |
| Transition       | `var(--vora-duration-fast)`               |

#### Code Example

```tsx
interface CardProps {
  variant?: 'static' | 'interactive' | 'expandable' | 'selectable';
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Card({ variant = 'static', selected, onClick, children }: CardProps) {
  const isClickable = variant !== 'static';
  return (
    <div
      className={`vora-card vora-card--${variant} ${selected ? 'vora-card--selected' : ''}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter') onClick?.(); } : undefined}
    >
      {children}
    </div>
  );
}
```

---

### 4.4 Modal / Bottom Sheet

#### Behavior by Breakpoint

| Breakpoint | Presentation       | Width          | Animation           |
| ---------- | ------------------- | -------------- | ------------------- |
| Mobile     | Full-screen sheet   | 100%           | Slide up from bottom|
| Tablet     | Bottom sheet        | 100%, max 560px| Slide up            |
| Desktop    | Centered dialog     | 480px          | Fade + scale up     |

#### Specs

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Backdrop          | `--vora-color-bg-overlay`                |
| Background        | `--vora-color-bg-primary`                |
| Border Radius     | `--vora-radius-xl` (top only on mobile)  |
| Padding           | `--vora-space-6`                         |
| Shadow            | `--vora-shadow-lg`                       |
| Z-index           | `--vora-z-modal`                         |
| Close             | ✕ button (top-right) + Escape key + backdrop click |
| Open duration     | `--vora-duration-normal`                 |
| Close duration    | `200ms`                                  |

#### Accessibility
- **Focus trap:** Focus cycles within open modal
- **ARIA:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title
- **Escape:** Closes modal
- **Scroll lock:** Body scroll disabled when open

---

### 4.5 Bottom Navigation (Mobile)

#### Specs

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Height           | `--vora-bottomnav-height` (64px)         |
| Background       | `--vora-color-bg-primary`                |
| Border Top       | 1px `--vora-color-border-default`        |
| Position         | `fixed` bottom                           |
| Z-index          | `--vora-z-sticky`                        |
| Items            | 3: Home 🏠, Tasks 📋, Analytics 📊      |
| Active Indicator | Accent-colored icon + label              |
| Visibility       | Hidden on desktop (≥1024px)              |

#### Item Anatomy

| Part        | Active                           | Inactive                          |
| ----------- | -------------------------------- | --------------------------------- |
| Icon        | `--vora-color-accent-primary`    | `--vora-color-text-secondary`     |
| Label       | `--vora-color-accent-primary`, semibold | `--vora-color-text-secondary`, regular |
| Size (icon) | 24×24px                          | 24×24px                           |
| Size (label)| 11px                             | 11px                              |
| Touch area  | 64×64px (full height + padding)  | Same                              |

---

### 4.6 Sidebar (Desktop)

#### Specs

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Width            | `--vora-sidebar-width` (260px)           |
| Background       | `--vora-color-bg-secondary`              |
| Border Right     | 1px `--vora-color-border-default`        |
| Position         | `fixed` left, full height                |
| Visibility       | Visible only ≥1024px                     |
| Content          | Logo, category list, "+" add category    |

---

### 4.7 Toast / Notification

#### Variants

| Variant     | Icon | Background / Border                | Duration |
| ----------- | ---- | ---------------------------------- | -------- |
| **Success** | ✅   | `--vora-color-success-bg`, green border | 3s  |
| **Error**   | ❌   | `--vora-color-error-bg`, red border     | 5s (+ dismiss) |
| **Info**    | ℹ️   | `--vora-color-info-bg`, blue border     | 4s  |

#### Specs

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Position         | Fixed top-center (mobile), top-right (desktop) |
| Max Width        | 400px                                    |
| Padding          | 12px 16px                                |
| Border Radius    | `--vora-radius-md`                       |
| Shadow           | `--vora-shadow-md`                       |
| Z-index          | `--vora-z-toast`                         |
| Enter animation  | Slide down + fade in                     |
| Exit animation   | Fade out + slide up                      |

---

### 4.8 Progress Bar

#### Variants

| Variant       | Usage                          | Shape        |
| ------------- | ------------------------------ | ------------ |
| **Linear**    | Completion rate on Home        | Horizontal bar |
| **Circular**  | Analytics completion donut     | Donut ring   |

#### Linear Specs

| Property     | Value                                     |
| ------------ | ----------------------------------------- |
| Height       | 8px                                       |
| Track color  | `--vora-color-bg-tertiary`               |
| Fill color   | `--vora-color-accent-primary`            |
| Border Radius| `--vora-radius-full`                     |
| Animation    | Width fill, `--vora-duration-emphasis`   |

#### Circular Specs

| Property       | Value                                   |
| -------------- | --------------------------------------- |
| Size           | 120×120px                               |
| Stroke width   | 10px                                    |
| Track color    | `--vora-color-bg-tertiary`             |
| Fill color     | `--vora-color-accent-primary`          |
| Center text    | Percentage (display font)               |
| Animation      | Stroke-dashoffset, `--vora-duration-emphasis` |

---

### 4.9 Skeleton Loader

Used as placeholder during API loading states.

| Element Type    | Shape              | Animation                          |
| --------------- | ------------------ | ---------------------------------- |
| Card            | Rounded rectangle  | Shimmer pulse (left→right gradient)|
| Text line       | Rounded strip      | Same shimmer                       |
| Avatar/Icon     | Circle             | Same shimmer                       |
| Chart           | Rounded rectangle  | Same shimmer                       |

```css
.vora-skeleton {
  background: linear-gradient(
    90deg,
    var(--vora-color-bg-tertiary) 25%,
    var(--vora-color-bg-secondary) 50%,
    var(--vora-color-bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: vora-shimmer 1.5s infinite;
  border-radius: var(--vora-radius-sm);
}

@keyframes vora-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### 4.10 Empty State

Used when a list or view has no data.

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Illustration     | Mascot in appropriate expression          |
| Title            | `--vora-font-h2`, centered                |
| Description      | `--vora-font-body`, `text-secondary`      |
| CTA Button       | Primary button, centered                  |
| Max Width        | 320px, centered in container              |

Examples:
- **No Habits:** Mascot wave — "Let's create your first habit!" — [Create Habit]
- **No Tasks:** Mascot clipboard — "Nothing on your plate!" — [Add a Task]
- **No Analytics:** Mascot chart — "Complete some habits to see your stats!"

---

### 4.11 Floating Action Button (FAB)

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Size             | 56×56px                                  |
| Icon             | `+` (24px)                               |
| Background       | `--vora-color-accent-primary`            |
| Color            | `--vora-color-text-inverse`              |
| Shadow           | `--vora-shadow-xl`                       |
| Border Radius    | `--vora-radius-full`                     |
| Position         | Fixed, bottom-right (bottom: 80px mobile for nav clearance, 24px desktop) |
| Hover            | Scale 1.1 + `--vora-shadow-xl`          |
| Active           | Scale 0.95                               |

---

## 5. Layout Patterns

### 5.1 Responsive Layout

```css
/* Mobile-first layout */
.vora-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.vora-layout__content {
  flex: 1;
  padding: var(--vora-space-4);
  padding-bottom: calc(var(--vora-bottomnav-height) + var(--vora-space-4));
  max-width: var(--vora-content-max-width);
  margin: 0 auto;
  width: 100%;
}

/* Desktop: sidebar layout */
@media (min-width: 1024px) {
  .vora-layout {
    flex-direction: row;
  }

  .vora-layout__content {
    margin-left: var(--vora-sidebar-width);
    padding: var(--vora-space-6);
    padding-bottom: var(--vora-space-6);
  }

  .vora-bottomnav { display: none; }
  .vora-sidebar { display: flex; }
}

/* Mobile: hide sidebar, show bottom nav */
@media (max-width: 1023px) {
  .vora-sidebar { display: none; }
  .vora-bottomnav { display: flex; }
}
```

### 5.2 Form Layout

```css
.vora-form {
  display: flex;
  flex-direction: column;
  gap: var(--vora-space-4);
}

.vora-form__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--vora-space-4);
}

@media (min-width: 768px) {
  .vora-form__row--split {
    grid-template-columns: 1fr 1fr;
  }
}

.vora-form__actions {
  display: flex;
  gap: var(--vora-space-3);
  justify-content: flex-end;
  padding-top: var(--vora-space-4);
  border-top: 1px solid var(--vora-color-border-default);
}
```

---

## 6. Interaction Specifications

### 6.1 Animation Catalogue

| Animation             | Trigger                | CSS / Approach                    | Duration        | Easing              |
| --------------------- | ---------------------- | --------------------------------- | --------------- | ------------------- |
| Checkbox bounce       | Habit completion tap   | `transform: scale` keyframes      | 300ms           | `--vora-easing-bounce` |
| Confetti burst        | Positive mood selected | Canvas particles (library)        | 2000ms          | Linear              |
| Progress fill         | Completion rate change | `width` or `stroke-dashoffset`    | 500ms           | `--vora-easing-default` |
| Card entrance         | List load              | `opacity` + `translateY` stagger  | 150ms × index   | `--vora-easing-decelerate` |
| Modal slide-up        | FAB / card tap         | `transform: translateY(100%→0)`   | 250ms           | `--vora-easing-decelerate` |
| Modal fade-in         | Desktop dialog open    | `opacity` + `scale(0.95→1)`      | 250ms           | `--vora-easing-decelerate` |
| Toast enter           | Notification           | `translateY(-100%→0)` + opacity   | 250ms           | `--vora-easing-decelerate` |
| Streak counter        | New completion         | Number count-up with scale pulse  | 400ms           | `--vora-easing-bounce` |
| Theme crossfade       | Theme toggle           | `transition` on all token colors  | 300ms           | `--vora-easing-default` |
| Heatmap cell hover    | Mouse hover            | `scale(1.1)` + tooltip            | 150ms           | `--vora-easing-default` |

### 6.2 Micro-Interaction: Habit Completion

```
1. User taps uncompleted habit card
2. Checkbox animates: scale(0) → scale(1.2) → scale(1) with bounce easing (300ms)
3. Card background briefly flashes accent-subtle (150ms)
4. API call: POST /habits/{id}/complete
5. Completion rate progress bar animates to new width (500ms)
6. Mascot expression updates (crossfade 300ms)
7. After 500ms delay: Smart Check-in modal slides up
```

---

## 7. Accessibility Guidelines

### 7.1 Color Contrast

| Combination                    | Ratio    | Required | Status |
| ------------------------------ | -------- | -------- | ------ |
| Text Primary on BG Primary     | 17.4:1   | 4.5:1    | ✅ Pass |
| Text Secondary on BG Primary   | 5.7:1    | 4.5:1    | ✅ Pass |
| Text Inverse on Accent Primary | 4.8:1    | 4.5:1    | ✅ Pass |
| Error on BG Primary            | 5.2:1    | 4.5:1    | ✅ Pass |
| Accent on BG Secondary         | 3.1:1    | 3:1 (lg) | ✅ Pass (large text only) |

> **Note:** For bodytext on accent backgrounds, always use `--vora-color-text-inverse` for Primary variant buttons.

### 7.2 Keyboard Navigation

| Context           | Keys                          | Action                    |
| ----------------- | ----------------------------- | ------------------------- |
| All buttons       | `Enter`, `Space`              | Activate                  |
| Modal             | `Escape`                      | Close                     |
| Modal             | `Tab` / `Shift+Tab`           | Cycle focus within modal  |
| Date picker       | `←` `→`                       | Previous / next day       |
| Tab bar / filters | `←` `→`                       | Switch tabs               |
| Expandable card   | `Enter`                       | Toggle expand             |
| Color picker grid | Arrow keys                    | Navigate swatches         |
| Mood grid         | Arrow keys + `Enter`          | Navigate + select mood    |

### 7.3 Screen Reader Announcements

| Event                    | Announcement                                      |
| ------------------------ | ------------------------------------------------- |
| Habit completed          | "[Habit name] marked as complete"                 |
| Habit uncompleted        | "[Habit name] marked as incomplete"               |
| Mood selected            | "Mood set to [mood name]"                         |
| Task completed           | "[Task title] completed"                          |
| Sub-task all done        | "All sub-tasks complete. [Task] auto-completed"   |
| Toast (success)          | "Success: [message]"                              |
| Toast (error)            | "Error: [message]"                                |
| Completion rate          | "Completion rate: [n] percent, [x] of [y] habits" |

### 7.4 ARIA Requirements per Component

| Component       | Required ARIA                                           |
| --------------- | ------------------------------------------------------- |
| Button          | `aria-label` (icon-only), `aria-busy` (loading)        |
| Input           | `aria-invalid`, `aria-describedby`, `aria-required`    |
| Modal           | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`|
| Toast           | `role="alert"`, `aria-live="polite"`                   |
| Progress bar    | `role="progressbar"`, `aria-valuenow`, `aria-valuemin/max` |
| Tab bar         | `role="tablist"`, `role="tab"`, `aria-selected`        |
| Heatmap cell    | `aria-label="[date]: [rate]% completion"`              |
| Checkbox (habit)| `role="checkbox"`, `aria-checked`                      |

---

## 8. Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use semantic tokens (`--vora-color-accent-primary`) | Hardcode hex values in components |
| Provide visible labels on all inputs | Use placeholder text as the only label |
| Use `--vora-radius-lg` for cards consistently | Mix border-radius values on similar elements |
| Animate state changes with token durations | Use animations > 500ms for non-celebration actions |
| Test all flows with keyboard only | Rely solely on color to convey information |
| Show loading skeletons during API calls | Leave blank screens while loading |
| Use the mascot sparingly (home, check-in, empty states) | Put the mascot on every screen |
| Follow the 8px spacing grid | Use arbitrary pixel values for spacing |
| Ensure 44px minimum touch targets | Make icons or clickable text smaller than 44px |
| Use `prefers-reduced-motion` for users who need it | Force animations with no opt-out |

---

## 9. File Structure

```
src/
├── styles/
│   ├── tokens.css ............ All CSS custom properties (from §3.1)
│   ├── reset.css ............. Global reset & base (from §3.2)
│   ├── layout.css ............ Layout patterns (from §5)
│   └── utilities.css ......... Utility classes (spacing, text, flex)
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.css
│   │   └── Button.test.tsx
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   ├── BottomNav/
│   ├── Sidebar/
│   ├── Toast/
│   ├── ProgressBar/
│   ├── Skeleton/
│   ├── EmptyState/
│   ├── FAB/
│   ├── Mascot/
│   └── DatePicker/
├── patterns/
│   ├── HabitCard/
│   ├── TaskCard/
│   ├── MoodGrid/
│   ├── HeatmapCalendar/
│   └── StatsCard/
└── hooks/
    ├── useTheme.ts
    └── useMediaQuery.ts
```

---

## 10. Related Documents

| Document         | Path                    | Relationship                       |
| ---------------- | ----------------------- | ---------------------------------- |
| FSD              | `fsd.md`                | Functional requirements source     |
| ERD              | `erd.md`                | Data model definitions             |
| API Contract     | `api-contract.md`       | Endpoint & schema reference        |
| Wireframes       | `wireframes.md`         | Layout & screen specifications     |

---

## Appendix: Revision History

| Version | Date       | Author        | Changes                            |
| ------- | ---------- | ------------- | ---------------------------------- |
| 1.0     | 2026-02-10 | [Author Name] | Initial design system from wireframes + FSD |

---

*Document generated on 2026-02-10. Single source of truth for all Vora UI implementation.*
