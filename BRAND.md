# Axia Brand System — Implementation Spec

This document is the source of truth for Axia's visual identity. Any UI work in this codebase must follow these rules. Import from `@/brand` — never hardcode brand values.

## Positioning

Axia is an AI-augmented appraisal workspace for independent residential appraisers. The brand personality is **precise, calm, confident, modern-professional** — think Linear x Stripe x trusted senior appraiser. Never "AI magic." Never loud.

---

## Color system

Import from `@/brand/tokens`. Semantic rules are non-negotiable:

| Token | Hex | Allowed usage |
|---|---|---|
| `colors.ink` | `#0B1E3F` | Primary structure, headers, logo, body emphasis |
| `colors.gold` | `#C9A961` | **AI-generated content ONLY** — suggestions, confidence pills, AI badges |
| `colors.sage` | `#4A6B5C` | **Verified / approved / success states ONLY** |
| `colors.flag` | `#B54548` | Errors and compliance warnings ONLY |
| `colors.parchment` | `#F7F5F0` | Page background (never pure white) |
| `colors.slate` | `#1F2937` | Body text |
| `colors.fog` | `#6B7280` | Secondary text, borders |

**Enforcement:** if a color has a semantic meaning (gold, sage, flag), it is reserved for that meaning. Do not use gold for decoration. Do not use sage for branding accents. This discipline is what makes the product feel coherent.

## Typography

- **Display / headings:** Fraunces (variable serif) — `fonts.display`
- **UI / body:** Inter — `fonts.body`
- **Numeric / tabular data:** JetBrains Mono — `fonts.mono`

Weights: **400 regular, 500 medium only**. Never 600 or 700 — they feel heavy against the warm parchment background.

Rules:
- Sentence case everywhere. No Title Case, no ALL CAPS (except small label text with `letter-spacing: 0.12em`).
- No mid-sentence bolding. Use code style for entity names.
- Property addresses use Fraunces. Numbers (price, sqft, adjustments) use JetBrains Mono for tabular alignment.

## Logo

Import `<Logo />` from `@/brand`. Variants:
- `color` (default) — full brand, navy outline with sage + gold inner lines
- `mono` — inherits `currentColor`, for print/watermarks
- `inverted` — parchment outline for navy/dark surfaces

Minimum size: 24px. Below that, use just the outline (omit inner lines).

## Motion system

Import from `@/brand`. Use the right state for the right action:

| Component | When to use |
|---|---|
| `<AxiaLoading />` | Generic page load, API fetch, any wait under 3s |
| `<AxiaThinking />` | AI is reasoning — generating comps, adjustments, narrative |
| `<AxiaSuccess />` | Report complete, saved, signed, delivered |
| `<AxiaDataSync />` | Pulling external data (MLS, Zillow, Redfin, public records) |
| `<AxiaStepped />` | Multi-step transition: fetch -> calculate -> build |

**Motion principles:**
- Duration: 1.2s-2.4s for loops, 0.6s for one-shot transitions. Never instant, never sluggish.
- Easing: `cubic-bezier(0.65, 0, 0.35, 1)` for entrances. `ease-in-out` for loops.
- All animations use `transform` and `opacity` only. No layout thrash, no shadows.
- `prefers-reduced-motion` is respected automatically via CSS.

**Do not invent new spinners or loading states.** Use these five.

## Component patterns

### The "AI pill" — ubiquitous pattern
Any AI-generated value gets a small pill indicating its origin and confidence. Keep it quiet.

```tsx
<div style={{
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: colors.goldTint, padding: '4px 10px',
  borderRadius: 999, fontSize: 11, letterSpacing: '0.03em',
  color: colors.goldTextOnTint, fontWeight: 500,
}}>
  <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.gold }} />
  AI - 94% MATCH
</div>
```

### Comp card — the most-viewed element in the product
Serif address + monospace data grid. Signals "this is a document, not a dashboard."
Primary fact in Fraunces, secondary fact in small fog text, data in JetBrains Mono.

### Background
Every page gets `background: colors.parchment`. Cards sit on parchment with a 0.5px `colors.fog` border and `radius.lg`. Never pure white.

---

## What NOT to build

- No gradients, mesh backgrounds, drop shadows, glow, or neon effects
- No emoji in UI text. No sparkle icons for AI features.
- No dark-mode-first design — this is a daylight professional tool
- No cute illustrations. Geometric icons only, 1.5px stroke, 24px grid.
- No "AI Magic," "Powered by AI," or similar language. Say "Suggested by Axia" or just show the gold pill.

## File layout

```
src/brand/
├── index.ts              # Barrel — import everything from here
├── tokens.ts             # Colors, fonts, motion, radius
├── logo/
│   ├── Logo.tsx          # React component, 3 variants
│   ├── axia-mark.svg     # Raw SVG, full color
│   └── axia-mark-mono.svg# Raw SVG, currentColor
└── motion/
    ├── AxiaMotion.tsx    # 5 animated state components
    └── motion.css        # All keyframes + reduced-motion support
```
