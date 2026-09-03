import type { CaseListParams } from './types'
import type { DocumentListParams } from './internshipDocuments'

export const caseKeys = {
  all: ['cases'] as const,
  list: (params: CaseListParams) => [...caseKeys.all, 'list', params] as const,
  detail: (id: string) => [...caseKeys.all, id] as const,
  validation: (id: string) => [...caseKeys.detail(id), 'validation'] as const,
  audit: (id: string) => [...caseKeys.detail(id), 'audit'] as const,
  document: (caseId: string, documentId: string) =>
    [...caseKeys.detail(caseId), 'document', documentId] as const,
}

export const documentKeys = {
  all: ['documents'] as const,
  list: (params: DocumentListParams) => [...documentKeys.all, 'list', params] as const,
  detail: (id: string) => [...documentKeys.all, id] as const,
  validation: (id: string) => [...documentKeys.detail(id), 'validation'] as const,
  audit: (id: string) => [...documentKeys.detail(id), 'audit'] as const,
  file: (caseId: string, documentId: string) =>
    [...documentKeys.detail(caseId), 'file', documentId] as const,
}
