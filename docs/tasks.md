# YukMagang — Implementation Tasks

## Phase 0 — Project Setup

### [P0] Initialize Next.js with TypeScript, Tailwind, Prisma
- **Goal:** Running dev environment with all core dependencies
- **Dependency:** None
- **Definition of Done:** `npm run dev` starts, TypeScript compiles, Tailwind works, Prisma client generates

### [P0] Configure Neon PostgreSQL connection
- **Goal:** Database connected via `DATABASE_URL`
- **Dependency:** Neon account created
- **Definition of Done:** `npx prisma db push` succeeds, connection pool works

### [P0] Set up ESLint, Prettier, Git hooks
- **Goal:** Consistent code style
- **Dependency:** Phase 0 task 1
- **Definition of Done:** `npm run lint` passes, pre-commit runs

---

## Phase 1 — Documentation

### [P0] Create PRD (docs/prd.md)
- **Goal:** Product requirements documented
- **Dependency:** None
- **Definition of Done:** File exists with all required sections

### [P0] Create Technical Design (docs/design.md)
- **Goal:** Architecture, DB model, auth, matching engine documented
- **Dependency:** None
- **Definition of Done:** File exists with Mermaid diagrams

### [P0] Create UI Spec (docs/ui-spec.md)
- **Goal:** All pages specified with states
- **Dependency:** None
- **Definition of Done:** 15 pages documented

### [P0] Create Tasks (docs/tasks.md)
- **Goal:** All P0 tasks defined with DoD
- **Dependency:** PRD complete
- **Definition of Done:** This file complete

### [P0] Create API Spec (docs/api.md)
- **Goal:** Server Actions and Route Handlers documented
- **Dependency:** Technical design complete
- **Definition of Done:** All endpoints listed with types

### [P0] Create Decisions Log (docs/decisions.md)
- **Goal:** Track architectural decisions
- **Dependency:** None
- **Definition of Done:** File exists with initial decisions

### [P0] Create Risks Log (docs/risks.md)
- **Goal:** Identify and mitigate risks
- **Dependency:** None
- **Definition of Done:** File exists with top 5 risks

### [P0] Create AGENTS.md
- **Goal:** Coding agent instructions
- **Dependency:** None
- **Definition of Done:** File exists at root with rules

### [P0] Create DESIGN.md
- **Goal:** Design tokens and component list
- **Dependency:** UI spec complete
- **Definition of Done:** File exists at root with tokens

---

## Phase 2 — Database

### [P0] Define Prisma schema (prisma/schema.prisma)
- **Goal:** All MVP models with relations, enums, indexes
- **Dependency:** Technical design complete
- **Definition of Done:** `npx prisma generate` succeeds, schema matches design.md

### [P0] Create seed script (prisma/seed.ts)
- **Goal:** Demo data for hackathon
- **Dependency:** Schema complete
- **Definition of Done:** `npx prisma db seed` creates: 3 skills per category, 2 demo companies (verified), 5 jobs with study cases, 1 demo student

### [P0] Run initial migration
- **Goal:** Database schema deployed
- **Dependency:** Schema + seed ready
- **Definition of Done:** `npx prisma migrate dev --name init` succeeds

---

## Phase 3 — Authentication

### [P0] Create auth library (lib/auth.ts)
- **Goal:** Password hashing (bcrypt), session creation, validation
- **Dependency:** Phase 0 complete
- **Definition of Done:** `hashPassword`, `verifyPassword`, `createSession`, `getSession`, `destroySession` exported and typed

### [P0] Create session middleware (middleware.ts)
- **Goal:** Protect routes, attach user to request
- **Dependency:** Auth library
- **Definition of Done:** `/student/*` requires STUDENT, `/company/*` requires COMPANY, `/api/*` protected, unauthenticated → `/login`

### [P0] Build Login page (/login)
- **Goal:** Email/password form, validation, redirect by role
- **Dependency:** Auth library, middleware
- **Definition of Done:** Valid login → student → /student, company → /company; invalid shows error

### [P0] Build Register page (/register)
- **Goal:** Role selection, email/password, auto-login
- **Dependency:** Auth library
- **Definition of Done:** Student register → creates User + StudentProfile → /student/profile; Company register → creates User + Company → /company/profile

