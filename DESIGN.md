# YukMagang — DESIGN.md

## Design Tokens

### Colors (CSS Variables)
```css
:root {
  /* Brand — Emerald Green (Growth, Career, Trust) */
  --brand-50: 148 100% 97%;   /* #ecfdf5 */
  --brand-100: 151 81% 83%;   /* #d1fae5 */
  --brand-200: 151 69% 67%;   /* #a7f3d0 */
  --brand-300: 150 60% 52%;   /* #6ee7b7 */
  --brand-400: 150 57% 42%;   /* #34d399 */
  --brand-500: 151 58% 36%;   /* #10b981 */
  --brand-600: 153 63% 31%;   /* #059669 */
  --brand-700: 153 66% 24%;   /* #047857 */
  --brand-800: 152 64% 19%;   /* #065f46 */
  --brand-900: 153 61% 16%;   /* #064e3b */

  /* Secondary — Soft Cyan (Tech, Modernity) — Use Sparingly */
  --cyan-50: 192 100% 96%;    /* #ecfeff */
  --cyan-100: 191 93% 87%;    /* #cffafe */
  --cyan-500: 189 94% 43%;    /* #06b6d4 */
  --cyan-600: 191 91% 35%;    /* #0891b2 */

  /* Accent — Soft Amber (Energy, Attention) — Use Sparingly */
  --amber-50: 48 100% 96%;    /* #fffbeb */
  --amber-100: 46 92% 90%;    /* #fef3c7 */
  --amber-500: 38 92% 50%;    /* #f59e0b */
  --amber-600: 35 92% 42%;    /* #d97706 */

  /* Base — Warm White / Very Light Neutral */
  --base-50: 30 33% 98%;      /* #fafaf9 */
  --base-100: 30 23% 96%;     /* #f5f5f4 */
  --base-200: 30 14% 90%;     /* #e7e5e4 */
  --base-300: 30 10% 81%;     /* #d6d3d1 */
  --base-400: 28 8% 64%;      /* #a8a29e */
  --base-500: 25 7% 50%;      /* #78716c */
  --base-600: 25 8% 39%;      /* #57534e */
  --base-700: 25 10% 28%;     /* #44403c */
  --base-800: 25 12% 19%;     /* #292524 */
  --base-900: 25 15% 11%;     /* #1c1917 */
  --base-950: 26 20% 6%;      /* #0c0a09 */

  /* Semantic Aliases (Use These in Components) */
  --background: var(--base-50);
  --foreground: var(--base-900);
  --muted: var(--base-100);
  --muted-foreground: var(--base-500);
  --border: var(--base-200);
  --input: var(--base-200);
  --ring: var(--brand-500);

  --primary: var(--brand-600);
  --primary-foreground: 0 0% 100%;
  --primary-hover: var(--brand-700);
  --primary-light: var(--brand-100);

  --secondary: var(--cyan-600);
  --secondary-foreground: 0 0% 100%;
  --secondary-light: var(--cyan-100);

  --accent: var(--amber-500);
  --accent-foreground: var(--base-900);
  --accent-light: var(--amber-100);

  --success: var(--brand-600);
  --success-foreground: 0 0% 100%;
  --success-light: var(--brand-100);

  --warning: var(--amber-500);
  --warning-foreground: var(--base-900);
  --warning-light: var(--amber-100);

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --destructive-light: 0 93% 94%;

  --card: 0 0% 100%;
  --card-foreground: var(--base-900);
  --card-border: var(--base-200);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows — Subtle, Purposeful */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Dark Mode (Optional — P1)
```css
.dark {
  --background: var(--base-950);
  --foreground: var(--base-50);
  --muted: var(--base-800);
  --muted-foreground: var(--base-400);
  --border: var(--base-700);
  --input: var(--base-700);
  --ring: var(--brand-400);

  --primary: var(--brand-500);
  --primary-hover: var(--brand-400);
  --primary-light: var(--brand-900);

  --secondary: var(--cyan-500);
  --secondary-light: var(--cyan-900);

  --accent: var(--amber-400);
  --accent-light: var(--amber-900);

  --success: var(--brand-500);
  --success-light: var(--brand-900);

  --warning: var(--amber-400);
  --warning-light: var(--amber-900).

  --destructive: 0 72% 51%;
  --destructive-light: 0 62% 15%.

  --card: var(--base-900);
  --card-foreground: var(--base-50);
  --card-border: var(--base-700);
}
```

### Typography Scale
```css
/* Display — Marketing, Hero */
.text-display { 
  @apply font-semibold tracking-tight; 
  font-size: clamp(2rem, 1.5rem + 2vw, 3rem); 
  line-height: 1.1; 
}

