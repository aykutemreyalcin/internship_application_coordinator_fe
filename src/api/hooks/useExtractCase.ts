import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractCase } from '../cases'
import { caseKeys } from '../queryKeys'

export function useExtractCase(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => extractCase(caseId),
    onSuccess: (updatedCase) => {
      queryClient.setQueryData(caseKeys.detail(caseId), updatedCase)
    },
  })
}
