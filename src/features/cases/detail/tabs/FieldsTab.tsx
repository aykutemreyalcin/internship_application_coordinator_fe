import type { Case } from '../../../../api/types'
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

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Extracted Fields</h3>
      <dl className={styles.fieldList}>
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
