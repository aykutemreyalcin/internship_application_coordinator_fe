import { CASE_STATUSES, type CaseListParams, type CaseStatus } from '../../../api/types'

export const DEFAULT_CASE_LIST_PAGE = 0
export const DEFAULT_CASE_LIST_SIZE = 10

export type CaseListFilterState = {
  status?: CaseStatus
  search: string
  page: number
  size: number
}

export function parseCaseListSearchParams(params: URLSearchParams): CaseListFilterState {
  const statusParam = params.get('status')
  const status =
    statusParam && CASE_STATUSES.includes(statusParam as CaseStatus)
      ? (statusParam as CaseStatus)
      : undefined

  const pageRaw = Number(params.get('page') ?? DEFAULT_CASE_LIST_PAGE)
  const page =
    Number.isFinite(pageRaw) && pageRaw >= 0 ? Math.floor(pageRaw) : DEFAULT_CASE_LIST_PAGE

  const sizeRaw = Number(params.get('size') ?? DEFAULT_CASE_LIST_SIZE)
  const size =
    Number.isFinite(sizeRaw) && sizeRaw >= 1 && sizeRaw <= 100
      ? Math.floor(sizeRaw)
      : DEFAULT_CASE_LIST_SIZE

  return {
    status,
    search: params.get('search') ?? '',
    page,
    size,
  }
}

export function toCaseListParams(state: CaseListFilterState): CaseListParams {
  const trimmedSearch = state.search.trim()
  return {
    caseType: 'APPLICATION',
    status: state.status,
    search: trimmedSearch || undefined,
    page: state.page,
    size: state.size,
  }
}

export function serializeCaseListSearchParams(state: CaseListFilterState): URLSearchParams {
  const next = new URLSearchParams()
  if (state.status) {
    next.set('status', state.status)
  }
  if (state.search.trim()) {
    next.set('search', state.search.trim())
  }
  if (state.page !== DEFAULT_CASE_LIST_PAGE) {
    next.set('page', String(state.page))
  }
  if (state.size !== DEFAULT_CASE_LIST_SIZE) {
    next.set('size', String(state.size))
  }
  return next
}
