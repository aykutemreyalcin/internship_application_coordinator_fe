import { DOCUMENT_CASE_TYPES } from './types'
import type { Case, CaseListParams, CaseType, DocumentCaseType, PageResponse, CaseSummary } from './types'
import { createCase, fetchCase, fetchCases } from './cases'

export type DocumentListParams = Omit<CaseListParams, 'caseType'> & {
  caseType?: DocumentCaseType
}

export async function fetchDocuments(
  params: DocumentListParams = {},
): Promise<PageResponse<CaseSummary>> {
  const caseType: CaseType | CaseType[] = params.caseType ?? [...DOCUMENT_CASE_TYPES]
  return fetchCases({ ...params, caseType })
}

export async function fetchDocumentCase(caseId: string): Promise<Case> {
  return fetchCase(caseId)
}

export async function createDocumentCase(
  file: File,
  caseType: DocumentCaseType,
  onUploadProgress?: (percent: number) => void,
): Promise<Case> {
  return createCase(file, onUploadProgress, caseType)
}
