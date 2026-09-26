# PKL Platform — Risk Register

## Risk Assessment Matrix

| ID | Risk | Likelihood | Impact | Score | Mitigation |
|----|------|------------|--------|-------|------------|
| R1 | Hackathon time runs out before core loop complete | High | Critical | 9 | Strict P0 scope, daily progress check, stop conditions enforced |
| R2 | Matching engine produces poor recommendations | Medium | High | 6 | Seed realistic skills, test with demo data, weights adjustable |
| R3 | Prisma/Neon connection issues in production | Low | Critical | 6 | Test Neon connection early, use connection pooling, verify env vars |
| R4 | Auth session bugs (logout, expiry, role confusion) | Medium | High | 6 | Write auth tests, manual test both roles, use established patterns |
| R5 | Company review doesn't create portfolio (core differentiator fails) | Low | Critical | 5 | Transactional review action, integration test, verify in seed |
| R6 | UI/UX delays core workflow implementation | Medium | Medium | 4 | Build functional first, style after; use minimal component library |
| R7 | Database schema changes break existing data | Medium | Medium | 4 | Use migrations, seed script recreates data, test migrations |
| R8 | Vercel deployment fails (build errors, env vars) | Low | High | 4 | Deploy early (Phase 12), verify build locally first |
| R9 | Scope creep — stakeholders request P1 features | High | Medium | 6 | Document non-goals, refer to PRD, say "post-MVP" |
| R10 | Demo data doesn't showcase matching/portfolio well | Medium | Medium | 4 | Curate seed data: overlapping skills, mixed decisions |

---

## Top 5 Risks — Detailed Mitigation

### R1: Time Overrun (Score: 9)
**Trigger:** Hackathon deadline (typically 24-48 hours)
**Impact:** Incomplete demo, failed hypothesis validation
**Mitigation:**
- Phase-gated approach: documentation → DB → auth → student → company → matching → portfolio
- **Stop condition:** If Phase 4 not done by 40% time, cut matching engine to simple skill overlap
- Daily 15-min standup: "What P0 task done? What blocked? What next?"
- No P1/P2 work until all P0 verified end-to-end

### R2: Poor Matching Quality (Score: 6)
**Trigger:** Demo shows irrelevant jobs to students
**Impact:** Core value prop not demonstrated
**Mitigation:**
- Seed 30 skills mapped to real tech stacks (React/Next.js → RPL, Cisco/Linux → TKJ, Flutter/Dart → PPLG)
- Demo companies use those exact skills
- Matching weights exposed as constants for quick tuning
- Fallback: show "Matched: React, TypeScript" even if % is low

### R3: Database Connection Failure (Score: 6)
**Trigger:** Neon cold start, connection limit, wrong DATABASE_URL
**Impact:** App completely broken in production
**Mitigation:**
- Test `prisma db push` against Neon in Phase 0
- Use `prisma7.config.ts` for connection pooling (already in project)
- Verify Vercel env vars: `DATABASE_URL` (pooled), `DIRECT_URL` (migrations)
- Health check endpoint for monitoring

### R4: Auth Bugs (Score: 6)
**Trigger:** Session not persisted, role mismatch, middleware loops
**Impact:** Users stuck, cannot test flows
**Mitigation:**
- Use `iron-session` or simple JWT in cookie (battle-tested)
- Middleware: only check cookie existence + role, no DB calls
- Test matrix: Student login → student pages, Company login → company pages, cross-access blocked
- Logout clears cookie + redirects to `/login`

### R5: Portfolio Not Created on Rejection (Score: 5)
**Trigger:** Review action only creates portfolio on ACCEPTED
**Impact:** Core differentiator missing from demo
**Mitigation:**
- Single `reviewApplication` Server Action creates PortfolioItem unconditionally
- Unit test: call with REJECTED → verify PortfolioItem exists with result=REJECTED
- Seed script: create pre-reviewed rejected application + portfolio item
- Demo script: "Watch — student rejected but portfolio gets item"

---

## Technical Debt Tracked (Accepted for MVP)

| ID | Debt | Reason | Post-MVP Fix |
|----|------|--------|--------------|
| D1 | No password reset | Out of scope | Add email + token flow |
| D2 | No email verification | Out of scope | Add verification token |
| D3 | No rate limiting | Vercel defaults sufficient | Add @vercel/rate-limit |
| D4 | No audit logging | MVP simplicity | Add AuditLog model |
| D5 | Skill taxonomy manual | Controlled vocab | Admin skill management |
| D6 | Major mapping heuristic | No ML | Company selects major explicitly |
| D7 | Single study case per job | MVP scope | One-to-many Job → StudyCase |
| D8 | No file upload | Storage complexity | Vercel Blob integration |
| D9 | No notification system | Out of scope | Email/push notifications |
| D10 | No test suite | Time constraint | Add Vitest + Playwright |

---

## Contingency Plans

### If Matching Engine Not Ready (Phase 10)
- Fallback: Show all jobs with simple skill overlap count
- UI still shows "X skills match" badge
- Match % = (matched / total) * 100 without major weight

### If Company Review Flow Blocked
- Demo with pre-seeded reviewed applications
- Show portfolio page with seeded data
- Narrate: "Here's what happens when company reviews"

### If Deployment Fails
- Run locally with `ngrok` or `vercel dev` for demo
- Record video walkthrough as backup
- GitHub repo with README for judges to run locally

### If Database Schema Wrong
- `prisma migrate reset` + reseed (dev only)
- Neon branch for each major schema change
- Never migrate production without backup

---

## Go/No-Go Criteria for Hackathon Demo

**Must Have (No-Go if missing):**
- [ ] Student registers → profiles → applies → submits
- [ ] Company registers → creates job+case → reviews
- [ ] Portfolio item created for REJECTED application
- [ ] Matching shows % and matched skills
- [ ] Deployed URL accessible

**Should Have (Demo quality):**
- [ ] Clean UI, no console errors
- [ ] Loading/empty states handled
- [ ] Responsive on mobile
- [ ] Seed data tells coherent story

**Nice to Have (Polish):**
- [ ] Dark mode
- [ ] Toast notifications
- [ ] Form validation UX