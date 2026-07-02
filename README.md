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

### Verify detail endpoints (FE-INT-02)

With the backend running and `.env` pointing at it (`VITE_USE_MSW=false`):

```bash
npm run verify:detail-api
```

This checks detail, validation, audit, PDF, extract, recommendation, clarification, supervisor, and decision endpoints. Gemini-powered steps need `VERTEX_AI_ENABLED=true` on the backend; otherwise those checks may fail with an explanatory API message while read-only checks still pass.

Read-only mode (no mutations):

```bash
SKIP_MUTATIONS=1 npm run verify:detail-api
```

Target a specific case:

```bash
CASE_ID=<uuid> npm run verify:detail-api
```

**Manual UI checklist (Alvin detail flows):**

1. Open a case from the list → PDF preview loads
2. **Fields** → Re-extract (sync on real backend; fields + validation refresh)
3. **Validation** → completeness and rules sections
4. **Recommendation / Decision** → generate recommendation, apply decision
5. Draft clarification / supervisor emails → confirm send refreshes case (SMTP send is backend phase 2)
6. **History** → audit timeline updates after actions

### End-to-end demo (FE-INT-03)

Full recording script (upload → extract → validate → recommend → decide → audit): [docs/DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md)

Detail-side walkthrough for Alvin (decision panel, email modals, audit timeline): see **FE-INT-04** section in [docs/DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run verify:detail-api` | Verify detail API endpoints against backend |

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable / release-ready |
| `dev` | Active development |

## Team

- **Nizamettin** — scaffold, list, upload, API layer
- **Alvin** — case detail, validation, decision, audit
- **Aykut** — backend ([BE repo](https://github.com/aykutemreyalcin/internship_application_coordinator_be))
