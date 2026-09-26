<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — YukMagang Coding Agent Instructions

## Purpose
This file instructs AI coding agents on how to work on the YukMagang hackathon MVP. Follow these rules strictly.

---

## Before Every Implementation Task

1. **Read the active task** in `docs/tasks.md` — find the `[P0]` task currently in progress
2. **Read the Definition of Done** for that task
3. **Read relevant documentation:**
   - `docs/prd.md` — product requirements
   - `docs/design.md` — technical design, database model, API
   - `docs/ui-spec.md` — page specs, components, states
   - `docs/api.md` — Server Action signatures, Route Handlers
   - `DESIGN.md` — design tokens, component list
4. **Inspect existing code** in the repository to understand patterns
5. **State your implementation approach** before writing code

---

## Core Rules

### Scope Discipline
- **Work ONLY on the active P0 task** — do not start the next task
- **Do NOT add features not in the current task's Definition of Done**
- **Do NOT refactor unrelated code** — only touch files needed for the task
- **If you discover missing prerequisites**, stop and report — do not implement them

### Minimal Changes
- Make the **smallest change required** to satisfy the Definition of Done
- Prefer editing existing files over creating new ones
- Reuse existing patterns, components, utilities
- Avoid introducing new dependencies (see Dependency Rule)

### Design Preservation
- **Preserve the approved design** from `docs/ui-spec.md` and `DESIGN.md`
- Use design tokens (CSS variables) — no hardcoded colors/spacing
- Use components from the approved component list
- Do not create new component abstractions without approval

### Implementation Quality
- **TypeScript strict mode** — no `any`, proper types
- **Server-side validation** — never trust client input
- **Authorization in every Server Action** — check role + ownership
- **Error handling** — try/catch, return structured errors
- **Revalidation** — call `revalidatePath` after mutations

### Testing & Validation
- **Validate against acceptance criteria** in `docs/prd.md`
- **Test the happy path manually** after implementation
- **Check edge cases** from UI spec (empty, loading, error states)
- **Run `npm run lint`** and `npm run build` before reporting done

---

## Dependency Rule

**Before installing ANY package:**
1. Check if Next.js, React, TypeScript, Tailwind, or Prisma can solve it
2. Check `package.json` for existing similar packages
3. If truly needed, propose with justification — do not install silently

**Approved for MVP:**
- `bcryptjs` (password hashing)
- `iron-session` or `jose` (session management)
- `zod` (validation schemas) — if not using manual validation

**Explicitly NOT approved without discussion:**
- UI component libraries (shadcn, Radix, MUI, etc.)
- State management (Zustand, Redux, etc.)
- Form libraries (React Hook Form, etc.) — use native forms + Server Actions
- Date libraries (date-fns, dayjs) — use native Date/Intl
- Animation libraries (Framer Motion, etc.)

---

## File Organization Patterns

### Server Actions
```
app/actions/
  auth.ts          # register, login, logout
  student/
    profile.ts     # updateProfile, addSkill, removeSkill
    application.ts # apply, submitStudyCase
  company/
    profile.ts     # updateCompanyProfile
    job.ts         # createJob, updateJob, deleteJob
    review.ts      # reviewApplication
  matching.ts      # calculateMatch (pure function)
```

### Route Handlers
```
app/api/
  skills/route.ts
  jobs/route.ts
  jobs/[id]/route.ts
  student/
    applications/route.ts
    applications/[id]/route.ts
    portfolio/route.ts
  company/
    jobs/route.ts
    jobs/[id]/applicants/route.ts
    applications/[id]/route.ts
```

### Components
```
components/
  ui/              # Base components (Button, Input, Badge, Card, etc.)
  forms/           # Form-specific (JobForm, StudyCaseForm, etc.)
  layout/          # Navigation, Sidebar, Header
  job/             # JobCard, JobDetailTabs
  application/     # ApplicationTimeline, SubmissionForm
  portfolio/       # PortfolioCard
  company/         # ApplicantTable, ReviewForm
```

