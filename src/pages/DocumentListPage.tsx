import { useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, EmptyState, Spinner } from '../components'
import {
  getDocumentQueryErrorMessage,
  useDocumentList,
} from '../api/hooks/useDocuments'
import { getApiModeLabel } from '../config/env'
import { DocumentListFilters } from '../features/internshipDocuments/list/DocumentListFilters'
import { DocumentListTable } from '../features/internshipDocuments/list/DocumentListTable'
import { CaseListPagination } from '../features/cases/list/CaseListPagination'
import panelStyles from '../features/cases/list/CaseListTablePanel.module.css'
import { CaseListTableSkeleton } from '../features/cases/list/CaseListTableSkeleton'
import {
  parseDocumentListSearchParams,
  serializeDocumentListSearchParams,
  toDocumentListParams,
  type DocumentListFilterState,
} from '../features/internshipDocuments/list/documentListSearchParams'
import styles from './Page.module.css'

function hasActiveFilters(filters: DocumentListFilterState): boolean {
  return Boolean(filters.status || filters.caseType || filters.search.trim())
}

export function DocumentListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseDocumentListSearchParams(searchParams), [searchParams])
  const queryParams = useMemo(() => toDocumentListParams(filters), [filters])

  const { data, isLoading, isFetching, isError, error, refetch } = useDocumentList(queryParams)

  const updateFilters = useCallback(
    (patch: Partial<DocumentListFilterState>, options?: { resetPage?: boolean }) => {
      const next: DocumentListFilterState = {
        ...filters,
        ...patch,
      }

      if (options?.resetPage ?? ('status' in patch || 'search' in patch || 'caseType' in patch)) {
        next.page = 0
      }

      setSearchParams(serializeDocumentListSearchParams(next), { replace: true })
    },
    [filters, setSearchParams],
  )

  const showInitialLoading = isLoading && !data
  const showRefetchOverlay = isFetching && Boolean(data)
  const filtersDisabled = isLoading || isFetching

  return (
    <section className={`${styles.page} ${styles.pageEnter}`} aria-labelledby="document-list-heading">
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Internship Documents</p>
        <h2 id="document-list-heading" className={styles.title}>
          Document review
        </h2>
        <p className={styles.lead}>
          Review learning outcomes reports and internship journals submitted by students. Filter by
          type, status, or search by student and company.
        </p>
      </div>

      <DocumentListFilters
        key={filters.search}
        status={filters.status}
        caseType={filters.caseType}
        search={filters.search}
        disabled={filtersDisabled}
        onStatusChange={(status) => updateFilters({ status })}
        onCaseTypeChange={(caseType) => updateFilters({ caseType })}
        onSearchChange={(search) => updateFilters({ search })}
      />

      {showInitialLoading ? <CaseListTableSkeleton /> : null}

      {isError ? (
        <EmptyState
          title="Failed to load documents"
          description={getDocumentQueryErrorMessage(error)}
          action={
            <Button variant="primary" onClick={() => refetch()} loading={isFetching}>
              Try again
            </Button>
          }
        />
      ) : null}

      {!showInitialLoading && !isError && data && data.content.length === 0 ? (
        <EmptyState
          title={hasActiveFilters(filters) ? 'No matching documents' : 'No documents yet'}
          description={
            hasActiveFilters(filters)
              ? 'Try different filters or clear your search to see more results.'
              : 'Upload a learning outcomes report or internship journal to start reviewing.'
          }
          action={
            hasActiveFilters(filters) ? (
              <Button
                variant="secondary"
                onClick={() => updateFilters({ status: undefined, caseType: undefined, search: '' })}
              >
                Clear filters
              </Button>
            ) : (
              <Link to="/documents/new" className={styles.buttonLink}>
                Upload document
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
            <DocumentListTable cases={data.content} />
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
