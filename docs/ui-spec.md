# YukMagang — UI Specification

## Design Goals

- **Clarity over cleverness** — Information hierarchy drives every decision
- **Speed** — Minimal clicks to core actions (apply, submit, review)
- **Trust** — Clean, professional feel; not "AI-generated dashboard"
- **Accessibility** — Semantic HTML, proper contrast, keyboard navigation

## Design Direction

**Visual Language:** Clean, restrained, functional
- No gradients, no glassmorphism, no decorative animations
- Subtle borders (1px), limited shadows (elevation only for dropdowns/modals)
- 4px base spacing system
- Primary color for key actions only
- Status colors: success (green), warning (amber), destructive (red)

**Typography Scale:**
- Page title: `text-2xl font-semibold` (24px)
- Section title: `text-lg font-medium` (18px)
- Body: `text-base` (16px)
- Caption: `text-sm text-muted-foreground` (14px)

**Color Tokens (CSS Variables):**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
  --radius: 6px;
}
```

---

## Navigation

### Student Navigation (Sidebar / Top Bar)
- Dashboard (overview + recommendations)
- Jobs (browse + search)
- Applications (my applications)
- Portfolio (validated work)
- Profile (settings)

### Company Navigation
- Dashboard (overview + stats)
- Jobs (manage postings)
- Applications (review queue)
- Company Profile

### Auth Pages
- No navigation — focused, centered forms

---

## Information Hierarchy

### Page Level
1. Page title + primary action (top)
2. Section groups with section titles
3. Content cards / tables / forms
4. Secondary actions (bottom or inline)

### Card Level (JobCard, ApplicationCard)
1. Primary identifier (title, company)
2. Key metadata (location, deadline, match %)
3. Skills/tags (visual chips)
4. Primary action button

---

## Page Specifications

### 1. Login Page (`/login`)

| Property | Value |
|----------|-------|
| **Purpose** | Authenticate existing users |
| **User** | Student, Company |
| **Primary Goal** | Login successfully |
| **Primary Action** | Submit credentials → redirect to role dashboard |
| **Secondary Actions** | Link to Register, "Forgot password" (future) |
| **Content Structure** | Centered card: Logo → Title → Email input → Password input → Submit button → Register link |
| **Important States** | Loading (disabled button), Error (invalid credentials), Empty (initial) |
| **Responsive** | Full width on mobile, max-w-md centered on desktop |

### 2. Register Page (`/register`)

| Property | Value |
|----------|-------|
| **Purpose** | Create new account |
| **User** | Student, Company |
| **Primary Goal** | Register and auto-login |
| **Primary Action** | Submit form → create account → redirect to profile setup |
| **Secondary Actions** | Role toggle (Student/Company), Link to Login |
| **Content Structure** | Role selector tabs → Form fields (email, password, confirm) → Submit |
| **Important States** | Validation (email format, password min 8, match), Error (email exists), Loading |
| **Responsive** | Same as Login |

### 3. Student Dashboard (`/student`)

| Property | Value |
|----------|-------|
| **Purpose** | Overview + recommended jobs |
| **User** | Student |
| **Primary Goal** | See match recommendations, quick actions |
| **Primary Action** | "Browse All Jobs" → /student/jobs |
| **Secondary Actions** | "Complete Profile" (if incomplete), View Application Status |
| **Content Structure** | Header (welcome, profile completion %) → Recommended Jobs (top 3 match cards) → My Applications summary (counts by status) → Quick links |
| **Important States** | Empty (no recommendations), Loading skeletons, Profile incomplete banner |
| **Responsive** | Stack sections vertically on mobile |

### 4. Jobs List (`/student/jobs`)

| Property | Value |
|----------|-------|
| **Purpose** | Browse and filter PKL opportunities |
| **User** | Student |
| **Primary Goal** | Find relevant jobs to apply |
| **Primary Action** | Click job → Job Detail |
| **Secondary Actions** | Filter by major/skills (future), Sort by match/date |
| **Content Structure** | Header (title, count) → Job Grid (JobCard × N) → Pagination |
| **JobCard Content** | Company logo/name, Job title, Match badge (XX%), Location, Tech stack tags (3 max + count), Deadline, "View Details" button |
| **Important States** | Empty (no jobs match), Loading grid, Error |
| **Responsive** | 1 col mobile, 2 col tablet, 3 col desktop |

### 5. Job Detail (`/student/jobs/[id]`)

| Property | Value |
|----------|-------|
| **Purpose** | Full job info + study case + apply |
| **User** | Student |
| **Primary Goal** | Decide and apply |
| **Primary Action** | "Apply Now" (if not applied) / "View Application" (if applied) |
| **Secondary Actions** | Save for later (future), Share |
| **Content Structure** | Hero: Company, Title, Match %, Location, Deadline → Tabs: Overview / Study Case / Requirements → Apply CTA (sticky bottom on mobile) |
| **Study Case Tab** | Title, Problem Description, Instructions, Required Skills, Deadline |
| **Requirements Tab** | Required skills (chips), Tech stack (chips), Major preference |
| **Important States** | Already applied (show status), Application deadline passed (disabled), Loading |
| **Responsive** | Tabs collapse to accordion on mobile |

### 6. Application Detail (`/student/applications/[id]`)

| Property | Value |
|----------|-------|
| **Purpose** | Track application status + submission + review |
| **User** | Student |
| **Primary Goal** | See current status, submit study case if pending, view review if reviewed |
| **Primary Action** | "Submit Study Case" (if PENDING) / "View Portfolio" (if REVIEWED) |
| **Secondary Actions** | Withdraw application (if PENDING) |
| **Content Structure** | Status badge + timeline (Applied → Submitted → Reviewed → Decided) → Job summary → Submission form (if PENDING) → Review result (if REVIEWED: score, feedback, decision) |
| **Important States** | PENDING (show submit form), SUBMITTED (read-only), REVIEWED (show review + portfolio link) |
| **Responsive** | Timeline vertical on mobile |

### 7. Study Case Submission (`/student/applications/[id]/submit`)

| Property | Value |
|----------|-------|
| **Purpose** | Submit study case solution |
| **User** | Student |
| **Primary Goal** | Complete submission |
| **Primary Action** | "Submit Solution" |
| **Content Structure** | Job context header → Form: Repository URL (required), Deployed URL (optional), Explanation (textarea, required) → Submit |
| **Validation** | Repo URL required, valid URL format, Explanation min 50 chars |
| **Important States** | Validating, Submitting, Success (redirect to application), Error |
| **Responsive** | Full width form |

### 8. Portfolio (`/student/portfolio`)

| Property | Value |
|----------|-------|
| **Purpose** | Showcase validated work |
| **User** | Student |
| **Primary Goal** | View and share portfolio items |
| **Primary Action** | "View Details" per item |
| **Content Structure** | Header (title, count) → Portfolio Grid (PortfolioCard × N) |
| **PortfolioCard Content** | Study case title, Company name, Technologies (chips), Score badge (XX/100), Result badge (Accepted/Rejected), Repo link, Deployed link, "View Details" |
| **Important States** | Empty (no reviews yet → CTA to browse jobs), Loading |
| **Responsive** | 1 col mobile, 2 col desktop |

### 9. Student Profile (`/student/profile`)

| Property | Value |
|----------|-------|
| **Purpose** | Manage profile and skills |
| **User** | Student |
| **Primary Goal** | Keep profile updated for better matching |
| **Primary Action** | "Save Changes" |
| **Content Structure** | Section: Basic Info (name, major, bio) → Section: Skills (multi-select with search, selected as chips) → Save button |
| **Important States** | Saving, Saved toast, Validation errors |
| **Responsive** | Stack sections |

### 10. Company Dashboard (`/company`)

| Property | Value |
|----------|-------|
| **Purpose** | Overview of jobs + applications needing review |
| **User** | Company |
| **Primary Goal** | Quick access to pending reviews |
| **Primary Action** | "Review" on pending applications |
| **Secondary Actions** | "Create Job", "Manage Jobs" |
| **Content Structure** | Header → Stats cards (Active Jobs, Total Applicants, Pending Reviews) → Pending Reviews table (top 5) → Recent Jobs list |
| **Important States** | Empty (no jobs), Loading |
| **Responsive** | Table → cards on mobile |

### 11. Company Jobs (`/company/jobs`)

| Property | Value |
|----------|-------|
| **Purpose** | Manage job postings |
| **User** | Company |
| **Primary Goal** | View, edit, create jobs |
| **Primary Action** | "Create Job" |
| **Secondary Actions** | Edit, Delete, View Applicants per job |
| **Content Structure** | Header + Create button → Job Table: Title, Status, Applicants, Deadline, Actions |
| **Important States** | Empty, Loading |
| **Responsive** | Table with horizontal scroll on mobile |

### 12. Create Job (`/company/jobs/create`)

| Property | Value |
|----------|-------|
| **Purpose** | Create new PKL opportunity + study case |
| **User** | Company |
| **Primary Goal** | Publish complete job with study case |
| **Primary Action** | "Publish Job" |
| **Content Structure** | Multi-step or single long form: Basic Info (title, description, location, deadline) → Requirements (skills multi-select, tech stack tags) → Study Case (title, problem, instructions, required skills, deadline) → Publish |
| **Validation** | All required fields, deadline future, study case deadline ≤ job deadline |
| **Important States** | Saving draft (future), Publishing, Success redirect |
| **Responsive** | Stack sections |

### 13. Applicant Detail (`/company/jobs/[id]/applicants`)

| Property | Value |
|----------|-------|
| **Purpose** | List applicants for a job |
| **User** | Company |
| **Primary Goal** | Review submissions |
| **Primary Action** | Click applicant → Submission Review |
| **Content Structure** | Job header → Applicant Table: Student name, Major, Match %, Status, Applied date, Actions |
| **Important States** | Empty (no applicants), Loading |
| **Responsive** | Table → cards |

### 14. Submission Review (`/company/applications/[id]/review`)

| Property | Value |
|----------|-------|
| **Purpose** | Review student submission, give feedback |
| **User** | Company |
| **Primary Goal** | Score, feedback, accept/reject |
| **Primary Action** | "Submit Review" |
| **Content Structure** | Student info + Job context → Submission details (repo, deployed, explanation) → Review form: Score (0-100 slider/input), Feedback (textarea, required), Decision (radio: Accept/Reject) → Submit |
| **Validation** | Score required, Feedback required, Decision required |
| **Important States** | Submitting, Success (redirect to applicants), Error |
| **Responsive** | Stack sections |

### 15. Company Profile (`/company/profile`)

| Property | Value |
|----------|-------|
| **Purpose** | Manage company info |
| **User** | Company |
| **Primary Goal** | Keep company profile accurate |
| **Primary Action** | "Save Changes" |
| **Content Structure** | Name, Description, Location, Website, Verified badge (read-only) → Save |
| **Important States** | Saving, Saved |

---

## Loading States

- **Page level:** Skeleton screens matching final layout (shimmer on background)
- **Button level:** Disabled + spinner
- **List level:** 3-5 skeleton cards
- **Never** full-page spinner blocking navigation

---

## Empty States

| Page | Empty Message | Action |
|------|---------------|--------|
| Jobs | "No PKL opportunities match your profile yet" | "Browse all jobs" |
| Applications | "You haven't applied to any positions" | "Find opportunities" |
| Portfolio | "Your portfolio will appear here after company reviews" | "Apply to jobs" |
| Company Jobs | "You haven't posted any PKL opportunities" | "Create your first job" |
| Applicants | "No applications yet for this position" | — |

---

## Error States

- **Form validation:** Inline field errors + toast on submit failure
- **Server errors:** Toast with "Something went wrong. Please try again."
- **Not found:** 404 page with link to dashboard
- **Unauthorized:** Redirect to login with return URL

---

## Responsive Behavior

- **Mobile (< 640px):** Single column, stacked sections, bottom-sheet modals, sticky primary action
- **Tablet (640-1024px):** Two-column grids, side-by-side forms
- **Desktop (> 1024px):** Three-column grids, sidebar navigation, full-width tables
- **Breakpoints:** Tailwind defaults (sm, md, lg, xl)

---

## Component List (Reusable)

1. **Button** — primary, secondary, ghost, destructive, loading, disabled
2. **Input** — text, email, password, URL, with label + error
3. **Textarea** — with label, error, character count
4. **Select** — single, multi-select with chips
5. **Badge** — default, success, warning, destructive, outline
6. **Card** — container with padding, border
7. **JobCard** — job preview with match badge
8. **SkillChip** — skill tag with category color
9. **StatusBadge** — PENDING/REVIEWED/ACCEPTED/REJECTED
10. **Dialog/Modal** — confirm actions, forms
11. **Table** — sortable, responsive
12. **Tabs** — keyboard accessible
13. **Timeline** — application status steps
14. **EmptyState** — illustration + message + action
15. **Toast** — success, error, info
16. **Avatar** — initials or logo
17. **Breadcrumb** — navigation context