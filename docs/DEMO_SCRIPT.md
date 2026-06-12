# End-to-End Demo Script (FE-INT-03)

> **Owners:** Nizamettin (list + upload) · Alvin (case detail)  
> **Duration:** ~8–10 minutes uninterrupted  
> **Flow:** Upload → Extract → Validate → Recommend → Decide → Audit

## Before recording

### Environment

```bash
# Backend (Aykut)
cd internship_application_coordinator_be
docker compose up -d
./mvnw spring-boot:run

# Frontend
cd internship_application_coordinator_fe
cp .env.example .env    # VITE_USE_MSW=false
npm run dev             # http://localhost:5173
```

Confirm the header shows **Backend API**. For Gemini steps (extract, recommendation, email drafts), set `VERTEX_AI_ENABLED=true` on the backend.

### Sample file

Prepare one real internship application PDF (any valid sample from the 40-case test set, or a team demo PDF). Name it clearly, e.g. `demo-internship-application.pdf`.

### Optional pre-flight

```bash
npm run verify:detail-api
```

---

## Demo path A — Full upload flow (recommended for video)

Best for showing the complete coordinator journey from intake to decision.

| Step | Owner | Screen | Action | Narration cue |
|------|-------|--------|--------|---------------|
| 1 | Nizamettin | Dashboard `/` | Show case list; note status badges | "The coordinator sees all internship applications in one place." |
| 2 | Nizamettin | **New Application** `/new` | Drag-and-drop demo PDF → **Upload and open case** | "A new application is uploaded and a case is created immediately." |
| 3 | Alvin | Case detail | Point to PDF preview (left) and summary | "The uploaded document is visible alongside case metadata." |
| 4 | Alvin | **Fields** tab | Click **Re-extract**; wait for fields to populate | "AI extracts student, company, and internship dates from the PDF." |
| 5 | Alvin | **Validation** tab | Show Completeness + Rules sections | "Automated checks flag missing fields and rule violations." |
| 6 | Alvin | **Recommendation / Decision** tab | Click **Generate recommendation** | "The decision agent proposes approve, reject, or clarify with reasoning." |
| 7 | Alvin | Same tab | Enter optional note → **Approve** (confirm modal) | "The coordinator makes the final human-in-the-loop decision." |
| 8 | Alvin | **History** tab | Scroll audit timeline | "Every system, agent, and coordinator action is recorded in order." |
| 9 | Alvin | Dashboard `/` | Show updated status in list | "The list reflects the final decision status." |

**Expected result:** Case moves `NEW` → fields populated → validation shown → `READY_FOR_REVIEW` → `APPROVED` (or chosen outcome), with audit entries for each step.

---

## Demo path B — Mock API (no backend)

Use when the backend or Gemini is unavailable.

```env
VITE_USE_MSW=true
```

| Step | Owner | Action |
|------|-------|--------|
| 1 | Nizamettin | Upload any PDF on **New Application** → opens new mock case |
| 2 | Alvin | Open existing case **Jan Kowalski** (`11111111-1111-4111-8111-111111111101`) for a pre-filled walkthrough |
| 3 | Alvin | Run extract / recommendation / decision on the uploaded case; show History on Jan Kowalski for rich audit data |

**Mock sample cases (dashboard links):**

| Case | ID | Use for |
|------|-----|---------|
| Jan Kowalski | `11111111-1111-4111-8111-111111111101` | Happy path — ready for review, APPROVE recommendation |
| Tomasz Lewandowski | `22222222-2222-4222-8222-222222222201` | Incomplete fields — needs clarification |
| Piotr Zajac | `33333333-3333-4333-8333-333333333301` | Rule violation — REJECT scenario |
| Agnieszka Wojcik | `44444444-4444-4444-8444-444444444401` | Ambiguous employer — CLARIFY scenario |

---

## Demo path C — Backend with seeded dataset

When `TEST_DATASET_ENABLED=true` on the backend:

```bash
curl -X POST http://localhost:8080/api/internal/test-dataset/seed
```

Pick a **VALID** category case from the list for approve flow, or **INCOMPLETE** for clarification. Skip upload; start at case detail step 4.

---

## Optional extensions (if time permits)

| Feature | Tab | Owner |
|---------|-----|-------|
| Clarification email draft | Recommendation / Decision | Alvin |
| Supervisor verification draft | Recommendation / Decision | Alvin |
| Reject / Request clarification decision | Recommendation / Decision | Alvin |

Note: Email **send** is mock-only until backend SMTP (phase 2). On real API, draft generation updates case status; confirm in modal refreshes the case.

---

## Troubleshooting on camera

| Issue | Quick fix |
|-------|-----------|
| CORS / network error | Set `VITE_API_BASE_URL=/api` and restart dev server |
| Extract / recommendation fails | Enable `VERTEX_AI_ENABLED=true` on backend |
| Empty case list | Upload a case or seed test dataset |
| Validation empty | Run **Re-extract** first (validation runs after extraction) |

---

## Recording checklist

- [ ] Header shows correct API mode (Backend API or Mock API)
- [ ] Upload completes and redirects to case detail
- [ ] PDF preview visible
- [ ] Extract populates fields
- [ ] Validation tab shows issues or pass
- [ ] Recommendation generated with reason
- [ ] Coordinator decision applied
- [ ] Audit timeline shows full history
- [ ] No page reloads or broken navigation mid-flow
