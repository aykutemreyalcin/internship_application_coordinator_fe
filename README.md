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
cp .env.example .env   # when added
npm run dev            # http://localhost:5173
```

API base URL: `http://localhost:8080/api` (see `PROJECT_OVERVIEW.md`).

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable / release-ready |
| `dev` | Active development |

## Team

- **Nizamettin** — scaffold, list, upload, API layer
- **Alvin** — case detail, validation, decision, audit
- **Aykut** — backend ([BE repo](https://github.com/aykutemreyalcin/internship_application_coordinator_be))
