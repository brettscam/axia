# DECISIONS.md — Axia

> This file is the running log of decisions made during development. Claude Code updates it at each session checkpoint and at session end. If a decision conflicts with `CLAUDE.md`, `CLAUDE.md` wins — flag the conflict.

---

## Format

Each entry:
```
### YYYY-MM-DD — [Short decision title]
- **Context**: what triggered this
- **Decision**: what we chose
- **Alternatives considered**: what we rejected and why
- **Assumptions**: anything unverified
```

---

## Locked decisions (carried forward from strategic review)

### 2026-04-11 — Product identity: document-first
- **Context**: PRD described a data-platform product; kickoff drifted toward editor-first.
- **Decision**: MVP is a document editor with Claude narrative generation. Comps/adjustments are supporting data, not the headline feature.
- **Alternatives considered**: Data-first (rejected: competing on comp depth requires MLS access we don't have). Workflow-first (rejected: no orders yet).

### 2026-04-11 — Comp data: ATTOM for demo, MLS direct for launch
- **Context**: No existing data feed; PRD assumed MLS from day one.
- **Decision**: ATTOM API (30-day trial → paid) for the MVP. MLS direct deals pursued in parallel, targeted for launch.
- **Assumptions to verify**: ATTOM's trial tier includes sufficient comp coverage in the Phoenix test market. Check by end of Week 3.

### 2026-04-11 — First AI feature: Subject Property Description
- **Context**: "All narrative sections equally" isn't actionable; need a single Week 4 target.
- **Decision**: Subject Property Description. Inputs are form fields we control; output demos the core value prop clearly.
- **Alternatives considered**: Market conditions (rejected: depends on market data we don't have yet). Comp commentary (rejected: depends on comps being reliable, which ATTOM trial may not deliver).

### 2026-04-11 — AI architecture: Claude API only, via Edge Functions
- **Context**: PRD mentioned trained ML models; we have no data or ML team.
- **Decision**: All AI = Claude API calls from Supabase Edge Functions. No training, no ML pipeline, no model storage.
- **Revisit when**: We have 10+ appraisers using the product and a real dataset of human-corrected outputs.

### 2026-04-11 — Cut from MVP
- Yjs / real-time collaboration
- Kanban pipeline
- Clients CRUD UI (schema stays)
- Google OAuth
- Mobile app
- USPAP compliance engine

---

## Session log (append below)

### 2026-04-12 — Tailwind v4 (not v3)
- **Context**: `npm install tailwindcss` installed v4.2.2 (current latest). CLAUDE.md says "Tailwind CSS" but does not pin a version.
- **Decision**: Use Tailwind v4 with CSS-based `@theme` configuration and `@tailwindcss/vite` plugin. No `tailwind.config.js` — tokens defined in `src/index.css`.
- **Alternatives considered**: Downgrading to Tailwind v3 (rejected: v4 is stable, ships by default, and the CSS-based config is cleaner for our token setup).
- **Assumptions to verify**: All Tailwind utility classes used in the project work identically in v4 vs v3. If any v3-specific patterns are needed later, flag it.

### 2026-04-12 — TypeScript 6, no baseUrl
- **Context**: Vite scaffold installed TypeScript 6.0.2. `baseUrl` is deprecated in TS 6 (will be removed in TS 7).
- **Decision**: Use `paths` without `baseUrl` in `tsconfig.app.json`. Vite `resolve.alias` handles the actual resolution at build time.
- **Alternatives considered**: Adding `ignoreDeprecations: "6.0"` (rejected: kicks the can; better to use the modern approach now).

### 2026-04-12 — Vite 8 + React plugin
- **Context**: `create-vite` scaffolded Vite 8.0.8 with `@vitejs/plugin-react`. CLAUDE.md specifies "Vite" without a version.
- **Decision**: Use Vite 8 as scaffolded. No reason to downgrade.
- **Assumptions to verify**: None — Vite 8 is backwards-compatible with the config patterns we need.

### 2026-04-12 — Google Fonts for Inter + JetBrains Mono
- **Context**: CLAUDE.md specifies Inter and JetBrains Mono font families but doesn't specify how to load them.
- **Decision**: Load via Google Fonts `<link>` tags in `index.html` for simplicity. No self-hosted fonts for MVP.
- **Assumptions to verify**: Google Fonts availability is acceptable for the MVP (no offline requirement).

### 2026-04-12 — Supabase project connected
- **Context**: Supabase project provisioned at `lryltfufrceraizdxkwx.supabase.co`. Vercel domain: `axia-mu.vercel.app`.
- **Decision**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` stored in `.env.local` (gitignored). Supabase agent skills installed via `npx skills add supabase/agent-skills`.
- **Assumptions to verify**: Anon key has correct RLS-gated permissions once schema is applied.
