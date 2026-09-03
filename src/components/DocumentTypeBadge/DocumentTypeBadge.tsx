import type { CaseType } from '../../api/types'
import { getDocumentTypeLabel } from '../../features/internshipDocuments/documentTypeLabels'
import styles from './DocumentTypeBadge.module.css'

type DocumentTypeBadgeProps = {
  caseType: CaseType
}

export function DocumentTypeBadge({ caseType }: DocumentTypeBadgeProps) {
  const variant =
    caseType === 'LEARNING_OUTCOMES_REPORT'
      ? styles.report
      : caseType === 'INTERNSHIP_JOURNAL'
        ? styles.journal
        : styles.application

  return (
    <span className={`${styles.badge} ${variant}`}>
      <span className={styles.dot} aria-hidden="true" />
      {getDocumentTypeLabel(caseType)}
    </span>
  )
}
