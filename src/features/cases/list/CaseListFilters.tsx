import { useEffect, useState } from 'react'
import { CASE_STATUSES, type CaseStatus } from '../../../api/types'
import { formatCaseStatus } from '../../../components'
import styles from './CaseListFilters.module.css'

const SEARCH_DEBOUNCE_MS = 300

type CaseListFiltersProps = {
  status?: CaseStatus
  search: string
  onStatusChange: (status?: CaseStatus) => void
  onSearchChange: (search: string) => void
}

export function CaseListFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: CaseListFiltersProps) {
  const [searchDraft, setSearchDraft] = useState(search)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchDraft !== search) {
        onSearchChange(searchDraft)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [searchDraft, search, onSearchChange])

  return (
    <div className={styles.toolbar}>
      <label className={styles.field}>
        <span className={styles.label}>Status</span>
        <select
          className={styles.select}
          value={status ?? ''}
          onChange={(event) => {
            const value = event.target.value
            onStatusChange(value ? (value as CaseStatus) : undefined)
          }}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {CASE_STATUSES.map((caseStatus) => (
            <option key={caseStatus} value={caseStatus}>
              {formatCaseStatus(caseStatus)}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Search</span>
        <input
          className={styles.input}
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Student or company…"
          aria-label="Search by student or company"
        />
      </label>
    </div>
  )
}
