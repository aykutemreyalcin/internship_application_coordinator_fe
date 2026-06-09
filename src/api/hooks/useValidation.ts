import { useQuery } from '@tanstack/react-query'
import { fetchValidation } from '../cases'
import { isApiError } from '../client'
import { caseKeys } from '../queryKeys'

export function useValidation(caseId: string | undefined) {
  return useQuery({
    queryKey: caseKeys.validation(caseId ?? ''),
    queryFn: () => fetchValidation(caseId!),
    enabled: Boolean(caseId),
  })
}

export function getValidationQueryErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unable to load validation results'
}
