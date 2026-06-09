import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generateRecommendation } from '../cases'
import { caseKeys } from '../queryKeys'

export function useGenerateRecommendation(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateRecommendation(caseId),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(caseKeys.detail(caseId), updatedCase)
      void queryClient.invalidateQueries({ queryKey: caseKeys.all })
    },
  })
}
