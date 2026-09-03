import { useEffect, useMemo } from 'react'
import { documentUrl } from '../../../api/cases'
import { getDocumentQueryErrorMessage, useDocument } from '../../../api/hooks/useDocument'
import type { ApplicationDocument } from '../../../api/types'
import { Button, EmptyState, Skeleton } from '../../../components'
import { isDocxFile } from '../../cases/upload/uploadUtils'
import styles from './DocumentDetail.module.css'

interface DocumentPreviewProps {
  caseId: string
  document: ApplicationDocument
}

export function DocumentPreview({ caseId, document }: DocumentPreviewProps) {
  const isDocx = isDocxFile(document)
  const { data: blob, isLoading, isError, error, refetch, isFetching } = useDocument(
    caseId,
    document.id,
  )

  const objectUrl = useMemo(() => (blob && !isDocx ? URL.createObjectURL(blob) : null), [blob, isDocx])
  const downloadUrl = objectUrl ?? documentUrl(caseId, document.id)

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  return (
    <div className={styles.preview}>
      <div className={styles.previewToolbar}>
        <div className={styles.previewMeta}>
          <span className={styles.previewLabel}>Document</span>
          <span className={styles.previewName} title={document.fileName}>
            {document.fileName}
          </span>
        </div>
        <a
          className={styles.previewLink}
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={isDocx ? document.fileName : undefined}
        >
          {isDocx ? 'Download' : 'Open in new tab'}
        </a>
      </div>

      {isDocx ? (
        <div className={styles.docxPlaceholder}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.docxIcon}>
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p className={styles.docxTitle}>Word document</p>
          <p className={styles.docxHint}>
            In-browser preview is not available for .docx files. Download the file to view it
            locally, or review extracted fields in the Summary tab.
          </p>
          <a className={styles.docxDownload} href={downloadUrl} download={document.fileName}>
            Download {document.fileName}
          </a>
        </div>
      ) : null}

      {!isDocx && isLoading ? (
        <div className={styles.frameShell} aria-busy="true">
          <Skeleton className={styles.loadingSkeleton} />
          <p className={styles.loadingLabel}>Loading PDF…</p>
        </div>
      ) : null}

      {!isDocx && isError ? (
        <div className={styles.frameShell}>
          <EmptyState
            title="Failed to load document"
            description={getDocumentQueryErrorMessage(error)}
            action={
              <Button variant="primary" size="sm" onClick={() => refetch()} loading={isFetching}>
                Try again
              </Button>
            }
          />
        </div>
      ) : null}

      {!isDocx && !isLoading && !isError && objectUrl ? (
        <iframe
          className={styles.frame}
          src={objectUrl}
          title={`PDF preview: ${document.fileName}`}
        />
      ) : null}
    </div>
  )
}
