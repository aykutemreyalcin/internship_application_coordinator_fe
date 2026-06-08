import { useQuery } from '@tanstack/react-query'
import { getCase } from '../cases'
import { caseKeys } from '../queryKeys'

export function useCase(id: string | undefined) {
  return useQuery({
    queryKey: caseKeys.detail(id ?? ''),
    queryFn: () => getCase(id!),
    enabled: Boolean(id),
  })
}
