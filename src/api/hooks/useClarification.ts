import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateClarification, sendClarification } from '../cases'
import type { ClarificationSendRequest } from '../cases'
import { caseKeys } from '../queryKeys'

function invalidateCaseQueries(queryClient: ReturnType<typeof useQueryClient>, caseId: string) {
  void queryClient.invalidateQueries({ queryKey: caseKeys.detail(caseId) })
  void queryClient.invalidateQueries({ queryKey: caseKeys.all })
  void queryClient.invalidateQueries({ queryKey: caseKeys.audit(caseId) })
}

export function useGenerateClarification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateClarification(caseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: caseKeys.audit(caseId) })
    },
  })
}

export function useSendClarification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ClarificationSendRequest) => sendClarification(caseId, request),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(caseKeys.detail(caseId), updatedCase)
      invalidateCaseQueries(queryClient, caseId)
    },
  })
}
