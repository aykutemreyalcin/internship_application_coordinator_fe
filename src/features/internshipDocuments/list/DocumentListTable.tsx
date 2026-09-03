import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CaseSummary, Recommendation } from '../../../api/types'
import { DocumentTypeBadge } from '../../../components/DocumentTypeBadge/DocumentTypeBadge'
import { StatusBadge } from '../../../components'
import styles from './DocumentListTable.module.css'

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  APPROVE: 'Approve',
  REJECT: 'Reject',
  CLARIFY: 'Clarify',
}

type DocumentListTableProps = {
  cases: CaseSummary[]
}

function formatListDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatStudent(caseItem: CaseSummary): string {
  if (caseItem.studentName) {
    return caseItem.studentId
      ? `${caseItem.studentName} (${caseItem.studentId})`
      : caseItem.studentName
  }
  return caseItem.studentId ?? 'Unnamed document'
}

export function DocumentListTable({ cases }: DocumentListTableProps) {
  const navigate = useNavigate()

  function openDocument(caseId: string) {
    navigate(`/documents/${caseId}`)
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, caseId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDocument(caseId)
    }
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>
          Internship documents. Select a row to open document details.
        </caption>
        <thead>
          <tr>
            <th scope="col">Student</th>
            <th scope="col">Type</th>
            <th scope="col" className={styles.hideMobile}>
              Company
            </th>
            <th scope="col">Status</th>
            <th scope="col" className={styles.hideTablet}>
              Date
            </th>
            <th scope="col" className={styles.hideTablet}>
              Recommendation
            </th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr
              key={caseItem.caseId}
              className={styles.row}
              onClick={() => openDocument(caseItem.caseId)}
              onKeyDown={(event) => handleRowKeyDown(event, caseItem.caseId)}
              tabIndex={0}
              role="link"
              aria-label={`Open document for ${formatStudent(caseItem)}`}
            >
              <td className={styles.studentCell}>{formatStudent(caseItem)}</td>
              <td>
                <DocumentTypeBadge caseType={caseItem.caseType} />
              </td>
              <td className={styles.hideMobile}>{caseItem.companyName ?? '—'}</td>
              <td>
                <StatusBadge status={caseItem.status} />
              </td>
              <td className={`${styles.dateCell} ${styles.hideTablet}`}>
                {formatListDate(caseItem.createdAt)}
              </td>
              <td className={styles.hideTablet}>
                {caseItem.recommendation ? (
                  <span
                    className={`${styles.recommendationBadge} ${styles[`rec${caseItem.recommendation}`]}`}
                  >
                    {RECOMMENDATION_LABELS[caseItem.recommendation]}
                  </span>
                ) : (
                  <span className={styles.recommendationPending}>Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
