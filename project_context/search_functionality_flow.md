# Phase 1 — MVP (Simple, Not Too Simple)

## Goals

- Turn “teach me X” into an iterative flow: **probe → plan → edit steps → run steps (teach + micro-quiz) → recap**.
- Keep brand model names visible in UI (e.g., “Gemini 2.0 Flash”, “GPT-4o Mini”), but make backend provider-agnostic.
- Reuse your stack: **Next.js + Vercel serverless + Supabase (DB + Storage + Auth)**.

---

## Primary User Flow (Happy Path)

1. **Start**
   - User clicks Tutor (or “Learn with a tutor”) and types: “Teach me C programming”.
   - UI asks one knowledge probe (“What do you already know?” + chips: total beginner / watched YouTube / did a course).

2. **Draft Plan**
   - Backend generates a 6–8 step plan (titles + short goals).
   - UI opens a Step Editor modal: user can rename, reorder, delete/add steps.
   - User clicks Start.

3. **Run Step 1**
   - Tutor explains briefly (≤200 words), then asks one micro-question.
   - User answers → instant feedback + hint if wrong.
   - Automatic 1-minute recap + 2 flashcards added.

4. **Advance**
   - Move to next step; repeat explain → micro-quiz → recap.

5. **Finish**
   - Shows session summary and links to generated flashcards.

---

## Screen Structure (Desktop; Auto-Collapse on 13″)

- **Left:** Steps list (progress dots).
- **Center:** Conversation (tutor + user).
- **Right:** Context pane (collapsible) showing: “Sources (from your uploads)”, generated flashcards, short recap.

---

## Data Needed (MVP)

- **Tutor session:** topic, level, chosen model brand + id, status.
- **Steps:** order, title, goal, status.
- **Messages:** tutor/user, per step.
- **Micro-quizzes:** 1 Q per step; result.
- **User model preference:** brand for UI, id for backend.

---

## Minimal API Surface (Vercel Serverless)

- `POST /api/tutor/session` → create session from topic + probe.
- `POST /api/tutor/plan` → return draft steps (array).
- `POST /api/tutor/plan/commit` → save edited steps.
- `POST /api/tutor/step/run` → stream tutor content + micro-quiz for a step.
- `POST /api/tutor/quiz/grade` → grade answer, return feedback.
- `POST /api/prefs/model` → save UI brand + internal provider id (e.g., gemini | openai).

> All endpoints auth-guarded; rate-limited.

---

## MVP Session & Step States

- `session.status`: `planning` → `active` → `completed`
- `step.status`: `draft` → `ready` → `running` → `done`

---

## ERD (Entities & Relations)