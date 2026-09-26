# YukMagang — Architecture Decision Log

## ADR-001: Custom Session Auth vs NextAuth.js

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Use custom session-based authentication with bcrypt + httpOnly cookies

**Rationale:**
- NextAuth.js adds ~50KB bundle, complex configuration
- Only two roles (STUDENT, COMPANY) — simple RBAC
- Full control over session payload, cookie settings
- Faster to implement for hackathon
- No OAuth providers needed

**Consequences:**
- Manual implementation of login/register/logout
- Must handle password hashing, session rotation, CSRF
- No built-in email verification, password reset (out of MVP scope)

---

## ADR-002: Server Actions vs REST API Routes

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Use Server Actions for all mutations; Route Handlers only for GET endpoints

**Rationale:**
- Type-safe end-to-end (TypeScript shared between client/server)
- Automatic revalidation with `revalidatePath`/`revalidateTag`
- Less boilerplate than API routes + fetch
- Built-in progressive enhancement (works without JS)

**Consequences:**
- Tied to Next.js App Router
- Cannot call from external clients (not needed for MVP)
- Form submissions require `<form action={action}>` pattern

---

## ADR-003: Single StudyCase per Job

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** One-to-one Job → StudyCase (not one-to-many)

**Rationale:**
- MVP scope: one study case per PKL opportunity
- Simpler data model, simpler UI
- Companies can update study case if needed
- Avoids "which study case applies to this application" ambiguity

**Consequences:**
- Cannot have multiple study cases for different stages
- Future: change to one-to-many if multi-stage selection needed

---

## ADR-004: Deterministic Rule-Based Matching

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Weighted Jaccard similarity (skills 70%, major 30%), no ML

**Rationale:**
- Hackathon MVP — no time for ML training/infrastructure
- Explainable: UI shows exactly which skills matched
- Deterministic: same input → same output, testable
- Fast: pure TypeScript, no external service
- Extensible: weights adjustable, can add factors later

**Consequences:**
- Less "intelligent" than ML
- Requires curated skill taxonomy
- Major mapping is heuristic (tech stack → major inference)

---

## ADR-005: Portfolio Item Created on Every Review

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** PortfolioItem created for both ACCEPTED and REJECTED decisions

**Rationale:**
- Core product differentiator: "rejection still yields portfolio evidence"
- Simplifies logic: one code path
- Student always gets value from completing study case

**Consequences:**
- Portfolio may have many "rejected" items
- UI must clearly show result badge
- Future: add "hide rejected" filter

---

## ADR-006: No File Upload for Submissions

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Only repository URL + deployed URL + explanation

**Rationale:**
- Avoids storage complexity (S3, Blob, Vercel Blob)
- URLs are standard developer workflow (GitHub, Vercel, Netlify)
- Hackathon time constraint
- Sufficient for demo

**Consequences:**
- Cannot submit zip files, PDFs, images
- No plagiarism detection via file content
- Future: add file upload with Vercel Blob

---

## ADR-007: Prisma Client Output to `app/generated/prisma`

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Custom output path for Prisma Client

**Rationale:**
- Keeps generated code inside `app/` for Next.js App Router compatibility
- Avoids `node_modules` import issues with Server Actions
- Standard pattern for Next.js + Prisma

**Consequences:**
- Must run `prisma generate` after schema changes
- Gitignore the generated folder

---

## ADR-008: Enum for Major (RPL, TKJ, PPLG, OTHER)

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Fixed enum instead of free-text major

**Rationale:**
- Indonesian SMK context has standardized majors
- Enables major-based matching logic
- Controlled vocabulary = better data quality
- OTHER covers edge cases

**Consequences:**
- Cannot add new majors without migration
- Migration needed if new major added

---

## ADR-009: Skill Category Enum

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Predefined categories (TECHNICAL, SOFT, LANGUAGE, FRAMEWORK, DATABASE, TOOL, CLOUD, OTHER)

**Rationale:**
- Enables filtered skill selection UI
- Helps matching engine weight categories differently (future)
- Consistent taxonomy for demo data

**Consequences:**
- Skills must be pre-seeded
- Students cannot add custom skills (MVP)
- Future: allow custom skills with "OTHER" category

---

## ADR-010: No School Entity in MVP

**Date:** 2026-09-26
**Status:** Accepted
**Decision:** Exclude School/SchoolAdmin from MVP entirely

**Rationale:**
- Explicitly listed in "MVP OUT OF SCOPE"
- Two-sided marketplace (Student ↔ Company) is core hypothesis
- School adds third party, more auth roles, more complexity
- Can be added post-hackathon

**Consequences:**
- No school verification of students
- No school dashboard for PKL monitoring
- Students register independently