# Link2Digital — Design System & Architecture Guide

This document serves as the canonical reference for the Link2Digital agency platform. It defines the "Cinematic-Runco" aesthetic and the technical implementation details to ensure total consistency in future updates.

## 🎨 Visual Identity (STRICT RULES)

### The ONLY Permitted Colors
- **Sage (`--bg-sage`)**: `#d1d9cf` — The foundation. Used for backgrounds and primary screens.
- **Charcoal (`--text-main`)**: `#1a1a1a` — Used for headings, primary text, and dark sections.
- **Lime (`--accent-lime`)**: `#ccff00` — The ONLY accent color. Used for buttons, indicators, and focus points.
- **White (`#ffffff`)**: Used ONLY for ghost/outline text or specific highlights.
- **STRICT RULE**: No other colors (Blue, Red, etc.) are allowed in the brand identity.

### Typography & Layout
- **Headings**: `Syne` (Uppercase, Extra-bold). Tight tracking (`-0.08em`).
- **Subtitles**: `Inter` (Medium/Bold). Clean and readable.
- **Ghost Text**: Use large outlined or semi-transparent headings for depth.
- **Buttons**: Pill-shaped, Lime background, Black text, uppercase.

### Core Geometry
- **Screen Radius**: `40px` (`var(--radius-xl)`).
- **Card Radius**: `24px` (`var(--radius-lg)`).
- **Cinematic Container**: Every main section is wrapped in a `100vh` rounded screen with a subtle grain/noise overlay.

---

## 🏗️ Technical Architecture

### Core Stack
- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS + Vanilla CSS (enforced via `!important` for critical layout tokens).
- **Motion**: Framer Motion for all transitions and interactions.
- **Smooth Scroll**: Lenis Scroll (integrated via `CinematicProvider.tsx`).

### Page Layouts
1. **Home (`/`)**: A 3D Bento Grid. Uses `TiltCard` for interactive depth and statistical visualizations.
2. **Portfolio (`/portfolio`)**: **Horizontal Scroll Journey**. Projects move sideways using `useScroll` and `useTransform`. Includes a dynamic progress bar at the bottom with project titles and numbering (`01/04`).
3. **Contact (`/contact`)**: **Bento Grid**. Unified with the Home aesthetic using Sage background and modular cards. Features a multi-step form with a custom "Success State".

---

## ⚡ Interactive Principles

### 1. The Custom Cursor
- **Default State**: Small dot, `mix-blend-mode: difference`.
- **Active State**: 80px circle with a **2px Lime border**. 
- **Rule**: NO BLUR. The cursor must feel sharp and high-tech.

### 2. Magnetic Elements
- **Physics**: Spring-based (`stiffness: 100`, `damping: 20`).
- **Usage**: Apply to all primary action buttons and icons to create a "sticky" interactive feel.

### 3. 3D Tilt Cards
- **Logic**: Cards tilt based on mouse position. 
- **Optimization**: Disabled on mobile to preserve performance and prevent layout jitter.

### 4. The Preloader
- **Sequence**: Artificial progress (0-100%) followed by a circular exit animation.
- **Z-Index**: Always `9999999`. Ensures no content is visible before fully loaded.

---

## 📏 Layout Spacing Rules
- **Margins**: Large breathing room. Sections should feel "airy".
- **Gaps**: Standard grid gaps are `32px` (`gap-8`) or `48px` (`gap-12`). Bottom cards in contact use `64px` (`gap-16`).
- **Consistency**: Always use the `cinematic-screen` class to maintain the "tablet-in-space" look.

---

## 🛠 Maintenance & Updates
When adding new projects or sections:
1. Always add a corresponding **Project No.** (Archive No. e.g., `L2D-05`).
2. Maintain the **uppercase** naming convention for all major headings.
3. Use **Lucide React** for icons, wrapping them in a background circle or square with a subtle border.
4. Ensure **Tailwind directives** remain at the top of `globals.css` to prevent layout breakage.

*Last Updated: May 2026*
