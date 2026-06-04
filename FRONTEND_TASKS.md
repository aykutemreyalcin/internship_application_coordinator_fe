# Frontend — Task Plan (Nizamettin & Alvin)

> This document breaks frontend work into tasks from start to finish. **Nizamettin** and **Alvin** work together.
> For architecture, stack, and API contract: `PROJECT_OVERVIEW.md`.
> FE can start with **mock data** (MSW or static JSON) before the backend (Aykut) is ready, then connect to the real API.

## 0. Stack and Conventions

- **React + TypeScript + Vite**
- **React Router** (page routing)
- **TanStack Query** (server state / data fetching / cache)
- **Axios** or a single `fetch`-based API client
- CSS Modules or a lightweight component library (e.g. Mantine/Chakra) — team decision
- All types in `src/api/types.ts`, aligned with the API contract
- Branches: `fe/nizamettin/<topic>`, `fe/alvin/<topic>`

### Target pages
1. **Dashboard / Case List** — application list, filters, search, status badges
2. **New Application** — upload PDF, create case
3. **Case Detail** — extracted fields, validation, recommendation, decision, email, audit timeline

### Suggested folder structure
```
src/
  api/            # client, types, query hooks  (Nizamettin sets up)
  components/     # shared components (StatusBadge, Button, Modal...)
  features/
    cases/        # list + upload (Nizamettin), detail (Alvin)
  layout/         # AppShell, Sidebar, Header (Nizamettin)
  mocks/          # MSW handlers / static json (both)
  routes.tsx
  main.tsx
```

---

## Work Split Summary

| Area | Owner |
|------|-------|
| Project scaffold, layout, API layer, mock infrastructure | **Nizamettin** |
| Case List page (table, filter, search) | **Nizamettin** |
| New Application (PDF upload flow) | **Nizamettin** |
| Shared UI components (Button, Badge, Spinner, Toast) | **Nizamettin** (Alvin uses/extends) |
| Case Detail scaffold + extracted fields panel | **Alvin** |
| Validation panel (completeness + rules) | **Alvin** |
| Decision panel (approve/reject/clarify + recommendation display) | **Alvin** |
| Clarification & Supervisor email modals | **Alvin** |
| Audit log / case history timeline | **Alvin** |
| PDF preview component | **Alvin** |

> Both work under `features/cases`. To reduce conflicts: Nizamettin owns **list/upload** subfolders; Alvin owns **detail** subfolders.

---

# NIZAMETTIN — Tasks

### FE-N-01 — Project setup (Vite + TS)
- `npm create vite@latest` (react-ts), dependencies: react-router-dom, @tanstack/react-query, axios.
- ESLint + Prettier, `.env.example` (`VITE_API_BASE_URL=http://localhost:8080/api`).
- **Done when:** `npm run dev` opens empty app on `:5173`.

### FE-N-02 — Layout / AppShell
- Top header (project name, user role placeholder), left menu (Dashboard, New Application).
- Responsive, clean, modern look.
- **Done when:** All pages render inside the shared shell.

### FE-N-03 — Routing
- Routes: `/` (list), `/new` (upload), `/cases/:id` (detail).
- 404 page.
- **Done when:** Navigation between pages via links works.

### FE-N-04 — API client + types
- `src/api/client.ts` (base URL, interceptor, error normalization → `PROJECT_OVERVIEW.md` error format).
- `src/api/types.ts`: `Case`, `CaseStatus`, `ValidationResult`, `AuditLogEntry`, `Recommendation`.
- **Done when:** Types match contract; single import entry point.

### FE-N-05 — Mock infrastructure (MSW)
- MSW handlers for all endpoints (`PROJECT_OVERVIEW.md` API list).
- At least 6 sample cases (different statuses: valid, incomplete, rule violation, ambiguous).
- **Done when:** FE works fully with backend off; env flag toggles mock on/off.

### FE-N-06 — Shared UI components
- `StatusBadge` (color per CaseStatus), `Button`, `Spinner/Loading`, `EmptyState`, `Toast/Notification`, `Modal`.
- **Done when:** All visible on a demo page (no Storybook required). Alvin will reuse these.

### FE-N-07 — Case List page
- `GET /cases` (TanStack Query): table — student, company, status badge, date, recommendation.
- Row click → detail.
- **Done when:** List loads from mock; row click navigates to detail.

### FE-N-08 — Filter & search
- Status filter (dropdown), text search (student/company), pagination (`page`, `size`).
- URL query sync (shareable links).
- **Done when:** Filter/search reflected in query params; list updates.

