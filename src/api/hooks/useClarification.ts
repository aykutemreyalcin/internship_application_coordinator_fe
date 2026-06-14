import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isMockApiEnabled } from '../../config/env'
import { generateClarification, sendClarification } from '../cases'
import type { ClarificationSendRequest } from '../cases'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useGenerateClarification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateClarification(caseId),
    onSuccess: () => {
      const refreshDetail = !isMockApiEnabled()
      invalidateCaseQueries(queryClient, caseId, {
        detail: refreshDetail,
        list: refreshDetail,
        audit: true,
      })
    },
  })
}

export function useSendClarification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ClarificationSendRequest) => sendClarification(caseId, request),
    onSuccess: (updatedCase) => {
      syncCaseDetailCache(queryClient, caseId, updatedCase)
      invalidateCaseQueries(queryClient, caseId, { detail: false, audit: true })
    },
  })
}
