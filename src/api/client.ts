import axios, { type AxiosError } from 'axios'
import type { ApiErrorBody } from './types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export class ApiClientError extends Error {
  status: number
  body: ApiErrorBody

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiClientError'
    this.status = body.status
    this.body = body
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.data?.message) {
      throw new ApiClientError({
        timestamp: error.response.data.timestamp ?? new Date().toISOString(),
        status: error.response.status,
        error: error.response.data.error ?? error.response.statusText,
        message: error.response.data.message,
        path: error.response.data.path ?? error.config?.url ?? '',
      })
    }

    throw new ApiClientError({
      timestamp: new Date().toISOString(),
      status: error.response?.status ?? 0,
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
      path: error.config?.url ?? '',
    })
  },
)

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 404
}