### Lib
```
lib/
  auth.ts          # hashPassword, verifyPassword, session helpers
  session.ts       # getSession, createSession, destroySession
  prisma.ts        # Prisma client singleton
  matching.ts      # calculateMatch, mapJobMajor
  utils.ts         # cn(), formatDate, etc.
```

---

## Authorization Pattern (Mandatory)

```typescript
// Every Server Action MUST start with:
export async function someAction(input: InputType) {
  const session = await getSession()
  
  // 1. Authentication
  if (!session) {
    return { error: 'UNAUTHORIZED', message: 'Please log in' }
  }
  
  // 2. Role authorization
  if (session.role !== 'EXPECTED_ROLE') {
    return { error: 'FORBIDDEN', message: 'Insufficient permissions' }
  }
  
  // 3. Ownership authorization (if resource-specific)
  const resource = await prisma.resource.findUnique({
    where: { id: input.resourceId }
  })
  if (!resource || resource.ownerId !== session.userId) {
    return { error: 'FORBIDDEN', message: 'Not your resource' }
  }
  
  // 4. Business logic...
}
```

---

## Database Access Pattern

- Use `prisma` from `lib/prisma.ts` (singleton)
- Use transactions for multi-model operations:
```typescript
await prisma.$transaction(async (tx) => {
  const job = await tx.job.create({ data: {...} })
  await tx.jobSkill.createMany({ data: skillIds.map(...) })
  await tx.studyCase.create({ data: {...}, jobId: job.id })
})
```
- Select only needed fields (avoid `select: *`)
- Use `include` for relations, not separate queries

---

## UI Implementation Pattern

### Page Structure
```tsx
// app/student/jobs/page.tsx
import { JobGrid } from '@/components/job/JobGrid'
import { getJobsWithMatch } from '@/app/actions/student/jobs'

export default async function JobsPage() {
  const { jobs } = await getJobsWithMatch()
  return <JobGrid jobs={jobs} />
}
```

### Client Components (Minimal)
- Only for interactivity: forms, dropdowns, modals, tabs
- Mark with `'use client'`
- Pass data as props from Server Components
- Call Server Actions via form `action` or `startTransition`

### Forms
```tsx
'use client'
import { submitStudyCase } from '@/app/actions/student/application'

export function SubmissionForm({ applicationId }: { applicationId: string }) {
  return (
    <form action={async (formData) => {
      'use server'
      await submitStudyCase(applicationId, {
        repoUrl: formData.get('repoUrl'),
        deployedUrl: formData.get('deployedUrl') || undefined,
        explanation: formData.get('explanation'),
      })
    }}>
      <Input name="repoUrl" label="Repository URL" required />
      <Input name="deployedUrl" label="Deployed URL" />
      <Textarea name="explanation" label="Explanation" required minLength={50} />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

---

## Reporting Format

After completing a task, report:

```
## Task: [P0] Task Name
### Changes Made
- File: `path/to/file.ts` — brief description
- File: `path/to/file.tsx` — brief description

### Validation
- [ ] Acceptance criteria 1 met
- [ ] Acceptance criteria 2 met
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Manual test: [describe what you tested]

### Next Task
[P0] Next Task Name — [brief note if blocked]
```

---

## Stop Conditions

**STOP and report if:**
- Task scope expands beyond Definition of Done
- You need to implement something not in P0
- Database schema needs change not in design.md
- New dependency seems necessary
- UI work exceeds 30 minutes for a single component
- Build or lint fails and you cannot fix in 5 minutes

**Do NOT:**
- Continue to next task automatically
- "Fix" things not broken
- Add "nice to have" polish
- Refactor for "clean code" unless required

---

## Current Phase Reference

**Phase 0-1:** Documentation (COMPLETE — this file created in Phase 1)
**Phase 2:** Database Schema & Seed
**Phase 3:** Authentication
**Phase 4:** Student Profile & Skills
**Phase 5:** Company Profile & Jobs
**Phase 6:** Job Browsing & Applications
**Phase 7:** Study Case Submission
**Phase 8:** Company Review
**Phase 9:** Portfolio
**Phase 10:** Matching Engine
**Phase 11:** E2E Testing
**Phase 12:** Deployment

**Active Task:** Check `docs/tasks.md` for current `[P0]` task with `in_progress` status