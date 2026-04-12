/**
 * Axia Design Tokens
 * Single source of truth for brand colors, typography, and spacing.
 * Import from here everywhere — never hardcode brand values.
 */

export const colors = {
  // Primary
  ink: '#0B1E3F',        // Axia Ink — primary, headers, logo outline
  gold: '#C9A961',       // Valuation Gold — AI-generated content ONLY
  sage: '#4A6B5C',       // Surveyor Sage — verified/approved/success ONLY

  // Neutrals
  slate: '#1F2937',      // Body text
  fog: '#6B7280',        // Secondary text, borders
  parchment: '#F7F5F0',  // Background (warm off-white)

  // Signal
  flag: '#B54548',       // Errors, compliance warnings

  // Derived / tinted
  goldTint: 'rgba(201, 169, 97, 0.15)',
  sageTint: 'rgba(74, 107, 92, 0.15)',
  goldTextOnTint: '#7A6423',
} as const;

export const fonts = {
  display: "'Fraunces', Georgia, serif",           // Headlines, logo wordmark
  body: "'Inter', -apple-system, sans-serif",      // UI, body
  mono: "'JetBrains Mono', ui-monospace, monospace", // Data, numbers
} as const;

export const typeScale = {
  h1: { size: '22px', weight: 500, lineHeight: 1.2 },
  h2: { size: '18px', weight: 500, lineHeight: 1.3 },
  h3: { size: '16px', weight: 500, lineHeight: 1.4 },
  body: { size: '16px', weight: 400, lineHeight: 1.6 },
  small: { size: '13px', weight: 400, lineHeight: 1.5 },
  label: { size: '11px', weight: 500, lineHeight: 1.4, letterSpacing: '0.12em' },
} as const;

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
} as const;

export const motion = {
  // Durations
  fast: '0.3s',
  base: '0.6s',
  slow: '1.2s',
  loop: '2.4s',

  // Easings
  standard: 'cubic-bezier(0.65, 0, 0.35, 1)',
  loopEase: 'ease-in-out',
} as const;

/**
 * SEMANTIC RULES — enforce these in code review:
 * - gold  = AI-generated content ONLY (suggestions, confidence scores, AI badges)
 * - sage  = verified/approved/success states ONLY
 * - ink   = primary structure, never decorative
 * - flag  = errors and compliance warnings ONLY
 */
