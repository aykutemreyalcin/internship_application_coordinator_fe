import { useQuery } from '@tanstack/react-query'
import { fetchCase, fetchCases, isApiError } from '../api'

export function useCaseList() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: () => fetchCases({ page: 0, size: 20 }),
  })
}

export function useCase(caseId: string | undefined) {
  return useQuery({
    queryKey: ['cases', caseId],
    queryFn: () => fetchCase(caseId!),
    enabled: Boolean(caseId),
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
