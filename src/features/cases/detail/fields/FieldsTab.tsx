import { useMemo, useState } from 'react'
import type { Case, EditableCaseField } from '../../../../api/types'
import { Button } from '../../../../components/Button/Button'
import {
  calculateInternshipDuration,
  countMissingFields,
  EXTRACTED_FIELD_DEFINITIONS,
  formatDisplayDate,
  isFieldEmpty,
  type FieldDefinition,
} from './fieldUtils'
import styles from './FieldsTab.module.css'

interface FieldsTabProps {
  caseData: Case
}

type FieldOverrides = Partial<Record<EditableCaseField, string>>

function getDisplayValue(
  field: FieldDefinition,
  data: Case,
  overrides: FieldOverrides,
): string | null {
  if (field.key === 'duration') return null
  const override = overrides[field.key as EditableCaseField]
  if (override !== undefined) return override || null
  return field.getValue(data)
}

function getDurationDisplay(data: Case, overrides: FieldOverrides) {
  const start =
    overrides.internshipStartDate !== undefined
      ? overrides.internshipStartDate || null
      : data.internshipStartDate
  const end =
    overrides.internshipEndDate !== undefined
      ? overrides.internshipEndDate || null
      : data.internshipEndDate

  return calculateInternshipDuration(start, end)
}

export function FieldsTab({ caseData }: FieldsTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<FieldOverrides>({})
  const [savedOverrides, setSavedOverrides] = useState<FieldOverrides>({})
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const mergedData = useMemo<Case>(
    () => ({
      ...caseData,
      ...Object.fromEntries(
        Object.entries(savedOverrides).map(([key, value]) => [key, value || null]),
      ),
    }),
    [caseData, savedOverrides],
  )

  const missingCount = countMissingFields(mergedData)

  function startEditing() {
    const initialDraft: FieldOverrides = {}
    for (const field of EXTRACTED_FIELD_DEFINITIONS) {
      if (!field.editable || field.key === 'duration') continue
      const value = getDisplayValue(field, mergedData, savedOverrides)
      initialDraft[field.key as EditableCaseField] = value ?? ''
    }
    setDraft(initialDraft)
    setIsEditing(true)
    setSaveNotice(null)
  }

  function cancelEditing() {
    setDraft({})
    setIsEditing(false)
    setSaveNotice(null)
  }

  function handleDraftChange(key: EditableCaseField, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    setSavedOverrides(draft)
    setIsEditing(false)
    setDraft({})
    setSaveNotice('Changes saved locally. PATCH sync will be available in a future update.')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.heading}>Extracted Fields</h3>
          <p className={styles.subheading}>
            Fields extracted from the application document by the AI agent.
          </p>
        </div>
        <div className={styles.headerActions}>
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save changes
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={startEditing}>
              Edit fields
            </Button>
          )}
        </div>
      </header>

      {missingCount > 0 && (
        <div className={styles.missingBanner} role="status">
          <span className={styles.missingIcon} aria-hidden="true">
            !
          </span>
          <span>
            <strong>{missingCount}</strong> field{missingCount === 1 ? '' : 's'} missing or
            incomplete — highlighted below.
          </span>
        </div>
      )}

      {saveNotice && (
        <p className={styles.saveNotice} role="status">
          {saveNotice}
        </p>
      )}

      <div className={styles.fieldGrid}>
        {EXTRACTED_FIELD_DEFINITIONS.map((field) => {
          if (field.key === 'duration') {
            const duration = getDurationDisplay(mergedData, savedOverrides)
            const isMissing = duration.isMissing

            return (
              <div
                key={field.key}
                className={`${styles.fieldCard} ${isMissing ? styles.fieldMissing : ''}`}
              >
                <div className={styles.fieldCardHeader}>
                  <span className={styles.fieldLabel}>{field.label}</span>
                  {isMissing && <span className={styles.missingBadge}>Missing</span>}
                </div>
                <p className={isMissing ? styles.missingValue : styles.fieldValue}>
                  {duration.label ?? 'Not available'}
                </p>
                {duration.missingReason && (
                  <p className={styles.missingHint}>{duration.missingReason}</p>
                )}
              </div>
            )
          }

          const value = getDisplayValue(field, mergedData, savedOverrides)
          const isMissing = isFieldEmpty(value)
          const displayValue =
            field.inputType === 'date' ? formatDisplayDate(value) : value

          return (
            <div
              key={field.key}
              className={`${styles.fieldCard} ${isMissing && !isEditing ? styles.fieldMissing : ''}`}
            >
              <div className={styles.fieldCardHeader}>
                <span className={styles.fieldLabel}>{field.label}</span>
                {isMissing && !isEditing && (
                  <span className={styles.missingBadge}>Missing</span>
                )}
              </div>

              {isEditing ? (
                <input
                  className={styles.fieldInput}
                  type={field.inputType ?? 'text'}
                  value={draft[field.key as EditableCaseField] ?? ''}
                  onChange={(event) =>
                    handleDraftChange(field.key as EditableCaseField, event.target.value)
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  aria-label={field.label}
                />
              ) : (
                <p className={isMissing ? styles.missingValue : styles.fieldValue}>
                  {displayValue ?? 'Not provided'}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
