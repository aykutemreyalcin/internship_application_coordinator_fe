import { useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, EmptyState, Spinner } from '../components'
import { getCaseQueryErrorMessage, useCaseList } from '../api/hooks/useCases'
import { getApiModeLabel } from '../config/env'
import { CaseListFilters } from '../features/cases/list/CaseListFilters'
import { CaseListPagination } from '../features/cases/list/CaseListPagination'
import { CaseListTable } from '../features/cases/list/CaseListTable'
import panelStyles from '../features/cases/list/CaseListTablePanel.module.css'
import { CaseListTableSkeleton } from '../features/cases/list/CaseListTableSkeleton'
import {
  parseCaseListSearchParams,
  serializeCaseListSearchParams,
  toCaseListParams,
  type CaseListFilterState,
} from '../features/cases/list/caseListSearchParams'
import styles from './Page.module.css'

function hasActiveFilters(filters: CaseListFilterState): boolean {
  return Boolean(filters.status || filters.search.trim())
}

export function CaseListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseCaseListSearchParams(searchParams), [searchParams])
  const queryParams = useMemo(() => toCaseListParams(filters), [filters])

  const { data, isLoading, isFetching, isError, error, refetch } = useCaseList(queryParams)

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
  const showRefetchOverlay = isFetching && Boolean(data)
  const filtersDisabled = isLoading || isFetching

  return (
    <section className={`${styles.page} ${styles.pageEnter}`} aria-labelledby="case-list-heading">
      <p className={styles.eyebrow}>Applications</p>
      <h2 id="case-list-heading" className={styles.title}>
        Case list
      </h2>
      <p className={styles.lead}>
        Browse internship applications. Select a case to open its detail view.
      </p>

      <CaseListFilters
        key={filters.search}
        status={filters.status}
        search={filters.search}
        disabled={filtersDisabled}
        onStatusChange={(status) => updateFilters({ status })}
        onSearchChange={(search) => updateFilters({ search })}
      />

      {showInitialLoading ? <CaseListTableSkeleton /> : null}

      {isError ? (
        <EmptyState
          title="Failed to load cases"
          description={getCaseQueryErrorMessage(error)}
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 8v5m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          action={
            <Button variant="primary" onClick={() => refetch()} loading={isFetching}>
              Try again
            </Button>
          }
        />
      ) : null}

      {!showInitialLoading && !isError && data && data.content.length === 0 ? (
        <EmptyState
          title={hasActiveFilters(filters) ? 'No matching applications' : 'No applications yet'}
          description={
            hasActiveFilters(filters)
              ? 'Try different filters or clear your search to see more results.'
              : 'Upload a PDF to create your first internship application case.'
          }
          action={
            hasActiveFilters(filters) ? (
              <Button
                variant="secondary"
                onClick={() => updateFilters({ status: undefined, search: '' })}
              >
                Clear filters
              </Button>
            ) : (
              <Link to="/new" className={styles.buttonLink}>
                New application
              </Link>
            )
          }
        />
      ) : null}

      {!showInitialLoading && !isError && data && data.content.length > 0 ? (
        <div className={styles.contentSection} aria-live="polite" aria-busy={isFetching}>
          <div className={panelStyles.tablePanel}>
            {showRefetchOverlay ? (
              <div className={panelStyles.refetchOverlay} aria-live="polite">
                <span className={panelStyles.refetchLabel}>
                  <Spinner size="sm" label="Updating list" />
                  Updating list…
                </span>
              </div>
            ) : null}
            <CaseListTable cases={data.content} />
          </div>
          <CaseListPagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={data.size}
            onPageChange={(page) => updateFilters({ page }, { resetPage: false })}
          />
          <p className={styles.hint}>Data source: {getApiModeLabel().toLowerCase()}.</p>
        </div>
      ) : null}
    </section>
  )
}
