const DEFAULT_API_BASE_URL = 'http://localhost:8080/api'

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()
  return configured && configured.length > 0 ? configured : DEFAULT_API_BASE_URL
}

/** MSW is only active in dev when explicitly enabled. */
export function isMockApiEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true'
}

export function getApiModeLabel(): string {
  return isMockApiEnabled() ? 'Mock API' : 'Backend API'
}
