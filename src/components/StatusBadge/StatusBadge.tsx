import type { CaseStatus } from '../../api/types'
import { STATUS_LABELS } from './statusBadgeLabels'
import styles from './StatusBadge.module.css'

type StatusBadgeProps = {
  status: CaseStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const toneClass = styles[`tone${status}` as keyof typeof styles] ?? styles.toneDefault

  return (
    <span className={[styles.badge, toneClass, className].filter(Boolean).join(' ')}>
      {STATUS_LABELS[status]}
    </span>
  )
}
