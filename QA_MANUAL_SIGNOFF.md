# Manual QA Signoff Checklist

## Scope
This sheet covers manual-only validation required to close `P10`.

## Environments
- Frontend: local build preview / staging URL
- Backend: local API / staging API

## Device Matrix
- Desktop: Chrome (latest)
- Desktop: Edge (latest)
- Mobile: one real Android or iOS device

## Checklist

### Public Website
- [ ] Home page renders correctly above-the-fold and below-the-fold
- [ ] About page quick-nav buttons scroll to correct sections
- [ ] Services cards and detail pages open correctly
- [ ] Contact form success and error states render correctly
- [ ] Header and footer logo visibility is correct in light/dark areas

### Portals and Auth
- [ ] Client register -> login -> dashboard flow works
- [ ] Training login -> dashboard flow works
- [ ] Admin login -> dashboard flow works
- [ ] Logout works on all portals
- [ ] Direct dashboard URL without auth redirects to login

### Accessibility and UX
- [ ] Keyboard tab order is logical
- [ ] Focus ring visible for interactive elements
- [ ] Contrast is readable for hero/buttons/body text
- [ ] Reduced-motion behavior is acceptable

### Performance
- [ ] Home Lighthouse run reviewed
- [ ] No blocking visual jank on first render

## Signoff
- Tester name:
- Date:
- Environment:
- Notes:
