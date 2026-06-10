import { api, ApiError, isApiErrorResponse } from './client'
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

/** Alias used by case detail hooks. */
export const getCase = fetchCase

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

export type ClarificationSendRequest = {
  subject: string
  body: string
}

export async function sendClarification(
  caseId: string,
  request: ClarificationSendRequest,
): Promise<Case> {
  const { data } = await api.post<Case>(`/cases/${caseId}/clarification/send`, request)
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

export type SupervisorVerificationSendRequest = {
  subject: string
  body: string
}

export async function sendSupervisorVerification(
  caseId: string,
  request: SupervisorVerificationSendRequest,
): Promise<Case> {
  const { data } = await api.post<Case>(
    `/cases/${caseId}/supervisor-verification/send`,
    request,
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

export async function fetchDocument(caseId: string, documentId: string): Promise<Blob> {
  const { data, headers } = await api.get<Blob>(`/cases/${caseId}/documents/${documentId}`, {
    responseType: 'blob',
    headers: { Accept: 'application/pdf' },
  })

  const contentType = (headers['content-type'] as string | undefined) ?? data.type
  if (contentType.includes('application/json')) {
    const text = await data.text()
    const parsed = JSON.parse(text) as unknown
    if (isApiErrorResponse(parsed)) {
      throw new ApiError(parsed)
    }
  }

  return data
}
