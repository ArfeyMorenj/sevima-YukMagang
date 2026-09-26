# YukMagang — API Specification

## Server Actions (Mutations)

All Server Actions live in `app/actions/` and follow the pattern:
```typescript
export async function actionName(input: InputType): Promise<ResultType>
```

### Authentication

#### `registerStudent(input: RegisterStudentInput)`
```typescript
interface RegisterStudentInput {
  email: string
  password: string
  name: string
  major: Major
}

interface RegisterResult {
  userId: string
  redirectTo: '/student/profile'
}
```
- Creates User (STUDENT) + StudentProfile
- Hashes password
- Creates session
- Returns redirect path

#### `registerCompany(input: RegisterCompanyInput)`
```typescript
interface RegisterCompanyInput {
  email: string
  password: string
  name: string
}
```
- Creates User (COMPANY) + Company (unverified)
- Hashes password
- Creates session
- Returns redirect to `/company/profile`

#### `login(input: LoginInput)`
```typescript
interface LoginInput {
  email: string
  password: string
}

interface LoginResult {
  redirectTo: '/student' | '/company'
}
```
- Verifies credentials
- Creates session
- Redirects by role

#### `logout()`
```typescript
interface LogoutResult {
  success: boolean
}
```
- Destroys session cookie
- Returns success

---

### Student Profile

#### `updateStudentProfile(input: UpdateStudentProfileInput)`
```typescript
interface UpdateStudentProfileInput {
  name: string
  major: Major
  bio: string
}

interface StudentProfileResult {
  id: string
  name: string
  major: Major
  bio: string | null
  skills: { skillId: string; skill: Skill }[]
}
```
- Requires STUDENT role
- Updates StudentProfile
- Returns updated profile with skills

#### `addStudentSkill(skillId: string)`
```typescript
interface AddSkillResult {
  studentSkill: { skillId: string; skill: Skill }
}
```
- Requires STUDENT role
- Creates StudentSkill (idempotent - ignore if exists)
- Returns created relation

#### `removeStudentSkill(skillId: string)`
```typescript
interface RemoveSkillResult {
  success: boolean
}
```
- Requires STUDENT role
- Deletes StudentSkill
- Returns success

---

### Company Profile

#### `updateCompanyProfile(input: UpdateCompanyProfileInput)`
```typescript
interface UpdateCompanyProfileInput {
  name: string
  description: string
  location: string
  website: string
}

interface CompanyProfileResult {
  id: string
  name: string
  description: string | null
  location: string | null
  website: string | null
  verified: boolean
}
```
- Requires COMPANY role
- Updates Company
- Returns updated profile

---

### Jobs & Study Cases

#### `createJob(input: CreateJobInput)`
```typescript
interface CreateJobInput {
  title: string
  description: string
  location: string
  techStack: string[]
  applicationDeadline: string // ISO date
  skillIds: string[]
  studyCase: {
    title: string
    problemDescription: string
    instructions: string
    requiredSkillIds: string[]
    deadline: string // ISO date
  }
}

interface JobResult {
  id: string
  title: string
  companyId: string
  studyCaseId: string
}
```
- Requires COMPANY role
- Verifies company exists
- Transaction: creates Job + JobSkills + StudyCase
- Validates studyCase.deadline ≤ applicationDeadline
- Returns job ID

#### `updateJob(jobId: string, input: Partial<CreateJobInput>)`
- Requires COMPANY role + ownership
- Updates Job + JobSkills (replace)
- StudyCase updated separately

#### `deleteJob(jobId: string)`
- Requires COMPANY role + ownership
- Cascades to StudyCase, Applications

---

### Applications

#### `applyToJob(jobId: string)`
```typescript
interface ApplyResult {
  applicationId: string
  status: 'PENDING'
}
```
- Requires STUDENT role
- Checks: job exists, deadline not passed, not already applied
- Creates Application (PENDING)
- Returns application ID

#### `withdrawApplication(applicationId: string)`
- Requires STUDENT role + ownership
- Only if status = PENDING
- Deletes Application

---

### Submissions

#### `submitStudyCase(applicationId: string, input: SubmitStudyCaseInput)`
```typescript
interface SubmitStudyCaseInput {
  repoUrl: string
  deployedUrl?: string
  explanation: string
}

interface SubmissionResult {
  id: string
  applicationId: string
  repoUrl: string
  deployedUrl: string | null
  explanation: string
  submittedAt: Date
}
```
- Requires STUDENT role + ownership
- Checks: application exists, status = PENDING
- Validates: repoUrl required, valid URL, explanation min 50 chars
- Creates Submission
- Updates Application status → REVIEWED
- Returns submission

---

### Reviews

#### `reviewApplication(applicationId: string, input: ReviewInput)`
```typescript
interface ReviewInput {
  score: number // 0-100
  feedback: string
  decision: 'ACCEPTED' | 'REJECTED'
}

interface ReviewResult {
  review: {
    id: string
    score: number
    feedback: string
    decision: 'ACCEPTED' | 'REJECTED'
  }
  portfolioItem: {
    id: string
    studyCaseTitle: string
    companyName: string
    technologies: string[]
    repoUrl: string
    deployedUrl: string | null
    score: number
    feedback: string
    result: 'ACCEPTED' | 'REJECTED'
  }
}
```
- Requires COMPANY role + ownership (company owns the job)
- Checks: application exists, has submission, status = REVIEWED
- Validates: score 0-100, feedback required, decision required
- Transaction: creates Review + updates Application status + creates PortfolioItem
- PortfolioItem created regardless of decision
- Returns review + portfolio item