### [P0] Build Logout action
- **Goal:** Destroy session, redirect to login
- **Dependency:** Auth library
- **Definition of Done:** Button in nav works, session cleared

---

## Phase 4 — Student Profile & Skills

### [P0] Create Skill seed data (in seed script)
- **Goal:** ~30 predefined skills across categories
- **Dependency:** Schema complete
- **Definition of Done:** Skills queryable, categorized

### [P0] Build Student Profile page (/student/profile)
- **Goal:** Name, major (select), bio, skills multi-select
- **Dependency:** Auth, schema
- **Definition of Done:** Form saves to DB, shows current skills as removable chips, major enum works

### [P0] Create updateStudentProfile Server Action
- **Goal:** Validate and persist profile
- **Dependency:** Auth, schema
- **Definition of Done:** Updates StudentProfile, returns updated profile

### [P0] Create add/remove StudentSkill Server Actions
- **Goal:** Manage many-to-many skills
- **Dependency:** Schema
- **Definition of Done:** Add creates StudentSkill, remove deletes it, prevents duplicates

### [P0] Build Student Dashboard (/student)
- **Goal:** Welcome, profile completion %, top 3 matched jobs, application summary
- **Dependency:** Profile, matching engine (stub)
- **Definition of Done:** Shows data, loading states, empty states

---

## Phase 5 — Company Profile & Jobs

### [P0] Build Company Profile page (/company/profile)
- **Goal:** Name, description, location, website
- **Dependency:** Auth, schema
- **Definition of Done:** Form saves, shows verified badge

### [P0] Create updateCompanyProfile Server Action
- **Goal:** Persist company profile
- **Dependency:** Auth
- **Definition of Done:** Updates Company, returns updated

### [P0] Build Create Job page (/company/jobs/create)
- **Goal:** Job form + Study Case form in one flow
- **Dependency:** Company profile, skills seeded
- **Definition of Done:** Creates Job + JobSkills + StudyCase, redirects to /company/jobs

### [P0] Create createJob Server Action
- **Goal:** Transactional job + skills + study case creation
- **Dependency:** Schema
- **Definition of Done:** All created atomically, companyId set from session

### [P0] Build Company Jobs list (/company/jobs)
- **Goal:** Table with actions (edit, view applicants, delete)
- **Dependency:** createJob
- **Definition of Done:** Lists company's jobs, shows applicant count, links work

---

## Phase 6 — Job Browsing & Applications

### [P0] Build Jobs List page (/student/jobs)
- **Goal:** Grid of JobCards with match %, skills, deadline
- **Dependency:** Matching engine (basic), jobs seeded
- **Definition of Done:** Shows all active jobs, match % calculated, responsive grid

### [P0] Create getJobsWithMatch Server Action / Route Handler
- **Goal:** Fetch jobs + calculate match for current student
- **Dependency:** Matching engine
- **Definition of Done:** Returns Job[] with matchPercentage, matchedSkills[]

### [P0] Build Job Detail page (/student/jobs/[id])
- **Goal:** Full job info, study case tabs, apply button
- **Dependency:** getJobsWithMatch
- **Definition of Done:** Tabs work, study case displays, apply creates application

### [P0] Create applyToJob Server Action
- **Goal:** Create Application (PENDING), prevent duplicate
- **Dependency:** Schema, auth
- **Definition of Done:** Unique constraint enforced, redirects to application detail

### [P0] Build Application Detail page (/student/applications/[id])
- **Goal:** Status timeline, submission form (if PENDING), review result (if REVIEWED)
- **Dependency:** applyToJob
- **Definition of Done:** Status updates reflect, submission form shows when PENDING

---

## Phase 7 — Study Case Submission

### [P0] Create submitStudyCase Server Action
- **Goal:** Create Submission, update Application status → REVIEWED
- **Dependency:** Application exists, PENDING status
- **Definition of Done:** Validates URLs, explanation; creates Submission; updates status

### [P0] Build Submission Form (in Application Detail)
- **Goal:** Repo URL, Deployed URL, Explanation textarea
- **Dependency:** submitStudyCase
- **Definition of Done:** Validation works, submits, redirects to application detail with success

---

## Phase 8 — Company Review

