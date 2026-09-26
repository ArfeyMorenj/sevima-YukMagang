# YukMagang — UI Specification

## Design Goals

- **Clarity over cleverness** — Information hierarchy drives every decision
- **Speed** — Minimal clicks to core actions (apply, submit, review)
- **Trust** — Clean, professional feel; not "AI-generated dashboard"
- **Approachability** — Warm, human, welcoming — not sterile corporate
- **Accessibility** — Semantic HTML, proper contrast, keyboard navigation
- **Mobile-First** — Optimized for mobile devices, which are the primary access point for SMK students

## Design Direction

**Visual Language:** Clean, warm, purposeful — **CareerTech/EdTech startup**

- **Brand Color**: Emerald green (#059669) — growth, trust, opportunity
- **Neutrals**: Warm stone tones — approachable, not sterile
- **Accent**: Cyan (tech), Amber (energy) — semantic use only
- **No**: Gradients, glassmorphism, neon, glow, cyberpunk, decorative blobs
- **Shadows**: Subtle, purposeful (sm for cards, md for dropdowns)
- **Radius**: 4px (inputs/buttons), 8px (cards), 12px (modals)
- **Typography**: Geist Sans as primary application font, Geist Mono for technical/code content, fluid headings, 15px base body

**Brand Personality:**
> Bright, Optimistic, Trustworthy, Modern, Youthful, Professional, Approachable, Technology-Oriented

---

## Navigation

### Student Navigation (Sticky Header + Mobile Drawer)
- **Header**: Brand logo + Nav (Jobs, Applications, Portfolio, Profile) + User Menu
- **Mobile**: Hamburger → Full-screen drawer
- **User Menu**: Avatar → Name/Role → Sign Out

### Company Navigation (Sticky Header + Mobile Drawer)
- **Header**: Brand logo + Nav (Dashboard, Jobs, Create Job, Profile) + User Menu
- **Mobile**: Hamburger → Full-screen drawer

### Auth Pages (Login/Register)
- **No persistent nav** — focused composition
- **Layout**: Split two-column on desktop (brand left, form right), stacked on mobile
- **Left Column**: Brand headline, supporting copy, 3 benefits, subtle visual
- **Right Column**: Clean form with hierarchy

---

## Information Hierarchy

### Page Level
1. **Auth Layout**: Brand area + Form container
2. **App Layout**: Sticky header + main content
3. **Page Header**: Title + description + primary action
4. **Section Groups**: Section header (H2 + description) + content
5. **Content**: Forms, cards, tables, lists with clear grouping

### Card Level (JobCard, ApplicationCard, PortfolioCard)
1. **Primary Identifier**: Title, Company
2. **Key Metadata**: Location, Deadline, Match %, Status Badge
3. **Tags/Chips**: Skills, Technologies (max 3 + count)
4. **Primary Action**: Button or Link

---

## Page Specifications

### 1. Login Page (`/login`)

| Property | Value |
|----------|-------|
| **Purpose** | Authenticate existing users |
| **User** | Student, Company |
| **Primary Goal** | Login successfully |
| **Primary Action** | Submit credentials → redirect to role dashboard |
| **Secondary Actions** | Link to Register |
| **Layout** | Two-column desktop (split), stacked mobile |
| **Form Container** | `max-w-md`, clean surface, no heavy card |

**Desktop Layout (Two-Column Split):**
```
┌─────────────────────────────────────────────────────────────┐
│ LEFT (50%) — Brand Area                                     │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  YukMagang                                          │   │
│   │                                                     │   │
│   │  "Cari PKL yang sesuai skill kamu."                │   │
│   │                                                     │   │
│   │  Temukan peluang, buktikan kemampuan lewat         │   │
│   │  study case nyata, dan bangun portfolio            │   │
│   │  yang tetap bernilai.                              │   │
│   │                                                     │   │
│   │  ✓ Skill-based matching                            │   │
│   │  ✓ Real company study case                         │   │
│   │  ✓ Portfolio with company feedback                 │   │
│   │                                                     │   │
│   │  [Subtle visual: realistic study case preview card] │   │
│   └─────────────────────────────────────────────────────┘   │
│ RIGHT (50%) — Form Area                                     │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Welcome back                                       │   │
│   │  Sign in to continue                               │   │
│   │                                                     │   │
│   │  [Email input]                                     │   │
│   │  [Password input + show/hide]                      │   │
│   │                                                     │   │
│   │  [Sign in] ← Primary button, full width            │   │
│   │                                                     │   │
│   │  Don't have an account? [Create one]               │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout (Stacked):**
- Brand area condensed at top
- Form below, full width

**Form Fields:**
- Email (input, required, email type, autocomplete)
- Password (input, required, show/hide toggle, autocomplete)
- Submit Button (primary, full width, "Sign in")

**States:**
- **Empty**: Clean form
- **Loading**: Button disabled, spinner, "Signing in..."
- **Error**: Inline field errors + toast (destructive)
- **Success**: Redirect with router.refresh()

**Responsive:**
- Desktop: Two-column split (50/50), min-height 100vh
- Tablet: Stacked, centered, max-w-xl
- Mobile: Stacked, full width, px-4

---

### 2. Register Page (`/register`)

| Property | Value |
|----------|-------|
| **Purpose** | Create new account |
| **User** | Student, Company |
| **Primary Goal** | Register and auto-login |
| **Primary Action** | Submit form → create account → redirect to profile |
| **Secondary Actions** | Link to Login |
| **Layout** | Two-column desktop (split), stacked mobile |

**Desktop Layout (Two-Column Split):**
```
┌─────────────────────────────────────────────────────────────┐
│ LEFT (50%) — Brand Area (same as Login)                     │
│ RIGHT (50%) — Form Area                                     │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Create an account                                  │   │
│   │  Join YukMagang to find your perfect PKL           │   │
│   │                                                     │   │
│   │  I am a [Student] [Company]  ← Segmented control   │   │
│   │                                                     │   │
│   │  [Full Name input]                                 │   │
│   │  [Email input]                                     │   │
│   │  [Password input + strength]                       │   │
│   │  [Confirm Password input]                          │   │
│   │  [Major select] — only if Student                  │   │
│   │                                                     │   │
│   │  [Create account] ← Primary button, full width     │   │
│   │                                                     │   │
│   │  Already have an account? [Sign in]                │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Role Selector:**
- Segmented control (two equal-width buttons)
- Active state: brand background, brand foreground
- Inactive state: muted background, muted foreground
- Animated transition between states

**Form Fields:**
- Full Name (input, required)
- Email (input, required, email type)
- Password (input, required, min 8, strength indicator)
- Confirm Password (input, required, match validation)
- Major (select, required, ONLY if Student role)
  - Options: RPL, TKJ, PPLG, Other

**States:**
- **Role Switch**: Animated transition, Major field appears/disappears smoothly
- **Validation**: Inline per-field (Zod), password strength visual
- **Loading**: Button disabled, "Creating account..."
- **Error**: Field errors + toast

**Responsive:** Same as Login

---

### 3. Student Profile (`/student/profile`)

| Property | Value |
|----------|-------|
| **Purpose** | Manage profile and skills |
| **User** | Student |
| **Primary Goal** | Keep profile updated for better matching |
| **Primary Action** | "Save Changes" |
| **Layout** | `StudentLayout` with sticky header |

**Content Structure:**
```
Sticky Header
  ├─ Brand Logo
  ├─ Nav: Jobs · Applications · Portfolio · Profile
  └─ User Menu: Avatar → Name, Major → Sign Out

Main (container-form py-12 px-4 md:py-16 md:px-8)
  ├─ PageHeader
  │   ├─ H1 "Profile"
  │   └─ Subtitle: "Manage your profile and skills for better job matching"
  │
  ├─ FormSection: "Basic Information"
  │   ├─ Description: "This helps companies find you"
  │   ├─ Full Name (input, required)
  │   ├─ Major (Select: RPL/TKJ/PPLG/OTHER, required)
  │   ├─ Bio (textarea, max 500, char counter)
  │   └─ Save Button (primary)
  │
  └─ FormSection: "Skills"
      ├─ Description: "8/20 skills added · Add more for better matches"
      ├─ SkillPicker
      │   ├─ Search Input (filters available skills)
      │   ├─ Categorized Dropdown (checkbox multi-select)
      │   └─ Selected as Chips (removable)
      └─ Current Skills (chips with remove button)
          └─ Chip: bg-brand-100 text-brand-700 border-brand-200
```

**SkillPicker Behavior:**
- Search input filters available skills in real-time
- Skills grouped by category in dropdown
- Checkbox multi-select for bulk adding
- Selected skills appear as removable chips above
- Chip: `bg-brand-100 text-brand-700 border-brand-200` with remove button

**Current Skills Display:**
- Flex wrap gap-2
- Each skill as pill with remove button
- Hover: slight background change
- Focus: visible ring

**States:**
- **Saving**: Button loading, disabled
- **Saved**: Toast success, revalidate
- **Error**: Toast error + inline field errors
- **Skill Search**: Debounced, categorized results
- **Empty Skills**: "No skills added yet. Add skills from the picker above."

**Responsive:**
- Mobile: Stack sections, full-width form, chips wrap
- Desktop: Same, max-w-xl centered

---

## Loading States

| Level | Pattern |
|-------|---------|
| **Page** | Skeleton matching final layout (shimmer `base-200` → `base-100`) |
| **Button** | Disabled + `Spinner sm` + "Saving..." |
| **List/Grid** | 3-5 Skeleton cards |
| **Form** | Disabled inputs, no skeleton |
| **Never** | Full-page spinner blocking navigation |

---

## Empty States

| Page | Illustration | Message | Action |
|------|--------------|---------|--------|
| Jobs | 📭 | "No PKL opportunities match your profile yet" | "Complete your profile" → `/student/profile` |
| Applications | 📄 | "You haven't applied to any positions" | "Find opportunities" → `/student/jobs` |
| Portfolio | 🎨 | "Your portfolio will appear here after company reviews" | "Apply to jobs" → `/student/jobs` |
| Company Jobs | 🏢 | "You haven't posted any PKL opportunities" | "Create your first job" → `/company/jobs/create` |
| Applicants | 👥 | "No applications yet for this position" | — |
| Skills (Profile) | 🏷️ | "No skills added yet" | "Add skills" (scroll to picker) |

---

## Error States

- **Field Validation**: Inline below input (red text, `text-destructive`), `aria-describedby`
- **Form Submit**: Toast (destructive) + preserve input
- **Server Error**: Toast "Something went wrong. Please try again."
- **Not Found**: 404 page with illustration + "Back to Dashboard"
- **Unauthorized**: Redirect to `/login?callbackUrl=...`
- **Forbidden**: Toast "You don't have permission" + redirect

---

## Responsive Behavior

- **Mobile (< 640px)**: Single column, stacked sections, sticky CTA bottom
- **Tablet (640-1024px)**: Two-column grids, side-by-side forms
- **Desktop (> 1024px)**: Full layout, max-width containers
- **Breakpoints**: Tailwind defaults (sm, md, lg, xl)

---

## Component List (Reusable) — For This Phase

### Base UI (`components/ui/`)
1. **Button** — primary, secondary, outline, ghost, destructive, success, loading, disabled
2. **Input** — text, email, password, url, with label + error + hint
3. **Textarea** — with label, error, hint, char counter
4. **Select** — single, searchable
5. **RadioGroup** — default, card variant (for role selector)
6. **Label** — required indicator
7. **Card** — default, bordered
8. **Badge** — default, success, warning, destructive, outline, brand
9. **Avatar** — sm, md, lg, fallback initials
10. **Spinner** — sm, md, lg
11. **Separator** — horizontal, vertical
12. **FormField** — label + input + error + hint wrapper
13. **FormSection** — header (title + description) + content
14. **PageHeader** — title + description + actions
15. **AuthLayout** — two-column split layout
15. **StudentLayout** — sticky header + content
16. **SkillChip** — removable, category color
17. **StatusBadge** — PENDING/REVIEWED/ACCEPTED/REJECTED
18. **PageHeader** — title + description + actions
19. **SectionHeader** — H2/H3 + description + secondary action

### Domain Components
- `SkillChip` — removable skill tag with category color
- `SkillPicker` — searchable multi-select with chips

---

## Accessibility Checklist

- [ ] All inputs have associated `<label>` (via `FormField`)
- [ ] Error messages linked with `aria-describedby`
- [ ] Focus visible: `focus-visible:ring-2 focus-visible:ring-ring`
- [ ] Color contrast ≥ 4.5:1 (text), 3:1 (UI)
- [ ] Keyboard: Tab, Enter, Escape, Arrow keys
- [ ] ARIA labels on icon-only buttons
- [ ] Live regions: `aria-live="polite"` for toasts
- [ ] Heading hierarchy: h1 → h2 → h3
- [ ] Skip to main content link

---

## Implementation Notes

### CSS Variables in globals.css
All tokens defined as HSL for Tailwind v4 `@theme inline` compatibility.

### Migration Path
1. Update `globals.css` with new tokens
2. Create base components in `components/ui/`
3. Redesign `/login` and `/register` first (highest impact)
4. Redesign `/student/profile` with new `FormSection` + `SkillPicker`
5. Validate with `npm run lint && npx tsc --noEmit && npm run build`