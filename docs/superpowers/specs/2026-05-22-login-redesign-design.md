# Login Page Redesign — Split-Screen Layout

**Date:** 2026-05-22
**Status:** Approved by user

## Overview

Redesign the login page from a centered single card layout to a split-screen layout with a branded left panel and a glassmorphism login form on the right.

## Architecture

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    LOGIN PAGE                       │
├──────────────────────┬──────────────────────────────┤
│   LEFT PANEL (50%)   │     RIGHT PANEL (50%)        │
│                      │                              │
│  ┌────────────────┐  │  ┌────────────────────────┐  │
│  │  Dot Grid BG   │  │  │   Light Gray BG        │  │
│  │                │  │  │                        │  │
│  │   [Logo Icon]  │  │  │  ┌──────────────────┐  │  │
│  │  E-Inventaris  │  │  │  │  Glassmorphism   │  │  │
│  │ SMK Al Basyar. │  │  │  │     Card         │  │  │
│  │                │  │  │  │                  │  │  │
│  │   Tagline      │  │  │  │  Username Input  │  │  │
│  │                │  │  │  │  Password Input  │  │  │
│  │                │  │  │  │  Submit Button   │  │  │
│  │                │  │  │  │  Footer          │  │  │
│  └────────────────┘  │  │  └──────────────────┘  │  │
│                      │  │                        │  │
└──────────────────────┴──┴────────────────────────┘
```

### Left Panel (Brand)

- **Background:** Primary blue (`#2563eb` / `bg-primary-600`)
- **Pattern:** Dot grid overlay using `radial-gradient` CSS, 24px spacing, white dots at 15% opacity
- **Content (centered vertically and horizontally):**
  - Logo icon: 80x80px, frosted glass container (`backdrop-blur`, semi-transparent white bg), rounded-2xl, Package icon
  - Title: "E-Inventaris" — 28px, bold, white
  - Subtitle: "SMK Al Basyariah" — 14px, white at 70% opacity
  - Tagline: "Kelola aset dan inventaris sekolah dengan mudah dan terorganisir" — 13px, white at 50% opacity, max-width 250px

### Right Panel (Form)

- **Background:** Light gray (`#f8fafc` / `bg-surface-50`)
- **Card:** Glassmorphism style
  - `bg-white/70`, `backdrop-blur-xl`, `border-white/40`
  - `rounded-3xl` (24px radius), `shadow-card-hover`
  - Max-width: 380px, centered vertically and horizontally
- **Form Content:**
  - Header: "Masuk" (22px bold) + "Silakan masuk ke akun Anda" (14px muted)
  - Username input: same functionality as current, refined styling
  - Password input: same functionality (show/hide toggle), refined styling
  - Submit button: "Masuk ke Sistem" — primary blue, full-width, loading state
  - Footer: copyright + version badge (same as current)

## Responsive Behavior

- **Desktop (≥768px):** Split-screen 50/50
- **Mobile (<768px):** Brand panel collapses to a top banner (120px height), form below on white background

## Animations

- Left panel: subtle dot grid is static (no animation needed for performance)
- Right card: `scale-in` animation on page load (0.3s ease-out)
- Form fields: `slide-up` stagger animation (fields appear sequentially)
- Submit button: same hover/active states as current

## Files Changed

- `src/routes/login.tsx` — complete rewrite of layout and styling
- No new files needed; uses existing Tailwind theme tokens

## Data Flow

No changes to data flow. Same `loginUser` function, same form state management, same toast notifications, same navigation to `/dashboard`.

## Dependencies

- Existing: `lucide-react`, `@tanstack/react-router`, `sonner`, `react`
- No new dependencies
