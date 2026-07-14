import type { AuditLogEntry } from '../../../../api/types'

export type AuditActorType = 'COORDINATOR' | 'SYSTEM' | 'AGENT'

export function getAuditActorType(actor: string): AuditActorType {
  if (actor === 'COORDINATOR') {
    return 'COORDINATOR'
  }
  if (actor === 'SYSTEM') {
    return 'SYSTEM'
  }
  return 'AGENT'
}

export function sortAuditEntriesChronologically(entries: AuditLogEntry[]): AuditLogEntry[] {
  return [...entries].sort((left, right) => left.timestamp.localeCompare(right.timestamp))
}

export function formatAuditTimestamp(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const AUDIT_ACTION_LABELS: Record<string, string> = {
  CASE_CREATED: 'Case created',
  EMAIL_INTAKE: 'Email intake',
  EXTRACTION_STARTED: 'Extraction started',
  EXTRACTION_COMPLETED: 'Extraction completed',
  EXTRACTION_FAILED: 'Extraction failed',
  VALIDATION_COMPLETENESS: 'Completeness validation',
  VALIDATION_RULES: 'University rules validation',
  VALIDATION_COMPLETED: 'Validation completed',
  VALIDATION_FAILED: 'Validation failed',
  RECOMMENDATION: 'Recommendation generated',
  RECOMMENDATION_GENERATED: 'Recommendation generated',
  DECISION_APPLIED: 'Coordinator decision applied',
  DECISION_APPROVE: 'Coordinator approved',
  DECISION_REJECT: 'Coordinator rejected',
  DECISION_CLARIFY: 'Coordinator requested clarification',
  CLARIFICATION_DRAFT: 'Clarification email drafted',
  CLARIFICATION_DRAFTED: 'Clarification email drafted',
  CLARIFICATION_SENT: 'Clarification email sent',
  SUPERVISOR_VERIFICATION_DRAFT: 'Supervisor verification drafted',
  SUPERVISOR_VERIFICATION_DRAFTED: 'Supervisor verification drafted',
  SUPERVISOR_VERIFICATION_SENT: 'Supervisor verification sent',
  STATUS_NEW: 'Status → New',
  STATUS_EXTRACTING: 'Status → Extracting',
  STATUS_NEEDS_CLARIFICATION: 'Status → Needs clarification',
  STATUS_PENDING_SUPERVISOR: 'Status → Pending supervisor',
  STATUS_READY_FOR_REVIEW: 'Status → Ready for review',
  STATUS_APPROVED: 'Status → Approved',
  STATUS_REJECTED: 'Status → Rejected',
  STATUS_CLARIFICATION_REQUESTED: 'Status → Clarification requested',
  DATASET_SEEDED: 'Test dataset seeded',
}

export function formatAuditAction(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action.replaceAll('_', ' ')
}
