# D1: Dark Theme Token Spec (Design-Only)

Status: `Proposed (not yet implemented)`

## Objective
Create a premium institutional dark visual system for AMC public site and portals without changing layout architecture.

## Theme Intent
- Authority-first, audit-ready, safety-led.
- No neon/gaming glow.
- Strong contrast and long-form readability.

## Core Tokens
Use these as the default dark palette proposal.

```css
/* D1 proposal: do not activate until implementation phase */
[data-theme="amc-dark"] {
  color-scheme: dark;

  --amc-bg-main: #0a1220;
  --amc-bg-surface: #111c2e;
  --amc-bg-card: #162338;
  --amc-bg-navy: #08111d;

  --amc-text-strong: #e6edf7;
  --amc-text-body: #b8c4d9;
  --amc-text-muted: #8fa0bc;

  --amc-border: #24324a;

  --amc-accent-700: #1d4ed8;
  --amc-accent-600: #2563eb;
  --amc-accent-500: #3b82f6;
  --amc-accent-400: #60a5fa;

  --amc-success-600: #10b981;
  --amc-warning-600: #f59e0b;
  --amc-danger-600: #ef4444;

  --amc-shadow-sm: 0 2px 8px rgba(2, 8, 23, 0.35);
  --amc-shadow-md: 0 10px 30px rgba(2, 8, 23, 0.4);
  --amc-shadow-lg: 0 24px 60px rgba(2, 8, 23, 0.46);

  --amc-gradient-hero: linear-gradient(135deg, #0a1220 0%, #111c2e 55%, #163252 100%);
  --amc-gradient-surface: linear-gradient(160deg, #111c2e 0%, #0d1728 100%);
}
```

## Surface Layering Rules
- Layer 0 (`bg-main`): app/page background.
- Layer 1 (`bg-surface`): section shells.
- Layer 2 (`bg-card`): cards, forms, tables, modal content.
- Borders: always visible, low-contrast steel edge (`--amc-border`).

## Typography and Contrast Rules
- Heading color: `--amc-text-strong`.
- Body color: `--amc-text-body`.
- Muted/supporting labels: `--amc-text-muted`.
- Target contrast:
  - Body text >= 4.5:1
  - Headings/primary CTAs >= 7:1

## Accent Usage Rules
- Blue accents for action and key numeric signals only.
- Success/warning/danger reserved for status states.
- Do not use accent blue for large paragraph text blocks.

## Motion + Elevation in Dark
- Motion durations remain existing tokens (`160/260/420ms`).
- Prefer shadow + border together (shadow-only feels muddy on dark surfaces).
- Hover lift: max `translateY(-3px)` for cards and buttons.

## Background Art Direction
- Use low-opacity technical grid/noise texture overlays.
- Watermarks: max opacity `3% - 5%`.
- Avoid hard glows behind text blocks.

## Implementation Guardrails
- No token deletion from light mode; dark should be additive.
- No forced dark mode for all users in first release.
- Keep `prefers-reduced-motion` compatibility.
