# D2: Dark Component Spec (Design-Only)

Status: `Proposed (not yet implemented)`

## Scope
This spec defines dark-mode behavior for reusable AMC UI primitives and key page sections.

## 1) Header + Navigation
- Header background: `rgba(10, 18, 32, 0.88)` with blur.
- Border bottom: `1px solid var(--amc-border)`.
- Nav links:
  - Default: `--amc-text-body`
  - Hover: `--amc-text-strong`
  - Active: `--amc-accent-500`
- Client Portal button: primary gradient blue.

## 2) Hero Section
- Base background: dark hero gradient token.
- Overlay: subtle engineering grid (very low alpha).
- Watermark text opacity: `0.03 - 0.05`.
- Typography:
  - H1 weight: `600`
  - Tracking: `-0.02em`
  - Lead/body line-height: `1.75 - 1.9`

## 3) Buttons
- Primary:
  - Background: `linear-gradient(180deg, #4f7dff 0%, #2f5bff 100%)`
  - Text: `#ffffff`
  - Hover: darken by one stop
  - Shadow: layered (tight + broad)
- Secondary:
  - Transparent/dark fill
  - Border: `1px solid rgba(96, 165, 250, 0.5)`
  - Hover: slight surface lift + stronger border
- Ghost:
  - No heavy fill
  - Keep focus ring prominent

## 4) Cards (Standard + Glass Variant)
- Standard card:
  - Background: `--amc-bg-card`
  - Border: `--amc-border`
  - Shadow: `--amc-shadow-sm` or `--amc-shadow-md`
- Glass card (use selectively):
  - `background: rgba(22, 35, 56, 0.72)`
  - `backdrop-filter: blur(10px)`
  - Border remains mandatory
- Card hover:
  - Max lift `-3px`
  - Slight border tint to accent

## 5) Badges + Pills
- Info badge: dark blue tint background, light blue text.
- Success badge: green tint background.
- Trust pills: muted dark chip with thin border.

## 6) Inputs + Select + Textarea
- Field background: `#0f1a2c`
- Text: `--amc-text-strong`
- Placeholder: `--amc-text-muted`
- Border: `--amc-border`
- Focus:
  - Border -> `--amc-accent-500`
  - Ring -> `rgba(59, 130, 246, 0.25)`
- Validation:
  - Error text + border use danger token.

## 7) Tables
- Header row: darker elevated strip.
- Body rows: subtle zebra (`+/- 3%` brightness).
- Row hover: light blue tint overlay.
- Sticky header retains border clarity.

## 8) Sections + Backgrounds
- Use page-specific background images with unified dark overlay:
  - overlay gradient + radial accents + optional grid texture.
- Section containers keep card/elevated surfaces for readability.
- Avoid direct text over raw photos.

## 9) Modal + Alert + Tabs
- Modal panel:
  - `--amc-bg-card`, border, strong drop shadow.
- Alert:
  - Info/success/warning/danger each with tinted dark background + colored left edge.
- Tabs:
  - Inactive: muted text on dark track.
  - Active: accent text + subtle fill.

## 10) Data Visualization Rules
- Numeric highlights (KPIs): accent blue.
- Labels: muted text.
- Count-up animation allowed once on first viewport reveal.

## 11) Accessibility + QA
- Keyboard visible focus for every interactive element.
- Do not communicate status with color only; include text/icon cues.
- Respect `prefers-reduced-motion`.
- Test matrix:
  - Desktop wide
  - Laptop
  - Tablet portrait/landscape
  - Mobile (iOS + Android minimum one real device)

## 12) Rollout Plan (After Approval)
1. Apply D1 tokens in `tokens.css` as additive `data-theme="amc-dark"`.
2. Update shared UI primitives (`Button`, `Card`, `Input`, `Table`, `Section`).
3. Apply section-level classes page-by-page (Home -> About -> Services -> Training -> Careers -> Contact -> Service Areas).
4. Run Lighthouse + contrast + keyboard QA pass.
