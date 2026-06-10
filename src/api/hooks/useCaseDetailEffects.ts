import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { Case } from '../types'
import { useToast } from '../../components'
import { invalidateCaseQueries } from './caseQueryUtils'

export function useCaseDetailEffects(caseData: Case) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const previousStatusRef = useRef(caseData.status)

  useEffect(() => {
    const previousStatus = previousStatusRef.current
    const nextStatus = caseData.status

    if (previousStatus === 'EXTRACTING' && nextStatus !== 'EXTRACTING') {
      invalidateCaseQueries(queryClient, caseData.caseId, {
        detail: false,
        list: false,
        audit: true,
        validation: true,
      })
      showToast('Field extraction completed', 'success')
    }

    previousStatusRef.current = nextStatus
  }, [caseData.caseId, caseData.status, queryClient, showToast])
}
