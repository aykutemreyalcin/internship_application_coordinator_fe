import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyDecision } from '../cases'
import type { CoordinatorDecisionRequest } from '../types'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useApplyDecision(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CoordinatorDecisionRequest) => applyDecision(caseId, request),
    onSuccess: (updatedCase) => {
      syncCaseDetailCache(queryClient, caseId, updatedCase)
      invalidateCaseQueries(queryClient, caseId, { detail: false, audit: true })
    },
  })
}
