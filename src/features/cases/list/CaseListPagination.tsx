import { Button } from '../../../components'
import styles from './CaseListPagination.module.css'

type CaseListPaginationProps = {
  page: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function CaseListPagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: CaseListPaginationProps) {
  if (totalElements === 0) {
    return null
  }

  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, totalElements)
  const canGoPrevious = page > 0
  const canGoNext = page + 1 < totalPages

  return (
    <nav className={styles.pagination} aria-label="Case list pagination">
      <p className={styles.summary}>
        Showing {start}–{end} of {totalElements}
        {totalPages > 1 ? ` · Page ${page + 1} of ${totalPages}` : ''}
      </p>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
