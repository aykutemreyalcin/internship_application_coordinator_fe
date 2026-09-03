import { DocumentTypeBadge } from '../../../components/DocumentTypeBadge/DocumentTypeBadge'
import { StatusBadge } from '../../../components'
import type { Case } from '../../../api/types'
import { DocumentPreview } from './DocumentPreview'
import styles from './DocumentDetail.module.css'

interface DocumentSummaryPanelProps {
  caseData: Case
}

export function DocumentSummaryPanel({ caseData }: DocumentSummaryPanelProps) {
  const primaryDoc = caseData.documents[0]

  return (
    <aside className={styles.summaryPanel}>
      {primaryDoc ? (
        <DocumentPreview caseId={caseData.caseId} document={primaryDoc} />
      ) : (
        <div className={styles.noDocument}>No document attached</div>
      )}

      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <div>
            <DocumentTypeBadge caseType={caseData.caseType} />
            <h2 className={styles.studentName}>
              {caseData.studentName ?? 'Unknown student'}
            </h2>
          </div>
          <StatusBadge status={caseData.status} />
        </div>

        <dl className={styles.metaList}>
          <div className={styles.metaRow}>
            <dt>Company</dt>
            <dd>{caseData.companyName ?? '—'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Student ID</dt>
            <dd>{caseData.studentId ?? '—'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Case ID</dt>
            <dd className={styles.mono}>{caseData.caseId}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Submitted</dt>
            <dd>{new Date(caseData.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
