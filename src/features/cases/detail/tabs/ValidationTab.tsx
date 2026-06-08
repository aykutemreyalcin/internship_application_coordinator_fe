import type { Case, ValidationBlock } from '../../../../api/types'
import styles from './tabs.module.css'

interface ValidationTabProps {
  caseData: Case
}

function ValidationSection({ title, block }: { title: string; block: ValidationBlock }) {
  return (
    <section className={styles.validationSection}>
      <div className={styles.validationHeader}>
        <h4 className={styles.validationTitle}>{title}</h4>
        <span
          className={block.passed ? styles.passBadge : styles.failBadge}
          aria-label={block.passed ? 'Passed' : 'Failed'}
        >
          {block.passed ? 'Passed' : 'Failed'}
        </span>
      </div>
      {block.issues.length === 0 ? (
        <p className={styles.noIssues}>No issues found.</p>
      ) : (
        <ul className={styles.issueList}>
          {block.issues.map((issue) => (
            <li
              key={`${issue.field}-${issue.message}`}
              className={`${styles.issueItem} ${styles[`severity${issue.severity}`]}`}
            >
              <span className={styles.issueField}>{issue.field}</span>
              <span className={styles.issueMessage}>{issue.message}</span>
              <span className={styles.severityBadge}>{issue.severity}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function ValidationTab({ caseData }: ValidationTabProps) {
  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Validation Results</h3>
      <ValidationSection title="Completeness" block={caseData.validation.completeness} />
      <ValidationSection title="University Rules" block={caseData.validation.rules} />
    </div>
  )
}
