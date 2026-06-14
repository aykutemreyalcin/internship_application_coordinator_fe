import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCase } from '../cases'
import { caseKeys } from '../queryKeys'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

export function useCreateCase() {
  const queryClient = useQueryClient()
  const [uploadProgress, setUploadProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: (file: File) =>
      createCase(file, (progress) => setUploadProgress(progress)),
    onSettled: () => setUploadProgress(0),
    onSuccess: (createdCase) => {
      syncCaseDetailCache(queryClient, createdCase.caseId, createdCase)
      invalidateCaseQueries(queryClient, createdCase.caseId, {
        detail: false,
        audit: true,
      })
      void queryClient.invalidateQueries({ queryKey: caseKeys.all })
    },
  })

  return { ...mutation, uploadProgress }
}
