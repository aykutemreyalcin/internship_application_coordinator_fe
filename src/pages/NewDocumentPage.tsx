import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMutationErrorMessage } from '../api/hooks/caseQueryUtils'
import { useCreateDocumentCase } from '../api/hooks/useCreateDocumentCase'
import type { DocumentCaseType } from '../api/types'
import { Button, EmptyState, Spinner, useToast } from '../components'
import { validateDocumentUploadFile } from '../features/cases/upload/uploadUtils'
import pageStyles from './Page.module.css'
import styles from './NewDocumentPage.module.css'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DOCUMENT_TYPES: {
  value: DocumentCaseType
  label: string
  description: string
}[] = [
  {
    value: 'LEARNING_OUTCOMES_REPORT',
    label: 'Learning Outcomes Report',
    description:
      'End-of-internship report documenting how the student achieved each learning outcome.',
  },
  {
    value: 'INTERNSHIP_JOURNAL',
    label: 'Internship Journal',
    description:
      'Weekly log of hours and activities completed during the internship period.',
  },
]

export function NewDocumentPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createMutation = useCreateDocumentCase()
  const { uploadProgress } = createMutation

  const [caseType, setCaseType] = useState<DocumentCaseType>('LEARNING_OUTCOMES_REPORT')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const isUploading = createMutation.isPending
  const uploadError =
    createMutation.isError && selectedFile
      ? getMutationErrorMessage(createMutation.error, 'Failed to upload document')
      : null

  function handleFile(file: File | undefined) {
    if (!file) {
      return
    }

    createMutation.reset()

    const error = validateDocumentUploadFile(file)
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

    createMutation.mutate(
      { file: selectedFile, caseType },
      {
        onSuccess: (createdCase) => {
          showToast('Document uploaded successfully', 'success')
          navigate(`/documents/${createdCase.caseId}`)
        },
        onError: (error) => {
          showToast(getMutationErrorMessage(error, 'Failed to upload document'), 'error')
        },
      },
    )
  }

  return (
    <section
      className={`${pageStyles.page} ${pageStyles.pageEnter}`}
      aria-labelledby="new-document-heading"
    >
      <div className={pageStyles.hero}>
        <p className={pageStyles.eyebrow}>Internship Documents</p>
        <h2 id="new-document-heading" className={pageStyles.title}>
          Upload document
        </h2>
        <p className={pageStyles.lead}>
          Select the document type, then upload a PDF or Word (.docx) file for AI-assisted review.
        </p>
      </div>

      <fieldset className={styles.typeSelector} disabled={isUploading}>
        <legend className={styles.typeLegend}>Document type</legend>
        <div className={styles.typeGrid}>
          {DOCUMENT_TYPES.map((option) => (
            <label
              key={option.value}
              className={`${styles.typeCard} ${caseType === option.value ? styles.typeCardActive : ''}`}
            >
              <input
                type="radio"
                name="caseType"
                value={option.value}
                checked={caseType === option.value}
                onChange={() => setCaseType(option.value)}
              />
              <span className={styles.typeCardLabel}>{option.label}</span>
              <span className={styles.typeCardDescription}>{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <input
        ref={fileInputRef}
        className={styles.fileInput}
        type="file"
        accept="application/pdf,.pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            <Spinner size="lg" label="Uploading document" />
            <p className={styles.uploadOverlayLabel}>Uploading document…</p>
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
        <p className={styles.uploadTitle}>Drop PDF or DOCX here, or click to browse</p>
        <p className={styles.uploadHint}>PDF or Word (.docx) only · max 10 MB</p>
      </div>

      {validationError ? (
        <p className={styles.validationError} role="alert">
          {validationError}
        </p>
      ) : null}

      {uploadError ? (
        <div className={styles.uploadError}>
          <EmptyState
            title="Upload failed"
            description={uploadError}
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
          Upload and open document
        </Button>
      </div>
    </section>
  )
}