/* H1 — Page Titles */
.text-h1 { 
  @apply font-semibold tracking-tight; 
  font-size: clamp(1.75rem, 1.5rem + 1vw, 2.25rem); 
  line-height: 1.2; 
}

/* H2 — Section Titles */
.text-h2 { 
  @apply font-semibold tracking-tight; 
  font-size: clamp(1.375rem, 1.25rem + 0.5vw, 1.75rem); 
  line-height: 1.3; 
}

/* H3 — Card Titles, Subsections */
.text-h3 { 
  @apply font-semibold; 
  font-size: 1.125rem; 
  line-height: 1.4; 
}

/* Body Large — Comfortable Reading */
.text-body-lg { 
  @apply font-normal; 
  font-size: 1.125rem; 
  line-height: 1.7; 
}

/* Body — Default */
.text-body { 
  @apply font-normal; 
  font-size: 1rem; 
  line-height: 1.6; 
}

/* Small — Meta, Secondary Text */
.text-small { 
  @apply font-normal; 
  font-size: 0.875rem; 
  line-height: 1.5; 
}

/* Caption — Labels, Helper Text */
.text-caption { 
  @apply font-medium; 
  font-size: 0.75rem; 
  line-height: 1.5; 
  color: hsl(var(--muted-foreground)); 
}

/* Tiny — Badges, Tiny Labels */
.text-tiny { 
  @apply font-medium; 
  font-size: 0.6875rem; 
  line-height: 1.4; 
}

