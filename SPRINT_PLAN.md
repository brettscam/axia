# SPRINT_PLAN.md — Axia MVP Phases

> **Principle**: Each phase ends with a shippable outcome. Finish a phase before starting the next. Move as fast as possible, but do not skip the shippable outcome — it is the proof the phase is done.

---

## Phase 1 — Auth + Empty Editor That Saves
**Shippable outcome**: Sign up, log in, create an appraisal, type into an editor that auto-saves and versions.

- [ ] Vite + React + TypeScript + Tailwind bootstrap
- [ ] Supabase project created; full schema applied **with the `status` check-constraint fix and the new `document_versions` table**
- [ ] Supabase client wrapper
- [ ] Email/password auth (signup, login, logout, protected routes)
- [ ] App shell with sidebar (Appraisals list + New Appraisal button)
- [ ] New Appraisal modal → creates row, redirects to editor
- [ ] Editor page with TipTap StarterKit
- [ ] Debounced auto-save (2s) to `appraisals.document_content`
- [ ] Version snapshot every 30s (if changed) to `document_versions`

**Out of scope**: Kanban, OAuth, client UI, photos, comps, AI.

---

## Phase 2 — Structured Appraisal + Sections
**Shippable outcome**: Editor has real appraisal structure; subject property form fields captured separately from prose.

- [ ] Subject property form (beds, baths, GLA, lot, year built, condition) → `appraisals` columns
- [ ] Section sidebar: Subject, Neighborhood, Site, Comparables, Adjustments, Reconciliation — named anchors in TipTap doc
- [ ] Section click-to-jump navigation
- [ ] Appraisals list view (table, not Kanban)
- [ ] Version history dropdown (preview last 10; restore later)

**Out of scope**: ATTOM, comps UI, AI.

---

## Phase 3 — ATTOM Integration + Comp Grid
**Shippable outcome**: Subject address triggers ATTOM fetch + candidate comps; user reviews comps in a grid.

- [ ] Edge Function `get-property-details` → ATTOM `/property/detail`, normalized + cached
- [ ] Edge Function `get-comparables` → ATTOM comps endpoint
- [ ] Auto-populate subject fields from ATTOM (user can override)
- [ ] Comp search panel (radius, date range, property-type filters)
- [ ] Comp grid: subject + comps side-by-side
- [ ] Add/remove comps → `comparables` table
- [ ] Basic heuristic similarity score (distance + GLA + age; NO ML)

**Out of scope**: AI narrative, adjustments, PDF export.

**Risk checkpoint**: If ATTOM trial coverage is poor in your test market, hand-seed 5–10 comps for one Phoenix zip. Decide mid-phase, not at the end.

---

## Phase 4 — First AI Feature: Subject Property Description
**Shippable outcome**: Click Generate Description → Claude writes 2–3 paragraphs → editable prose in the editor.

- [ ] `ai_generations` table (`id, appraisal_id, feature, prompt, output, user_action, created_at`)
- [ ] Edge Function `generate-subject-description` using `claude-sonnet-4-6`; logs to `ai_generations`
- [ ] Editor UI: "Generate description" button in Subject section
- [ ] Generated text inserted as editable TipTap block with AI-generated marker
- [ ] Regenerate / Accept / Reject → updates `ai_generations.user_action`
- [ ] PDF export of the full document (pick `react-pdf` vs. Edge Function + puppeteer in-session)

**Out of scope**: market conditions, comp commentary, adjustments reasoning, photo analysis — all in `BACKLOG.md`.

---

## Definition-of-Done Demo Script

1. Log in
2. New Appraisal → real Phoenix address
3. Subject fields auto-populate from ATTOM
4. Fill any gaps manually
5. Generate Description → 2–3 paragraphs appear
6. Edit the prose
7. Export PDF → download

**If this flow works end-to-end on a real property you're appraising, MVP ships. Next-phase planning happens then, not before.**
