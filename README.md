# Internship Application Coordinator — Frontend

React + TypeScript coordinator dashboard for processing student internship applications.

## Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Architecture, API contract, local setup (shared with backend) |
| [FRONTEND_TASKS.md](./FRONTEND_TASKS.md) | Task plan for **Nizamettin** and **Alvin** |

## Quick start (local)

```bash
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

### Connect to the real backend (default)

1. Start the backend on `http://localhost:8080` (see `PROJECT_OVERVIEW.md`).
2. Copy `.env.example` → `.env` (MSW is **off** by default).
3. Confirm Aykut enabled CORS for `http://localhost:5173` (BE-17).
4. Open the app — the header shows **Backend API**.

`.env` defaults:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MSW=false
```

If CORS is not configured yet, use the Vite dev proxy instead:

```env
VITE_API_BASE_URL=/api
```

`vite.config.ts` proxies `/api` → `http://localhost:8080`.

### Use mocks without the backend

```env
VITE_USE_MSW=true
```

Restart `npm run dev`. The header shows **Mock API**.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable / release-ready |
| `dev` | Active development |

## Team

- **Nizamettin** — scaffold, list, upload, API layer
- **Alvin** — case detail, validation, decision, audit
- **Aykut** — backend ([BE repo](https://github.com/aykutemreyalcin/internship_application_coordinator_be))
