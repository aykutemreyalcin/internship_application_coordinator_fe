import { isNotFoundError } from '../../../../api/client'
import {
  getValidationQueryErrorMessage,
  useValidation,
} from '../../../../api/hooks/useValidation'
import type { ValidationIssue, ValidationResult, ValidationSummary } from '../../../../api/types'
import { Button, EmptyState, LoadingBlock } from '../../../../components'
import styles from './tabs.module.css'

interface ValidationTabProps {
  caseId: string
}

function SeverityBadge({ severity }: { severity: ValidationIssue['severity'] }) {
  return (
    <span className={`${styles.severityBadge} ${styles[`severityBadge${severity}`]}`}>
      {severity}
    </span>
  )
}

function ValidationSection({ title, block }: { title: string; block: ValidationResult }) {
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
              <SeverityBadge severity={issue.severity} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ValidationSummaryBanner({ validation }: { validation: ValidationSummary }) {
  const totalIssues =
    validation.completeness.issues.length + validation.rules.issues.length
  const allPassed = validation.completeness.passed && validation.rules.passed

  return (
    <div
      className={`${styles.validationSummary} ${allPassed ? styles.validationSummaryPass : styles.validationSummaryFail}`}
      role="status"
    >
      <span className={styles.validationSummaryLabel}>
        {allPassed ? 'All validations passed' : 'Validation issues found'}
      </span>
      <span className={styles.validationSummaryMeta}>
        {totalIssues} issue{totalIssues === 1 ? '' : 's'} · Completeness{' '}
        {validation.completeness.passed ? 'passed' : 'failed'} · Rules{' '}
        {validation.rules.passed ? 'passed' : 'failed'}
      </span>
    </div>
  )
}

export function ValidationTab({ caseId }: ValidationTabProps) {
  const { data, isLoading, isError, error, refetch, isFetching } = useValidation(caseId)

  if (isLoading) {
    return (
      <div className={styles.tabContent}>
        <h3 className={styles.tabHeading}>Validation Results</h3>
        <LoadingBlock label="Loading validation results…" />
      </div>
    )
  }

  if (isError && isNotFoundError(error)) {
    return (
      <div className={styles.tabContent}>
        <h3 className={styles.tabHeading}>Validation Results</h3>
        <p className={styles.placeholder}>
          Validation has not been run for this case yet. Run extraction first to populate
          validation results.
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.tabContent}>
        <h3 className={styles.tabHeading}>Validation Results</h3>
        <EmptyState
          title="Failed to load validation"
          description={getValidationQueryErrorMessage(error)}
          action={
            <Button variant="primary" onClick={() => refetch()} loading={isFetching}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.tabContent}>
        <h3 className={styles.tabHeading}>Validation Results</h3>
        <p className={styles.placeholder}>No validation data available.</p>
      </div>
    )
  }

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.tabHeading}>Validation Results</h3>
      <p className={styles.tabIntro}>
        Automated completeness and university rule checks for this application.
      </p>
      <ValidationSummaryBanner validation={data} />
      <ValidationSection title="Completeness" block={data.completeness} />
      <ValidationSection title="University Rules" block={data.rules} />
    </div>
  )
}
