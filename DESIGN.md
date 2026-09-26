# YukMagang — DESIGN.md

## Design Tokens

### Colors (CSS Variables)
```css
:root {
  /* Base */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  
  /* Muted */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  
  /* Borders */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  
  /* Primary */
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
  --primary-hover: 221 83% 48%;
  
  /* Status */
  --success: 142 76% 36%;
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;
  --warning-foreground: 222 47% 11%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  
  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  
  /* Radius */
  --radius: 6px;
}
```

### Dark Mode (Optional — P1)
```css
.dark {
  --background: 222 47% 8%;
  --foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --primary: 217 91% 60%;
  --card: 222 47% 11%;
}
```

### Typography Scale
```css
/* Page Title */
.text-page-title { @apply text-2xl font-semibold tracking-tight; }

/* Section Title */
.text-section-title { @apply text-lg font-medium; }

/* Body */
.text-body { @apply text-base leading-relaxed; }

/* Caption */
.text-caption { @apply text-sm text-muted-foreground; }

/* Small */
.text-small { @apply text-xs text-muted-foreground; }
```

### Spacing System (4px base)
```css
.space-1 { @apply space-y-1; }   /* 4px */
.space-2 { @apply space-y-2; }   /* 8px */
.space-3 { @apply space-y-3; }   /* 12px */
.space-4 { @apply space-y-4; }   /* 16px */
.space-6 { @apply space-y-6; }   /* 24px */
.space-8 { @apply space-y-8; }   /* 32px */
```

### Container Widths
```css
.container-narrow { @apply max-w-2xl mx-auto; }   /* 672px — forms */
.container-wide { @apply max-w-6xl mx-auto; }     /* 1152px — dashboards */
.container-full { @apply max-w-full mx-auto; }
```

---

## Component Principles

1. **Composable** — Small, single-purpose components
2. **Unstyled logic** — Logic separated from presentation where possible
3. **Accessible** — Semantic HTML, ARIA labels, keyboard navigation
4. **Typed** — TypeScript interfaces for all props
5. **Server-first** — Server Components by default, Client only when needed

---

## Reusable Component List

### Base UI Components (`components/ui/`)

| Component | Props | Variants |
|-----------|-------|----------|
| `Button` | `children`, `type`, `disabled`, `onClick` | `primary`, `secondary`, `ghost`, `destructive`, `outline` |
| `Input` | `name`, `label`, `type`, `value`, `onChange`, `error`, `required` | `text`, `email`, `password`, `url` |
| `Textarea` | `name`, `label`, `value`, `onChange`, `error`, `required`, `minLength` | — |
| `Select` | `name`, `label`, `options`, `value`, `onChange`, `error`, `multiple` | Single, Multi-select |
| `Badge` | `children`, `variant` | `default`, `success`, `warning`, `destructive`, `outline` |
| `Card` | `children`, `className`, `padding` | Default, Interactive (hover) |
| `Avatar` | `src`, `alt`, `fallback` (initials) | `sm`, `md`, `lg` |
| `Tabs` | `tabs`, `activeTab`, `onChange` | — |
| `Table` | `columns`, `data`, `keyField`, `onRowClick` | Responsive (cards on mobile) |
| `Dialog` | `open`, `onClose`, `title`, `children`, `actions` | — |
| `Toast` | `type`, `message`, `duration` | `success`, `error`, `info` |
| `Timeline` | `steps[]` (label, date, status, current) | Vertical |
| `Breadcrumb` | `items[]` (label, href) | — |
| `EmptyState` | `icon`, `title`, `description`, `action` | — |

### Domain Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `JobCard` | `components/job/JobCard.tsx` | Job preview with match badge, skills, deadline |
| `JobDetailTabs` | `components/job/JobDetailTabs.tsx` | Overview / Study Case / Requirements tabs |
| `SkillChip` | `components/ui/SkillChip.tsx` | Skill tag with category color, removable |
| `StatusBadge` | `components/ui/StatusBadge.tsx` | PENDING/REVIEWED/ACCEPTED/REJECTED with colors |
| `ApplicationTimeline` | `components/application/ApplicationTimeline.tsx` | Visual status progression |
| `SubmissionForm` | `components/application/SubmissionForm.tsx` | Repo URL, Deployed URL, Explanation |
| `ReviewForm` | `components/company/ReviewForm.tsx` | Score slider, Feedback textarea, Accept/Reject radio |
| `PortfolioCard` | `components/portfolio/PortfolioCard.tsx` | Study case title, company, tech chips, score, result |
| `ApplicantTable` | `components/company/ApplicantTable.tsx` | Student list with match %, status, actions |
| `CompanyNav` | `components/layout/CompanyNav.tsx` | Company sidebar/header navigation |
| `StudentNav` | `components/layout/StudentNav.tsx` | Student sidebar/header navigation |

