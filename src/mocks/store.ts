import type {
  AuditLogEntry,
  Case,
  CaseStatus,
  CaseSummary,
  CaseType,
  DocumentCaseType,
  Recommendation,
} from '../api/types'
import { MOCK_AUDIT_LOGS, MOCK_CASES } from './data/sampleCases'
import { MOCK_DOCUMENT_AUDIT_LOGS, MOCK_DOCUMENT_CASES } from './data/sampleDocumentCases'

function cloneCase(applicationCase: Case): Case {
  return structuredClone(applicationCase)
}

function cloneAuditLog(entry: AuditLogEntry): AuditLogEntry {
  return { ...entry }
}

function toSummary(applicationCase: Case): CaseSummary {
  return {
    caseId: applicationCase.caseId,
    caseType: applicationCase.caseType,
    status: applicationCase.status,
    studentName: applicationCase.studentName,
    studentId: applicationCase.studentId,
    companyName: applicationCase.companyName,
    recommendation: applicationCase.recommendation,
    createdAt: applicationCase.createdAt,
    updatedAt: applicationCase.updatedAt,
  }
}

function nowIso(): string {
  return new Date().toISOString()
}

function newId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}`
}

const MOCK_EXTRACTION_DELAY_MS = 2000

let cases: Case[] = [...MOCK_CASES, ...MOCK_DOCUMENT_CASES].map(cloneCase)
const auditLogs = new Map<string, AuditLogEntry[]>([
  ...Object.entries(MOCK_AUDIT_LOGS).map(([caseId, entries]) => [
    caseId,
    entries.map(cloneAuditLog),
  ] as const),
  ...Object.entries(MOCK_DOCUMENT_AUDIT_LOGS).map(([caseId, entries]) => [
    caseId,
    entries.map(cloneAuditLog),
  ] as const),
])
const pendingExtractions = new Map<string, ReturnType<typeof setTimeout>>()

function clearPendingExtractions(): void {
  for (const timeout of pendingExtractions.values()) {
    clearTimeout(timeout)
  }
  pendingExtractions.clear()
}

export function resetMockStore(): void {
  clearPendingExtractions()
  cases = [...MOCK_CASES, ...MOCK_DOCUMENT_CASES].map(cloneCase)
  auditLogs.clear()
  for (const [caseId, entries] of Object.entries(MOCK_AUDIT_LOGS)) {
    auditLogs.set(caseId, entries.map(cloneAuditLog))
  }
  for (const [caseId, entries] of Object.entries(MOCK_DOCUMENT_AUDIT_LOGS)) {
    auditLogs.set(caseId, entries.map(cloneAuditLog))
  }
}

function matchesCaseType(applicationCase: Case, caseType?: CaseType | CaseType[] | null): boolean {
  if (!caseType) {
    return true
  }
  if (Array.isArray(caseType)) {
    return caseType.includes(applicationCase.caseType)
  }
  return applicationCase.caseType === caseType
}

export function listMockCases(params: {
  status?: CaseStatus | null
  search?: string | null
  caseType?: CaseType | CaseType[] | null
  page: number
  size: number
}) {
  const searchTerm = params.search?.trim().toLowerCase() ?? ''
  let filtered = [...cases]

  if (params.caseType) {
    filtered = filtered.filter((applicationCase) => matchesCaseType(applicationCase, params.caseType))
  }

  if (params.status) {
    filtered = filtered.filter((applicationCase) => applicationCase.status === params.status)
  }

  if (searchTerm.length > 0) {
    filtered = filtered.filter((applicationCase) => {
      const haystack = [
        applicationCase.studentName,
        applicationCase.studentId,
        applicationCase.companyName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(searchTerm)
    })
  }

  filtered.sort((left, right) => right.createdAt.localeCompare(left.createdAt))

  const totalElements = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalElements / params.size))
  const start = params.page * params.size
  const content = filtered.slice(start, start + params.size).map(toSummary)

  return {
    content,
    page: params.page,
    size: params.size,
    totalElements,
    totalPages,
  }
}

export function getMockCase(caseId: string): Case | undefined {
  const applicationCase = cases.find((entry) => entry.caseId === caseId)
  return applicationCase ? cloneCase(applicationCase) : undefined
}

export function createMockCase(fileName: string): Case {
  const caseId = newId('case')
  const documentId = newId('doc')
  const timestamp = nowIso()

  const applicationCase: Case = {
    caseId,
    caseType: 'APPLICATION',
    extractedPayload: null,
    status: 'NEW',
    studentName: null,
    studentId: null,
    companyName: null,
    supervisorName: null,
    supervisorEmail: null,
    fieldOfStudy: null,
    internshipStartDate: null,
    internshipEndDate: null,
    recommendation: null,
    recommendationReason: null,
    validation: null,
    documents: [{ id: documentId, fileName, pageCount: 1 }],
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  cases.unshift(applicationCase)
  auditLogs.set(caseId, [
    {
      id: newId('audit'),
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: `Uploaded ${fileName}`,
      timestamp,
    },
  ])

  return cloneCase(applicationCase)
}

export function createMockDocumentCase(fileName: string, caseType: DocumentCaseType): Case {
  const caseId = newId('doc-case')
  const documentId = newId('doc')
  const timestamp = nowIso()
  const isDocx = fileName.toLowerCase().endsWith('.docx')

  const applicationCase: Case = {
    caseId,
    caseType,
    extractedPayload: null,
    status: 'NEW',
    studentName: null,
    studentId: null,
    companyName: null,
    supervisorName: null,
    supervisorEmail: null,
    fieldOfStudy: null,
    internshipStartDate: null,
    internshipEndDate: null,
    recommendation: null,
    recommendationReason: null,
    validation: null,
    documents: [
      {
        id: documentId,
        fileName,
        contentType: isDocx
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/pdf',
        pageCount: isDocx ? null : 1,
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  cases.unshift(applicationCase)
  auditLogs.set(caseId, [
    {
      id: newId('audit'),
      actor: 'SYSTEM',
      action: 'CASE_CREATED',
      detail: `${caseType === 'LEARNING_OUTCOMES_REPORT' ? 'Learning outcomes report' : 'Internship journal'} uploaded`,
      timestamp,
    },
  ])

  return cloneCase(applicationCase)
}

function updateCase(caseId: string, updater: (applicationCase: Case) => Case): Case | undefined {
  const index = cases.findIndex((entry) => entry.caseId === caseId)
  if (index === -1) {
    return undefined
  }

  const updated = updater(cloneCase(cases[index]))
  updated.updatedAt = nowIso()
  cases[index] = updated
  return cloneCase(updated)
}

function appendAudit(caseId: string, actor: string, action: string, detail: string): void {
  const entries = auditLogs.get(caseId) ?? []
  entries.push({
    id: newId('audit'),
    actor,
    action,
    detail,
    timestamp: nowIso(),
  })
  auditLogs.set(caseId, entries)
}

function completeMockExtraction(caseId: string): Case | undefined {
  return updateCase(caseId, (applicationCase) => {
    appendAudit(
      caseId,
      'Document Extraction Agent',
      'EXTRACTION_COMPLETED',
      'Fields extracted from PDF',
    )

    if (applicationCase.studentName) {
      return { ...applicationCase, status: 'READY_FOR_REVIEW' }
    }

    return {
      ...applicationCase,
      status: 'READY_FOR_REVIEW',
      studentName: 'Extracted Student',
      studentId: applicationCase.studentId ?? '999999',
      companyName: applicationCase.companyName ?? 'Extracted Company',
      supervisorName: applicationCase.supervisorName ?? 'Extracted Supervisor',
      supervisorEmail: applicationCase.supervisorEmail ?? 'supervisor@extracted.example',
      fieldOfStudy: applicationCase.fieldOfStudy ?? 'Computer Engineering',
      internshipStartDate: applicationCase.internshipStartDate ?? '2026-06-01',
      internshipEndDate: applicationCase.internshipEndDate ?? '2026-10-28',
      validation: applicationCase.validation ?? {
        completeness: { passed: true, issues: [] },
        rules: { passed: true, issues: [] },
      },
    }
  })
}

export function startMockExtraction(caseId: string): Case | undefined {
  const existing = getMockCase(caseId)
  if (!existing) {
    return undefined
  }

  if (existing.status === 'EXTRACTING') {
    return existing
  }

  const extractingCase = updateCase(caseId, (applicationCase) => ({
    ...applicationCase,
    status: 'EXTRACTING',
  }))

  if (!extractingCase) {
    return undefined
  }

  appendAudit(
    caseId,
    'Document Extraction Agent',
    'EXTRACTION_STARTED',
    'Document extraction in progress',
  )

  const existingTimeout = pendingExtractions.get(caseId)
  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }

  const timeout = setTimeout(() => {
    completeMockExtraction(caseId)
    pendingExtractions.delete(caseId)
  }, MOCK_EXTRACTION_DELAY_MS)

  pendingExtractions.set(caseId, timeout)
  return extractingCase
}

/** @deprecated Use startMockExtraction for async extraction flow. */
export function extractMockCase(caseId: string): Case | undefined {
  return completeMockExtraction(caseId)
}

export function getMockValidation(caseId: string) {
  const applicationCase = getMockCase(caseId)
  if (!applicationCase?.validation) {
    return undefined
  }
  return applicationCase.validation
}

export function generateMockRecommendation(caseId: string): Case | undefined {
  return updateCase(caseId, (applicationCase) => {
    const recommendation: Recommendation =
      applicationCase.recommendation ??
      (applicationCase.validation?.rules.passed === false
        ? 'REJECT'
        : applicationCase.validation?.completeness.passed === false
          ? 'REJECT'
          : applicationCase.caseId.startsWith('44444444')
            ? 'CLARIFY'
            : 'APPROVE')

    const recommendationReason =
      applicationCase.recommendationReason ??
      (recommendation === 'CLARIFY'
        ? 'Ambiguous employer details require coordinator review.'
        : recommendation === 'REJECT'
          ? 'Validation issues must be resolved before approval.'
          : 'All required fields are present; duration complies with rules.')

    appendAudit(
      caseId,
      'Decision Recommendation Agent',
      'RECOMMENDATION_GENERATED',
      `Recommendation: ${recommendation}`,
    )

    return {
      ...applicationCase,
      status: 'READY_FOR_REVIEW',
      recommendation,
      recommendationReason,
    }
  })
}

export function applyMockDecision(
  caseId: string,
  decision: Recommendation,
  note?: string,
): Case | undefined {
  return updateCase(caseId, (applicationCase) => {
    const status: CaseStatus =
      decision === 'APPROVE'
        ? 'APPROVED'
        : decision === 'REJECT'
          ? 'REJECTED'
          : 'CLARIFICATION_REQUESTED'

    appendAudit(
      caseId,
      'COORDINATOR',
      'DECISION_APPLIED',
      note ? `Decision: ${decision} — ${note}` : `Decision: ${decision}`,
    )

    return {
      ...applicationCase,
      status,
      recommendation: decision,
      recommendationReason: note ?? applicationCase.recommendationReason,
    }
  })
}

export function getMockAuditLog(caseId: string): AuditLogEntry[] {
  return [...(auditLogs.get(caseId) ?? [])]
}

export function getMockDocument(caseId: string, docId: string) {
  const applicationCase = getMockCase(caseId)
  const document = applicationCase?.documents.find((entry) => entry.id === docId)
  if (!applicationCase || !document) {
    return undefined
  }
  return document
}

export function buildClarificationDraft(caseId: string) {
  const applicationCase = getMockCase(caseId)
  if (!applicationCase) {
    return undefined
  }

  appendAudit(caseId, 'Clarification Request Agent', 'CLARIFICATION_DRAFTED', 'Draft email generated')

  return {
    caseId: applicationCase.caseId,
    status: applicationCase.status,
    studentName: applicationCase.studentName ?? 'Student',
    subject: 'Internship application — additional information required',
    body: `Dear ${applicationCase.studentName ?? 'Student'},\n\nWe need additional information regarding your internship application.\n\nBest regards,\nInternship Coordinator`,
  }
}

export function sendMockClarificationEmail(
  caseId: string,
  payload: { subject: string; body: string },
): Case | undefined {
  const applicationCase = getMockCase(caseId)
  if (!applicationCase) {
    return undefined
  }

  return updateCase(caseId, (currentCase) => {
    appendAudit(
      caseId,
      'COORDINATOR',
      'CLARIFICATION_SENT',
      `Clarification email sent to student — "${payload.subject}"`,
    )

    return {
      ...currentCase,
      status: 'CLARIFICATION_REQUESTED',
    }
  })
}

export function buildSupervisorVerificationDraft(caseId: string) {
  const applicationCase = getMockCase(caseId)
  if (!applicationCase) {
    return undefined
  }

  appendAudit(
    caseId,
    'Supervisor Verification Agent',
    'SUPERVISOR_VERIFICATION_DRAFTED',
    'Draft email generated',
  )

  return {
    caseId: applicationCase.caseId,
    status: applicationCase.status,
    supervisorName: applicationCase.supervisorName ?? 'Supervisor',
    supervisorEmail: applicationCase.supervisorEmail ?? 'supervisor@example.com',
    subject: 'Internship supervisor verification request',
    body: `Dear ${applicationCase.supervisorName ?? 'Supervisor'},\n\nPlease confirm the internship arrangement for our student.\n\nBest regards,\nInternship Coordinator`,
  }
}

export function sendMockSupervisorVerificationEmail(
  caseId: string,
  payload: { subject: string; body: string },
): Case | undefined {
  const applicationCase = getMockCase(caseId)
  if (!applicationCase) {
    return undefined
  }

  return updateCase(caseId, (currentCase) => {
    appendAudit(
      caseId,
      'COORDINATOR',
      'SUPERVISOR_VERIFICATION_SENT',
      `Supervisor verification email sent — "${payload.subject}"`,
    )

    return {
      ...currentCase,
      status: 'PENDING_SUPERVISOR',
    }
  })
}
