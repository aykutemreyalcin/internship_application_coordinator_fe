import type { QueryClient } from '@tanstack/react-query'
import type { Case } from '../types'
import { isApiError } from '../client'
import { caseKeys } from '../queryKeys'

export type InvalidateCaseOptions = {
  detail?: boolean
  list?: boolean
  audit?: boolean
  validation?: boolean
}

export function syncCaseDetailCache(
  queryClient: QueryClient,
  caseId: string,
  updatedCase: Case,
): void {
  queryClient.setQueryData(caseKeys.detail(caseId), updatedCase)
}

export function invalidateCaseQueries(
  queryClient: QueryClient,
  caseId: string,
  options: InvalidateCaseOptions = {},
): void {
  const { detail = true, list = true, audit = true, validation = false } = options

  if (detail) {
    void queryClient.invalidateQueries({ queryKey: caseKeys.detail(caseId) })
  }
  if (list) {
    void queryClient.invalidateQueries({ queryKey: caseKeys.all })
  }
  if (audit) {
    void queryClient.invalidateQueries({ queryKey: caseKeys.audit(caseId) })
  }
  if (validation) {
    void queryClient.invalidateQueries({ queryKey: caseKeys.validation(caseId) })
  }
}

export function getMutationErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}
