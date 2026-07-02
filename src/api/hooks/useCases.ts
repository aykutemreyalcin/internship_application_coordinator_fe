import { useQuery } from '@tanstack/react-query'
import { fetchCases } from '../cases'
import { isApiError } from '../client'
import type { CaseListParams } from '../types'
import { caseKeys } from '../queryKeys'

export function useCaseList(params: CaseListParams) {
  return useQuery({
    queryKey: caseKeys.list(params),
    queryFn: () => fetchCases(params),
  })
}

export function getCaseQueryErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unable to load case data'
}
