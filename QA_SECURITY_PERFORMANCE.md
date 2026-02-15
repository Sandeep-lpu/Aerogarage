# QA, Security, and Performance Checklist

## 1. End-to-End Functional Testing

### Automated smoke test
1. Start backend (`server`) and frontend (`aerogarage`).
2. Run:
   - `cd server`
   - `npm run qa:smoke`
3. Expected result: `E2E smoke passed`

This script validates:
- register and login flow
- protected route without token (`401`)
- protected route with token (`200`)
- RBAC denial check (`403`)
- public content endpoint availability

## 2. API Security Checks

### Enabled protections
- Security headers middleware (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
- Global API rate limit on `/api/*`
- Auth endpoint throttling for `/api/auth/login` and `/api/auth/register`
- Request sanitization against dangerous object keys (`$` and `.`) and null-byte stripping

### Manual security checks
1. Login brute force:
   - Send repeated `POST /api/auth/login` attempts from same IP
   - Expect `429` after threshold
2. API flood:
   - Repeatedly call `/api/public/health`
   - Expect `429` after threshold
3. NoSQL operator injection:
   - Send payload with keys like `{ "$where": "..." }`
   - Expect sanitized payload processing / validation failure

## 3. Frontend Performance and Accessibility

### Improvements applied
- `Alert` now uses `role="status"` and `aria-live="polite"` for assistive tech
- `Button` now defaults to `type="button"` to avoid accidental form submits
- `index.html` includes `theme-color`
- Hero fallback image is preloaded for faster first paint

### Validation commands
1. `cd aerogarage`
2. `npm run lint`
3. `npm run build`

### Manual browser checks
1. Lighthouse (Performance + Accessibility) on Home, Client Dashboard, Training Dashboard, Admin Dashboard
2. Keyboard navigation:
   - tab through all interactive elements
   - verify focus visibility
3. Reduced motion:
   - enable OS reduced motion
   - verify media stage fallback behavior
