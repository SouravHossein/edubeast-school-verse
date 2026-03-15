

# Plan: Complete SaaS Workflow — Homepage → Onboarding → School Management

## Problem Analysis

The **database is completely empty** — no tables exist in Supabase. The `types.ts` reflects `[_ in never]: never` for all tables, causing every `supabase.from()` call to fail with TypeScript errors. Authentication is mock-based (localStorage). The entire backend infrastructure needs to be built from scratch.

## Implementation Plan

### Phase 1: Database Schema (Single Migration)

Create all core tables in one migration:

```text
profiles          ← linked to auth.users, stores role + tenant_id
tenants           ← school/institution record
tenant_features   ← toggleable modules per tenant
classes           ← class/section/grade
students          ← student records linked to profiles + classes
teachers          ← teacher records linked to profiles
parents           ← parent records linked to profiles, linked to students
activity_logs     ← user action tracking
```

Plus: RLS policies, auto-profile-creation trigger on signup, indexes.

### Phase 2: Real Authentication (Replace Mock)

Rewrite `AuthContext.tsx` to use Supabase Auth:
- `signUp` / `signInWithPassword` / `signOut`
- `onAuthStateChange` listener (set up before `getSession`)
- Load profile from `profiles` table to get role + tenant info
- Remove all localStorage mock auth

Update `LoginDialog.tsx` to use real Supabase auth calls.

### Phase 3: Onboarding Flow (Fix + Complete)

Fix `SchoolOnboardingWizard.tsx` — currently broken due to missing tables. After Phase 1, these will work. The flow:

1. User signs up (admin role) → redirected to `/onboard`
2. Wizard creates `tenant` → links profile → creates `tenant_features`
3. Redirects to `/dashboard`

### Phase 4: Homepage Update

Update `Index.tsx` landing page:
- Clear CTA: "Create Your School" → signup as admin
- Role-based login buttons (admin/teacher/student/parent)
- Pricing section (Basic/Premium/Enterprise)
- Clean up Navigation component

### Phase 5: Dashboard Workflows per Role

**Admin Dashboard** — after onboarding:
- Add teachers (creates auth user + profile + teacher record)
- Add classes
- Add students (creates auth user + profile + student record)
- Invite parents (creates auth user + profile + parent record linked to student)

**Teacher Dashboard** — after login:
- View assigned classes, mark attendance, manage exams

**Student Dashboard** — after login:
- View schedule, grades, attendance

**Parent Dashboard** — after login:
- View child's progress, fees, attendance

### Phase 6: Fix All Build Errors

All files referencing `supabase.from('tablename')` will work once:
1. Tables exist in DB (Phase 1)
2. Types are regenerated automatically after migration
3. Components use proper typed queries

Files to fix: `OnboardingWizard.tsx`, `SchoolOnboardingWizard.tsx`, `TranscriptGenerator.tsx`, `OnlineExamPortal.tsx`, `QuestionBankManager.tsx`, `AdminAuthContext.tsx`, `useActivityLog.tsx`, `useStudents.tsx`, `useDashboardData.tsx`, `useTenant.tsx`

For tables not yet created (exam-related like `student_exam_attempts`, `question_bank`, `transcripts`, `student_answers`, `subjects`), we either add them to the migration or use type assertions with `as any` to defer those modules.

## Technical Details

**Migration SQL** creates ~10 tables with:
- `profiles` with trigger `on_auth_user_created` to auto-insert
- `tenants` with all branding/config columns
- `tenant_features` for module toggles
- `classes`, `students`, `teachers`, `parents` with proper FKs
- `activity_logs` for audit trail
- RLS policies: users see own profile, admins see tenant data

**Auth flow**:
- Supabase `signUp` with `user_metadata: { full_name, role }`
- Trigger creates profile with role from metadata
- `onAuthStateChange` loads profile → sets user context

**Estimated files changed**: ~12-15 files

