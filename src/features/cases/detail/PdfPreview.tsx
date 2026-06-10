import { useEffect, useMemo } from 'react'
import { getDocumentQueryErrorMessage, useDocument } from '../../../api/hooks/useDocument'
import type { ApplicationDocument } from '../../../api/types'
import { Button, EmptyState, LoadingBlock } from '../../../components'
import styles from './CaseSummaryPanel.module.css'

interface PdfPreviewProps {
  caseId: string
  document: ApplicationDocument
}

export function PdfPreview({ caseId, document }: PdfPreviewProps) {
  const { data: blob, isLoading, isError, error, refetch, isFetching } = useDocument(
    caseId,
    document.id,
  )

  const objectUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob])

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  if (isLoading) {
    return (
      <div className={styles.pdfPreview}>
        <LoadingBlock label="Loading PDF…" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.pdfPreview}>
        <EmptyState
          title="Failed to load PDF"
          description={getDocumentQueryErrorMessage(error)}
          action={
            <Button variant="primary" onClick={() => refetch()} loading={isFetching}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!objectUrl) {
    return null
  }

  return (
    <div className={styles.pdfPreview}>
      <iframe
        className={styles.pdfFrame}
        src={objectUrl}
        title={`PDF preview: ${document.fileName}`}
      />
      <p className={styles.pdfCaption}>
        {document.fileName} · {document.pageCount} pages
      </p>
    </div>
  )
}
