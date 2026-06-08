import type { Case } from '../../../../api/types'
import styles from './tabs.module.css'

interface RecommendationDecisionTabProps {
  caseData: Case
}

const recommendationLabels = {
  APPROVE: 'Approve',
  REJECT: 'Reject',
  CLARIFY: 'Request Clarification',
} as const

export function RecommendationDecisionTab({ caseData }: RecommendationDecisionTabProps) {
  const hasRecommendation = caseData.recommendation !== null

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
              {recommendationLabels[caseData.recommendation!]}
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
    </div>
  )
}
