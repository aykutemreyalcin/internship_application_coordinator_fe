/** Matches backend `CaseStatus` enum and PROJECT_OVERVIEW contract. */
export const CASE_STATUSES = [
  'NEW',
  'EXTRACTING',
  'NEEDS_CLARIFICATION',
  'PENDING_SUPERVISOR',
  'READY_FOR_REVIEW',
  'APPROVED',
  'REJECTED',
  'CLARIFICATION_REQUESTED',
] as const

export type CaseStatus = (typeof CASE_STATUSES)[number]

/** Matches backend `Recommendation` enum. Null when not yet generated. */
export const RECOMMENDATIONS = ['APPROVE', 'REJECT', 'CLARIFY'] as const

export type Recommendation = (typeof RECOMMENDATIONS)[number]

export const ISSUE_SEVERITIES = ['ERROR', 'WARNING', 'INFO'] as const

export type IssueSeverity = (typeof ISSUE_SEVERITIES)[number]

export const VALIDATION_TYPES = ['COMPLETENESS', 'RULES'] as const

export type ValidationType = (typeof VALIDATION_TYPES)[number]

export type ValidationIssue = {
  field: string
  message: string
  severity: IssueSeverity
}

/** API validation group (`ValidationGroupDto` / nested in case detail). */
export type ValidationResult = {
  passed: boolean
  issues: ValidationIssue[]
}

export type ValidationSummary = {
  completeness: ValidationResult
  rules: ValidationResult
}

export type ApplicationDocument = {
  id: string
  fileName: string
  pageCount: number | null
}

/** Full case detail — `GET /cases/{id}` (`CaseDetailResponse`). */
export type Case = {
  caseId: string
  status: CaseStatus
  studentName: string | null
  studentId: string | null
  companyName: string | null
  supervisorName: string | null
  supervisorEmail: string | null
  fieldOfStudy: string | null
  internshipStartDate: string | null
  internshipEndDate: string | null
  recommendation: Recommendation | null
  recommendationReason: string | null
  validation: ValidationSummary | null
  documents: ApplicationDocument[]
  createdAt: string
  updatedAt: string
}

/** Case row in list — `GET /cases` item (`CaseSummaryResponse`). */
export type CaseSummary = {
  caseId: string
  status: CaseStatus
  studentName: string | null
  studentId: string | null
  companyName: string | null
  recommendation: Recommendation | null
  createdAt: string
  updatedAt: string
}

/** `GET /cases/{id}/audit` entry (`AuditLogEntryDto`). */
export type AuditLogEntry = {
  id: string
  actor: string
  action: string
  detail: string
  timestamp: string
}

/** Global error body — `ApiErrorResponse` / PROJECT_OVERVIEW §6. */
export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type CoordinatorDecision = Recommendation

export type CoordinatorDecisionRequest = {
  decision: CoordinatorDecision
  note?: string
}

export type ClarificationDraftResponse = {
  caseId: string
  status: CaseStatus
  studentName: string
  subject: string
  body: string
}

export type SupervisorVerificationDraftResponse = {
  caseId: string
  status: CaseStatus
  supervisorName: string
  supervisorEmail: string
  subject: string
  body: string
}

export type CaseListParams = {
  status?: CaseStatus
  search?: string
  page?: number
  size?: number
}
