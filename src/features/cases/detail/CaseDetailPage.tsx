import { Link, useNavigate, useParams } from 'react-router-dom'
import { isApiError, isNotFoundError } from '../../../api/client'
import { useCase } from '../../../api/hooks/useCase'
import { Button, EmptyState, LoadingBlock } from '../../../components'
import { CaseDetailLayout } from './CaseDetailLayout'
import styles from './CaseDetailPage.module.css'

export function CaseDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch, isFetching } = useCase(id)

  if (isLoading) {
    return <LoadingBlock label="Loading case details…" />
  }

  if (isError && isNotFoundError(error)) {
    return (
      <EmptyState
        title="Case not found"
        description={
          isApiError(error)
            ? error.message
            : 'The requested case does not exist or may have been removed.'
        }
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to case list
          </Button>
        }
      />
    )
  }

  if (isError) {
    const message = isApiError(error)
      ? error.message
      : 'Something went wrong while loading this case.'

    return (
      <EmptyState
        title="Failed to load case"
        description={message}
        action={
          <Button variant="primary" onClick={() => refetch()} loading={isFetching}>
            Try again
          </Button>
        }
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        title="Case not found"
        description="No case data was returned for this ID."
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to case list
          </Button>
        }
      />
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Back to case list
        </Link>
        <h1 className={styles.title}>Case detail</h1>
      </header>
      <CaseDetailLayout caseData={data} />
    </div>
  )
}