### FE-N-09 — New Application (PDF upload)
- Drag-and-drop + file picker; PDF only; size validation.
- `POST /cases` (multipart) → redirect to detail on success.
- Progress/disabled state during upload.
- **Done when:** PDF upload creates new case (mock) and navigates to detail.

### FE-N-10 — Loading / error / empty states (list side)
- Skeleton/spinner for list and upload, error message, empty list state.
- **Done when:** All states handled visually.

### FE-N-11 — Role placeholder (RBAC UI)
- Role indicator in header (Coordinator). No real auth yet; structure ready for later.
- **Done when:** Role read from a single place.

---

# ALVIN — Tasks

### FE-A-01 — Case Detail scaffold
- `/cases/:id` → `GET /cases/{id}` (TanStack Query). Layout: PDF/summary left, tabs right (Fields, Validation, Recommendation/Decision, History).
- Loading/error/not-found states.
- **Done when:** Detail page opens with mock data; tabs work.
- **Depends on:** FE-N-04 (types), FE-N-06 (components).

### FE-A-02 — Extracted fields panel
- Student name, ID, field of study, company, supervisor, supervisor email, internship start/end, duration.
- Empty/missing fields visually marked (e.g. red border).
- (Optional) Inline edit + save for coordinator corrections (`PATCH` later).
- **Done when:** Fields laid out clearly; gaps obvious.

### FE-A-03 — Trigger extraction
- "Re-extract" button → `POST /cases/{id}/extract`; polling/disabled while status is `EXTRACTING`.
- **Done when:** Button works; fields refresh when result arrives.

### FE-A-04 — Validation panel
- `GET /cases/{id}/validation`: Completeness and Rules blocks; per issue: field + message + severity badge.
- Pass/fail summary badge.
- **Done when:** Both validation types listed; severity color-coded.

### FE-A-05 — Recommendation display
- Card for `recommendation` (APPROVE/REJECT/CLARIFY) + `recommendationReason` (Gemini reasoning).
- "Generate recommendation" → `POST /cases/{id}/recommendation`.
- **Done when:** Recommendation and reason readable; generate button works.

### FE-A-06 — Decision panel (Human-in-the-Loop)
- Three actions: **Approve / Reject / Request Clarification** + note field.
- `POST /cases/{id}/decision`; on success update status + toast.
- Confirm before approve; buttons disabled after decision; show final status.
- **Done when:** Coordinator can decide; status changes; audit updated.

### FE-A-07 — Clarification email modal
- `POST /cases/{id}/clarification` → backend returns draft; show/edit/send in modal.
- **Done when:** Draft visible; send action works (mock).

### FE-A-08 — Supervisor verification modal
- `POST /cases/{id}/supervisor-verification` → supervisor verification email draft; show/edit/send.
- **Done when:** Draft flow works.

### FE-A-09 — Audit log / Case history timeline
- `GET /cases/{id}/audit`: chronological timeline (actor, action, detail, time).
- Visual distinction: SYSTEM/agent vs COORDINATOR.
- **Done when:** All events shown in time order.

### FE-A-10 — PDF preview
- Show PDF via `GET /cases/{id}/documents/{docId}` (iframe or `react-pdf`).
- **Done when:** Uploaded PDF visible on detail page.

### FE-A-11 — Detail-side polish (states & errors)
- Loading/disabled on actions, error toasts, optimistic update or invalidate.
- **Done when:** Detail page feels smooth; errors clear to users.

---

## Integration Tasks (Both Together)

### FE-INT-01 — Connect to real API
- Turn off MSW; point `VITE_API_BASE_URL` at real backend; verify CORS/ports.
- **Done when:** Full flow works end-to-end with backend.

### FE-INT-02 — End-to-end demo flow
- Upload → extract → validate → recommend → decide → audit. Scenario for demo video.
- **Done when:** Scenario runs without gaps; demonstrable with sample cases from 40-case set.

### FE-INT-03 — UI/UX polish (10% of grade)
- Consistent spacing/colors, accessibility, mobile/tablet check, light animations.
- **Done when:** UI is clean, modern, consistent.

---

## Order / Dependency Summary

1. Nizamettin: FE-N-01 → N-02 → N-03 → N-04 → N-05 → N-06 (foundation; unblocks Alvin)
2. In parallel: Nizamettin N-07..N-11 (list/upload) ‖ Alvin A-01..A-11 (detail)
3. Together: FE-INT-01..03 (when backend is ready)
