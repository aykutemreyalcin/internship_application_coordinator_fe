import { Link } from 'react-router-dom'
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

      {isLoading ? <p className={styles.stateMessage}>Loading cases…</p> : null}
      {isError ? (
        <p className={styles.errorMessage}>{getCaseQueryErrorMessage(error)}</p>
      ) : null}

      {data ? (
        <>
          <ul className={styles.list}>
            {data.content.map((applicationCase) => (
              <li key={applicationCase.caseId}>
                <Link to={`/cases/${applicationCase.caseId}`} className={styles.listLink}>
                  <span className={styles.listPrimary}>
                    {applicationCase.studentName ?? 'Unnamed application'}
                  </span>
                  <span className={styles.listMeta}>
                    {applicationCase.status.replaceAll('_', ' ')}
                  </span>
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
