# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Dream AI official website monorepo. The main deliverable is `apps/site-web`, a Next.js 14 App Router project containing both the public-facing website and a full admin backoffice (`/admin/*`). A read-only Go backend reference lives in `server-readonly/` (gitignored) for API contract lookup only — never edit it.

## Common commands

All commands run from `apps/site-web/` unless noted:

```bash
npm run dev         # Start dev server (default port 3000)
npm run build       # Production build (standalone output for Docker)
npm run start       # Start production server
npm run lint        # ESLint via next lint
```

No test suite exists yet.

## Environment variables

- `NEXT_PUBLIC_SITE_API_BASE_URL` — backend API base (e.g. `https://api.dreamlog.com/api/v1`). Required at build time because `NEXT_PUBLIC_*` values are inlined.
- `NEXT_PUBLIC_OSS_HOST` — Aliyun OSS host for Next.js image remote patterns (build-time).
- `NEXT_PUBLIC_ENABLE_SITE_API_FALLBACK` — when set to `"false"`, disables the dev-mode fallback data in the public site API layer.

Copy `.env.example` to `.env.local` for local development.

## Architecture

### Route structure (App Router)

```
/                          Public homepage
/about, /features, /faq, /blog, /download, /contact, /privacy, /terms
/admin/login              Admin login (public, no auth)
/admin/*                  All admin pages (protected by client-side auth)
```

The root layout (`src/app/layout.tsx`) fetches site config server-side and wraps everything in `AppFrame`. The admin layout (`src/app/admin/layout.tsx`) wraps admin routes in `AdminShell`, which handles session bootstrapping, token refresh, and logout.

### API layer (src/lib/api/)

Four client modules, all calling the same Go backend:

| Module | Side | Purpose |
|--------|------|---------|
| `site.ts` | Server | Public site data fetches with ISR (`revalidate: 120`). Falls back to static fixture data in non-production when the backend is unreachable. |
| `site-admin.ts` | Client | Site CMS CRUD: config, features, FAQs, posts, download links. All calls require a Bearer token. |
| `admin-auth.ts` | Client | Login (password + SMS code), session refresh, logout. Converts snake_case API responses to camelCase via helper readers. |
| `admin-console.ts` | Client | Operations console: user management, billing/orders/products, points ledger, device management. |

### Admin auth flow

1. User logs in via `loginAdmin()` / `loginAdminByCode()`.
2. The returned session (access token, refresh token, user info) is persisted to `localStorage` under keys `dreamai-admin-token` and `dreamai-admin-session`.
3. `AdminShell` bootstraps on every admin page load: validates current token via `GET /admin/session`, auto-refreshes with refresh token if expired, redirects to `/admin/login` on failure.
4. All admin API calls attach `Authorization: Bearer <token>`.
5. `useAdminToken` hook manages session state and cross-tab sync via `storage` events.

### Middleware

`middleware.ts` assigns a persistent device ID cookie (`x-dreamai-device-id`) to every request (excluding Next.js static assets). Server-side fetches forward this header to the backend via `getServerDeviceHeaders()`; client-side calls use `getClientDeviceHeaders()`.

### Fallback system

`src/lib/site-fallback.ts` provides static fixture data for all public site endpoints. The server-side API layer (`site.ts`) uses these when:
- `NODE_ENV !== "production"` AND `NEXT_PUBLIC_ENABLE_SITE_API_FALLBACK` is not explicitly `"false"`
- An actual API call fails

This allows developing the public site UI without a running backend.

### Component organization

- `src/components/layout/` — `AppFrame` (public shell) and `SiteShell`
- `src/components/sections/` — public page sections (hero, features, FAQs, posts, downloads)
- `src/components/admin/` — admin components: `AdminShell`, `AdminNav`, form controls, and per-feature admin pages

Admin page components are typically named `*-admin-page.tsx` (e.g. `site-config-admin-page.tsx`) and colocated in `src/components/admin/`, while route entry points live in `src/app/admin/*/page.tsx`.

### Types

- `src/types/site.ts` — public site content types (SiteConfig, SiteFeature, SiteFaq, SitePost, SiteDownloadLink)
- `src/types/admin.ts` — admin console types (user management, billing, products, point ledgers)

## Deployment

Docker-based deploy via GitHub Actions (`.github/workflows/deploy-site-web.yml`):

1. Push to `master` with changes under `apps/site-web/**` triggers the workflow.
2. GitHub Actions builds a standalone Docker image and pushes it to `ghcr.io`.
3. SSH deploys to a single Ubuntu server (`62.234.138.193`), stops the old container, and starts the new one.
4. Nginx reverse-proxies `:3000` with SSL termination.

Build args `NEXT_PUBLIC_SITE_API_BASE_URL` and `NEXT_PUBLIC_OSS_HOST` must be set as GitHub Secrets.

Full deployment guide: `DEPLOY.md`.

## Key constraints

- **Never edit `server-readonly/`** — it's gitignored and exists only as an API contract reference.
- If a frontend feature needs a backend capability that doesn't exist yet, the backend team must implement it first. Do not mock unimplemented APIs in the admin layer.
- Admin pages should follow the incremental refactor approach: extract admin layouts first, then modularize pages, then add filtering/validation. Do not rewrite from scratch.
- `NEXT_PUBLIC_*` env vars are build-time only — they must be passed via `--build-arg` in Docker builds, not set at runtime.