### [P0] Build Applicant List (/company/jobs/[id]/applicants)
- **Goal:** Table of applicants with status, match %, actions
- **Dependency:** Jobs with applications
- **Definition of Done:** Lists all, links to review page

### [P0] Build Submission Review page (/company/applications/[id]/review)
- **Goal:** View submission, score input, feedback textarea, accept/reject radio
- **Dependency:** Applications with submissions
- **Definition of Done:** Shows repo, deployed, explanation; form submits review

### [P0] Create reviewApplication Server Action
- **Goal:** Create Review, update Application status, create PortfolioItem
- **Dependency:** Company owns job, application exists
- **Definition of Done:** Transactional: Review + Application status + PortfolioItem all created; score 0-100 validated

---

## Phase 9 — Portfolio

### [P0] Build Portfolio page (/student/portfolio)
- **Goal:** Grid of PortfolioCards with all required fields
- **Dependency:** reviewApplication creates PortfolioItem
- **Definition of Done:** Shows study case title, company, technologies, repo, deployed, score, feedback, result badge

### [P0] Verify rejected applications create portfolio
- **Goal:** Core differentiator works
- **Dependency:** reviewApplication
- **Definition of Done:** Reject decision still creates PortfolioItem with result=REJECTED

---

## Phase 10 — Matching Engine

### [P0] Implement calculateMatch function (lib/matching.ts)
- **Goal:** Deterministic weighted scoring
- **Dependency:** Student skills, job skills, tech stack, major
- **Definition of Done:** Returns { percentage, matchedSkills[], missingSkills[], majorMatches }

### [P0] Integrate matching in getJobsWithMatch
- **Goal:** All jobs return match data
- **Dependency:** calculateMatch
- **Definition of Done:** Jobs sorted by match % descending

### [P0] Display match badge on JobCard
- **Goal:** Visual match percentage + matched skills tooltip
- **Dependency:** getJobsWithMatch
- **Definition of Done:** Badge shows %, hover shows matched skills

---

## Phase 11 — End-to-End Testing

### [P0] Full Student Flow Test
- **Goal:** Register → Profile → Browse → Apply → Submit → Review → Portfolio
- **Dependency:** All Phase 3-10 complete
- **Definition of Done:** Manual test passes without errors

### [P0] Full Company Flow Test
- **Goal:** Register → Profile → Create Job+Case → Review → Portfolio created
- **Dependency:** All Phase 3-10 complete
- **Definition of Done:** Manual test passes

### [P0] Cross-Flow Test
- **Goal:** Student applies to Company job, Company reviews, Student sees portfolio
- **Dependency:** Both flows work
- **Definition of Done:** End-to-end works with two browser sessions

### [P0] Seed Demo Data for Presentation
- **Goal:** Realistic demo scenario
- **Dependency:** Seed script
- **Definition of Done:** 2 companies, 5 jobs, 3 students with profiles, mixed decisions

---

## Phase 12 — Deployment

### [P0] Deploy to Vercel
- **Goal:** Public URL working
- **Dependency:** All P0 complete, GitHub repo
- **Definition of Done:** `vercel deploy` succeeds, Neon connected, env vars set

### [P0] Configure Production Environment
- **Goal:** DATABASE_URL, SESSION_SECRET in Vercel
- **Dependency:** Vercel project created
- **Definition of Done:** Production build succeeds, database migrations run

### [P0] Verify Demo Flow on Production
- **Goal:** Hackathon demo works on live URL
- **Dependency:** Deployed
- **Definition of Done:** Both flows work on production

---

## P1 — Important After P0 (Post-MVP)

### [P1] Job search/filter (skills, location, major)
### [P1] Student dashboard: "Saved jobs" feature
### [P1] Company: Edit job, close job, reopen job
### [P1] Email notifications (application received, review complete)
### [P1] Portfolio public shareable link
### [P1] Skill autocomplete / typeahead
### [P1] Dark mode support
### [P1] Responsive polish (mobile gestures, touch targets)

---

## P2 — Bonus (Nice to Have)

### [P2] Company verification workflow (admin approval)
### [P2] Student: Multiple portfolio sections (projects, certifications)
### [P2] Company: Bulk actions on applicants
### [P2] Analytics: Match distribution, conversion funnel
### [P2] Export portfolio as PDF
### [P2] Study case template library