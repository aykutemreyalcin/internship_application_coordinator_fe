import { useEffect, useMemo } from 'react'
import { documentUrl } from '../../../api/cases'
import { getDocumentQueryErrorMessage, useDocument } from '../../../api/hooks/useDocument'
import type { ApplicationDocument } from '../../../api/types'
import { Button, EmptyState, Skeleton } from '../../../components'
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
  const openUrl = objectUrl ?? documentUrl(caseId, document.id)

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  return (
    <div className={styles.pdfPreview}>
      <div className={styles.pdfToolbar}>
        <div className={styles.pdfToolbarMeta}>
          <span className={styles.pdfToolbarLabel}>Document</span>
          <span className={styles.pdfToolbarName} title={document.fileName}>
            {document.fileName}
          </span>
        </div>
        {!isLoading && !isError && objectUrl ? (
          <a
            className={styles.pdfOpenLink}
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in new tab
          </a>
        ) : null}
      </div>

      {isLoading ? (
        <div className={styles.pdfFrameShell} aria-busy="true" aria-label="Loading PDF preview">
          <Skeleton className={styles.pdfLoadingSkeleton} />
          <p className={styles.pdfLoadingLabel}>Loading PDF…</p>
        </div>
      ) : null}

      {isError ? (
        <div className={styles.pdfFrameShell}>
          <EmptyState
            title="Failed to load PDF"
            description={getDocumentQueryErrorMessage(error)}
            action={
              <Button variant="primary" size="sm" onClick={() => refetch()} loading={isFetching}>
                Try again
              </Button>
            }
          />
        </div>
      ) : null}

      {!isLoading && !isError && objectUrl ? (
        <iframe
          className={styles.pdfFrame}
          src={objectUrl}
          title={`PDF preview: ${document.fileName}`}
        />
      ) : null}

      {!isLoading && !isError && objectUrl ? (
        <p className={styles.pdfCaption}>
          {document.fileName} · {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'}
        </p>
      ) : null}
    </div>
  )
}
