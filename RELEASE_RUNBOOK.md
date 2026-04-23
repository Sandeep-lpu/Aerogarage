# Release Runbook

## 1) Pre-Release Gates
- [ ] `server`: `npm run qa:smoke` passes
- [ ] `aerogarage`: `npm run lint` passes
- [ ] `aerogarage`: `npm run build` passes
- [ ] `QA_MANUAL_SIGNOFF.md` completed
- [ ] Environment variables verified

## 2) Environment Configuration

### Backend required
- `MONGO_URI`
- `PORT`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `API_RATE_LIMIT_WINDOW_MS`
- `API_RATE_LIMIT_MAX`
- `AUTH_RATE_LIMIT_WINDOW_MS`
- `AUTH_RATE_LIMIT_MAX`

### Frontend required
- `VITE_API_BASE_URL`

## 3) Deployment Order
1. Deploy backend API.
2. Verify API health (`/api/health`).
3. Deploy frontend build.
4. Verify public routes and portal logins.

## 4) Post-Deploy Smoke
- [ ] `/api/health` returns `200`
- [ ] Public pages load
- [ ] Contact form request succeeds
- [ ] Client, training, admin login path works
- [ ] Protected APIs reject missing token (`401`)

## 5) Rollback Plan
1. Roll back frontend to previous stable build.
2. Roll back backend to previous stable build.
3. Re-test `/api/health`, auth login, and one protected endpoint.
4. Announce incident summary and next action window.

## 6) Release Signoff
- Release owner:
- Date/time:
- Version/tag:
- Approval notes:
