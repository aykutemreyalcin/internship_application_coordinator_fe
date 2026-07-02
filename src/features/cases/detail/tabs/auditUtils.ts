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
  EXTRACTION_STARTED: 'Extraction started',
  EXTRACTION_COMPLETED: 'Extraction completed',
  VALIDATION_COMPLETED: 'Validation completed',
  VALIDATION_FAILED: 'Validation failed',
  RECOMMENDATION_GENERATED: 'Recommendation generated',
  DECISION_APPLIED: 'Coordinator decision applied',
  CLARIFICATION_DRAFTED: 'Clarification email drafted',
  CLARIFICATION_SENT: 'Clarification email sent',
  SUPERVISOR_VERIFICATION_DRAFTED: 'Supervisor verification drafted',
  SUPERVISOR_VERIFICATION_SENT: 'Supervisor verification sent',
}

export function formatAuditAction(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action.replaceAll('_', ' ')
}
