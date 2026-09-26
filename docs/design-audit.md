# YukMagang — Design Audit

## Executive Summary

The current YukMagang UI is **functional but visually generic**. It lacks a distinctive CareerTech/EdTech identity. The design system is minimal and uses default-ish Tailwind tokens with a single blue primary. Authentication pages feel like standard template forms. There's no brand personality, weak visual hierarchy, and no sense of "YukMagang" as a product.

---

## Current State Analysis

### 1. Color System (globals.css)
| Token | Value | Assessment |
|-------|-------|------------|
| `--primary` | 221 83% 53% (blue) | Generic SaaS blue, no brand connection |
| `--background` | 0 0% 100% (white) | Standard |
| `--muted` | 210 40% 96% | Cool gray, slightly sterile |
| `--border` | 214 32% 91% | Very light, low contrast |
| `--radius` | 6px | Standard, safe |
| **Missing** | Brand green, warm neutrals, semantic accent colors | Critical gap |

**Verdict**: The current primary (blue #3b82f6) has zero connection to the product name "YukMagang" or the Indonesian EdTech context. No green/teal which would signal "growth", "career", "opportunity".

### 2. Typography
- Uses Geist Sans (Next.js default) — clean but impersonal
- No defined type scale beyond 4 utility classes
- No heading hierarchy system
- No font-weight variety in use (mostly font-medium)

### 3. Spacing & Layout
- Uses standard Tailwind spacing (4px base)
- `container-narrow` (max-w-2xl), `container-wide` (max-w-6xl) defined but inconsistently applied
- Auth pages: `max-w-md` centered card — generic pattern
- No rhythm or vertical spacing system

### 4. Component Patterns

#### Auth Pages (Login/Register)
**Current Problems:**
- Centered white card on gray background — generic "template" look
- No brand mark/logo area
- Excessive vertical padding (`py-12`) creates floating card feel
- Weak visual hierarchy: title + subtitle + form all same weight
- CTA button: standard blue, full-width, no personality
- Radio role selector: functional but visually flat
- No illustration, no human touch, no value proposition messaging

#### Student Profile Page
**Current Problems:**
- Two stacked cards with generic borders
- Section headers: `text-section-title` but no visual distinction
- Skill chips: `bg-primary/10 text-primary border-primary/20` — uses blue, not brand color
- Skill search dropdown: raw `<ul>` with basic hover states
- Empty state: plain text, no illustration
- Save button: same generic primary as auth

#### Student Dashboard
**Current Problems:**
- Header: plain border-bottom, no brand presence
- Welcome text + major badge + logout — all cramped in one row
- Quick Actions: four links with inconsistent styling (1 primary, 3 outline)
- No visual hierarchy between primary and secondary actions
- No dashboard "personality" — looks like admin panel

### 5. Anti-Patterns Identified

| Anti-Pattern | Location | Impact |
|--------------|----------|--------|
| Generic centered card | Login, Register | Feels like template, not product |
| Single blue primary everywhere | All pages | No brand identity, no semantic meaning |
| Border-heavy cards | All pages | Visually heavy, dated |
| No brand/logo space | Auth, Dashboard | Zero brand recall |
| Uniform visual weight | Forms, dashboards | Hard to scan, no priority |
| Raw HTML selects/inputs | Register, Profile | Inconsistent, unstyled |
| No illustration/icon system | All pages | Sterile, impersonal |
| Generic "muted" gray background | Auth pages | Clinical, not welcoming |

---

## Competitive Context: CareerTech/EdTech Visual Language

### Reference Products
| Product | Visual Language | Key Attributes |
|---------|----------------|----------------|
| **LinkedIn Learning** | Warm blue, clean, professional | Trust, authority |
| **Coursera** | Bright blue + green accents, illustrated | Growth, accessibility |
| **Kampus Merdeka (Indonesian)** | Government blue/red, formal | Authority, trust |
| **Glints** | Green primary, youthful, mobile-first | Opportunity, energy |
| **Kumparan Karir** | Teal/green, modern, content-focused | Fresh, approachable |

### Indonesian EdTech Expectations
- **Green/Teal** = growth, career, nature, opportunity (culturally resonant)
- **Warm, human** = not cold corporate blue
- **Mobile-first** = majority of SMK students access via phone
- **Clear hierarchy** = students scan, don't read
- **Trust signals** = verified badges, company logos, testimonials

---

## Recommended Visual Direction

### Brand Personality Keywords
> **Bright, Optimistic, Trustworthy, Modern, Youthful, Professional, Approachable, Technology-Oriented**

### Color Strategy: "Growth Green" System

```
Primary:     #059669  (emerald-600)  — trust, growth, action
Primary-50:  #ecfdf5  (emerald-50)   — subtle backgrounds
Primary-100: #d1fae5  (emerald-100)  — hover states, chips
Primary-700: #047857  (emerald-700)  — hover, active states

Secondary:   #0891b2  (cyan-600)     — tech, modernity, complement
Accent:      #f59e0b  (amber-500)    — warnings, highlights, energy

Neutral Warm: 
  --neutral-50:  #fafaf9  (stone-50)
  --neutral-100: #f5f5f4  (stone-100)
  --neutral-200: #e7e5e4  (stone-200)
  --neutral-900: #1c1917  (stone-900)
```

**Why this palette:**
- Emerald green = "YukMagang" (let's intern) → growth, forward motion
- Warm stone neutrals = approachable, not sterile
- Cyan secondary = tech/modernity without being "cyberpunk"
- Amber accent = optimism, energy, attention

### Typography System
- **Font**: Geist Sans (keep) + Geist Mono for code/technical
- **Scale** (fluid, clamp-based):
  - Display: `clamp(2rem, 1.5rem + 2vw, 3rem)` — hero, marketing
  - H1: `clamp(1.75rem, 1.5rem + 1vw, 2.25rem)` — page titles
  - H2: `clamp(1.375rem, 1.25rem + 0.5vw, 1.75rem)` — section titles
  - H3: `1.125rem` — card titles
  - Body: `1rem` / `1.125rem` (comfortable reading)
  - Small: `0.875rem` — meta, captions
  - Tiny: `0.75rem` — labels, badges
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing & Rhythm
- **Base unit**: 4px (keep Tailwind default)
- **Vertical rhythm**: 8px, 16px, 24px, 32px, 48px, 64px
- **Container widths**:
  - `container-form`: `max-w-xl` (560px) — auth, profile forms
  - `container-content`: `max-w-3xl` (768px) — reading content
  - `container-dashboard`: `max-w-7xl` (1280px) — full dashboards

### Border Radius
- **Small**: `4px` — buttons, inputs, badges
- **Medium**: `8px` — cards, dropdowns
- **Large**: `12px` — modals, primary containers
- **Full**: `9999px` — pills, avatars

### Shadow System (Subtle, Purposeful)
- **None**: default
- **Sm**: `0 1px 2px rgb(0 0 0 / 0.05)` — cards, inputs focus
- **Md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)` — dropdowns, tooltips
- **Lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)` — modals, sidebars
- **NO**: heavy shadows, colored shadows, glow effects

---

## Page Composition Recommendations

### Auth Pages (Login/Register)
```
┌─────────────────────────────────────────────────────┐
│                    Viewport                         │
│  ┌─────────────────────────────────────────────┐   │
│  │           Brand Header (64px)               │   │
│  │  [Logo] YukMagang    ← Trust signal         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │         Form Container (max-w-xl)           │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │         Value Proposition            │   │   │
│  │  │  "Find PKL that matches your skills" │   │   │
│  │  │  "Build portfolio with real cases"   │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │                                             │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │         Form Fields                  │   │   │
│  │  │  [Email]  [Password]  [Submit]       │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  │                                             │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │  Trust Signals                       │   │   │
│  │  │  "50+ companies · 500+ students"     │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Footer: Privacy · Terms · Help]                  │
└─────────────────────────────────────────────────────┘
```

**Key Changes:**
- Remove `min-h-screen centered card` pattern
- Split into: Brand header + Form container + Trust footer
- Add value proposition above form
- Add trust metrics below form
- Use warm neutral background (`stone-50`), not cool gray
- Primary button: emerald-600, slightly rounded (8px), with subtle shadow

### Student Profile Page
```
┌─────────────────────────────────────────────────────┐
│  Sticky Header (mobile) / Sidebar (desktop)         │
│  [Logo] YukMagang    [Avatar] Name ▼  [Sign out]    │
└─────────────────────────────────────────────────────┘
│                                                     │
│  <main class="container-form py-12 px-4">          │
│    <header class="mb-10">                          │
│      <h1 class="text-h1">Profile</h1>              │
│      <p class="text-body text-muted mt-2">         │
│        Keep your profile updated for better matches│
│      </p>                                          │
│    </header>                                       │
│                                                     │
│    <section class="card mb-8">                     │
│      <header class="mb-6">                         │
│        <h2 class="text-h3">Basic Information</h2>  │
│        <p class="text-small text-muted">           │
│          This helps companies find you             │
│        </p>                                        │
│      </header>                                     │
│      <Form> ... </Form>                            │
│    </section>                                      │
│                                                     │
│    <section class="card">                          │
│      <header class="mb-6">                         │
│        <h2 class="text-h3">Skills</h2>             │
│        <p class="text-small text-muted">           │
│          8/20 skills added · Add more for matches  │
│        </p>                                        │
│      </header>                                     │
│      <SkillPicker />                               │
│    </section>                                      │
│  </main>                                           │
```

**Key Changes:**
- Sticky header with brand + user avatar
- Proper section headers with description text
- Progress indicator for skills (8/20)
- Card with subtle shadow, not just border
- Primary actions use emerald, secondary use stone-200
- Skill chips use emerald-100/emerald-700
- Empty state: illustration + action button

---

## Implementation Priority

### Phase 1: Foundation (Do First)
1. Update `globals.css` with new color tokens
2. Update `tailwind.config.ts` with new theme extensions
3. Create base component primitives: `Button`, `Input`, `Card`, `Badge`

### Phase 2: Auth Pages
1. Redesign `/login` with brand header + value prop + trust signals
2. Redesign `/register` with same layout + role selector as segmented control

### Phase 3: Student Dashboard + Profile
1. Add sticky header with brand + user menu
2. Redesign profile page with proper sections, progress indicators
3. Update skill chips to use brand colors

### Phase 4: Company Pages (Parallel)
1. Company dashboard with brand header
2. Company profile page

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|------|
| `bg-gray-50` background | `bg-stone-50` warm neutral |
| Blue primary for everything | Emerald primary, semantic colors |
| `rounded-lg` everywhere | Size-appropriate radius (sm/md/lg) |
| Border-only cards | Subtle shadow + border |
| Centered card on gray | Split layout with brand header |
| Generic "Welcome back" | Value proposition + trust signals |
| Plain text empty states | Illustrated empty states + CTA |
| Raw `<select>` | Styled select component |
| Full-width buttons always | Context-appropriate width |

---

## Next Steps

1. **Update `DESIGN.md`** with new tokens and component specs
2. **Update `docs/ui-spec.md`** with new page compositions
3. **Create base UI components** in `components/ui/`
4. **Implement auth page redesign** as first real test
5. **Validate with stakeholders** before rolling to all pages

---

*This audit is the foundation for the YukMagang visual identity. The goal: make a student feel "this is for me" and a company feel "this is professional" within 3 seconds of landing.*