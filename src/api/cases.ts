import { api, ApiClientError } from './client'
import { getMockCase } from '../mocks/cases'
import type { Case } from './types'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getCase(id: string): Promise<Case> {
  if (useMocks) {
    await delay(400)
    return getMockCase(id)
  }

  try {
    const response = await api.get<Case>(`/cases/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw error
  }
}
