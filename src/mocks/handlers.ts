import { http, HttpResponse } from 'msw'
import type { CaseStatus } from '../api/types'
import { CASE_STATUSES } from '../api/types'
import { MOCK_PDF_BYTES } from './data/sampleCases'
import {
  applyMockDecision,
  buildClarificationDraft,
  buildSupervisorVerificationDraft,
  createMockCase,
  extractMockCase,
  generateMockRecommendation,
  getMockAuditLog,
  getMockCase,
  getMockDocument,
  getMockValidation,
  listMockCases,
} from './store'

function apiError(status: number, error: string, message: string, path: string) {
  return HttpResponse.json(
    {
      timestamp: new Date().toISOString(),
      status,
      error,
      message,
      path,
    },
    { status },
  )
}

function casePath(request: Request): string {
  return new URL(request.url).pathname
}

export const handlers = [
  http.get('*/api/cases', ({ request }) => {
    const url = new URL(request.url)
    const statusParam = url.searchParams.get('status')
    const status =
      statusParam && CASE_STATUSES.includes(statusParam as CaseStatus)
        ? (statusParam as CaseStatus)
        : null
    const search = url.searchParams.get('search')
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '20')

    return HttpResponse.json(
      listMockCases({
        status,
        search,
        page: Number.isFinite(page) ? page : 0,
        size: Number.isFinite(size) ? size : 20,
      }),
    )
  }),

  http.post('*/api/cases', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return apiError(400, 'Bad Request', 'PDF file is required', casePath(request))
    }

    const created = createMockCase(file.name)
    return HttpResponse.json(created, { status: 201 })
  }),

  http.get('*/api/cases/:id', ({ params, request }) => {
    const applicationCase = getMockCase(String(params.id))
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(applicationCase)
  }),

  http.post('*/api/cases/:id/extract', ({ params, request }) => {
    const applicationCase = extractMockCase(String(params.id))
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(applicationCase)
  }),

  http.get('*/api/cases/:id/validation', ({ params, request }) => {
    const applicationCase = getMockCase(String(params.id))
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(getMockValidation(String(params.id)))
  }),

  http.post('*/api/cases/:id/recommendation', ({ params, request }) => {
    const applicationCase = generateMockRecommendation(String(params.id))
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(applicationCase)
  }),

  http.post('*/api/cases/:id/decision', async ({ params, request }) => {
    const body = (await request.json()) as { decision?: string; note?: string }
    if (!body.decision || !['APPROVE', 'REJECT', 'CLARIFY'].includes(body.decision)) {
      return apiError(400, 'Bad Request', 'Invalid coordinator decision', casePath(request))
    }

    const applicationCase = applyMockDecision(
      String(params.id),
      body.decision as 'APPROVE' | 'REJECT' | 'CLARIFY',
      body.note,
    )
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(applicationCase)
  }),

  http.post('*/api/cases/:id/clarification', ({ params, request }) => {
    const draft = buildClarificationDraft(String(params.id))
    if (!draft) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(draft)
  }),

  http.post('*/api/cases/:id/supervisor-verification', ({ params, request }) => {
    const draft = buildSupervisorVerificationDraft(String(params.id))
    if (!draft) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(draft)
  }),

  http.get('*/api/cases/:id/audit', ({ params, request }) => {
    const applicationCase = getMockCase(String(params.id))
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(getMockAuditLog(String(params.id)))
  }),

  http.get('*/api/cases/:id/documents/:docId', ({ params, request }) => {
    const document = getMockDocument(String(params.id), String(params.docId))
    if (!document) {
      return apiError(404, 'Not Found', 'Document not found', casePath(request))
    }

    return new HttpResponse(MOCK_PDF_BYTES, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${document.fileName}"`,
      },
    })
  }),
]