---

## Layout Structure

### Student Layout
```
<StudentLayout>
  <StudentNav />           {/* Sidebar on desktop, drawer on mobile */}
  <main className="container-wide p-4 md:p-6">
    {children}
  </main>
</StudentLayout>
```

### Company Layout
```
<CompanyLayout>
  <CompanyNav />
  <main className="container-wide p-4 md:p-6">
    {children}
  </main>
</CompanyLayout>
```

### Auth Layout (Login/Register)
```
<div className="min-h-screen flex items-center justify-center bg-muted p-4">
  <Card className="w-full max-w-md p-6">
    {children}
  </Card>
</div>
```

---

## Page Component Map

| Route | Page Component | Layout | Key Components |
|-------|---------------|--------|----------------|
| `/login` | `app/login/page.tsx` | Auth | Button, Input |
| `/register` | `app/register/page.tsx` | Auth | Button, Input, Select (role) |
| `/student` | `app/student/page.tsx` | Student | JobCard (×3), Stat cards |
| `/student/profile` | `app/student/profile/page.tsx` | Student | Input, Textarea, Select, SkillChip |
| `/student/jobs` | `app/student/jobs/page.tsx` | Student | JobCard grid |
| `/student/jobs/[id]` | `app/student/jobs/[id]/page.tsx` | Student | JobDetailTabs, Button |
| `/student/applications` | `app/student/applications/page.tsx` | Student | ApplicationCard list |
| `/student/applications/[id]` | `app/student/applications/[id]/page.tsx` | Student | ApplicationTimeline, SubmissionForm, ReviewResult |
| `/student/portfolio` | `app/student/portfolio/page.tsx` | Student | PortfolioCard grid |
| `/company` | `app/company/page.tsx` | Company | Stat cards, ApplicantTable (top 5) |
| `/company/profile` | `app/company/profile/page.tsx` | Company | Input, Textarea |
| `/company/jobs` | `app/company/jobs/page.tsx` | Company | ApplicantTable (jobs) |
| `/company/jobs/create` | `app/company/jobs/create/page.tsx` | Company | JobForm, StudyCaseForm |
| `/company/jobs/[id]/applicants` | `app/company/jobs/[id]/applicants/page.tsx` | Company | ApplicantTable |
| `/company/applications/[id]/review` | `app/company/applications/[id]/review/page.tsx` | Company | ReviewForm, SubmissionDisplay |

---

## Interaction Patterns

### Form Submission (Server Action)
```tsx
// Server Component passes action to Client Component
<form action={submitAction}>
  <Input name="field" />
  <Button type="submit">Submit</Button>
</form>

// Client Component with useTransition
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
// Page fetches data, passes to client components
export default async function Page() {
  const data = await getData() // Server Action or direct Prisma
  return <ClientComponent data={data} />
}
```

### Conditional Rendering by Role
```tsx
// Middleware ensures role, but double-check in components
{session.role === 'STUDENT' && <StudentOnlyComponent />}
{session.role === 'COMPANY' && <CompanyOnlyComponent />}
```

---

## Accessibility Checklist

- [ ] All inputs have associated `<label>`
- [ ] Error messages linked with `aria-describedby`
- [ ] Focus visible on all interactive elements
- [ ] Color contrast ≥ 4.5:1 (text), 3:1 (UI)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels on icon-only buttons
- [ ] Live regions for toast notifications
- [ ] Semantic heading hierarchy (h1 → h2 → h3)

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | 2-col grids, side-by-side forms |
| `md` | 768px | Sidebar visible, 3-col grids |
| `lg` | 1024px | Full dashboard layout |
| `xl` | 1280px | Max container width |

---

## Animation Policy

**Allowed:**
- CSS transitions: `transition-colors`, `transition-opacity` (150ms)
- Loading shimmer (CSS keyframes)

**Not Allowed:**
- Framer Motion, React Spring
- Page transitions
- Hover animations beyond color/opacity
- Staggered list animations

---

## Icon Usage

- **Lucide React** (if added) — only for semantic meaning
- **No decorative icons** — every icon must have purpose
- **SVG inlined** — no icon font
- **Size:** `w-4 h-4` (inline), `w-5 h-5` (standalone)

---

## Form Validation

**Client-side:** HTML5 attributes (`required`, `minLength`, `type="email"`, `type="url"`)

**Server-side:** Every Server Action validates:
```typescript
if (!input.email || !input.email.includes('@')) {
  return { error: 'VALIDATION_ERROR', field: 'email', message: 'Invalid email' }
}
```

**Display:** Inline below input + toast on submit failure