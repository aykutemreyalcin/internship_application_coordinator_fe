import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCase } from '../cases'
import { caseKeys } from '../queryKeys'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => createCase(file),
    onSuccess: (createdCase) => {
      syncCaseDetailCache(queryClient, createdCase.caseId, createdCase)
      invalidateCaseQueries(queryClient, createdCase.caseId, {
        detail: false,
        audit: true,
      })
      void queryClient.invalidateQueries({ queryKey: caseKeys.all })
    },
  })
}
