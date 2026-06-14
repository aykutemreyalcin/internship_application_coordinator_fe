import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CaseSummary, Recommendation } from '../../../api/types'
import { StatusBadge } from '../../../components'
import styles from './CaseListTable.module.css'

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  APPROVE: 'Approve',
  REJECT: 'Reject',
  CLARIFY: 'Clarify',
}

type CaseListTableProps = {
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
  return caseItem.studentId ?? 'Unnamed application'
}

export function CaseListTable({ cases }: CaseListTableProps) {
  const navigate = useNavigate()

  function openCase(caseId: string) {
    navigate(`/cases/${caseId}`)
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, caseId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openCase(caseId)
    }
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>
          Internship applications. Select a row to open case details.
        </caption>
        <thead>
          <tr>
            <th scope="col">Student</th>
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
              onClick={() => openCase(caseItem.caseId)}
              onKeyDown={(event) => handleRowKeyDown(event, caseItem.caseId)}
              tabIndex={0}
              role="link"
              aria-label={`Open case for ${formatStudent(caseItem)}`}
            >
              <td className={styles.studentCell}>{formatStudent(caseItem)}</td>
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
