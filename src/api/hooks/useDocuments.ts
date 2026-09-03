import { useQuery } from '@tanstack/react-query'
import { fetchDocuments, type DocumentListParams } from '../internshipDocuments'
import { isApiError } from '../client'
import { documentKeys } from '../queryKeys'

export function useDocumentList(params: DocumentListParams) {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: () => fetchDocuments(params),
  })
}

export function getDocumentQueryErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Unable to load documents'
}
