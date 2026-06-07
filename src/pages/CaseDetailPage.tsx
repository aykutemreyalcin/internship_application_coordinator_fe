import { Link, useParams } from 'react-router-dom'
import { LoadingBlock, StatusBadge } from '../components'
import { getCaseQueryErrorMessage, useCase } from '../hooks/useCases'
import styles from './Page.module.css'

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useCase(id)

  return (
    <section className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to case list
      </Link>

      <p className={styles.eyebrow}>Case detail</p>
      <h2 className={styles.title}>Application review</h2>

      {isLoading ? <LoadingBlock label="Loading case…" /> : null}
      {isError ? (
        <p className={styles.errorMessage}>{getCaseQueryErrorMessage(error)}</p>
      ) : null}

      {data ? (
        <>
          <div className={styles.statusRow}>
            <p className={styles.lead}>{data.studentName ?? 'Unnamed application'}</p>
            <StatusBadge status={data.status} />
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Student</h3>
              <p className={styles.cardText}>{data.studentName ?? '—'}</p>
              <p className={styles.cardText}>ID: {data.studentId ?? '—'}</p>
              <p className={styles.cardText}>Field: {data.fieldOfStudy ?? '—'}</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Company & supervisor</h3>
              <p className={styles.cardText}>{data.companyName ?? '—'}</p>
              <p className={styles.cardText}>{data.supervisorName ?? '—'}</p>
              <p className={styles.cardText}>{data.supervisorEmail ?? '—'}</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Recommendation</h3>
              <p className={styles.cardText}>{data.recommendation ?? 'Not generated'}</p>
              <p className={styles.cardText}>{data.recommendationReason ?? '—'}</p>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}
