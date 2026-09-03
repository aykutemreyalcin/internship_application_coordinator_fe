import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDocumentCase } from '../internshipDocuments'
import type { DocumentCaseType } from '../types'
import { documentKeys } from '../queryKeys'
import { caseKeys } from '../queryKeys'
import { invalidateCaseQueries, syncCaseDetailCache } from './caseQueryUtils'

type CreateDocumentInput = {
  file: File
  caseType: DocumentCaseType
}

export function useCreateDocumentCase() {
  const queryClient = useQueryClient()
  const [uploadProgress, setUploadProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: ({ file, caseType }: CreateDocumentInput) =>
      createDocumentCase(file, caseType, (progress) => setUploadProgress(progress)),
    onSettled: () => setUploadProgress(0),
    onSuccess: (createdCase) => {
      syncCaseDetailCache(queryClient, createdCase.caseId, createdCase)
      queryClient.setQueryData(documentKeys.detail(createdCase.caseId), createdCase)
      invalidateCaseQueries(queryClient, createdCase.caseId, {
        detail: false,
        audit: true,
      })
      void queryClient.invalidateQueries({ queryKey: documentKeys.all })
      void queryClient.invalidateQueries({ queryKey: caseKeys.all })
    },
  })

  return { ...mutation, uploadProgress }
}
