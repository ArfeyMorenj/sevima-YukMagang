# PKL Platform — Product Requirements Document

## Product Overview

**Product Name:** PKL Platform

**Product Description:** A platform that helps Indonesian SMK students, especially students from RPL, TKJ, and PPLG-related majors, discover relevant PKL (industrial internship) opportunities. The key differentiation is that students can complete a real company study case as part of the application process. The completed study case becomes portfolio evidence even when the student is rejected from the PKL position.

**Target Users:**
- SMK Students (RPL, TKJ, PPLG majors) — primary users seeking PKL opportunities
- Companies — providing PKL opportunities and study cases

**Core Problem:** SMK students struggle to find relevant PKL opportunities aligned with their major and skills. Schools have difficulty finding enough relevant industry opportunities. Industry technology requirements change quickly while schools may not have up-to-date visibility. Student portfolios lack validated real-world evidence. Rejected applications create little long-term value.

**Value Proposition:** Students discover relevant PKL opportunities, prove their skills through real company study cases, and turn that work into validated portfolio evidence — regardless of acceptance or rejection.

---

## Goals (Maximum 3–5)

1. **Enable student-company matching** — Students can find PKL opportunities matching their major and skills with a transparent matching score
2. **Validate skills through real study cases** — Companies provide study cases; students submit solutions; companies give scored feedback
3. **Convert applications into portfolio evidence** — Every reviewed study case becomes a portfolio item with company feedback, score, and result — even for rejected applications
4. **Demonstrate core hypothesis in hackathon demo** — Working end-to-end flow: student registers → completes profile → finds job → applies → submits study case → company reviews → portfolio item created
5. **Ship a clean, usable MVP** — Minimal features, deterministic matching, human-driven reviews, no AI black boxes

---

## Non-Goals (Explicitly Outside MVP)

- School dashboard, school accounts, school analytics
- Industry insight dashboard, talent pool
- Private chat, notification center
- Advanced company verification dashboard
- PKL administrative document generation
- Payment system, social networking
- AI chatbot, AI study case evaluation, ML recommendation model
- Complex analytics, advanced reporting, complex search filters
- Team collaboration, mobile application
- Collaborative coding environment, online code editor
- Plagiarism detection, automated testing platform

---

## User Personas

### Student (Primary)
- SMK student in RPL, TKJ, or PPLG major
- Needs to find PKL relevant to their skills
- Wants to build validated portfolio for future employment
- Technical level: beginner to intermediate

### Company (Primary)
- Company offering PKL positions
- Wants to evaluate candidates through practical study cases
- Provides feedback and scoring on submissions
- Technical level: varies, but understands their tech stack

---

## Core User Flow

### Student Flow
1. Register → Login
2. Complete profile (name, major, bio, skills)
3. Browse PKL opportunities (see matching scores)
4. View job details, required skills, study case
5. Apply to job
6. Submit study case (repo URL, deployed URL, explanation)
7. Company reviews submission
8. View result (accepted/rejected) + score + feedback
9. Study case appears in portfolio automatically

### Company Flow
1. Register → Login
2. Create company profile (name, description, location, website)
3. Create PKL opportunity (title, description, location, required skills, tech stack, deadline)
4. Create study case (title, problem description, instructions, required skills, deadline)
5. Receive applications
6. View applicant submissions
7. Give numeric score, write feedback, accept or reject
8. Student sees result; portfolio item created

---

## MVP Features (P0 Only)

### P0.1 Authentication
- Register, login, logout, protected routes, role-based authorization (STUDENT, COMPANY)

### P0.2 Student Profile
- Name, major (enum), short bio, skills (many-to-many with Skill table)

### P0.3 Company Profile
- Company name, description, location, website, verified (boolean)

### P0.4 PKL Opportunity (Job)
- Title, description, location, required skills (many-to-many), technology stack, application deadline

### P0.5 Study Case
- One per job: title, problem description, instructions, required skills, deadline

