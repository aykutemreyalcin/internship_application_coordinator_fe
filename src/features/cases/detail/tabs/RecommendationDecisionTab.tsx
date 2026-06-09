import { useState } from 'react'
import { useApplyDecision } from '../../../../api/hooks/useApplyDecision'
import { useGenerateRecommendation } from '../../../../api/hooks/useGenerateRecommendation'
import type { Case, CaseStatus, CoordinatorDecision, Recommendation } from '../../../../api/types'
import { Button, Modal, StatusBadge, useToast } from '../../../../components'
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

function isFinalDecision(status: CaseStatus): boolean {
  return FINAL_DECISION_STATUSES.includes(status)
}

export function RecommendationDecisionTab({ caseData }: RecommendationDecisionTabProps) {
  const { showToast } = useToast()
  const [note, setNote] = useState('')
  const [approveModalOpen, setApproveModalOpen] = useState(false)

  const generateMutation = useGenerateRecommendation(caseData.caseId)
  const decisionMutation = useApplyDecision(caseData.caseId)

  const hasRecommendation = caseData.recommendation !== null
  const decisionLocked = isFinalDecision(caseData.status)
  const isSubmitting = decisionMutation.isPending

  function submitDecision(decision: CoordinatorDecision) {
    decisionMutation.mutate(
      { decision, note: note.trim() || undefined },
      {
        onSuccess: () => {
          setNote('')
          setApproveModalOpen(false)
          showToast('Coordinator decision recorded', 'success')
        },
        onError: () => {
          showToast('Failed to record decision. Please try again.', 'error')
        },
      },
    )
  }

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Recommendation & Decision</h3>

      <section className={styles.recommendationCard}>
        <div className={styles.recommendationCardHeader}>
          <h4 className={styles.sectionLabel}>AI Recommendation</h4>
          <Button
            variant="secondary"
            size="sm"
            loading={generateMutation.isPending}
            disabled={generateMutation.isPending || decisionLocked}
            onClick={() => generateMutation.mutate()}
          >
            {hasRecommendation ? 'Regenerate recommendation' : 'Generate recommendation'}
          </Button>
        </div>

        {hasRecommendation ? (
          <div className={styles.recommendationContent}>
            <span
              className={`${styles.recommendationBadge} ${styles[`rec${caseData.recommendation}`]}`}
            >
              {RECOMMENDATION_LABELS[caseData.recommendation!]}
            </span>
            {caseData.recommendationReason ? (
              <blockquote className={styles.recommendationReason}>
                {caseData.recommendationReason}
              </blockquote>
            ) : (
              <p className={styles.placeholder}>No reasoning provided.</p>
            )}
          </div>
        ) : (
          <div className={styles.recommendationEmpty}>
            <p className={styles.placeholder}>
              No recommendation generated yet. Run validation first, then generate an AI
              recommendation based on extracted fields and validation results.
            </p>
          </div>
        )}

        {generateMutation.isError && (
          <p className={styles.recommendationError} role="alert">
            Failed to generate recommendation. Please try again.
          </p>
        )}
      </section>

      <section className={styles.decisionSection}>
        <h4 className={styles.sectionLabel}>Coordinator Decision</h4>

        {decisionLocked ? (
          <div className={styles.decisionFinal}>
            <p className={styles.decisionFinalText}>Final decision recorded.</p>
            <StatusBadge status={caseData.status} />
          </div>
        ) : (
          <>
            <label className={styles.decisionNoteLabel} htmlFor="decision-note">
              Note (optional)
            </label>
            <textarea
              id="decision-note"
              className={styles.decisionNote}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add context for this decision…"
              rows={3}
              disabled={isSubmitting}
            />

            <div className={styles.decisionActions}>
              <Button
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => setApproveModalOpen(true)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => submitDecision('REJECT')}
              >
                Reject
              </Button>
              <Button
                variant="secondary"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={() => submitDecision('CLARIFY')}
              >
                Request Clarification
              </Button>
            </div>
          </>
        )}

        <p className={styles.statusNote}>
          Current status: <StatusBadge status={caseData.status} />
        </p>
      </section>

      <Modal
        open={approveModalOpen}
        onClose={() => !isSubmitting && setApproveModalOpen(false)}
        title="Confirm approval"
        footer={
          <div className={styles.decisionModalFooter}>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => setApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={() => submitDecision('APPROVE')}
            >
              Confirm approve
            </Button>
          </div>
        }
      >
        <p className={styles.decisionModalText}>
          Approve this internship application? The coordinator always makes the final decision.
          This action cannot be undone from this panel.
        </p>
        {note.trim() && (
          <p className={styles.decisionModalNote}>
            <strong>Note:</strong> {note.trim()}
          </p>
        )}
      </Modal>
    </div>
  )
}
