import type { CaseType, DocumentCaseType } from '../../api/types'

export function getDocumentTypeLabel(caseType: CaseType): string {
  switch (caseType) {
    case 'LEARNING_OUTCOMES_REPORT':
      return 'Learning Outcomes Report'
    case 'INTERNSHIP_JOURNAL':
      return 'Internship Journal'
    default:
      return 'Application'
  }
}

export function getDocumentTypeShortLabel(caseType: DocumentCaseType): string {
  return caseType === 'LEARNING_OUTCOMES_REPORT' ? 'Report' : 'Journal'
}
