import { Link, useParams } from 'react-router-dom'
import styles from './Page.module.css'

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to case list
      </Link>

      <p className={styles.eyebrow}>Case detail</p>
      <h2 className={styles.title}>Application review</h2>
      <p className={styles.lead}>
        Detail panels for fields, validation, recommendation, and audit history will be added in
        follow-up tasks.
      </p>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Case ID</h3>
        <p className={styles.cardText}>
          <code className={styles.inlineCode}>{id}</code>
        </p>
      </div>
    </section>
  )
}
