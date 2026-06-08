import { EmptyState, LoadingBlock } from '../components'
import { getCaseQueryErrorMessage, useCaseList } from '../api/hooks/useCases'
import { CaseListTable } from '../features/cases/list/CaseListTable'
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
          <CaseListTable cases={data.content} />
          <p className={styles.hint}>
            Showing {data.content.length} of {data.totalElements} cases
            {import.meta.env.VITE_USE_MSW === 'true' ? ' (mock API)' : ''}.
          </p>
        </>
      ) : null}
    </section>
  )
}
