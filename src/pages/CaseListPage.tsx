import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState, LoadingBlock } from '../components'
import { getCaseQueryErrorMessage, useCaseList } from '../api/hooks/useCases'
import { getApiModeLabel } from '../config/env'
import { CaseListFilters } from '../features/cases/list/CaseListFilters'
import { CaseListPagination } from '../features/cases/list/CaseListPagination'
import { CaseListTable } from '../features/cases/list/CaseListTable'
import {
  parseCaseListSearchParams,
  serializeCaseListSearchParams,
  toCaseListParams,
  type CaseListFilterState,
} from '../features/cases/list/caseListSearchParams'
import styles from './Page.module.css'

export function CaseListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseCaseListSearchParams(searchParams), [searchParams])
  const queryParams = useMemo(() => toCaseListParams(filters), [filters])

  const { data, isLoading, isFetching, isError, error } = useCaseList(queryParams)

  const updateFilters = useCallback(
    (patch: Partial<CaseListFilterState>, options?: { resetPage?: boolean }) => {
      const next: CaseListFilterState = {
        ...filters,
        ...patch,
      }

      if (options?.resetPage ?? ('status' in patch || 'search' in patch)) {
        next.page = 0
      }

      setSearchParams(serializeCaseListSearchParams(next), { replace: true })
    },
    [filters, setSearchParams],
  )

  const showInitialLoading = isLoading && !data

  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Applications</p>
      <h2 className={styles.title}>Case list</h2>
      <p className={styles.lead}>
        Browse internship applications. Select a case to open its detail view.
      </p>

      <CaseListFilters
        key={filters.search}
        status={filters.status}
        search={filters.search}
        onStatusChange={(status) => updateFilters({ status })}
        onSearchChange={(search) => updateFilters({ search })}
      />

      {showInitialLoading ? <LoadingBlock label="Loading cases…" /> : null}
      {isError ? (
        <p className={styles.errorMessage}>{getCaseQueryErrorMessage(error)}</p>
      ) : null}

      {!showInitialLoading && !isError && data && data.content.length === 0 ? (
        <EmptyState
          title="No applications found"
          description="Create a new application or adjust your filters."
        />
      ) : null}

      {!showInitialLoading && !isError && data && data.content.length > 0 ? (
        <>
          {isFetching ? <p className={styles.hint}>Updating list…</p> : null}
          <CaseListTable cases={data.content} />
          <CaseListPagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={data.size}
            onPageChange={(page) => updateFilters({ page }, { resetPage: false })}
          />
          <p className={styles.hint}>
            Data source: {getApiModeLabel().toLowerCase()}.
          </p>
        </>
      ) : null}
    </section>
  )
}