### P0.6 Application
- Student applies to job; statuses: PENDING, REVIEWED, ACCEPTED, REJECTED

### P0.7 Study Case Submission
- Repository URL, deployed URL (optional), written explanation

### P0.8 Company Review
- View submission, numeric score (0-100), written feedback, accept/reject decision

### P0.9 Portfolio
- Auto-created after review: study case title, company, technologies, repo URL, deployed URL, score, feedback, application result
- Persists even when rejected

### P0.10 Matching Engine
- Deterministic rule-based weighted scoring
- Factors: student major, student skills, job required skills, technology stack
- Output: match percentage + matched skills list

---

## User Stories

**As a student,** I want to register and login, so that I can access the platform.

**As a student,** I want to create a profile with my major and skills, so that I can receive relevant job recommendations.

**As a student,** I want to browse PKL opportunities with matching scores, so that I can find relevant positions quickly.

**As a student,** I want to view job details including the study case, so that I can decide whether to apply.

**As a student,** I want to apply to a job and submit a study case solution, so that I can demonstrate my skills.

**As a student,** I want to see my application status and company feedback, so that I know where I stand.

**As a student,** I want my completed study cases to become portfolio items with company feedback, so that I have validated evidence of my skills even if rejected.

**As a company,** I want to register and create a company profile, so that I can post PKL opportunities.

**As a company,** I want to create a PKL opportunity with required skills and tech stack, so that I attract relevant candidates.

**As a company,** I want to create a study case for my PKL opportunity, so that I can evaluate candidates practically.

**As a company,** I want to review submissions, give scores and feedback, and accept or reject applicants, so that I make informed hiring decisions.

---

## Acceptance Criteria

### P0.1 Authentication
- [ ] Student can register with email/password
- [ ] Company can register with email/password
- [ ] Login redirects to appropriate dashboard based on role
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Role-based authorization prevents cross-role access

### P0.2 Student Profile
- [ ] Student can enter name, select major, write bio
- [ ] Student can add/remove skills from predefined list
- [ ] Profile persists and displays on dashboard

### P0.3 Company Profile
- [ ] Company can enter name, description, location, website
- [ ] Verified flag exists (seeded for demo accounts)

### P0.4 PKL Opportunity
- [ ] Company can create job with all required fields
- [ ] Job lists required skills and tech stack
- [ ] Application deadline enforced

### P0.5 Study Case
- [ ] One study case per job
- [ ] Contains title, problem, instructions, required skills, deadline

### P0.6 Application
- [ ] Student can apply to job (one application per student per job)
- [ ] Status transitions: PENDING → REVIEWED → ACCEPTED/REJECTED

### P0.7 Study Case Submission
- [ ] Student submits repo URL, deployed URL, explanation
- [ ] Submission linked to application

### P0.8 Company Review
- [ ] Company views submission
- [ ] Company enters score (0-100) and feedback
- [ ] Company chooses accept or reject
- [ ] Application status updates

### P0.9 Portfolio
- [ ] Portfolio item created automatically after review
- [ ] Displays: title, company, technologies, repo URL, deployed URL, score, feedback, result
- [ ] Item persists for rejected applications

### P0.10 Matching Engine
- [ ] Calculates match percentage based on skills + major
- [ ] Shows matched skills as reasons
- [ ] Deterministic and explainable

---

## Demo Ready Definition

The application is demo-ready when:

1. **Two users can complete the full loop:** A student registers, completes profile, finds a job, applies, submits study case; a company registers, creates job + study case, reviews submission, accepts/rejects; student sees result + portfolio item.

2. **Matching works visibly:** Student dashboard shows jobs with match percentages and matched skills.

3. **Portfolio persists rejection:** A rejected application still produces a portfolio item with score and feedback.

4. **No console errors, no broken flows:** All P0 features functional end-to-end.

5. **Deployed to Vercel with Neon PostgreSQL:** Accessible via public URL.