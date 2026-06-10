import { useState } from 'react'
import {
  useGenerateClarification,
  useSendClarification,
} from '../../../../api/hooks/useClarification'
import {
  useGenerateSupervisorVerification,
  useSendSupervisorVerification,
} from '../../../../api/hooks/useSupervisorVerification'
import type {
  Case,
  ClarificationDraftResponse,
  Recommendation,
  SupervisorVerificationDraftResponse,
} from '../../../../api/types'
import { Button, useToast } from '../../../../components'
import { ClarificationEmailModal } from '../clarification/ClarificationEmailModal'
import { SupervisorVerificationModal } from '../supervisor/SupervisorVerificationModal'
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
  const [supervisorOpen, setSupervisorOpen] = useState(false)
  const [supervisorDraft, setSupervisorDraft] =
    useState<SupervisorVerificationDraftResponse | null>(null)

  const clarificationDraftMutation = useGenerateClarification(caseData.caseId)
  const clarificationSendMutation = useSendClarification(caseData.caseId)
  const supervisorDraftMutation = useGenerateSupervisorVerification(caseData.caseId)
  const supervisorSendMutation = useSendSupervisorVerification(caseData.caseId)

  const hasRecommendation = caseData.recommendation !== null
  const isClarificationBusy =
    clarificationDraftMutation.isPending || clarificationSendMutation.isPending
  const isSupervisorBusy =
    supervisorDraftMutation.isPending || supervisorSendMutation.isPending

  function handleDraftClarification() {
    clarificationDraftMutation.mutate(undefined, {
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
    clarificationSendMutation.mutate(payload, {
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

  function handleDraftSupervisorVerification() {
    supervisorDraftMutation.mutate(undefined, {
      onSuccess: (draft) => {
        setSupervisorDraft(draft)
        setSupervisorOpen(true)
      },
      onError: () => {
        showToast('Failed to generate supervisor verification draft. Please try again.', 'error')
      },
    })
  }

  function handleSendSupervisorVerification(payload: { subject: string; body: string }) {
    supervisorSendMutation.mutate(payload, {
      onSuccess: () => {
        setSupervisorOpen(false)
        setSupervisorDraft(null)
        showToast('Supervisor verification email sent', 'success')
      },
      onError: () => {
        showToast('Failed to send supervisor verification email. Please try again.', 'error')
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

      <section className={styles.clarificationSection}>
        <div className={styles.clarificationHeader}>
          <div>
            <h4 className={styles.sectionLabel}>Supervisor Verification Email</h4>
            <p className={styles.clarificationHint}>
              Generate an AI draft email to verify the company supervisor&apos;s internship
              arrangement.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            loading={isSupervisorBusy}
            disabled={isSupervisorBusy}
            onClick={handleDraftSupervisorVerification}
          >
            Draft supervisor verification
          </Button>
        </div>
      </section>

      {clarificationDraft && (
        <ClarificationEmailModal
          open={clarificationOpen}
          draft={clarificationDraft}
          onClose={() => {
            if (!clarificationSendMutation.isPending) {
              setClarificationOpen(false)
            }
          }}
          onSend={handleSendClarification}
          isSending={clarificationSendMutation.isPending}
        />
      )}

      {supervisorDraft && (
        <SupervisorVerificationModal
          open={supervisorOpen}
          draft={supervisorDraft}
          onClose={() => {
            if (!supervisorSendMutation.isPending) {
              setSupervisorOpen(false)
            }
          }}
          onSend={handleSendSupervisorVerification}
          isSending={supervisorSendMutation.isPending}
        />
      )}
    </div>
  )
}
