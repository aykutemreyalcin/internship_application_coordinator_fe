import type { CaseStatus } from '../../api/types'

export const STATUS_LABELS: Record<CaseStatus, string> = {
  NEW: 'New',
  EXTRACTING: 'Extracting',
  NEEDS_CLARIFICATION: 'Needs clarification',
  PENDING_SUPERVISOR: 'Pending supervisor',
  READY_FOR_REVIEW: 'Ready for review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CLARIFICATION_REQUESTED: 'Clarification requested',
}

export function formatCaseStatus(status: CaseStatus): string {
  return STATUS_LABELS[status]
}
