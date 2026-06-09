import { useGenerateRecommendation } from '../../../../api/hooks/useGenerateRecommendation'
import type { Case, Recommendation } from '../../../../api/types'
import { Button } from '../../../../components'
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
  const generateMutation = useGenerateRecommendation(caseData.caseId)
  const hasRecommendation = caseData.recommendation !== null
  const isGenerating = generateMutation.isPending

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Recommendation & Decision</h3>

      <section className={styles.recommendationCard}>
        <div className={styles.recommendationCardHeader}>
          <h4 className={styles.sectionLabel}>AI Recommendation</h4>
          <Button
            variant="secondary"
            size="sm"
            loading={isGenerating}
            disabled={isGenerating}
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
        <p className={styles.placeholder}>
          Decision actions (Approve / Reject / Request Clarification) will be available in a
          follow-up task.
        </p>
        <p className={styles.statusNote}>
          Current status: <strong>{caseData.status.replaceAll('_', ' ')}</strong>
        </p>
      </section>
    </div>
  )
}
