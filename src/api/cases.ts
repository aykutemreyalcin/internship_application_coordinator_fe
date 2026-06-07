import { api } from './client'
import type {
  AuditLogEntry,
  Case,
  CaseListParams,
  CaseSummary,
  ClarificationDraftResponse,
  CoordinatorDecisionRequest,
  PageResponse,
  SupervisorVerificationDraftResponse,
  ValidationSummary,
} from './types'

export async function fetchCases(params: CaseListParams = {}): Promise<PageResponse<CaseSummary>> {
  const { data } = await api.get<PageResponse<CaseSummary>>('/cases', { params })
  return data
}

export async function fetchCase(caseId: string): Promise<Case> {
  const { data } = await api.get<Case>(`/cases/${caseId}`)
  return data
}

export async function createCase(file: File): Promise<Case> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post<Case>('/cases', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function extractCase(caseId: string): Promise<Case> {
  const { data } = await api.post<Case>(`/cases/${caseId}/extract`)
  return data
}

export async function fetchValidation(caseId: string): Promise<ValidationSummary> {
  const { data } = await api.get<ValidationSummary>(`/cases/${caseId}/validation`)
  return data
}

export async function generateRecommendation(caseId: string): Promise<Case> {
  const { data } = await api.post<Case>(`/cases/${caseId}/recommendation`)
  return data
}

export async function applyDecision(
  caseId: string,
  request: CoordinatorDecisionRequest,
): Promise<Case> {
  const { data } = await api.post<Case>(`/cases/${caseId}/decision`, request)
  return data
}

export async function generateClarification(caseId: string): Promise<ClarificationDraftResponse> {
  const { data } = await api.post<ClarificationDraftResponse>(`/cases/${caseId}/clarification`)
  return data
}

export async function generateSupervisorVerification(
  caseId: string,
): Promise<SupervisorVerificationDraftResponse> {
  const { data } = await api.post<SupervisorVerificationDraftResponse>(
    `/cases/${caseId}/supervisor-verification`,
  )
  return data
}

export async function fetchAuditLog(caseId: string): Promise<AuditLogEntry[]> {
  const { data } = await api.get<AuditLogEntry[]>(`/cases/${caseId}/audit`)
  return data
}

export function documentUrl(caseId: string, documentId: string): string {
  const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') ?? ''
  return `${baseUrl}/cases/${caseId}/documents/${documentId}`
}
