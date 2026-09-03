import { DOCUMENT_CASE_TYPES } from './types'
import type { Case, CaseListParams, CaseType, DocumentCaseType, PageResponse, CaseSummary } from './types'
import { createCase, fetchCase, fetchCases } from './cases'

export type DocumentListParams = Omit<CaseListParams, 'caseType'> & {
  caseType?: DocumentCaseType
}

export async function fetchDocuments(
  params: DocumentListParams = {},
): Promise<PageResponse<CaseSummary>> {
  if (params.caseType) {
    return fetchCases({ ...params, caseType: params.caseType })
  }

  const [reports, journals] = await Promise.all(
    DOCUMENT_CASE_TYPES.map((caseType) =>
      fetchCases({
        ...params,
        caseType,
        page: 0,
        size: 500,
      }),
    ),
  )

  const merged = [...reports.content, ...journals.content].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  )

  const page = params.page ?? 0
  const size = params.size ?? 20
  const start = page * size
  const content = merged.slice(start, start + size)

  return {
    content,
    page,
    size,
    totalElements: merged.length,
    totalPages: Math.max(1, Math.ceil(merged.length / size)),
  }
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

export function isDocumentCaseType(caseType: CaseType): caseType is DocumentCaseType {
  return DOCUMENT_CASE_TYPES.includes(caseType as DocumentCaseType)
}
