import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateRecommendation } from '../cases'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useGenerateRecommendation(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateRecommendation(caseId),
    onSuccess: (updatedCase) => {
      syncCaseDetailCache(queryClient, caseId, updatedCase)
      invalidateCaseQueries(queryClient, caseId, { detail: false, audit: true })
    },
  })
}
