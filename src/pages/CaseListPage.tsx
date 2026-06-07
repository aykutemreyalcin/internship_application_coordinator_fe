import { Link } from 'react-router-dom'
import styles from './Page.module.css'

/** Placeholder sample cases until FE-N-05 mock data / real API. */
const SAMPLE_CASES = [
  { id: 'a1b2c3d4-0001-4000-8000-000000000001', studentName: 'Jan Kowalski', status: 'READY_FOR_REVIEW' },
  { id: 'a1b2c3d4-0002-4000-8000-000000000002', studentName: 'Maria Wisniewska', status: 'NEW' },
  { id: 'a1b2c3d4-0003-4000-8000-000000000003', studentName: 'Tomasz Lewandowski', status: 'NEEDS_CLARIFICATION' },
] as const

export function CaseListPage() {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Applications</p>
      <h2 className={styles.title}>Case list</h2>
      <p className={styles.lead}>
        Browse internship applications. Select a case to open its detail view.
      </p>

      <ul className={styles.list}>
        {SAMPLE_CASES.map((applicationCase) => (
          <li key={applicationCase.id}>
            <Link to={`/cases/${applicationCase.id}`} className={styles.listLink}>
              <span className={styles.listPrimary}>{applicationCase.studentName}</span>
              <span className={styles.listMeta}>{applicationCase.status.replaceAll('_', ' ')}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className={styles.hint}>
        Full table, filters, and search arrive in a later task. Links above exercise routing to{' '}
        <code className={styles.inlineCode}>/cases/:id</code>.
      </p>
    </section>
  )
}
