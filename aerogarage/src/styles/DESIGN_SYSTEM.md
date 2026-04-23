# AMC Design System v1 (Phase 3.1)

## Visual Intent
- Trust-first, safety-driven, authority-grade corporate aviation UI.
- Serious institutional tone: no neon, no playful blobs, no bouncy motion.

## Motion Principles
- Allowed: fade-in, slide-up, controlled reveals.
- Duration tokens: 160ms / 260ms / 420ms.
- Easing: cubic-bezier(0.2, 0, 0, 1).

## 3D Rules
- Use realistic, infrastructure-scale visuals.
- Slow camera, stable angles, premium lighting.
- 3D should support content comprehension, not distract.

## Theme Strategy
- Light-first public site via :root tokens.
- `data-theme="ops-dark"` ready for operations dashboards.

## Primitive Library
- Button, Container, Section, Card, Badge, Title, TextBlock, Input, Select, Table, Modal, Alert, Tabs.

## Responsiveness
- Container width: up to 1280px.
- Spacing follows 8px system.
- Optimized for monitor, operations room displays, tablet, mobile.

## Dark Mode Design Specs (Pre-Implementation)
- D1 tokens spec: `aerogarage/src/styles/D1_DARK_TOKENS_SPEC.md`
- D2 component spec: `aerogarage/src/styles/D2_DARK_COMPONENT_SPEC.md`
- D3 page mapping: `aerogarage/src/styles/D3_DARK_PAGE_MAPPING.md`
- D4 QA signoff: `aerogarage/src/styles/D4_DARK_QA_SIGNOFF.md`
