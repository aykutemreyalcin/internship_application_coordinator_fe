import { useEffect, useId, useState } from 'react'
import { CASE_STATUSES, type CaseStatus } from '../../../api/types'
import { formatCaseStatus } from '../../../components'
import styles from './CaseListFilters.module.css'

const SEARCH_DEBOUNCE_MS = 300

type CaseListFiltersProps = {
  status?: CaseStatus
  search: string
  disabled?: boolean
  onStatusChange: (status?: CaseStatus) => void
  onSearchChange: (search: string) => void
}

export function CaseListFilters({
  status,
  search,
  disabled = false,
  onStatusChange,
  onSearchChange,
}: CaseListFiltersProps) {
  const [searchDraft, setSearchDraft] = useState(search)
  const statusFieldId = useId()
  const searchFieldId = useId()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchDraft !== search) {
        onSearchChange(searchDraft)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [searchDraft, search, onSearchChange])

  return (
    <div className={styles.toolbar} role="search" aria-label="Filter applications">
      <div className={styles.field}>
        <label className={styles.label} htmlFor={statusFieldId}>
          Status
        </label>
        <select
          id={statusFieldId}
          className={styles.select}
          value={status ?? ''}
          disabled={disabled}
          onChange={(event) => {
            const value = event.target.value
            onStatusChange(value ? (value as CaseStatus) : undefined)
          }}
        >
          <option value="">All statuses</option>
          {CASE_STATUSES.map((caseStatus) => (
            <option key={caseStatus} value={caseStatus}>
              {formatCaseStatus(caseStatus)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={searchFieldId}>
          Search
        </label>
        <input
          id={searchFieldId}
          className={styles.input}
          type="search"
          value={searchDraft}
          disabled={disabled}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Student or company…"
        />
      </div>
    </div>
  )
}
