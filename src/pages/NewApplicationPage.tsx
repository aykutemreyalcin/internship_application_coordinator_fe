import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMutationErrorMessage } from '../api/hooks/caseQueryUtils'
import { useCreateCase } from '../api/hooks/useCreateCase'
import { Button, EmptyState, Spinner, useToast } from '../components'
import { validateUploadFile } from '../features/cases/upload/uploadUtils'
import pageStyles from './Page.module.css'
import styles from './NewApplicationPage.module.css'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function NewApplicationPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createMutation = useCreateCase()
  const { uploadProgress } = createMutation

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const isUploading = createMutation.isPending
  const uploadError =
    createMutation.isError && selectedFile
      ? getMutationErrorMessage(createMutation.error, 'Failed to upload application')
      : null

  function handleFile(file: File | undefined) {
    if (!file) {
      return
    }

    createMutation.reset()

    const error = validateUploadFile(file)
    if (error) {
      setValidationError(error)
      setSelectedFile(null)
      return
    }

    setValidationError(null)
    setSelectedFile(file)
  }

  function handleUpload() {
    if (!selectedFile || isUploading) {
      return
    }

    createMutation.mutate(selectedFile, {
      onSuccess: (createdCase) => {
        showToast('Application uploaded successfully', 'success')
        navigate(`/cases/${createdCase.caseId}`)
      },
      onError: (error) => {
        showToast(getMutationErrorMessage(error, 'Failed to upload application'), 'error')
      },
    })
  }

  return (
    <section className={pageStyles.page}>
      <p className={pageStyles.eyebrow}>Intake</p>
      <h2 className={pageStyles.title}>New Application</h2>
      <p className={pageStyles.lead}>
        Upload a student internship application PDF to create a new case for processing.
      </p>

      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        accept="application/pdf,.pdf"
        disabled={isUploading}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div
        className={`${styles.uploadZone} ${isDragActive ? styles.uploadZoneActive : ''} ${isUploading ? styles.uploadZoneDisabled : ''}`}
        role="button"
        tabIndex={0}
        aria-busy={isUploading}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !isUploading) {
            event.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!isUploading) {
            setIsDragActive(true)
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          if (!isUploading) {
            setIsDragActive(true)
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragActive(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragActive(false)
          if (!isUploading) {
            handleFile(event.dataTransfer.files[0])
          }
        }}
      >
        {isUploading ? (
          <div className={styles.uploadOverlay} aria-live="polite">
            <Spinner size="lg" label="Uploading application" />
            <p className={styles.uploadOverlayLabel}>Uploading application…</p>
          </div>
        ) : null}
        <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 16V4m0 0 4 4m-4-4-4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className={styles.uploadTitle}>Drop PDF here or click to browse</p>
        <p className={styles.uploadHint}>PDF only · max 10 MB</p>
      </div>

      {validationError ? <p className={styles.validationError}>{validationError}</p> : null}

      {uploadError ? (
        <div className={styles.uploadError}>
          <EmptyState
            title="Upload failed"
            description={uploadError}
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 8v5m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            action={
              <Button
                variant="primary"
                loading={isUploading}
                disabled={!selectedFile}
                onClick={handleUpload}
              >
                Try again
              </Button>
            }
          />
        </div>
      ) : null}

      {selectedFile ? (
        <div className={styles.selectedFile}>
          <div>
            <p className={styles.fileMeta}>{selectedFile.name}</p>
            <p className={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isUploading}
            onClick={() => {
              setSelectedFile(null)
              setValidationError(null)
              createMutation.reset()
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
          >
            Remove
          </Button>
        </div>
      ) : null}

      {isUploading ? (
        <div
          className={styles.progressWrap}
          role="progressbar"
          aria-valuenow={uploadProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Upload progress"
        >
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className={styles.progressLabel}>Uploading… {uploadProgress}%</p>
        </div>
      ) : null}

      <div className={styles.actions}>
        <Button
          variant="primary"
          loading={isUploading}
          disabled={!selectedFile || isUploading}
          onClick={handleUpload}
        >
          Upload and open case
        </Button>
      </div>
    </section>
  )
}
