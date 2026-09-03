import {
  CASE_STATUSES,
  DOCUMENT_CASE_TYPES,
  type CaseStatus,
  type DocumentCaseType,
} from '../../../api/types'
import type { DocumentListParams } from '../../../api/internshipDocuments'

export const DEFAULT_DOCUMENT_LIST_PAGE = 0
export const DEFAULT_DOCUMENT_LIST_SIZE = 10

export type DocumentListFilterState = {
  status?: CaseStatus
  caseType?: DocumentCaseType
  search: string
  page: number
  size: number
}

export function parseDocumentListSearchParams(params: URLSearchParams): DocumentListFilterState {
  const statusParam = params.get('status')
  const status =
    statusParam && CASE_STATUSES.includes(statusParam as CaseStatus)
      ? (statusParam as CaseStatus)
      : undefined

  const typeParam = params.get('type')
  const caseType =
    typeParam && DOCUMENT_CASE_TYPES.includes(typeParam as DocumentCaseType)
      ? (typeParam as DocumentCaseType)
      : undefined

  const pageRaw = Number(params.get('page') ?? DEFAULT_DOCUMENT_LIST_PAGE)
  const page =
    Number.isFinite(pageRaw) && pageRaw >= 0 ? Math.floor(pageRaw) : DEFAULT_DOCUMENT_LIST_PAGE

  const sizeRaw = Number(params.get('size') ?? DEFAULT_DOCUMENT_LIST_SIZE)
  const size =
    Number.isFinite(sizeRaw) && sizeRaw >= 1 && sizeRaw <= 100
      ? Math.floor(sizeRaw)
      : DEFAULT_DOCUMENT_LIST_SIZE

  return {
    status,
    caseType,
    search: params.get('search') ?? '',
    page,
    size,
  }
}

export function toDocumentListParams(state: DocumentListFilterState): DocumentListParams {
  const trimmedSearch = state.search.trim()
  return {
    caseType: state.caseType,
    status: state.status,
    search: trimmedSearch || undefined,
    page: state.page,
    size: state.size,
  }
}

export function serializeDocumentListSearchParams(
  state: DocumentListFilterState,
): URLSearchParams {
  const next = new URLSearchParams()
  if (state.status) {
    next.set('status', state.status)
  }
  if (state.caseType) {
    next.set('type', state.caseType)
  }
  if (state.search.trim()) {
    next.set('search', state.search.trim())
  }
  if (state.page !== DEFAULT_DOCUMENT_LIST_PAGE) {
    next.set('page', String(state.page))
  }
  if (state.size !== DEFAULT_DOCUMENT_LIST_SIZE) {
    next.set('size', String(state.size))
  }
  return next
}
