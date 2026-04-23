# D3: Dark Page Mapping and IA Alignment

Status: `Implemented`

## Objective
Apply dark visual consistency page-by-page without changing existing information architecture or route behavior.

## Pages Covered
- Home (`/`)
- About (`/about`)
- Services hub (`/services`)
- Service Areas detail templates (`/services/*`)
- Training (`/training`)
- Careers (`/careers`)
- Contact (`/contact`)
- Not Found fallback

## Page-Level Mapping Rules
- Hero sections:
  - Use `--amc-gradient-hero`.
  - Badge style uses `.amc-hero-badge`.
  - Intro paragraph uses `.amc-hero-lead`.
  - Supporting text uses `.amc-hero-support`.
  - Secondary CTA uses `.amc-hero-secondary-btn`.
- Background image pages:
  - Keep `amc-page-bg` + page-specific class with dark overlay.
  - Avoid raw text on image; text always on overlay or card.
- Cards and tables:
  - Surfaces must resolve through theme tokens.
  - No hardcoded white backgrounds in active pages.
- Forms:
  - Inputs/selects/textareas must use `--amc-bg-field`.

## Implementation Notes
- Added shared dark-safe utility classes in `src/index.css`.
- Replaced hardcoded hero text/button classes in public pages with theme classes.
- Updated fallback/public wireframe artifacts to token-based colors.

## Result
- Public route set is visually consistent in dark mode.
- Service Area pages now inherit the same hero visual standard.
