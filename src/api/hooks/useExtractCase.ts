import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractCase } from '../cases'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useExtractCase(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => extractCase(caseId),
    onSuccess: (updatedCase) => {
      syncCaseDetailCache(queryClient, caseId, updatedCase)
      invalidateCaseQueries(queryClient, caseId, {
        detail: false,
        audit: true,
        validation: true,
      })
    },
  })
}
