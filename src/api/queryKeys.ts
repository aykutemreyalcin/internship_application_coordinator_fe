export const caseKeys = {
  all: ['cases'] as const,
  detail: (id: string) => [...caseKeys.all, id] as const,
  validation: (id: string) => [...caseKeys.detail(id), 'validation'] as const,
}
