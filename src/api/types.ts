export type CaseStatus =
  | 'NEW'
  | 'EXTRACTING'
  | 'NEEDS_CLARIFICATION'
  | 'PENDING_SUPERVISOR'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLARIFICATION_REQUESTED'

export type Recommendation = 'APPROVE' | 'REJECT' | 'CLARIFY' | null

export type ValidationType = 'COMPLETENESS' | 'RULES'

export type IssueSeverity = 'ERROR' | 'WARNING' | 'INFO'

export interface ValidationIssue {
  field: string
  message: string
  severity: IssueSeverity
}

export interface ValidationBlock {
  passed: boolean
  issues: ValidationIssue[]
}

export interface CaseValidation {
  completeness: ValidationBlock
  rules: ValidationBlock
}

export interface ApplicationDocument {
  id: string
  fileName: string
  pageCount: number
}

export interface Case {
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
  recommendation: Recommendation
  recommendationReason: string | null
  validation: CaseValidation
  documents: ApplicationDocument[]
  createdAt: string
  updatedAt: string
}

export interface ValidationResult {
  id: string
  caseId: string
  type: ValidationType
  passed: boolean
  issues: ValidationIssue[]
}

export type AuditActor = 'SYSTEM' | 'COORDINATOR' | string

export interface AuditLogEntry {
  id: string
  caseId: string
  actor: AuditActor
  action: string
  detail: string
  timestamp: string
}

export interface ApiErrorBody {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
