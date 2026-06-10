import { useQuery } from '@tanstack/react-query'
import { fetchAuditLog } from '../cases'
import { isApiError } from '../client'
import { caseKeys } from '../queryKeys'

export function useAuditLog(caseId: string | undefined) {
  return useQuery({
    queryKey: caseKeys.audit(caseId ?? ''),
    queryFn: () => fetchAuditLog(caseId!),
    enabled: Boolean(caseId),
  })
}

export function getAuditQueryErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unable to load case history'
}
