import { getMutationErrorMessage } from '../../../../api/hooks/caseQueryUtils'
import { useExtractCase } from '../../../../api/hooks/useExtractCase'
import type { Case } from '../../../../api/types'
import { Button, useToast } from '../../../../components'
import styles from './tabs.module.css'

interface FieldsTabProps {
  caseData: Case
}

interface FieldRow {
  label: string
  value: string | null
}

function formatDate(value: string | null): string | null {
  if (!value) return null
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function FieldsTab({ caseData }: FieldsTabProps) {
  const { showToast } = useToast()
  const extractMutation = useExtractCase(caseData.caseId)
  const isExtracting = caseData.status === 'EXTRACTING'
  const isExtractDisabled = isExtracting || extractMutation.isPending

  function handleReExtract() {
    extractMutation.mutate(undefined, {
      onSuccess: () => {
        showToast('Extraction started', 'success')
      },
      onError: (mutationError) => {
        showToast(getMutationErrorMessage(mutationError, 'Failed to start extraction'), 'error')
      },
    })
  }

  const fields: FieldRow[] = [
    { label: 'Student Name', value: caseData.studentName },
    { label: 'Student ID', value: caseData.studentId },
    { label: 'Field of Study', value: caseData.fieldOfStudy },
    { label: 'Company', value: caseData.companyName },
    { label: 'Supervisor', value: caseData.supervisorName },
    { label: 'Supervisor Email', value: caseData.supervisorEmail },
    {
      label: 'Internship Start',
      value: formatDate(caseData.internshipStartDate),
    },
    {
      label: 'Internship End',
      value: formatDate(caseData.internshipEndDate),
    },
  ]

  const missingCount = fields.filter((field) => !field.value).length

  return (
    <div className={styles.tabContent}>
      <div className={styles.fieldsHeader}>
        <div>
          <h3 className={styles.tabHeading}>Extracted Fields</h3>
          <p className={styles.tabIntro}>
            Values extracted from the uploaded PDF. Missing fields are highlighted.
          </p>
          {missingCount > 0 ? (
            <span className={styles.tabMeta}>
              {missingCount} missing field{missingCount === 1 ? '' : 's'}
            </span>
          ) : null}
          {isExtracting && (
            <p className={styles.extractingNotice} role="status">
              Extraction in progress — fields will refresh automatically when complete.
            </p>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          loading={isExtractDisabled}
          disabled={isExtractDisabled}
          onClick={handleReExtract}
        >
          {isExtracting ? 'Extracting…' : 'Re-extract'}
        </Button>
      </div>

      <dl className={`${styles.fieldList} ${isExtracting ? styles.fieldListDisabled : ''}`}>
        {fields.map((field) => (
          <div
            key={field.label}
            className={`${styles.fieldRow} ${!field.value ? styles.fieldMissing : ''}`}
          >
            <dt className={styles.fieldLabel}>{field.label}</dt>
            <dd className={styles.fieldValue}>{field.value ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
