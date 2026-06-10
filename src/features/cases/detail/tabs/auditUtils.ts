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

export function formatAuditAction(action: string): string {
  return action.replaceAll('_', ' ')
}
