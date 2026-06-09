import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyDecision } from '../cases'
import type { CoordinatorDecisionRequest } from '../types'
import { caseKeys } from '../queryKeys'

export function useApplyDecision(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CoordinatorDecisionRequest) => applyDecision(caseId, request),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(caseKeys.detail(caseId), updatedCase)
      void queryClient.invalidateQueries({ queryKey: caseKeys.all })
      void queryClient.invalidateQueries({ queryKey: caseKeys.audit(caseId) })
    },
  })
}
