import { useQuery } from '@tanstack/react-query'
import { fetchDocument } from '../cases'
import { isApiError } from '../client'
import { caseKeys } from '../queryKeys'

export function useDocument(caseId: string | undefined, documentId: string | undefined) {
  return useQuery({
    queryKey: caseKeys.document(caseId ?? '', documentId ?? ''),
    queryFn: () => fetchDocument(caseId!, documentId!),
    enabled: Boolean(caseId && documentId),
  })
}

export function getDocumentQueryErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unable to load PDF document'
}
