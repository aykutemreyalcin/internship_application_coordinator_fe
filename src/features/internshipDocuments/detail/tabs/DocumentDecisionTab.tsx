import { useState } from 'react'
import { getMutationErrorMessage } from '../../../../api/hooks/caseQueryUtils'
import { useApplyDecision } from '../../../../api/hooks/useApplyDecision'
import { useGenerateRecommendation } from '../../../../api/hooks/useGenerateRecommendation'
import type { Case, CaseStatus, CoordinatorDecision, Recommendation } from '../../../../api/types'
import { Button, Modal, useToast } from '../../../../components'
import tabStyles from '../../../cases/detail/tabs/tabs.module.css'

interface DocumentDecisionTabProps {
  caseData: Case
}

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  APPROVE: 'Approve',
  REJECT: 'Reject',
  CLARIFY: 'Request Clarification',
}

const FINAL_DECISION_STATUSES: CaseStatus[] = ['APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED']

export function DocumentDecisionTab({ caseData }: DocumentDecisionTabProps) {
  const { showToast } = useToast()
  const [decisionNote, setDecisionNote] = useState('')
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false)

  const recommendationMutation = useGenerateRecommendation(caseData.caseId)
  const decisionMutation = useApplyDecision(caseData.caseId)

  const hasRecommendation = caseData.recommendation !== null
  const hasFinalDecision = FINAL_DECISION_STATUSES.includes(caseData.status)
  const isExtracting = caseData.status === 'EXTRACTING'
  const isBusy =
    recommendationMutation.isPending || decisionMutation.isPending || isExtracting

  function handleGenerateRecommendation() {
    recommendationMutation.mutate(undefined, {
      onSuccess: () => showToast('Recommendation generated', 'success'),
      onError: (error) =>
        showToast(getMutationErrorMessage(error, 'Failed to generate recommendation'), 'error'),
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
          if (decision === 'CLARIFY') {
            showToast(
              'Clarification noted — coordinator will contact the student manually.',
              'success',
            )
          } else {
            showToast(`Decision recorded: ${RECOMMENDATION_LABELS[decision]}`, 'success')
          }
        },
        onError: (error) =>
          showToast(getMutationErrorMessage(error, 'Failed to apply decision'), 'error'),
      },
    )
  }

  return (
    <div className={tabStyles.tabContent}>
      <div>
        <h3 className={tabStyles.tabHeading}>Recommendation & Decision</h3>
        <p className={tabStyles.tabIntro}>
          Generate an AI recommendation from validation results, then record your coordinator
          decision. Document cases do not send automated emails.
        </p>
      </div>

      <section className={tabStyles.recommendationCard}>
        <div className={tabStyles.recommendationHeader}>
          <h4 className={tabStyles.sectionLabel}>AI Recommendation</h4>
          <Button
            variant="secondary"
            size="sm"
            loading={recommendationMutation.isPending}
            disabled={isBusy}
            onClick={handleGenerateRecommendation}
          >
            {hasRecommendation ? 'Regenerate' : 'Generate recommendation'}
          </Button>
        </div>
        {hasRecommendation ? (
          <>
            <span
              className={`${tabStyles.recommendationBadge} ${tabStyles[`rec${caseData.recommendation}`]}`}
            >
              {RECOMMENDATION_LABELS[caseData.recommendation!]}
            </span>
            {caseData.recommendationReason ? (
              <p className={tabStyles.recommendationReason}>{caseData.recommendationReason}</p>
            ) : null}
          </>
        ) : (
          <p className={tabStyles.placeholder}>
            No recommendation yet. Run extraction and validation first.
          </p>
        )}
      </section>

      <section className={tabStyles.decisionSection}>
        <h4 className={tabStyles.sectionLabel}>Coordinator Decision</h4>
        {hasFinalDecision ? (
          <p className={tabStyles.decisionLocked} role="status">
            Final decision recorded. Status:{' '}
            <strong>{caseData.status.replaceAll('_', ' ')}</strong>
          </p>
        ) : (
          <>
            <label className={tabStyles.decisionNoteLabel} htmlFor="document-decision-note">
              Coordinator note (optional)
            </label>
            <textarea
              id="document-decision-note"
              className={tabStyles.decisionNote}
              value={decisionNote}
              onChange={(event) => setDecisionNote(event.target.value)}
              rows={3}
              placeholder="Add context for this decision…"
              disabled={isBusy}
            />
            <div className={tabStyles.decisionActions}>
              <Button
                variant="primary"
                size="sm"
                loading={decisionMutation.isPending}
                disabled={isBusy}
                onClick={() => setApproveConfirmOpen(true)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={decisionMutation.isPending}
                disabled={isBusy}
                onClick={() => setRejectConfirmOpen(true)}
              >
                Reject
              </Button>
              <Button
                variant="secondary"
                size="sm"
                loading={decisionMutation.isPending}
                disabled={isBusy}
                onClick={() => submitDecision('CLARIFY')}
              >
                Request clarification
              </Button>
            </div>
          </>
        )}
      </section>

      <Modal
        open={approveConfirmOpen}
        onClose={() => !decisionMutation.isPending && setApproveConfirmOpen(false)}
        title="Confirm approval"
        footer={
          <div className={tabStyles.decisionModalFooter}>
            <Button variant="ghost" disabled={decisionMutation.isPending} onClick={() => setApproveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={decisionMutation.isPending}
              onClick={() => submitDecision('APPROVE')}
            >
              Confirm approve
            </Button>
          </div>
        }
      >
        <p className={tabStyles.decisionConfirmText}>
          Approve this internship document? This records your final decision.
        </p>
      </Modal>

      <Modal
        open={rejectConfirmOpen}
        onClose={() => !decisionMutation.isPending && setRejectConfirmOpen(false)}
        title="Confirm rejection"
        footer={
          <div className={tabStyles.decisionModalFooter}>
            <Button variant="ghost" disabled={decisionMutation.isPending} onClick={() => setRejectConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={decisionMutation.isPending}
              onClick={() => submitDecision('REJECT')}
            >
              Confirm reject
            </Button>
          </div>
        }
      >
        <p className={tabStyles.decisionConfirmText}>
          Reject this internship document? This records your final decision.
        </p>
      </Modal>
    </div>
  )
}
