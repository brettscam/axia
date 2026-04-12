# CLAUDE.md — Axia Project Constitution

> **Read this file at the start of every session.** Before doing any work, summarize back to me the 3 most important constraints in this file. If you skip this step, stop and restart.

---

## 1. What Axia Is (and Isn't)

**Axia is**: A web-based appraisal document editor for a solo appraiser. The user enters a subject address, we pull property data + comps from ATTOM, the user reviews/edits in a grid, and Claude generates narrative prose that lands as editable text in a TipTap editor. PDF export at the end.

**Axia is NOT (for MVP)**:
- Multi-user collaborative editing (no Yjs, no realtime)
- A CRM or pipeline tool (no Kanban, no client management UI)
- An ML training platform (no trained models — Claude API only)
- A mobile app (web-responsive is enough)
- A full USPAP-compliant report generator

If a feature isn't explicitly in `SPRINT_PLAN.md`, **do not build it**. Ask first.

---

## 2. Locked Technical Decisions (do not re-litigate)

| Decision | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (use `axia` color tokens) |
| State | Zustand (no Redux) |
| Data fetching | TanStack Query |
| Editor | TipTap (JSON in `appraisals.document_content`) |
| Backend | Supabase (Postgres + Auth + Edge Functions + Storage) |
| AI calls | **Supabase Edge Functions only** — never the browser |
| Hosting | Vercel frontend + Supabase backend |
| Auth | Email/password only for MVP (no Google OAuth yet) |
| Comp data | ATTOM API via Edge Function — `https://api.gateway.attomdata.com/propertyapi/v1.0.0/` |
| AI model | `claude-sonnet-4-6` |

If you think one of these is wrong, **flag it in chat — do not change it**.

---

## 3. Security Non-Negotiables

1. **No API keys in the browser.** No `VITE_ANTHROPIC_API_KEY`, no `VITE_ATTOM_API_KEY`. Keys live in Supabase Edge Function secrets.
2. **All AI and third-party API calls go through Edge Functions.** Browser → our Edge Function → Anthropic/ATTOM.
3. **RLS enabled on every table.** Never disable it.
4. **Never log PII** (addresses, names, photos) to console or third-party error services in production.

---

## 4. Schema Rules

1. The `appraisals.status` check constraint currently excludes `'draft'` but the default IS `'draft'` — **bug**. Add `'draft'` to the check constraint before applying schema.
2. **Every document save writes to `document_versions`**, not just `appraisals.document_content`:
   ```sql
   create table public.document_versions (
     id uuid default uuid_generate_v4() primary key,
     appraisal_id uuid references public.appraisals(id) on delete cascade not null,
     content jsonb not null,
     created_by uuid references public.profiles(id),
     created_at timestamptz default now()
   );
   ```
3. Auto-save writes a new version at most every 30s (debounced); manual saves always write.
4. The `clients` table stays in the schema, but the MVP UI only uses a `client_name` text reference. No clients CRUD UI.

---

## 5. Coding Conventions

- Feature-based file structure: `src/features/appraisal/`, `src/features/comps/`, `src/features/ai/`.
- One component per file, named export, `.tsx`. Props interface named `Props`.
- Hooks prefixed `use`. Data-fetching hooks wrap TanStack Query.
- Never call Supabase directly from components — go through hooks.
- Edge Functions: TypeScript, one per concern, in `supabase/functions/<n>/index.ts`.
- Every async operation has an error state in the UI. No silent failures.

---

## 6. How to Handle Ambiguity

1. Check `DECISIONS.md` for prior choices.
2. If still unclear, ask in chat with a specific A/B question. Don't guess.
3. If you made an assumption to keep moving, log it to `DECISIONS.md` under "Assumptions to verify" and mention it in your next response.

**Signs to stop and restart the session**: re-reading a file you read earlier, contradicting this file, asking a question already answered in `DECISIONS.md`.

---

## 7. Session Discipline

1. **Start**: Read `CLAUDE.md`, `DECISIONS.md`, `SPRINT_PLAN.md`. Summarize the 3 most important constraints.
2. **Middle**: One task from the sprint plan. If a second task emerges, write it to `BACKLOG.md` for later — don't start it.
3. **Checkpoints**: Update `DECISIONS.md` with choices made and assumptions to verify.
4. **End**: Git commit with a message naming the single scope. If you can't name it in one line, the session did too much.

---

## 8. The First AI Feature (Phase 4)

**Subject Property Description narrative generator.**

- Input: structured subject form fields (address, beds/baths, GLA, lot, year built, condition) + optional photos (stub for now)
- Output: 2–3 paragraph descriptive prose at the cursor in the TipTap editor
- Edge Function: `supabase/functions/generate-subject-description/`
- Model: `claude-sonnet-4-6`
- UI: Regenerate / Accept / Reject actions
- Audit: log prompt, output, and user action to `ai_generations`

**Do not build market-conditions, comp commentary, or adjustments reasoning in Phase 4.** Those live in `BACKLOG.md` and wait until the Phase 4 demo passes.
