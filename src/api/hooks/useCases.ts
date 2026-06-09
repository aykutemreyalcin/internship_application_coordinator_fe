import { useQuery } from '@tanstack/react-query'
import { fetchCases } from '../cases'
import { isApiError } from '../client'
import { caseKeys } from '../queryKeys'

export function useCaseList() {
  return useQuery({
    queryKey: caseKeys.all,
    queryFn: () => fetchCases({ page: 0, size: 20 }),
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
