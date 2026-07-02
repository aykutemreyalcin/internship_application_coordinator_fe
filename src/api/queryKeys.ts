import type { CaseListParams } from './types'

export const caseKeys = {
  all: ['cases'] as const,
  list: (params: CaseListParams) => [...caseKeys.all, 'list', params] as const,
  detail: (id: string) => [...caseKeys.all, id] as const,
  validation: (id: string) => [...caseKeys.detail(id), 'validation'] as const,
  audit: (id: string) => [...caseKeys.detail(id), 'audit'] as const,
  document: (caseId: string, documentId: string) =>
    [...caseKeys.detail(caseId), 'document', documentId] as const,
}
