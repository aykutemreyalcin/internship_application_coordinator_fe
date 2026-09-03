import { Link, useNavigate, useParams } from 'react-router-dom'
import { isApiError, isNotFoundError } from '../../../api/client'
import { useDocumentCase } from '../../../api/hooks/useDocumentCase'
import { DOCUMENT_CASE_TYPES } from '../../../api/types'
import { Button, EmptyState, LoadingBlock } from '../../../components'
import { DocumentTypeBadge } from '../../../components/DocumentTypeBadge/DocumentTypeBadge'
import { DocumentDetailLayout } from './DocumentDetailLayout'
import styles from './DocumentDetail.module.css'

export function DocumentDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch, isFetching } = useDocumentCase(id)

  if (isLoading) {
    return <LoadingBlock label="Loading document details…" />
  }

  if (isError && isNotFoundError(error)) {
    return (
      <EmptyState
        title="Document not found"
        description={
          isApiError(error)
            ? error.message
            : 'The requested document does not exist or may have been removed.'
        }
        action={
          <Button variant="secondary" onClick={() => navigate('/documents')}>
            Back to documents
          </Button>
        }
      />
    )
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load document"
        description={
          isApiError(error) ? error.message : 'Something went wrong while loading this document.'
        }
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
        title="Document not found"
        description="No document data was returned for this ID."
        action={
          <Button variant="secondary" onClick={() => navigate('/documents')}>
            Back to documents
          </Button>
        }
      />
    )
  }

  if (!DOCUMENT_CASE_TYPES.includes(data.caseType as (typeof DOCUMENT_CASE_TYPES)[number])) {
    return (
      <EmptyState
        title="Not an internship document"
        description="This case belongs to the application workflow. Open it from the applications list instead."
        action={
          <Button variant="secondary" onClick={() => navigate(`/cases/${data.caseId}`)}>
            Open application case
          </Button>
        }
      />
    )
  }

  return (
    <div className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <Link to="/documents" className={styles.backLink}>
          ← Back to documents
        </Link>
        <div className={styles.detailTitleRow}>
          <DocumentTypeBadge caseType={data.caseType} />
          <h1 className={styles.detailTitle}>{data.studentName ?? 'Unknown student'}</h1>
        </div>
      </header>
      <DocumentDetailLayout caseData={data} />
    </div>
  )
}
