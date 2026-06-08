import { Link } from 'react-router-dom'
import { MOCK_CASE_IDS } from '../mocks/cases'
import styles from './HomePage.module.css'

const demoLinks = [
  {
    id: MOCK_CASE_IDS.ready,
    label: 'Ready for review (valid case)',
  },
  {
    id: MOCK_CASE_IDS.incomplete,
    label: 'Needs clarification (missing fields)',
  },
  {
    id: 'unknown-case-id',
    label: 'Not found (404)',
  },
  {
    id: MOCK_CASE_IDS.error,
    label: 'Server error (500)',
  },
]

export function HomePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Internship Application Coordinator</h1>
      <p className={styles.subtitle}>
        Case detail scaffold — open a mock case to preview the layout and tabs.
      </p>
      <ul className={styles.linkList}>
        {demoLinks.map((link) => (
          <li key={link.id}>
            <Link to={`/cases/${link.id}`} className={styles.caseLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
