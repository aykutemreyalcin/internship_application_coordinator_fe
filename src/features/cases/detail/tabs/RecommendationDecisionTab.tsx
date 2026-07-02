import { useState } from 'react'
import { getMutationErrorMessage } from '../../../../api/hooks/caseQueryUtils'
import { useApplyDecision } from '../../../../api/hooks/useApplyDecision'
import {
  useGenerateClarification,
  useSendClarification,
} from '../../../../api/hooks/useClarification'
import { useGenerateRecommendation } from '../../../../api/hooks/useGenerateRecommendation'
import {
  useGenerateSupervisorVerification,
  useSendSupervisorVerification,
} from '../../../../api/hooks/useSupervisorVerification'
import type {
  Case,
  CaseStatus,
  ClarificationDraftResponse,
  CoordinatorDecision,
  Recommendation,
  SupervisorVerificationDraftResponse,
} from '../../../../api/types'
import { Button, Modal, useToast } from '../../../../components'
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

const FINAL_DECISION_STATUSES: CaseStatus[] = [
  'APPROVED',
  'REJECTED',
  'CLARIFICATION_REQUESTED',
]

export function RecommendationDecisionTab({ caseData }: RecommendationDecisionTabProps) {
  const { showToast } = useToast()
  const [clarificationOpen, setClarificationOpen] = useState(false)
  const [clarificationDraft, setClarificationDraft] =
    useState<ClarificationDraftResponse | null>(null)
  const [supervisorOpen, setSupervisorOpen] = useState(false)
  const [supervisorDraft, setSupervisorDraft] =
    useState<SupervisorVerificationDraftResponse | null>(null)
  const [decisionNote, setDecisionNote] = useState('')
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false)

  const recommendationMutation = useGenerateRecommendation(caseData.caseId)
  const decisionMutation = useApplyDecision(caseData.caseId)
  const clarificationDraftMutation = useGenerateClarification(caseData.caseId)
  const clarificationSendMutation = useSendClarification(caseData.caseId)
  const supervisorDraftMutation = useGenerateSupervisorVerification(caseData.caseId)
  const supervisorSendMutation = useSendSupervisorVerification(caseData.caseId)

  const hasRecommendation = caseData.recommendation !== null
  const hasFinalDecision = FINAL_DECISION_STATUSES.includes(caseData.status)
  const isExtracting = caseData.status === 'EXTRACTING'
  const isRecommendationBusy = recommendationMutation.isPending
  const isDecisionBusy = decisionMutation.isPending
  const isClarificationBusy =
    clarificationDraftMutation.isPending || clarificationSendMutation.isPending
  const isSupervisorBusy =
    supervisorDraftMutation.isPending || supervisorSendMutation.isPending
  const isActionBusy =
    isRecommendationBusy ||
    isDecisionBusy ||
    isClarificationBusy ||
    isSupervisorBusy ||
    isExtracting

  function handleGenerateRecommendation() {
    recommendationMutation.mutate(undefined, {
      onSuccess: () => {
        showToast('Recommendation generated', 'success')
      },
      onError: (mutationError) => {
        showToast(
          getMutationErrorMessage(mutationError, 'Failed to generate recommendation'),
          'error',
        )
      },
    })
  }

  function submitDecision(decision: CoordinatorDecision) {
    decisionMutation.mutate(
      { decision, note: decisionNote.trim() || undefined },
      {
        onSuccess: () => {
          setDecisionNote('')
          setApproveConfirmOpen(false)
          setRejectConfirmOpen(false)
          showToast(`Decision recorded: ${RECOMMENDATION_LABELS[decision]}`, 'success')
        },
        onError: (mutationError) => {
          showToast(getMutationErrorMessage(mutationError, 'Failed to apply decision'), 'error')
        },
      },
    )
  }

  function handleDraftClarification() {
    clarificationDraftMutation.mutate(undefined, {
      onSuccess: (draft) => {
        setClarificationDraft(draft)
        setClarificationOpen(true)
      },
      onError: (mutationError) => {
        showToast(
          getMutationErrorMessage(mutationError, 'Failed to generate clarification draft'),
          'error',
        )
      },
    })
  }

  function handleSendClarification(payload: { subject: string; body: string }) {
    clarificationSendMutation.mutate(payload, {
        onSuccess: () => {
          setClarificationOpen(false)
          setClarificationDraft(null)
          showToast('Clarification recorded — check History for the audit entry', 'success')
        },
      onError: (mutationError) => {
        showToast(
          getMutationErrorMessage(mutationError, 'Failed to send clarification email'),
          'error',
        )
      },
    })
  }

  function handleDraftSupervisorVerification() {
    supervisorDraftMutation.mutate(undefined, {
      onSuccess: (draft) => {
        setSupervisorDraft(draft)
        setSupervisorOpen(true)
      },
      onError: (mutationError) => {
        showToast(
          getMutationErrorMessage(mutationError, 'Failed to generate supervisor verification draft'),
          'error',
        )
      },
    })
  }

  function handleSendSupervisorVerification(payload: { subject: string; body: string }) {
    supervisorSendMutation.mutate(payload, {
        onSuccess: () => {
          setSupervisorOpen(false)
          setSupervisorDraft(null)
          showToast('Supervisor verification recorded — check History for the audit entry', 'success')
        },
      onError: (mutationError) => {
        showToast(
          getMutationErrorMessage(mutationError, 'Failed to send supervisor verification email'),
          'error',
        )
      },
    })
  }

  return (
    <div className={styles.tabContent}>
      <div>
        <h3 className={styles.tabHeading}>Recommendation & Decision</h3>
        <p className={styles.tabIntro}>
          Review the AI recommendation, record your decision, and draft outbound emails.
        </p>
      </div>

      <section className={styles.recommendationCard}>
        <div className={styles.recommendationHeader}>
          <h4 className={styles.sectionLabel}>AI Recommendation</h4>
          <Button
            variant="secondary"
            size="sm"
            loading={isRecommendationBusy}
            disabled={isActionBusy}
            onClick={handleGenerateRecommendation}
          >
            {hasRecommendation ? 'Regenerate' : 'Generate recommendation'}
          </Button>
        </div>
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
          <p className={styles.placeholder}>
            No recommendation generated yet. Run validation first, then generate a recommendation.
          </p>
        )}
      </section>

      <section className={styles.decisionSection}>
        <h4 className={styles.sectionLabel}>Coordinator Decision</h4>
        {hasFinalDecision ? (
          <p className={styles.decisionLocked} role="status">
            Final decision recorded. Status:{' '}
            <strong>{caseData.status.replaceAll('_', ' ')}</strong>
          </p>
        ) : (
          <>
            {hasRecommendation ? (
              <p className={styles.recommendationHint}>
                AI recommends:{' '}
                <strong>{RECOMMENDATION_LABELS[caseData.recommendation!]}</strong>
              </p>
            ) : null}
            <label className={styles.decisionNoteLabel} htmlFor="decision-note">
              Coordinator note (optional)
            </label>
            <textarea
              id="decision-note"
              className={styles.decisionNote}
              value={decisionNote}
              onChange={(event) => setDecisionNote(event.target.value)}
              rows={3}
              placeholder="Add context for this decision…"
              disabled={isActionBusy}
            />
            <div className={styles.decisionActions}>
              <Button
                variant="primary"
                size="sm"
                loading={isDecisionBusy}
                disabled={isActionBusy}
                onClick={() => setApproveConfirmOpen(true)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={isDecisionBusy}
                disabled={isActionBusy}
                onClick={() => setRejectConfirmOpen(true)}
              >
                Reject
              </Button>
              <Button
                variant="secondary"
                size="sm"
                loading={isDecisionBusy}
                disabled={isActionBusy}
                onClick={() => submitDecision('CLARIFY')}
              >
                Request clarification
              </Button>
            </div>
          </>
        )}
        {!hasFinalDecision && (
          <p className={styles.statusNote}>
            Current status: <strong>{caseData.status.replaceAll('_', ' ')}</strong>
          </p>
        )}
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
            disabled={isActionBusy}
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
            disabled={isActionBusy}
            onClick={handleDraftSupervisorVerification}
          >
            Draft supervisor verification
          </Button>
        </div>
      </section>

      <Modal
        open={approveConfirmOpen}
        onClose={() => !isDecisionBusy && setApproveConfirmOpen(false)}
        title="Confirm approval"
        footer={
          <div className={styles.decisionModalFooter}>
            <Button
              variant="ghost"
              disabled={isDecisionBusy}
              onClick={() => setApproveConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isDecisionBusy}
              disabled={isDecisionBusy}
              onClick={() => submitDecision('APPROVE')}
            >
              Confirm approve
            </Button>
          </div>
        }
      >
        <p className={styles.decisionConfirmText}>
          Approve this internship application? This records your final decision and updates the
          case status.
        </p>
      </Modal>

      <Modal
        open={rejectConfirmOpen}
        onClose={() => !isDecisionBusy && setRejectConfirmOpen(false)}
        title="Confirm rejection"
        footer={
          <div className={styles.decisionModalFooter}>
            <Button
              variant="ghost"
              disabled={isDecisionBusy}
              onClick={() => setRejectConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={isDecisionBusy}
              disabled={isDecisionBusy}
              onClick={() => submitDecision('REJECT')}
            >
              Confirm reject
            </Button>
          </div>
        }
      >
        <p className={styles.decisionConfirmText}>
          Reject this internship application? This records your final decision and updates the
          case status.
        </p>
      </Modal>

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