/* Font Families — Geist Sans primary, Geist Mono technical */
.font-sans { font-family: var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.font-mono { font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
```

### Spacing System (4px Base)
```css
/* Vertical Rhythm — Use These Consistently */
.space-1 { @apply space-y-1; }   /* 4px  — tight */
.space-2 { @apply space-y-2; }   /* 8px  — form fields */
.space-3 { @apply space-y-3; }   /* 12px — tight groups */
.space-4 { @apply space-y-4; }   /* 16px — standard */
.space-5 { @apply space-y-5; }   /* 20px — relaxed */
.space-6 { @apply space-y-6; }   /* 24px — sections */
.space-8 { @apply space-y-8; }   /* 32px — major sections */
.space-10 { @apply space-y-10; } /* 40px — page sections */
.space-12 { @apply space-y-12; } /* 48px — large gaps */
.space-16 { @apply space-y-16; } /* 64px — hero gaps */

/* Container Widths */
.container-form { @apply max-w-xl mx-auto; }      /* 560px — auth, profile forms */
.container-content { @apply max-w-3xl mx-auto; }  /* 768px — reading content */
.container-dashboard { @apply max-w-7xl mx-auto; } /* 1280px — full dashboards */
```

---

## Component Principles

1. **Semantic Color Use** — Never use `primary` for everything. Use `success` for positive actions, `destructive` for dangerous, `secondary` for alternatives.
2. **Warm Neutrals** — Backgrounds use `base-50`, borders use `base-200`. Avoid cool grays.
3. **Purposeful Shadows** — Cards: `shadow-sm`. Dropdowns/Modals: `shadow-md`. No heavy shadows.
4. **Consistent Radius** — Inputs/Buttons: `radius-sm` (4px). Cards: `radius-md` (8px). Modals: `radius-lg` (12px).
5. **Fluid Typography** — Use `clamp()` for headings. Body stays at 1rem/1.125rem.
6. **Accessible by Default** — Focus rings use `--ring` (brand-500). Contrast ≥ 4.5:1.
7. **Mobile-First** — All components work at 375px. Desktop enhances, doesn't redesign.

---

## Reusable Component List

### Base UI Components (`components/ui/`)

| Component | Variants | Key Specs |
|-----------|----------|-----------|
| `Button` | `primary`, `secondary`, `outline`, `ghost`, `destructive`, `success` | `radius-sm`, `shadow-sm` on primary, `h-10 px-4`, loading state |
| `Input` | `default`, `error`, `success` | `h-10 px-3`, `radius-sm`, focus ring `--ring` |
| `Textarea` | `default`, `error` | `min-h-[100px]`, `resize-y`, `radius-sm` |
| `Select` | `default`, `error`, `searchable` | Styled, not native; keyboard nav |
| `Checkbox` | `default`, `indeterminate` | `w-4 h-4`, `radius-sm`, brand check |
| `Radio` / `RadioGroup` | `default`, `card` | Card variant for role selector |
| `Switch` | `default` | `w-10 h-6`, brand thumb |
| `Label` | `default`, `required` | `text-sm font-medium` |
| `Card` | `default`, `interactive`, `bordered` | `radius-md`, `shadow-sm`, `border-base-200` |
| `Badge` | `default`, `success`, `warning`, `destructive`, `outline`, `brand` | `radius-full`, `text-tiny` |
| `Avatar` | `sm` (32px), `md` (40px), `lg` (56px) | Fallback: initials in brand-100 |
| `Dropdown` / `Popover` | `default` | `shadow-md`, `radius-md`, portal |
| `Tooltip` | `default` | `text-tiny`, `shadow-md` |
| `Separator` | `horizontal`, `vertical` | `border-base-200` |
| `Skeleton` | `text`, `circular`, `rectangular` | `base-200` → `base-100` pulse |
| `Spinner` | `sm`, `md`, `lg` | Brand color, accessible |

### Form-Specific Components (`components/forms/`)

| Component | Purpose |
|-----------|---------|
| `FormField` | Label + Input + Error + Hint wrapper |
| `FormSection` | Section header (title + description) + content |
| `SkillPicker` | Searchable multi-select with chips |
| `SkillChip` | Removable skill tag with category color |
| `ProfileHeader` | Avatar + name + role badge + actions |

### Layout Components (`components/layout/`)

| Component | Purpose |
|-----------|---------|
| `AuthLayout` | Brand header + form container + trust footer |
| `StudentLayout` | Sticky header + sidebar (desktop) / drawer (mobile) |
| `CompanyLayout` | Sticky header + sidebar (desktop) / drawer (mobile) |
| `PageHeader` | Title + description + primary action |
| `SectionHeader` | H2/H3 + description + secondary action |

### Domain Components (`components/[domain]/`)

| Component | Location | Purpose |
|-----------|----------|---------|
| `JobCard` | `components/job/` | Job preview: logo, title, match badge, chips, deadline |
| `JobDetailTabs` | `components/job/` | Overview / Study Case / Requirements |
| `StatusBadge` | `components/ui/` | PENDING/REVIEWED/ACCEPTED/REJECTED with semantic colors |
| `ApplicationTimeline` | `components/application/` | Visual status steps |
| `SubmissionForm` | `components/application/` | Repo URL, Deployed URL, Explanation |
| `ReviewForm` | `components/company/` | Score (0-100), Feedback, Accept/Reject |
| `PortfolioCard` | `components/portfolio/` | Title, company, tech chips, score, result badge |
| `ApplicantTable` | `components/company/` | Student list with match %, status, actions |

---

## Layout Structure

### Auth Layout (Login/Register)
```tsx
<AuthLayout>
  <AuthLayout.Header>
    <BrandLogo />
  </AuthLayout.Header>
  <AuthLayout.FormContainer>
    <ValueProp />
    <Form />
    <ProductBenefits />
  </AuthLayout.FormContainer>
  <AuthLayout.Footer>
    <Links />
  </AuthLayout.Footer>
</AuthLayout>
```

### Student Layout
```tsx
<StudentLayout>
  <StudentLayout.Header sticky>
    <BrandLogo />
    <NavDesktop />           {/* hidden mobile */}
    <UserMenu />
    <MobileMenuButton />    {/* visible mobile */}
  </StudentLayout.Header>
  <StudentLayout.MobileDrawer />
  <main className="container-dashboard py-8 px-4 md:py-12 md:px-8">
    {children}
  </main>
</StudentLayout>
```

### Company Layout
```tsx
<CompanyLayout>
  <CompanyLayout.Header sticky>
    <BrandLogo />
    <NavDesktop />
    <UserMenu />
    <MobileMenuButton />
  </CompanyLayout.Header>
  <CompanyLayout.MobileDrawer />
  <main className="container-dashboard py-8 px-4 md:py-12 md:px-8">
    {children}
  </main>
</CompanyLayout>
```

---

## Page Component Map (Updated)

| Route | Page Component | Layout | Key Components |
|-------|---------------|--------|----------------|
| `/login` | `app/login/page.tsx` | `AuthLayout` | `Button`, `Input`, `ValueProp`, `ProductBenefits` |
| `/register` | `app/register/page.tsx` | `AuthLayout` | `Button`, `Input`, `RadioGroup` (card), `ValueProp`, `ProductBenefits` |
| `/student` | `app/student/page.tsx` | `StudentLayout` | `PageHeader`, `JobCard`×3, `StatCards` |
| `/student/profile` | `app/student/profile/page.tsx` | `StudentLayout` | `FormSection`, `Input`, `Select`, `SkillPicker`, `SkillChip` |
| `/student/jobs` | `app/student/jobs/page.tsx` | `StudentLayout` | `JobCard` grid |
| `/student/jobs/[id]` | `app/student/jobs/[id]/page.tsx` | `StudentLayout` | `JobDetailTabs`, `Button` |
| `/student/applications` | `app/student/applications/page.tsx` | `StudentLayout` | `ApplicationCard` list |
| `/student/applications/[id]` | `app/student/applications/[id]/page.tsx` | `StudentLayout` | `ApplicationTimeline`, `SubmissionForm`, `ReviewResult` |
| `/student/portfolio` | `app/student/portfolio/page.tsx` | `StudentLayout` | `PortfolioCard` grid |
| `/company` | `app/company/page.tsx` | `CompanyLayout` | `StatCards`, `ApplicantTable` |
| `/company/profile` | `app/company/profile/page.tsx` | `CompanyLayout` | `FormSection`, `Input`, `Textarea` |
| `/company/jobs` | `app/company/jobs/page.tsx` | `CompanyLayout` | `JobTable` |
| `/company/jobs/create` | `app/company/jobs/create/page.tsx` | `CompanyLayout` | `JobForm`, `StudyCaseForm` |
| `/company/jobs/[id]/applicants` | `app/company/jobs/[id]/applicants/page.tsx` | `CompanyLayout` | `ApplicantTable` |
| `/company/applications/[id]/review` | `app/company/applications/[id]/review/page.tsx` | `CompanyLayout` | `ReviewForm`, `SubmissionDisplay` |

---

## Interaction Patterns

### Form Submission (Server Action)
```tsx
// Server Component passes action to Client Component
<form action={submitAction}>
  <FormField label="Email" name="email" type="email" required />
  <Button type="submit">Save</Button>
</form>

// Client Component with useTransition (for optimistic UI)
'use client'
export function Form({ action }: { action: (data: FormData) => Promise<void> }) {
  const [pending, startTransition] = useTransition()
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      startTransition(() => action(new FormData(e.currentTarget)))
    }}>
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
```

### Data Fetching (Server Component)
```tsx
export default async function Page() {
  const data = await getData()
  return <ClientComponent data={data} />
}
```

---

## Accessibility Checklist

- [ ] All inputs have associated `<label>` (use `FormField`)
- [ ] Error messages linked with `aria-describedby`
- [ ] Focus visible on all interactive elements (`focus-visible:ring-2`)
- [ ] Color contrast ≥ 4.5:1 (text), 3:1 (UI)
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
- [ ] ARIA labels on icon-only buttons
- [ ] Live regions for toast notifications (`aria-live="polite"`)
- [ ] Semantic heading hierarchy (h1 → h2 → h3)
- [ ] Focus trap in modals/drawers
- [ ] Skip to main content link

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | 2-col grids, side-by-side forms |
| `md` | 768px | Sidebar visible, tablet layout |
| `lg` | 1024px | Full dashboard layout |
| `xl` | 1280px | Max container width |

---

## Animation Policy

**Allowed:**
- `transition-colors` (150ms)
- `transition-opacity` (150ms)
- `transition-shadow` (150ms)
- `transform-gpu` for drawer slide
- Skeleton pulse (CSS keyframes, 1.5s)

**Not Allowed:**
- Framer Motion, React Spring
- Page transitions
- Hover animations beyond color/opacity/shadow
- Staggered list animations
- Parallax, scroll animations
- Decorative motion

---

## Icon Usage

- **Lucide React** (install if needed) — only for semantic meaning
- **No decorative icons** — every icon must have purpose
- **SVG inlined** — no icon font
- **Size:** `w-4 h-4` (inline), `w-5 h-5` (standalone), `w-6 h-6` (header actions)
- **Color:** `currentColor` (inherits text color)

---

## Form Validation

**Client-side:** HTML5 attributes (`required`, `minLength`, `type="email"`, `pattern`)

**Server-side:** Every Server Action validates with Zod:
```typescript
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const result = schema.safeParse(input)
if (!result.success) {
  const issue = result.error.issues[0]
  return { error: issue.message, field: issue.path[0] }
}
```

**Display:** Inline below input (`FormField` handles) + toast on submit failure