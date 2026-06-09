import type { Case, EditableCaseField } from '../../../../api/types'

export function isFieldEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === ''
}

export function formatDisplayDate(value: string | null): string | null {
  if (isFieldEmpty(value)) return null
  return new Date(value!).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export interface DurationResult {
  label: string | null
  isMissing: boolean
  missingReason?: string
}

function parseDateOnly(value: string): Date {
  const datePart = value.split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function calculateInternshipDuration(
  startDate: string | null,
  endDate: string | null,
): DurationResult {
  if (isFieldEmpty(startDate) && isFieldEmpty(endDate)) {
    return {
      label: null,
      isMissing: true,
      missingReason: 'Start and end dates are required to calculate duration',
    }
  }

  if (isFieldEmpty(startDate)) {
    return {
      label: null,
      isMissing: true,
      missingReason: 'Start date is missing',
    }
  }

  if (isFieldEmpty(endDate)) {
    return {
      label: null,
      isMissing: true,
      missingReason: 'End date is missing',
    }
  }

  const start = parseDateOnly(startDate!)
  const end = parseDateOnly(endDate!)
  const diffMs = end.getTime() - start.getTime()

  if (diffMs < 0) {
    return {
      label: 'Invalid date range',
      isMissing: false,
      missingReason: 'End date is before start date',
    }
  }

  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1
  const months = Math.floor(totalDays / 30)
  const days = totalDays % 30

  if (months > 0 && days > 0) {
    return {
      label: `${months} month${months === 1 ? '' : 's'}, ${days} day${days === 1 ? '' : 's'} (${totalDays} days)`,
      isMissing: false,
    }
  }

  if (months > 0) {
    return {
      label: `${months} month${months === 1 ? '' : 's'} (${totalDays} days)`,
      isMissing: false,
    }
  }

  return {
    label: `${totalDays} day${totalDays === 1 ? '' : 's'}`,
    isMissing: false,
  }
}

export interface FieldDefinition {
  key: EditableCaseField | 'duration'
  label: string
  editable: boolean
  inputType?: 'text' | 'email' | 'date'
  getValue: (data: Case) => string | null
}

export const EXTRACTED_FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'studentName',
    label: 'Student Name',
    editable: true,
    getValue: (data) => data.studentName,
  },
  {
    key: 'studentId',
    label: 'Student ID',
    editable: true,
    getValue: (data) => data.studentId,
  },
  {
    key: 'fieldOfStudy',
    label: 'Field of Study',
    editable: true,
    getValue: (data) => data.fieldOfStudy,
  },
  {
    key: 'companyName',
    label: 'Company',
    editable: true,
    getValue: (data) => data.companyName,
  },
  {
    key: 'supervisorName',
    label: 'Supervisor',
    editable: true,
    getValue: (data) => data.supervisorName,
  },
  {
    key: 'supervisorEmail',
    label: 'Supervisor Email',
    editable: true,
    inputType: 'email',
    getValue: (data) => data.supervisorEmail,
  },
  {
    key: 'internshipStartDate',
    label: 'Internship Start',
    editable: true,
    inputType: 'date',
    getValue: (data) => data.internshipStartDate,
  },
  {
    key: 'internshipEndDate',
    label: 'Internship End',
    editable: true,
    inputType: 'date',
    getValue: (data) => data.internshipEndDate,
  },
  {
    key: 'duration',
    label: 'Duration',
    editable: false,
    getValue: () => null,
  },
]

export function countMissingFields(data: Case): number {
  const editableFields = EXTRACTED_FIELD_DEFINITIONS.filter((field) => field.editable)
  const missingEditable = editableFields.filter((field) =>
    isFieldEmpty(field.getValue(data)),
  ).length

  const duration = calculateInternshipDuration(
    data.internshipStartDate,
    data.internshipEndDate,
  )

  return missingEditable + (duration.isMissing ? 1 : 0)
}
