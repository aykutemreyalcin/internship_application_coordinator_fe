import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiClientError, isNotFoundError } from '../../../api/client'
import { useCase } from '../../../api/hooks/useCase'
import { Button } from '../../../components/Button/Button'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { Spinner } from '../../../components/Spinner/Spinner'
import { CaseDetailLayout } from './CaseDetailLayout'
import styles from './CaseDetailPage.module.css'

export function CaseDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch, isFetching } = useCase(id)

  if (isLoading) {
    return <Spinner label="Loading case details…" fullPage />
  }

  if (isError && isNotFoundError(error)) {
    return (
      <EmptyState
        variant="notFound"
        title="Case not found"
        description={
          error instanceof ApiClientError
            ? error.message
            : 'The requested case does not exist or may have been removed.'
        }
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        }
      />
    )
  }

  if (isError) {
    const message =
      error instanceof ApiClientError
        ? error.message
        : 'Something went wrong while loading this case.'

    return (
      <EmptyState
        variant="error"
        title="Failed to load case"
        description={message}
        action={
          <Button variant="primary" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Retrying…' : 'Try again'}
          </Button>
        }
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        variant="notFound"
        title="Case not found"
        description="No case data was returned for this ID."
        action={
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        }
      />
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Back
        </Link>
        <h1 className={styles.title}>Case Detail</h1>
      </header>
      <CaseDetailLayout caseData={data} />
    </div>
  )
}