---

## Route Handlers (GET)

All Route Handlers in `app/api/` return JSON.

### `GET /api/skills`
```typescript
interface SkillResponse {
  id: string
  name: string
  category: SkillCategory
}[]
```
- Public
- Returns all skills for selects

### `GET /api/jobs`
```typescript
interface JobListResponse {
  jobs: JobWithMatch[]
  total: number
  page: number
  pageSize: number
}

interface JobWithMatch {
  id: string
  title: string
  company: { id: string; name: string }
  location: string
  techStack: string[]
  applicationDeadline: string
  matchPercentage: number
  matchedSkills: string[]
  majorMatches: boolean
  skills: { skillId: string; skill: Skill }[]
}
```
- Requires STUDENT role
- Query params: `page`, `pageSize`, `search` (optional)
- Calculates match for current student
- Sorted by matchPercentage desc

### `GET /api/jobs/[id]`
```typescript
interface JobDetailResponse {
  id: string
  title: string
  description: string
  location: string
  techStack: string[]
  applicationDeadline: string
  company: { id: string; name: string; description: string | null }
  skills: { skillId: string; skill: Skill }[]
  studyCase: {
    id: string
    title: string
    problemDescription: string
    instructions: string
    requiredSkills: string[]
    deadline: string
  } | null
  matchPercentage: number
  matchedSkills: string[]
  majorMatches: boolean
  hasApplied: boolean
  applicationId: string | null
}
```
- Requires STUDENT or COMPANY (own job)
- Returns full job + study case + match data

### `GET /api/student/applications`
```typescript
interface StudentApplicationsResponse {
  applications: {
    id: string
    status: ApplicationStatus
    job: { id: string; title: string; company: { name: string } }
    appliedAt: string
    submission: { id: string; repoUrl: string } | null
    review: { score: number; decision: Decision } | null
  }[]
}
```
- Requires STUDENT role
- Returns all applications for current student

### `GET /api/student/applications/[id]`
```typescript
interface ApplicationDetailResponse {
  id: string
  status: ApplicationStatus
  job: JobDetailResponse
  submission: {
    id: string
    repoUrl: string
    deployedUrl: string | null
    explanation: string
    submittedAt: string
  } | null
  review: {
    id: string
    score: number
    feedback: string
    decision: Decision
    reviewedAt: string
  } | null
  portfolioItem: PortfolioItemResponse | null
}
```
- Requires STUDENT role + ownership
- Returns full application with submission + review + portfolio

### `GET /api/student/portfolio`
```typescript
interface PortfolioResponse {
  items: PortfolioItemResponse[]
}

interface PortfolioItemResponse {
  id: string
  studyCaseTitle: string
  companyName: string
  technologies: string[]
  repoUrl: string
  deployedUrl: string | null
  score: number
  feedback: string
  result: 'ACCEPTED' | 'REJECTED'
  createdAt: string
}
```
- Requires STUDENT role
- Returns all portfolio items for current student

### `GET /api/company/jobs`
```typescript
interface CompanyJobsResponse {
  jobs: {
    id: string
    title: string
    status: 'OPEN' | 'CLOSED'
    applicantCount: number
    applicationDeadline: string
  }[]
}
```
- Requires COMPANY role
- Returns company's jobs with applicant counts

### `GET /api/company/jobs/[id]/applicants`
```typescript
interface ApplicantsResponse {
  applicants: {
    id: string // applicationId
    student: { id: string; name: string; major: Major }
    matchPercentage: number
    status: ApplicationStatus
    appliedAt: string
    hasSubmission: boolean
  }[]
}
```
- Requires COMPANY role + ownership
- Returns all applications for this job

### `GET /api/company/applications/[id]`
```typescript
interface CompanyApplicationDetailResponse {
  id: string
  status: ApplicationStatus
  student: { id: string; name: string; major: Major; bio: string | null }
  job: { id: string; title: string }
  submission: {
    id: string
    repoUrl: string
    deployedUrl: string | null
    explanation: string
    submittedAt: string
  } | null
}
```
- Requires COMPANY role + ownership
- Returns application with submission for review

---

## Data Types (Shared)

```typescript
type Major = 'RPL' | 'TKJ' | 'PPLG' | 'OTHER'

type SkillCategory = 
  | 'TECHNICAL' 
  | 'SOFT' 
  | 'LANGUAGE' 
  | 'FRAMEWORK' 
  | 'DATABASE' 
  | 'TOOL' 
  | 'CLOUD' 
  | 'OTHER'

type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'

type Decision = 'ACCEPTED' | 'REJECTED'

interface Skill {
  id: string
  name: string
  category: SkillCategory
}
```

---

## Error Responses

All Server Actions and Route Handlers return errors as:
```typescript
interface ApiError {
  error: string
  code?: string
  field?: string // for validation errors
}
```

Common codes:
- `UNAUTHORIZED` — No session or invalid role
- `FORBIDDEN` — Session valid but not owner
- `NOT_FOUND` — Resource doesn't exist
- `VALIDATION_ERROR` — Input validation failed
- `CONFLICT` — Duplicate (e.g., already applied)
- `INTERNAL_ERROR` — Unexpected server error