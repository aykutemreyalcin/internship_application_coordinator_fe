import axios, { AxiosError, isAxiosError, type AxiosInstance } from 'axios'
import type { ApiErrorResponse } from './types'

const DEFAULT_BASE_URL = 'http://localhost:8080/api'

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  return configured && configured.length > 0 ? configured : DEFAULT_BASE_URL
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.timestamp === 'string' &&
    typeof candidate.status === 'number' &&
    typeof candidate.error === 'string' &&
    typeof candidate.message === 'string' &&
    typeof candidate.path === 'string'
  )
}

export class ApiError extends Error {
  readonly status: number
  readonly error: string
  readonly path: string
  readonly timestamp: string
  readonly body: ApiErrorResponse

  constructor(body: ApiErrorResponse) {
    super(body.message)
    this.name = 'ApiError'
    this.body = body
    this.status = body.status
    this.error = body.error
    this.path = body.path
    this.timestamp = body.timestamp
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

function normalizeError(error: unknown): Promise<never> {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError
    const responseData = axiosError.response?.data

    if (isApiErrorResponse(responseData)) {
      return Promise.reject(new ApiError(responseData))
    }

    if (axiosError.response) {
      return Promise.reject(
        new ApiError({
          timestamp: new Date().toISOString(),
          status: axiosError.response.status,
          error: axiosError.response.statusText || 'Request failed',
          message: axiosError.message,
          path: axiosError.config?.url ?? '',
        }),
      )
    }

    return Promise.reject(
      new ApiError({
        timestamp: new Date().toISOString(),
        status: 0,
        error: 'Network Error',
        message: axiosError.message || 'Unable to reach the API',
        path: axiosError.config?.url ?? '',
      }),
    )
  }

  return Promise.reject(error)
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => normalizeError(error),
)

/** Preferred import name — axios instance with normalized API errors. */
export const api = apiClient
