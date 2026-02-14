# Project Architecture (Phase-ready)

## Frontend (`aerogarage`)
- `src/modules/public` -> public website pages and features
- `src/modules/client` -> airline/airport client portal
- `src/modules/training` -> student training portal
- `src/modules/admin` -> internal admin system
- `src/components` -> shared UI blocks
- `src/services` -> API and auth clients

## Backend (`server`)
- `src/modules/auth` -> login/roles/token handling
- `src/modules/public` -> public APIs (contact, services, careers)
- `src/modules/client` -> client portal APIs
- `src/modules/training` -> training portal APIs
- `src/modules/admin` -> admin APIs
- `src/shared` -> common models/constants

## Current runtime files kept intact
- `server/server.js`
- `server/config/db.js`

Next: implement Phase 1 routing + base layouts.
