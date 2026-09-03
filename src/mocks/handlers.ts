import { http, HttpResponse } from 'msw'
import type { CaseStatus, CaseType, DocumentCaseType } from '../api/types'
import { CASE_STATUSES, DOCUMENT_CASE_TYPES } from '../api/types'
import { MOCK_PDF_BYTES } from './data/sampleCases'
import {
  applyMockDecision,
  buildClarificationDraft,
  sendMockClarificationEmail,
  buildSupervisorVerificationDraft,
  sendMockSupervisorVerificationEmail,
  createMockCase,
  createMockDocumentCase,
  startMockExtraction,
  generateMockRecommendation,
  getMockAuditLog,
  getMockCase,
  getMockDocument,
  getMockValidation,
  listMockCases,
} from './store'
import { validateDocumentUploadFile, validateUploadFile } from '../features/cases/upload/uploadUtils'

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

    const caseTypeParams = url.searchParams.getAll('caseType')
    let caseType: CaseType | CaseType[] | null = null
    if (caseTypeParams.length === 1) {
      caseType = caseTypeParams[0] as CaseType
    } else if (caseTypeParams.length > 1) {
      caseType = caseTypeParams as CaseType[]
    }

    return HttpResponse.json(
      listMockCases({
        status,
        search,
        caseType,
        page: Number.isFinite(page) ? page : 0,
        size: Number.isFinite(size) ? size : 20,
      }),
    )
  }),

  http.post('*/api/cases', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('file')
    const caseTypeParam = formData.get('caseType')

    if (!(file instanceof File)) {
      return apiError(400, 'Bad Request', 'File is required', casePath(request))
    }

    const isDocumentUpload =
      typeof caseTypeParam === 'string' &&
      DOCUMENT_CASE_TYPES.includes(caseTypeParam as DocumentCaseType)

    const validationError = isDocumentUpload
      ? validateDocumentUploadFile(file)
      : validateUploadFile(file)

    if (validationError) {
      return apiError(400, 'Bad Request', validationError, casePath(request))
    }

    const created = isDocumentUpload
      ? createMockDocumentCase(file.name, caseTypeParam as DocumentCaseType)
      : createMockCase(file.name)

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
    const applicationCase = startMockExtraction(String(params.id))
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(applicationCase)
  }),

  http.get('*/api/cases/:id/validation', ({ params, request }) => {
    const caseId = String(params.id)
    const applicationCase = getMockCase(caseId)
    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    const validation = getMockValidation(caseId)
    if (!validation) {
      return apiError(
        404,
        'Not Found',
        'Validation has not been run for this case yet',
        casePath(request),
      )
    }
    return HttpResponse.json(validation)
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

  http.post('*/api/cases/:id/clarification/send', async ({ params, request }) => {
    const body = (await request.json()) as { subject?: string; body?: string }
    if (!body.subject?.trim() || !body.body?.trim()) {
      return apiError(400, 'Bad Request', 'Subject and body are required', casePath(request))
    }

    const applicationCase = sendMockClarificationEmail(String(params.id), {
      subject: body.subject.trim(),
      body: body.body.trim(),
    })

    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }

    return HttpResponse.json(applicationCase)
  }),

  http.post('*/api/cases/:id/supervisor-verification', ({ params, request }) => {
    const draft = buildSupervisorVerificationDraft(String(params.id))
    if (!draft) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }
    return HttpResponse.json(draft)
  }),

  http.post('*/api/cases/:id/supervisor-verification/send', async ({ params, request }) => {
    const body = (await request.json()) as { subject?: string; body?: string }
    if (!body.subject?.trim() || !body.body?.trim()) {
      return apiError(400, 'Bad Request', 'Subject and body are required', casePath(request))
    }

    const applicationCase = sendMockSupervisorVerificationEmail(String(params.id), {
      subject: body.subject.trim(),
      body: body.body.trim(),
    })

    if (!applicationCase) {
      return apiError(404, 'Not Found', 'Case not found', casePath(request))
    }

    return HttpResponse.json(applicationCase)
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
