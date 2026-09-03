import { useQuery } from '@tanstack/react-query'
import { fetchDocumentCase } from '../internshipDocuments'
import { documentKeys } from '../queryKeys'
import { getCaseQueryErrorMessage } from './useCases'

export function useDocumentCase(caseId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.detail(caseId ?? ''),
    queryFn: () => fetchDocumentCase(caseId!),
    enabled: Boolean(caseId),
  })
}

export { getCaseQueryErrorMessage as getDocumentCaseQueryErrorMessage }
