import { useQuery } from '@tanstack/react-query'
import { getCase } from '../cases'
import { caseKeys } from '../queryKeys'

const EXTRACTING_POLL_INTERVAL_MS = 1500

export function useCase(id: string | undefined) {
  return useQuery({
    queryKey: caseKeys.detail(id ?? ''),
    queryFn: () => getCase(id!),
    enabled: Boolean(id),
    refetchInterval: (query) =>
      query.state.data?.status === 'EXTRACTING' ? EXTRACTING_POLL_INTERVAL_MS : false,
  })
}
