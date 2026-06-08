import { Link } from 'react-router-dom'
import { EmptyState, LoadingBlock, StatusBadge } from '../components'
import { getCaseQueryErrorMessage, useCaseList } from '../hooks/useCases'
import styles from './Page.module.css'

export function CaseListPage() {
  const { data, isLoading, isError, error } = useCaseList()

  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Applications</p>
      <h2 className={styles.title}>Case list</h2>
      <p className={styles.lead}>
        Browse internship applications. Select a case to open its detail view.
      </p>

      {isLoading ? <LoadingBlock label="Loading cases…" /> : null}
      {isError ? (
        <p className={styles.errorMessage}>{getCaseQueryErrorMessage(error)}</p>
      ) : null}

      {data && data.content.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="Create a new application or adjust your filters."
        />
      ) : null}

      {data && data.content.length > 0 ? (
        <>
          <ul className={styles.list}>
            {data.content.map((applicationCase) => (
              <li key={applicationCase.caseId}>
                <Link to={`/cases/${applicationCase.caseId}`} className={styles.listLink}>
                  <span className={styles.listPrimary}>
                    {applicationCase.studentName ?? 'Unnamed application'}
                  </span>
                  <StatusBadge status={applicationCase.status} />
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.hint}>
            Showing {data.content.length} of {data.totalElements} cases
            {import.meta.env.VITE_USE_MSW === 'true' ? ' (mock API)' : ''}.
          </p>
        </>
      ) : null}
    </section>
  )
}
