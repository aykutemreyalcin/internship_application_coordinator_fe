import type { CaseStatus, DocumentCaseType } from '../../../api/types'
import { CASE_STATUSES, DOCUMENT_CASE_TYPES } from '../../../api/types'
import styles from '../../cases/list/CaseListFilters.module.css'

type DocumentListFiltersProps = {
  status?: CaseStatus
  caseType?: DocumentCaseType
  search: string
  disabled?: boolean
  onStatusChange: (status?: CaseStatus) => void
  onCaseTypeChange: (caseType?: DocumentCaseType) => void
  onSearchChange: (search: string) => void
}

export function DocumentListFilters({
  status,
  caseType,
  search,
  disabled,
  onStatusChange,
  onCaseTypeChange,
  onSearchChange,
}: DocumentListFiltersProps) {
  return (
    <div className={styles.filters}>
      <label className={styles.field}>
        <span className={styles.label}>Document type</span>
        <select
          className={styles.select}
          value={caseType ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onCaseTypeChange(
              event.target.value
                ? (event.target.value as DocumentCaseType)
                : undefined,
            )
          }
        >
          <option value="">All documents</option>
          {DOCUMENT_CASE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'LEARNING_OUTCOMES_REPORT'
                ? 'Learning Outcomes Report'
                : 'Internship Journal'}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Status</span>
        <select
          className={styles.select}
          value={status ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onStatusChange(
              event.target.value ? (event.target.value as CaseStatus) : undefined,
            )
          }
        >
          <option value="">All statuses</option>
          {CASE_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </label>

      <label className={`${styles.field} ${styles.searchField}`}>
        <span className={styles.label}>Search</span>
        <input
          className={styles.input}
          type="search"
          defaultValue={search}
          placeholder="Student, ID, or company"
          disabled={disabled}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
    </div>
  )
}
