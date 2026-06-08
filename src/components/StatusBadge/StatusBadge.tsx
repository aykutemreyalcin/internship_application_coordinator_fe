import type { CaseStatus } from '../../api/types'
import styles from './StatusBadge.module.css'

const statusLabels: Record<CaseStatus, string> = {
  NEW: 'New',
  EXTRACTING: 'Extracting',
  NEEDS_CLARIFICATION: 'Needs Clarification',
  PENDING_SUPERVISOR: 'Pending Supervisor',
  READY_FOR_REVIEW: 'Ready for Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CLARIFICATION_REQUESTED: 'Clarification Requested',
}

interface StatusBadgeProps {
  status: CaseStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>{statusLabels[status]}</span>
  )
}
