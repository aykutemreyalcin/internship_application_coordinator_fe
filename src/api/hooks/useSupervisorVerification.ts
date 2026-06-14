import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isMockApiEnabled } from '../../config/env'
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
      const refreshDetail = !isMockApiEnabled()
      invalidateCaseQueries(queryClient, caseId, {
        detail: refreshDetail,
        list: refreshDetail,
        audit: true,
      })
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
