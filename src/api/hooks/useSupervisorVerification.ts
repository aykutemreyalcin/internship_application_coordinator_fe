import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  generateSupervisorVerification,
  sendSupervisorVerification,
} from '../cases'
import type { SupervisorVerificationSendRequest } from '../cases'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useGenerateSupervisorVerification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateSupervisorVerification(caseId),
    onSuccess: () => {
      invalidateCaseQueries(queryClient, caseId, { detail: false, list: false, audit: true })
    },
  })
}

export function useSendSupervisorVerification(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SupervisorVerificationSendRequest) =>
      sendSupervisorVerification(caseId, request),
    onSuccess: (updatedCase) => {
      syncCaseDetailCache(queryClient, caseId, updatedCase)
      invalidateCaseQueries(queryClient, caseId, { detail: false, audit: true })
    },
  })
}
