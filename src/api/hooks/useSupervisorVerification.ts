import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  generateSupervisorVerification,
  sendSupervisorVerification,
} from '../cases'
import type { SupervisorVerificationSendRequest } from '../cases'
import { caseKeys } from '../queryKeys'

function invalidateCaseQueries(queryClient: ReturnType<typeof useQueryClient>, caseId: string) {
  void queryClient.invalidateQueries({ queryKey: caseKeys.detail(caseId) })
  void queryClient.invalidateQueries({ queryKey: caseKeys.all })
  void queryClient.invalidateQueries({ queryKey: caseKeys.audit(caseId) })
}

export function useGenerateSupervisorVerification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateSupervisorVerification(caseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: caseKeys.audit(caseId) })
    },
  })
}

export function useSendSupervisorVerification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SupervisorVerificationSendRequest) =>
      sendSupervisorVerification(caseId, request),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(caseKeys.detail(caseId), updatedCase)
      invalidateCaseQueries(queryClient, caseId)
    },
  })
}
