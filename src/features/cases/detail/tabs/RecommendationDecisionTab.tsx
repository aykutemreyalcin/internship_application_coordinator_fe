import { useState } from 'react'
import {
  useGenerateClarification,
  useSendClarification,
} from '../../../../api/hooks/useClarification'
import type { Case, ClarificationDraftResponse, Recommendation } from '../../../../api/types'
import { Button, useToast } from '../../../../components'
import { ClarificationEmailModal } from '../clarification/ClarificationEmailModal'
import styles from './tabs.module.css'

interface RecommendationDecisionTabProps {
  caseData: Case
}

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  APPROVE: 'Approve',
  REJECT: 'Reject',
  CLARIFY: 'Request Clarification',
}

export function RecommendationDecisionTab({ caseData }: RecommendationDecisionTabProps) {
  const { showToast } = useToast()
  const [clarificationOpen, setClarificationOpen] = useState(false)
  const [clarificationDraft, setClarificationDraft] =
    useState<ClarificationDraftResponse | null>(null)

  const draftMutation = useGenerateClarification(caseData.caseId)
  const sendMutation = useSendClarification(caseData.caseId)

  const hasRecommendation = caseData.recommendation !== null
  const isClarificationBusy = draftMutation.isPending || sendMutation.isPending

  function handleDraftClarification() {
    draftMutation.mutate(undefined, {
      onSuccess: (draft) => {
        setClarificationDraft(draft)
        setClarificationOpen(true)
      },
      onError: () => {
        showToast('Failed to generate clarification draft. Please try again.', 'error')
      },
    })
  }

  function handleSendClarification(payload: { subject: string; body: string }) {
    sendMutation.mutate(payload, {
      onSuccess: () => {
        setClarificationOpen(false)
        setClarificationDraft(null)
        showToast('Clarification email sent to student', 'success')
      },
      onError: () => {
        showToast('Failed to send clarification email. Please try again.', 'error')
      },
    })
  }

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Recommendation & Decision</h3>

      <section className={styles.recommendationCard}>
        <h4 className={styles.sectionLabel}>AI Recommendation</h4>
        {hasRecommendation ? (
          <>
            <span
              className={`${styles.recommendationBadge} ${styles[`rec${caseData.recommendation}`]}`}
            >
              {RECOMMENDATION_LABELS[caseData.recommendation!]}
            </span>
            {caseData.recommendationReason && (
              <p className={styles.recommendationReason}>{caseData.recommendationReason}</p>
            )}
          </>
        ) : (
          <p className={styles.placeholder}>No recommendation generated yet.</p>
        )}
      </section>

      <section className={styles.decisionSection}>
        <h4 className={styles.sectionLabel}>Coordinator Decision</h4>
        <p className={styles.placeholder}>
          Decision actions (Approve / Reject / Request Clarification) will be available in a
          follow-up task.
        </p>
        <p className={styles.statusNote}>
          Current status: <strong>{caseData.status.replaceAll('_', ' ')}</strong>
        </p>
      </section>

      <section className={styles.clarificationSection}>
        <div className={styles.clarificationHeader}>
          <div>
            <h4 className={styles.sectionLabel}>Clarification Email</h4>
            <p className={styles.clarificationHint}>
              Generate an AI draft email to request missing information from the student.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            loading={isClarificationBusy}
            disabled={isClarificationBusy}
            onClick={handleDraftClarification}
          >
            Draft clarification email
          </Button>
        </div>
      </section>

      {clarificationDraft && (
        <ClarificationEmailModal
          open={clarificationOpen}
          draft={clarificationDraft}
          onClose={() => {
            if (!sendMutation.isPending) {
              setClarificationOpen(false)
            }
          }}
          onSend={handleSendClarification}
          isSending={sendMutation.isPending}
        />
      )}
    </div>
  )
}
