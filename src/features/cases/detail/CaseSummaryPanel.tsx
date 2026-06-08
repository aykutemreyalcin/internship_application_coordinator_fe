import { StatusBadge } from '../../../components/StatusBadge/StatusBadge'
import type { Case } from '../../../api/types'
import styles from './CaseSummaryPanel.module.css'

interface CaseSummaryPanelProps {
  caseData: Case
}

export function CaseSummaryPanel({ caseData }: CaseSummaryPanelProps) {
  const primaryDoc = caseData.documents[0]

  return (
    <aside className={styles.panel}>
      <div className={styles.pdfPreview}>
        <div className={styles.pdfPlaceholder} aria-label="PDF preview placeholder">
          <svg
            className={styles.pdfIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className={styles.pdfLabel}>PDF Preview</p>
          {primaryDoc && (
            <p className={styles.pdfMeta}>
              {primaryDoc.fileName} · {primaryDoc.pageCount} pages
            </p>
          )}
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryHeader}>
          <h2 className={styles.studentName}>
            {caseData.studentName ?? 'Unknown Student'}
          </h2>
          <StatusBadge status={caseData.status} />
        </div>

        <dl className={styles.metaList}>
          <div className={styles.metaRow}>
            <dt>Company</dt>
            <dd>{caseData.companyName ?? '—'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Case ID</dt>
            <dd className={styles.caseId}>{caseData.caseId}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Created</dt>
            <dd>{new Date(caseData.createdAt).toLocaleString()}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Updated</dt>
            <dd>{new Date(caseData.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
